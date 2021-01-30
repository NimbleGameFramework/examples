
var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var hight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

if(FilesContainer === undefined){
  //If the project is being executed from within a zip file, this section would not be executed
  //If the project is being executed as a normal http server, than this section allows the entities and maps to get their images using a direct source
  //All 3 parameters are left empty.
  //The getImgAsync function is synchronous in this case.
  function FilesContainer(path, root_path_param, callback){
  	var that = this;
  	var root_path = root_path_param;
  	this.getImgAsync = function(file_path, callback){
      var respPromise = new Promise((resolve, error) => {
        var img_resp = new Image;
        img_resp.src = root_path+file_path;
        callback(img_resp);
        resolve();
      });
      return respPromise;
  	};

    this.getTextAsync = function(file_path, callback){
      var respPromise = window.fetch(file_path)
        .then(function(data){
          return data.text().then(function(responseText){
            callback(responseText)
          });
        })
        .catch(function(e){
          console.log("Failed to load text from "+file_path);
          console.log(e)
        });
      return respPromise;
    };
    callback();
  }

  //Loads a zip file from a given path
  var filesCapsule = new FilesContainer("", "",  function(){});
};


var World = function() {
  //Determines the size of the world (map, character and entities) on screen in pixels per unit(size of a single tile or size of character)
  var world = this;
  this.scale = 75;
  this.time_per_frame = 33;

  this.mainCharacter = undefined;//new Character(this);
  this.currentMap = undefined;//new Map(this);
  //List of all entities
  this.entities = [];
  //List of all entities that have a collide nature that is not empty
  this.entitiesThatCollide = [];
  //List of all entities that have a movement nature that is not still
  this.entitiesThatMove = [];
  //List of all entities that have a overlap nature that is not doNothing
  this.entitiesThatOverlap = [];
  //list of all entities that have a interact nature that is not doNothing
  this.entitiesThatInteract = [];
  //Interval timer that executes each round of actions and interactions
  this.clock;
  //True if clock is On, False if clock is Off
  this.clockState;

  console.log("Creating world");

  let gameContentDiv = document.getElementById("gameContent");
  let cssInyection = "<style>body{overflow:hidden}#mapLayer{position:absolute}.map_row{padding:0;margin:0;white-space:nowrap;overflow:hidden;}.map_element{padding:0;margin:0;overflow:hidden}.character_element{position:absolute;padding:0;margin:0;overflow:hidden}.entity_element{position:absolute;padding:0;margin:0;overflow:hidden}</style>";
  let divInyection = "<div id='MapContent'></div><div id='EntityContent'></div><div id='CharacterContent'></div><div id='MenuContent'></div>"
  gameContentDiv.innerHTML = cssInyection+divInyection;
  //Initializes the world building the character layer, the map layer and the entity layer
  this.init = function(map_object, character_obj, entity_tuple) {
    console.log("Initializing character");
    world.mainCharacter = character_obj;
    console.log("Initializing map");
    world.currentMap = map_object;
    console.log("Initializing entities");
    world.init_entities(entity_tuple);

    world.render(function(){
      console.log("Initializing world clock");
      world.startClock()
    });
  }

  this.startClock = function(){
    world.clock = setInterval(function() {
      var t0 = performance.now()
      checkAllCollisionsAndMove();
      checkAllOverlaps();
      world.updatePosition();
      var t1 = performance.now()
      //console.log(duration)
      if((t1 - t0) > world.time_per_frame){
        //What to do if frame rate is low
      }
    }, world.time_per_frame);
    world.clockState = true;
  }

  this.stopClock = function(){
    clearInterval(world.clock);
    world.clockState = false;
  }

  this.toggleClock = function(){
    if(world.clockState){
      world.stopClock();
    }
    else{
      world.startClock();
    }
  }

  document.addEventListener("visibilitychange", function() {
    world.mainCharacter.stopCharacter();
    if(document.visibilityState == "hidden"){world.stopClock()}
  })

  //allows other classes to inform the world that they have loaded
  //When all elements are loaded they are drawn
  var loading_assertion_array = [false, false];
  this.load_assertion = function(){
    for(let i = 0; i<loading_assertion_array.length; i++){
      if(loading_assertion_array[i]==false){
        loading_assertion_array[i] = true;
        if(i==loading_assertion_array.length-1){
          console.log("Drawing world")
          world.draw().then(function(){
            console.log("Initializing world clock");
            world.startClock()
          });

        }
        return;
      }
    }
  }
  this.render = function(callback){
    console.log("Drawing world")
    world.draw().then(callback);
  }


  this.init_entities = function(entity_tuple){
    world.entities = entity_tuple[0];
    world.entitiesThatCollide = entity_tuple[1];
    world.entitiesThatMove = entity_tuple[2];
    world.entitiesThatOverlap = entity_tuple[3];
    world.entitiesThatInteract = entity_tuple[4];

    world.entities.push(world.mainCharacter);
    //Adds entity to the optimized small arrays.
    //List of all entities that have a collide nature that is not empty
    if(world.mainCharacter.nature.collision !== undefined){
      world.entitiesThatCollide.push(world.mainCharacter);
    }

    //List of all entities that have a movement nature that is not still
    if(world.mainCharacter.nature.movement !== undefined){
      world.entitiesThatMove.push(world.mainCharacter);
    }

    //List of all entities that have a overlap nature that is not doNothing
    if(world.mainCharacter.nature.overlap !== undefined){
      world.entitiesThatOverlap.push(world.mainCharacter);
    }

    //list of all entities that have a interact nature that is not doNothing
    if(world.mainCharacter.nature.collision !== undefined){
      world.entitiesThatInteract.push(world.mainCharacter);
    }
    //Draw entities
    //ToRemove
    //for(let i = 0; i<world.entities.length;i++){
    //  loading_assertion_array.push(false);
    //}
    //load_assertion();
  }

  this.remove_entity = function(entity_id){
    for(let i = 0; i<world.entities.length;i++){
      if(world.entities[i].id==entity_id){
        world.entities[i].remove();
        world.entities.splice(i,1)
        break;
      }
    }
    for(let i = 0; i<world.entitiesThatMove.length;i++){
      if(world.entitiesThatMove[i].id==entity_id){
        world.entitiesThatMove.splice(i,1)
        break;
      }
    }
    for(let i = 0; i<world.entitiesThatCollide.length;i++){
      if(world.entitiesThatCollide[i].id==entity_id){
        world.entitiesThatCollide.splice(i,1)
        break;
      }
    }
    for(let i = 0; i<world.entitiesThatOverlap.length;i++){
      if(world.entitiesThatOverlap[i].id==entity_id){
        world.entitiesThatOverlap.splice(i,1)
        break;
      }
    }
    for(let i = 0; i<world.entitiesThatInteract.length;i++){
      if(world.entitiesThatInteract[i].id==entity_id){
        world.entitiesThatInteract.splice(i,1)
        break;
      }
    }
  }

  //Draws everything in the game world based on current properties
  this.draw = function() {
    //Draw entities
    console.log("Drawing world")
    var promise_array = []
    for(let i = 0; i<world.entities.length;i++){
      promise_array.push(world.entities[i].draw(world.scale));
    }
    promise_array.push(world.mainCharacter.draw(world.scale));
    promise_array.push(world.currentMap.draw(world.scale));
    return Promise.all(promise_array);
  }

  //Moves elements to position based on current properties.
  this.updatePosition = function() {
    //Calculate character displacement based on screen
    x_character_px_displacement = width / 2 - (world.scale / 2);
    y_character_px_displacement = hight / 2 - (world.scale / 2);
    world.mainCharacter.updatePosition(x_character_px_displacement, y_character_px_displacement);
    let mainCharacter_current_pos = world.mainCharacter.getPos();
    //Calculate other entity and map displacement based on character
    x_map_px_displacement = x_character_px_displacement - (mainCharacter_current_pos[0] * world.scale);
    y_map_px_displacement = y_character_px_displacement - (mainCharacter_current_pos[1] * world.scale);
    //world.currentMap.setDisplacement();
    world.currentMap.updatePosition(x_map_px_displacement, y_map_px_displacement);
    for(let i = 0; i<world.entities.length;i++){
      let current_entity = world.entities[i];
      current_entity.updatePosition(x_map_px_displacement+(current_entity.x_pos*world.scale),y_map_px_displacement+current_entity.y_pos*world.scale);
    }
  }

  //Checks collisions for each entity and the main character with the rest of the world
  function checkAllCollisionsAndMove(){
    //world.checkCollisions(world.mainCharacter, world.mainCharacter.predictMovement());
    //world.mainCharacter.movePosition();
    for(var i = 0; i<world.entitiesThatCollide.length;i++){
      world.checkCollisions(world.entitiesThatCollide[i], world.entitiesThatCollide[i].predictMovement());
      world.entitiesThatCollide[i].movePosition();
    }
  }

  //Based on an entities expected path(from_to) detects collisions with the rest of the world
  //When collision is detected the collision nature of the character, the entity, and the map elements that collided are activated.
  //Returns true if collision detected, false otherwise
  this.checkCollisions = function(entity_param, from_to) {
    var resp = true;
    resp = resp && checkEntityCollision(world.mainCharacter,entity_param, from_to);
    for(let i = 0;i<world.entitiesThatCollide.length;i++){
      let current_entity = world.entitiesThatCollide[i];
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
    let element_prop = world.currentMap.gridBlocks[map_element];
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
    for(var i = 0; i<world.entitiesThatOverlap.length;i++){
      world.checkOverlaps(world.entitiesThatOverlap[i]);
    }
  }

  this.checkOverlaps = function(entity){
    if(entity.id != world.mainCharacter.id && world.mainCharacter.z_index <= entity.z_index){
      if(hitboxOverlap(world.mainCharacter.getHitbox(), entity.getHitbox())){
        world.mainCharacter.nature.overlap(that, world.mainCharacter, entity)

      }
    }
    for(let i = 0; i<world.entitiesThatOverlap.length;i++){
      if(world.entitiesThatOverlap[i].z_index <= entity.z_index && world.entitiesThatOverlap[i].id != entity.id){
        if(hitboxOverlap(world.entitiesThatOverlap[i].getHitbox(), entity.getHitbox())){
            world.entitiesThatOverlap[i].nature.overlap(world, world.entitiesThatOverlap[i], entity);
        }
      }
    }
    let overlap_box = hitboxOverlapMap(entity.getHitbox());
    for(let i = overlap_box[0];i<overlap_box[2];i++){
      for(let j = overlap_box[1];j<overlap_box[3];j++){
        let map_element = world.currentMap.layout_data[j][i];
        let element_prop = world.currentMap.gridBlocks[map_element];
        if(element_prop.nature.overlap !== undefined){
          element_prop.nature.overlap(world, element_prop, entity);
        }
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
    world.updatePosition();
  };
}
