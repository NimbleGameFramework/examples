var World = function() {
  //Determines the size of the world (map, character and entities) on screen in pixels per unit(size of a single tile or size of character)
  var world = this;
  this.scale = 100;
  this.time_per_frame = 33;

  this.mainCharacter = new Character(this);
  this.currentMap = new Map(this);
  this.entities = [];
  console.log("Creating world");

  //Initializes the world building the character layer, the map layer and the entity layer
  this.init = function() {
    console.log("Initializing character");
    world.mainCharacter.init();
    console.log("Initializing map");
    world.currentMap.init();
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
            checkAllCollisions();
            movePositions();
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
        entity_properties.init = current_entity_type.init[j];
        entity_properties.texture = current_entity_type.texture;
        new_entity.init(entity_properties);
        new_entity.id = "entity_"+i+"_"+j;
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
  function checkAllCollisions(){
    world.checkCollisions(world.mainCharacter, world.mainCharacter.predictMovement());
    for(var i = 0; i<world.entities.length;i++){
      world.checkCollisions(world.entities[i], world.entities[i].predictMovement());
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
    for(let i=0;i<world.currentMap.layout_data.length;i++){
      let current_map_row = world.currentMap.layout_data[i];
      for(let j=0;j<current_map_row.length;j++){
        count_map_size = count_map_size +1;
        current_map_element = current_map_row[j];
        current_map_element_check = checkEntityMapCollision(current_map_element,j,i,entity_param,from_to);
        resp = current_map_element_check && resp;
      }
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
    let entityCollider_future_hitbox_x = [entityCollider_hitbox[0]+x_total, entityCollider_hitbox[1], entityCollider_hitbox[2]+x_total, entityCollider_hitbox[3]];
    let entityCollider_future_hitbox_y = [entityCollider_hitbox[0], entityCollider_hitbox[1]+y_total, entityCollider_hitbox[2], entityCollider_hitbox[3]+y_total];
    let y_collision = true;
    if(hitboxCollision(entity_hitbox, entityCollider_future_hitbox_y)){
      if(y_total>0){
        y_collision =entity.nature.collision(world,entityCollider, entity, 1)
        if(!y_collision){
          entityCollider.collisionDown = true;

        }
      }
      else if(y_total<0){
        y_collision =entity.nature.collision(world,entityCollider, entity,3)
        if(!y_collision){
          entityCollider.collisionUp = true;
        }
      }
    }
    let x_collision = true;
    if(hitboxCollision(entity_hitbox, entityCollider_future_hitbox_x)){
      if(x_total>0){
        x_collision = entity.nature.collision(world, entityCollider, entity,4);
        if(!x_collision){
          entityCollider.collisionRight = true;
        }
      }
      else if(x_total<0){
        x_collision = entity.nature.collision(world,entityCollider, entity,2);
        if(!x_collision){
          entityCollider.collisionLeft = true;
        }
      }
    }
    return y_collision && x_collision;
  }

  //Checks if 2 entities collide, if true takes appropriate action
  //entityCollider is the entity in movment, entity is the other element.
  function checkEntityMapCollision(map_element, map_element_x_pos, map_element_y_pos, entityCollider, movementPath){
    let element_hitbox = [map_element_x_pos, map_element_y_pos, map_element_x_pos+1, map_element_y_pos+1];
    let element_prop = world.currentMap.properties[map_element];
    let entityCollider_hitbox = entityCollider.getHitbox();
    let x_total = movementPath[1][0]-movementPath[0][0];
    let y_total = movementPath[1][1]-movementPath[0][1];
    let entityCollider_future_hitbox_x = [entityCollider_hitbox[0]+x_total, entityCollider_hitbox[1], entityCollider_hitbox[2]+x_total, entityCollider_hitbox[3]];
    let entityCollider_future_hitbox_y = [entityCollider_hitbox[0], entityCollider_hitbox[1]+y_total, entityCollider_hitbox[2], entityCollider_hitbox[3]+y_total];
    let y_resp = true;
    if(hitboxCollision(element_hitbox, entityCollider_future_hitbox_y)){
      if(y_total>0){
        y_resp = element_prop.nature.collision(world,entityCollider, undefined,1);
        if(!y_resp){
          entityCollider.collisionDown = true;
        }
      }
      else if(y_total<0){
        y_resp = element_prop.nature.collision(world,entityCollider, undefined,3);
        if(!y_resp){
          entityCollider.collisionUp = true;
        }
      }
    }
    let x_resp = true;
    if(hitboxCollision(element_hitbox, entityCollider_future_hitbox_x)){
      if(x_total>0){
        x_resp = element_prop.nature.collision(world,entityCollider, undefined,4);
        if(!x_resp){
          entityCollider.collisionRight = true;
        }
      }
      else if(x_total<0){
        x_resp = element_prop.nature.collision(world,entityCollider, undefined,2);
        if(!x_resp){
          entityCollider.collisionLeft = true;
        }
      }
    }

    return x_resp && y_resp;
  }

  //True if 2 hitboxes overlap, false otherwise
  function hitboxCollision(hitbox1, hitbox2){
    if(hitbox1[0]<hitbox2[2] && hitbox1[2]>hitbox2[0] && hitbox1[1]<hitbox2[3] && hitbox1[3]>hitbox2[1]){
      return true;
    }
    return false;
  }


  //Tells all entities to move to new position based on collision status. Resets collisions of each entity.
  function movePositions(){
    world.mainCharacter.movePosition();
    for(let i = 0;i<world.entities.length;i++){
      world.entities[i].movePosition();
    }
  }

  //Redraws map to ensure alignment
  document.getElementsByTagName("BODY")[0].onresize = function() {
    width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    hight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    world.update();
  };
}
