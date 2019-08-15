var World = function() {
  //Determines the size of the world (map, character and entities) on screen in pixels per unit(size of a single tile or size of character)
  var world = this;
  this.scale = 100;
  this.time_per_frame = 33;

  this.mainCharacter = new Character(this);
  this.currentMap = new Map(this);
  this.entities = [];
  console.log("Creating world");

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
        }
        return;
      }
    }
  }

  //Initializes the world building the character layer, the map layer and the entity layer
  this.init = function() {
    console.log("Initializing character");
    world.mainCharacter.init();
    console.log("Initializing map");
    world.currentMap.init();
    console.log("Initializing entities");
    this.init_entities();
    calculateDisplacement();
    console.log("Initializing world clock");
    window.setInterval(function() {
      checkAllCollisions();
      movePositions();
      world.update();
    }, world.time_per_frame);
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

  function checkAllCollisions(){
    world.checkCollisions(world.mainCharacter, world.mainCharacter.predictMovement());
  }

  //Analyzes predicted character and entity movements and provides collision information to each to indicate how they can move.
  //When collision is detected the collision nature of the character, the entity, and the map elements that collided are activated.
  this.checkCollisions = function(entity_param, from_to) {
    for(let i = 0;i<world.entities.length;i++){
      let current_entity = world.entities[i];
      checkEntityCollision(current_entity,entity_param, from_to)
    }
    for(let i=0;i<world.currentMap.layout_data.length;i++){
      let current_map_row = world.currentMap.layout_data[i];
      for(let j=0;j<current_map_row.length;j++){
        current_map_element = current_map_row[j];

        checkEntityMapCollision(current_map_element,j,i,entity_param,from_to);
      }
    }
  }

//Checks if 2 entities collide, if true takes appropriate action
//entityCollider is the entity in movment, entity is the other element.
  function checkEntityCollision(entity, entityCollider, movementPath){
    let entity_hitbox = entity.getHitbox();
    let entityCollider_hitbox = entityCollider.getHitbox();
    let x_total = movementPath[1][0]-movementPath[0][0];
    let y_total = movementPath[1][1]-movementPath[0][1];
    let entityCollider_future_hitbox_x = [entityCollider_hitbox[0]+x_total, entityCollider_hitbox[1], entityCollider_hitbox[2]+x_total, entityCollider_hitbox[3]];
    let entityCollider_future_hitbox_y = [entityCollider_hitbox[0], entityCollider_hitbox[1]+y_total, entityCollider_hitbox[2], entityCollider_hitbox[3]+y_total];
    if(hitboxCollision(entity_hitbox, entityCollider_future_hitbox_y)){
      if(y_total>0){
        if(!entity.nature.collision(entityCollider, entity)){
          entityCollider.collisionDown = true;
        }
        if(!entityCollider.nature.collision(entity, entityCollider)){
          entity.collisionUp = true;
        }
      }
      else if(y_total<0){
        if(!entity.nature.collision(entityCollider, entity)){
          entityCollider.collisionUp = true;
        }
        if(!entityCollider.nature.collision(entity, entityCollider)){
          entity.collisionDown = true;
        }
      }
    }
    if(hitboxCollision(entity_hitbox, entityCollider_future_hitbox_x)){
      if(x_total>0){
        if(!entity.nature.collision(entityCollider, entity)){
          entityCollider.collisionRight = true;
        }
        if(!entityCollider.nature.collision(entity, entityCollider)){
          entity.collisionLeft = true;
        }
      }
      else if(x_total<0){
        if(!entity.nature.collision(entityCollider, entity)){
          entityCollider.collisionLeft = true;
        }
        if(!entityCollider.nature.collision(entity, entityCollider)){
          entity.collisionRight = true;
        }
      }
    }
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
      if(hitboxCollision(element_hitbox, entityCollider_future_hitbox_y)){
        if(y_total>0){
          if(!element_prop.nature.collision(entityCollider, undefined)){
            entityCollider.collisionDown = true;
          }
          entityCollider.nature.collision(undefined, entityCollider)
        }
        else if(y_total<0){
          if(!element_prop.nature.collision(entityCollider, undefined)){
            entityCollider.collisionUp = true;
          }
          entityCollider.nature.collision(undefined, entityCollider)
        }
      }
      if(hitboxCollision(element_hitbox, entityCollider_future_hitbox_x)){
        if(x_total>0){

          if(!element_prop.nature.collision(entityCollider, undefined)){
            entityCollider.collisionRight = true;
          }
          entityCollider.nature.collision(undefined, entityCollider)
        }
        else if(x_total<0){
          if(!element_prop.nature.collision(entityCollider, undefined)){
            entityCollider.collisionLeft = true;
          }
          entityCollider.nature.collision(undefined, entityCollider)
        }
      }
    }

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
