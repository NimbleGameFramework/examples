
var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var hight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

var World = function() {
  //Determines the size of the world (map, character and entities) on screen in pixels per unit(size of a single tile or size of character)
  var world = this;
  this.scale = 75;
  this.time_per_frame = 33;

  this.mainCharacter = new Character(this);
  this.currentMap = new Map(this);
  this.entities = [];
  console.log("Creating world");

  let rpgContentDiv = document.getElementById("rpgContent");
  let cssInyection = "<style>body{overflow:hidden}#mapLayer{position:absolute}.map_row{padding:0;margin:0;white-space:nowrap;overflow:hidden;}.map_element{padding:0;margin:0;overflow:hidden}.character_element{position:absolute;padding:0;margin:0;overflow:hidden}.entity_element{position:absolute;padding:0;margin:0;overflow:hidden}</style>";
  let divInyection = "<div id='MapContent'></div><div id='EntityContent'></div><div id='CharacterContent'></div><div id='MenuContent'></div>"
  rpgContentDiv.innerHTML = cssInyection+divInyection;
  //Initializes the world building the character layer, the map layer and the entity layer
  this.init = function(rpg_map_data_path, init_rpg_map_properties, init_rpg_character_properties, init_rpg_entity_properties) {
    console.log("Initializing character");
    world.mainCharacter.init(init_rpg_character_properties);
    console.log("Initializing map");
    world.currentMap.init(init_rpg_map_properties, rpg_map_data_path);
    console.log("Initializing entities");
    this.init_entities();
  }

  //allows other classes to inform the world that they have loaded
  //When all elements are loaded they are drawn
  var loading_assertion_array = [false, false];
  this.load_assertion = function(){
    for(let i = 0; i<loading_assertion_array.length; i++){

      if(loading_assertion_array[i]==false){
        loading_assertion_array[i] = true;
        if(i==loading_assertion_array.length-1){
          console.log("Drawing world")
          world.draw();
          calculateDisplacement();
          console.log("Initializing world clock");
          window.setInterval(function() {
            checkAllCollisionsAndMove();
            checkAllOverlaps();
            world.update();
          }, world.time_per_frame);
        }
        return;
      }
    }
  }

  this.init_entities = function(){
    for(let i = 0; i<init_rpg_entity_properties.length; i++){
      let current_entity_type = init_rpg_entity_properties[i];
      for(let j = 0; j<current_entity_type.init.length;j++){
        let entity_properties = {};
        let new_entity = new Entity(world);
        new_entity.id = "entity_"+i+"_"+j;
        entity_properties.init = current_entity_type.init[j];
        entity_properties.texture = current_entity_type.texture;
        new_entity.init(entity_properties);
        world.entities.push(new_entity);
      }
    }
    world.draw_entities();
  }

  this.draw_entities = function(){
    for(let i = 0; i<world.entities.length;i++){
      world.entities[i].draw(world.scale);
    }
  }

  this.update_entities = function(){
    for(let i = 0; i<world.entities.length;i++){
      world.entities[i].update(world.scale);
    }
  }

  this.remove_entity = function(entity_id){
    for(let i = 0; i<world.entities.length;i++){
      if(world.entities[i].id==entity_id){
        world.entities[i].remove();
        world.entities.splice(i,1);
      }
    }
  }

  //Draws everything in the game world based on current properties
  this.draw = function() {
    calculateDisplacement();
    world.mainCharacter.draw(world.scale);
    world.currentMap.draw(world.scale);
  }

  //Moves elements to position based on current properties.
  this.update = function() {
    calculateDisplacement();
    world.mainCharacter.update(world.scale);
    world.currentMap.update(world.scale);
    world.update_entities();
  }



  //Calculates character, map, and entity pixel displacement on screen.
  function calculateDisplacement() {
    x_character_px_displacement = width / 2 - (world.scale / 2);
    y_character_px_displacement = hight / 2 - (world.scale / 2);
    world.mainCharacter.setDisplacement(x_character_px_displacement, y_character_px_displacement);
    let mainCharacter_current_pos = world.mainCharacter.getPos();
    x_map_px_displacement = x_character_px_displacement - (mainCharacter_current_pos[0] * world.scale);
    y_map_px_displacement = y_character_px_displacement - (mainCharacter_current_pos[1] * world.scale);
    world.currentMap.setDisplacement(x_map_px_displacement, y_map_px_displacement);
    for(let i = 0; i<world.entities.length;i++){
      let current_entity = world.entities[i];
      current_entity.setDisplacement(x_map_px_displacement+(current_entity.x_pos*world.scale),y_map_px_displacement+current_entity.y_pos*world.scale);
    }
  }

  //Checks collisions for each entity and the main character with the rest of the world
  function checkAllCollisionsAndMove(){
    world.checkCollisions(world.mainCharacter, world.mainCharacter.predictMovement());
    world.mainCharacter.movePosition();
    for(var i = 0; i<world.entities.length;i++){
      world.checkCollisions(world.entities[i], world.entities[i].predictMovement());
      world.entities[i].movePosition();
    }
  }

  //Based on an entities expected path(from_to) detects collisions with the rest of the world
  //When collision is detected the collision nature of the character, the entity, and the map elements that collided are activated.
  //Returns true if collision detected, false otherwise
  this.checkCollisions = function(entity_param, from_to) {
    var resp = true;
    resp = resp && checkEntityCollision(world.mainCharacter,entity_param, from_to);
    for(let i = 0;i<world.entities.length;i++){
      let current_entity = world.entities[i];
      current_entity_check= checkEntityCollision(current_entity,entity_param, from_to);
      resp = current_entity_check && resp;
    }
    let count_map_size = 0;
    let entity_perimeter = boxPerimeter(hitboxOverlapMap(entity_param.getHitbox()));
    for(let i=0;i<entity_perimeter.length;i++){
      let current_element_coordinates = entity_perimeter[i];
      let current_map_element = world.currentMap.layout_data[current_element_coordinates[1]][current_element_coordinates[0]];
      resp = checkEntityMapCollision(current_map_element,current_element_coordinates[0],current_element_coordinates[1],entity_param,from_to) && resp;
    }
    return resp;
  }

//Checks if 2 entities collide, if true takes appropriate action
//entityCollider is the entity in movment, entity is the other element.
  function checkEntityCollision(entity, entityCollider, movementPath){
    if(entity.id==entityCollider.id){
      return true;
    }
    let entity_hitbox = entity.getHitbox();
    let entityCollider_hitbox = entityCollider.getHitbox();
    let x_total = movementPath[1][0]-movementPath[0][0];
    let y_total = movementPath[1][1]-movementPath[0][1];
    let entityCollider_future_hitbox_x = [
      entityCollider_hitbox[0]+x_total,
      entityCollider_hitbox[1],
      entityCollider_hitbox[2]+x_total,
      entityCollider_hitbox[3]
    ];
    let entityCollider_future_hitbox_y = [
      entityCollider_hitbox[0],
      entityCollider_hitbox[1]+y_total,
      entityCollider_hitbox[2],
      entityCollider_hitbox[3]+y_total
    ];
    let entityCollider_future_hitbox_xy = [
      entityCollider_hitbox[0]+x_total,
      entityCollider_hitbox[1]+y_total,
      entityCollider_hitbox[2]+x_total,
      entityCollider_hitbox[3]+y_total
    ];
    let hitbox_collision_x = hitboxOverlap(entity_hitbox, entityCollider_future_hitbox_x);
    let hitbox_collision_y = hitboxOverlap(entity_hitbox, entityCollider_future_hitbox_y);
    let hitbox_collision_xy = hitboxOverlap(entity_hitbox, entityCollider_future_hitbox_xy);
    return processCollision(hitbox_collision_x, hitbox_collision_y, hitbox_collision_xy,x_total,y_total, entity, entityCollider);
  }

  //Checks if 2 entities collide, if true takes appropriate action
  //entityCollider is the entity in movment, entity is the other element.
  function checkEntityMapCollision(map_element, map_element_x_pos, map_element_y_pos, entityCollider, movementPath){
    let element_hitbox = [map_element_x_pos, map_element_y_pos, map_element_x_pos+1, map_element_y_pos+1];
    let element_prop = world.currentMap.properties[map_element];
    let entityCollider_hitbox = entityCollider.getHitbox();
    let x_total = movementPath[1][0]-movementPath[0][0];
    let y_total = movementPath[1][1]-movementPath[0][1];
    let entityCollider_future_hitbox_x = [
      entityCollider_hitbox[0]+x_total,
      entityCollider_hitbox[1],
      entityCollider_hitbox[2]+x_total,
      entityCollider_hitbox[3]
    ];
    let entityCollider_future_hitbox_y = [
      entityCollider_hitbox[0],
      entityCollider_hitbox[1]+y_total,
      entityCollider_hitbox[2],
      entityCollider_hitbox[3]+y_total
    ];
    let entityCollider_future_hitbox_xy = [
      entityCollider_hitbox[0]+x_total,
      entityCollider_hitbox[1]+y_total,
      entityCollider_hitbox[2]+x_total,
      entityCollider_hitbox[3]+y_total
    ];

    let hitbox_collision_x = hitboxOverlap(element_hitbox, entityCollider_future_hitbox_x);
    let hitbox_collision_y = hitboxOverlap(element_hitbox, entityCollider_future_hitbox_y);
    let hitbox_collision_xy = hitboxOverlap(element_hitbox, entityCollider_future_hitbox_xy);
    return processCollision(hitbox_collision_x, hitbox_collision_y, hitbox_collision_xy,x_total,y_total, element_prop, entityCollider);
}

function processCollision(hitbox_collision_x, hitbox_collision_y, hitbox_collision_xy,x_total,y_total, element_prop, entityCollider){
    let y_resp = true;
    if(hitbox_collision_y){
      if(y_total>0){
        if(!(element_prop.nature.collision===undefined)){
          y_resp = element_prop.nature.collision(world,entityCollider, element_prop,1);
        }
        else{y_resp=true;}
        if(!y_resp){
          entityCollider.collisionDown = true;
        }
      }
      else if(y_total<0){
        if(!(element_prop.nature.collision===undefined)){y_resp = element_prop.nature.collision(world,entityCollider, element_prop,3);}
        else{y_resp=true;}
        if(!y_resp){
          entityCollider.collisionUp = true;
        }
      }
    }
    let x_resp = true;
    if(hitbox_collision_x){
      if(x_total>0){
        if(!(element_prop.nature.collision===undefined)){x_resp = element_prop.nature.collision(world,entityCollider, element_prop,4);}
        else{x_resp=true;}
        if(!x_resp){
          entityCollider.collisionRight = true;
        }
      }
      else if(x_total<0){
        if(!(element_prop.nature.collision===undefined)){x_resp = element_prop.nature.collision(world,entityCollider, element_prop,2);}
        else{x_resp=true;}
        if(!x_resp){
          entityCollider.collisionLeft = true;
        }
      }
    }
    var xy_resp = true;
    if(!hitbox_collision_x && !hitbox_collision_y && hitbox_collision_xy){

      if(x_total>0 && y_total<0){
        if(!(element_prop.nature.collision===undefined)){xy_resp = element_prop.nature.collision(world,entityCollider, element_prop,1);}
        else{xy_resp=true;}
        if(!xy_resp){
          if(entityCollider.collisionUp == false){
            entityCollider.collisionRight = true;
          }
          else if(entityCollider.collisionRight == false){
            entityCollider.collisionUp = true;
          }
          else{
            entityCollider.collisionRight = true;
            entityCollider.collisionUp = true;
          }
        }
      }
      else if(x_total<0 && y_total<0){
        if(!(element_prop.nature.collision===undefined)){xy_resp = element_prop.nature.collision(world,entityCollider, element_prop,1);}
        else{xy_resp=true;}
        if(!xy_resp){
          if(entityCollider.collisionUp == false){
            entityCollider.collisionLeft = true;
          }
          else if(entityCollider.collisionLeft == false){
            entityCollider.collisionUp = true;
          }
          else{
            entityCollider.collisionLeft = true;
            entityCollider.collisionUp = true;
          }
        }
      }
      else if(x_total>0 && y_total>0){
        if(!(element_prop.nature.collision===undefined)){xy_resp = element_prop.nature.collision(world,entityCollider, element_prop,3);}
        else{xy_resp=true;}
        if(!xy_resp){
          if(entityCollider.collisionDown == false){
            entityCollider.collisionRight = true;
          }
          else if(entityCollider.collisionRight == false){
            entityCollider.collisionDown = true;
          }
          else{
            entityCollider.collisionRight = true;
            entityCollider.collisionDown = true;
          }
        }
      }
      else if(x_total<0 && y_total>0){
        if(!(element_prop.nature.collision===undefined)){xy_resp = element_prop.nature.collision(world,entityCollider, element_prop,3);}
        else{xy_resp=true;}
        if(!xy_resp){
          if(entityCollider.collisionDown == false){
            entityCollider.collisionLeft = true;
          }
          else if(entityCollider.collisionLeft == false){
            entityCollider.collisionDown = true;
          }
          else{
            entityCollider.collisionLeft = true;
            entityCollider.collisionDown = true;
          }
        }
      }
    }
    return x_resp && y_resp && xy_resp;
  }

  //True if 2 hitboxes overlap, false otherwise
  function hitboxOverlap(hitbox1, hitbox2){
    if(hitbox1[0]<hitbox2[2] && hitbox1[2]>hitbox2[0] && hitbox1[1]<hitbox2[3] && hitbox1[3]>hitbox2[1]){
      return true;
    }
    return false;
  }

  //Provides a square where a hitbox is overlapping with the background
  //Returns [OriginX,OriginY,EndX,EndY]
  function hitboxOverlapMap(hitbox){
    return [Math.floor(hitbox[0]),Math.floor(hitbox[1]),Math.ceil(hitbox[2]),Math.ceil(hitbox[3])];
  }

  function checkAllOverlaps(){
    world.checkOverlaps(world.mainCharacter);
    for(var i = 0; i<world.entities.length;i++){
      world.checkOverlaps(world.entities[i]);
    }
  }

  this.checkOverlaps = function(entity){
    if(world.mainCharacter.z_index <= entity.z_index && world.mainCharacter.id != entity.id){
      if(hitboxOverlap(world.mainCharacter.getHitbox(), entity.getHitbox())){
        try{world.mainCharacter.nature.overlap(that, world.mainCharacter, entity)}
        catch(err){}
      }
    }
    for(let i = 0; i<world.entities.length;i++){
      if(world.entities[i].z_index <= entity.z_index && world.entities[i].id != entity.id){
        if(hitboxOverlap(world.entities[i].getHitbox(), entity.getHitbox())){
          try{world.entities[i].nature.overlap(world, world.entities[i], entity);}
          catch(err){}
        }
      }
    }
    let overlap_box = hitboxOverlapMap(entity.getHitbox());
    for(let i = overlap_box[0];i<overlap_box[2];i++){
      for(let j = overlap_box[1];j<overlap_box[3];j++){
        let map_element = world.currentMap.layout_data[j][i];
        let element_prop = world.currentMap.properties[map_element];
        try{element_prop.nature.overlap(that, element_prop, entity, i, j)}
        catch(err){}
      }
    }
  }

  //Provides all integer value coordinates around a box. i.e. the coordinates of all map elements outside the perimiter of a box
  function boxPerimeter(box){
    let resp = [];
    //Get edges
    for(let i = box[0]; i<box[2];i++){
      resp.push([i,box[1]-1]);
      resp.push([i,box[3]]);
    }
    for(let j = box[1]; j<box[3];j++){
      resp.push([box[0]-1,j]);
      resp.push([box[2],j]);
    }
    //Get Corners
    resp.push([box[0]-1,box[1]-1]);
    resp.push([box[2],box[1]-1]);
    resp.push([box[0]-1,box[3]]);
    resp.push([box[2],box[3]]);
    return resp;
  }

  //Redraws map to ensure alignment
  document.getElementsByTagName("BODY")[0].onresize = function() {
    width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    hight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    world.update();
  };
}
