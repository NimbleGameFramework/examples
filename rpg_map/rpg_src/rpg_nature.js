/**
attributes
functionChain []
*/

/**
public functions
addNature();
executeCollisionNature();
executeOverlapNature();
executeInteractionNature(); (undefined, allows override)
*/

/**
solid
message
pushable
unstoppable
disappearEntity
portal
redirect
openMenu
messageChain
visualNovelChain
openDecision
setMapElement
*/

function Nature(collisionNature, overlapNature, interactionNature, movementNature) {
  this.collision = collisionNature;
  this.overlap = overlapNature;
  this.interaction = interactionNature;
  this.movement = movementNature;
}

//Collision nature must have at least 4 paramters, the first is wolrd object, the second is the entity the element is colliding with, the third is the entity/element itself, the third is the direction of the collision
//1=up 2=right 3=down 4=left 0=not important
//Direction relative to the entityCollider
//Extra parameters may be added, however hey must be handled when linking the nature (see map properties, alert example)
//Returns true if allows entity movement, returns false otherwise
var collisionLibrary = {
  "empty": function(world, entity,entityCollider,direction){
    //empty space always allows entity movment
    return true;
  },
  "solid": function(world, entity, entityCollider,direction) {
    //Solid objects dont allow entityColliders to move in direction.
    return false
  },
  "pushable": function(world, entity, entityCollider, direction) {
    //Pushble objects will allow movement if no collision detected in direction
    if(!entity.isCharacter){
      return false;
    }
    let entity_path = entity.predictMovement();
    if(direction == 1 || direction==3){
      let y_total = entity_path[1][1]-entity_path[0][1];
      var collisionRecursion = world.checkCollisions(
        entityCollider,
        [[entityCollider.x_pos,entityCollider.y_pos],[entityCollider.x_pos,entityCollider.y_pos+y_total]]
      );
      if(collisionRecursion){
        entityCollider.setPosition(entityCollider.x_pos,entityCollider.y_pos+y_total);
      }
      return collisionRecursion;
    }
    if(direction == 2 || direction==4){
      let x_total = entity_path[1][0]-entity_path[0][0];
      var collisionRecursion =  world.checkCollisions(
        entityCollider,
        [[entityCollider.x_pos,entityCollider.y_pos],[entityCollider.x_pos+x_total,entityCollider.y_pos]]
      );
      if(collisionRecursion){
        entityCollider.setPosition(entityCollider.x_pos+x_total,entityCollider.y_pos);
      }
      return collisionRecursion;
    }
  },
  "alert": function(world,entity, entityCollider,direction, message){
    if(entity.isCharacter){
      entity.stopCharacter();
      alert(message);
    }
    return true;
  }
}

//Movement functions only recieve their respective entity, however they can access the world to understand the situation.
//Based on collision data given by the world a entity can dodge elements and entities
var movementLibrary = {
  "still":function(world, entity){
    return [[entity.x_pos, entity.y_pos],[entity.x_pos, entity.y_pos]];
  },
  "bounceOnCollide":function(world, entity){
    let x_move = 0;
    let y_move = 0;

    if(entity.texture == "up"){
      y_move = -entity.movement_unit;
      var collisionRecursion =  world.checkCollisions(entity, [[entity.x_pos, entity.y_pos],[entity.x_pos, entity.y_pos+y_move]]);
      if(!collisionRecursion){
        entity.texture = "down"
      }
    }
    else if(entity.texture == "down"){
      y_move = entity.movement_unit;
      var collisionRecursion =  world.checkCollisions(entity, [[entity.x_pos, entity.y_pos],[entity.x_pos, entity.y_pos+y_move]]);
      if(!collisionRecursion){
        entity.texture = "up"
      }
    }
    else if(entity.texture == "right"){
      x_move = entity.movement_unit;
      var collisionRecursion =  world.checkCollisions(entity, [[entity.x_pos, entity.y_pos],[entity.x_pos+x_move, entity.y_pos]]);
      if(!collisionRecursion){
        entity.texture = "left"
      }
    }
    else if(entity.texture == "left"){
      x_move = -entity.movement_unit;
      var collisionRecursion =  world.checkCollisions(entity, [[entity.x_pos, entity.y_pos],[entity.x_pos+x_move, entity.y_pos]]);
      if(!collisionRecursion){
        entity.texture = "right"
      }
    }
    else if(entity.texture == "up_left"){
      y_move = -entity.movement_unit;
      x_move = -entity.movement_unit;
      var collisionRecursion =  world.checkCollisions(entity, [[entity.x_pos, entity.y_pos],[entity.x_pos+x_move, entity.y_pos+y_move]]);
      if(!collisionRecursion){
        entity.texture = "down_right"
      }
    }
    else if(entity.texture == "up_right"){
      y_move = -entity.movement_unit;
      x_move = entity.movement_unit;
      var collisionRecursion =  world.checkCollisions(entity, [[entity.x_pos, entity.y_pos],[entity.x_pos+x_move, entity.y_pos+y_move]]);
      if(!collisionRecursion){
        entity.texture = "down_left"
      }
    }
    else if(entity.texture == "down_right"){
      y_move = entity.movement_unit;
      x_move = entity.movement_unit;
      var collisionRecursion =  world.checkCollisions(entity, [[entity.x_pos, entity.y_pos],[entity.x_pos+x_move, entity.y_pos+y_move]]);
      if(!collisionRecursion){
        entity.texture = "up_left"
      }
    }
    else if(entity.texture == "down_left"){
      y_move = entity.movement_unit;
      x_move = -entity.movement_unit;
      var collisionRecursion =  world.checkCollisions(entity, [[entity.x_pos, entity.y_pos],[entity.x_pos+x_move, entity.y_pos+y_move]]);
      if(!collisionRecursion){
        entity.texture = "up_right"
      }
    }

    return [[entity.x_pos, entity.y_pos],[entity.x_pos+x_move, entity.y_pos+y_move]];
  },
  "moveInDirection":function(world, entity){
    let x_move = 0;
    let y_move = 0;
    if(entity.texture == "up"){
      y_move = -entity.movement_unit;
    }
    else if(entity.texture == "down"){
      y_move = entity.movement_unit;
    }
    else if(entity.texture == "right"){
      x_move = entity.movement_unit;
    }
    else if(entity.texture == "left"){
      x_move = -entity.movement_unit;
    }
    else if(entity.texture == "up_left"){
      y_move = -entity.movement_unit;
      x_move = -entity.movement_unit;
    }
    else if(entity.texture == "up_right"){
      y_move = -entity.movement_unit;
      x_move = entity.movement_unit;
    }
    else if(entity.texture == "down_right"){
      y_move = entity.movement_unit;
      x_move = entity.movement_unit;
    }
    else if(entity.texture == "down_left"){
      y_move = entity.movement_unit;
      x_move = -entity.movement_unit;
    }
    return [[entity.x_pos, entity.y_pos],[entity.x_pos+x_move, entity.y_pos+y_move]];
  }
}
