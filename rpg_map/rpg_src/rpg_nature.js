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

//Collision nature must have at least 4 paramters, the first is wolrd object, the second is the entityCollider the element is colliding with, the third is the entity/element itself, the fourth is the direction of the collision
//1=up 2=right 3=down 4=left 0=not important
//Direction relative to the entity
//Extra parameters may be added, however hey must be handled when linking the nature (see map properties, alert example)
//Returns true if allows entityCollider movement, returns false otherwise
var collisionLibrary = {
  "empty": function(world, entityCollider, entity,direction){
    //empty space always allows entity movment
    return true;
  },
  "solid": function(world, entityCollider, entity,direction) {
    //Solid objects dont allow entityColliders to move in direction.
    return false
  },
  "pushable": function(world, entityCollider, entity, direction) {
    //Pushble objects will allow movement if no collision detected in direction
    if(!entityCollider.isCharacter){
      return false;
    }
    let entity_path = entityCollider.predictMovement();
    if(direction == 1 || direction==3){
      let y_total = entity_path[1][1]-entity_path[0][1];
      var collisionRecursion = world.checkCollisions(
        entity,
        [[entity.x_pos,entity.y_pos],[entity.x_pos,entity.y_pos+y_total]]
      );
      if(collisionRecursion){
        entity.setPosition(entity.x_pos,entity.y_pos+y_total);
      }
      return collisionRecursion;
    }
    if(direction == 2 || direction==4){
      let x_total = entity_path[1][0]-entity_path[0][0];
      var collisionRecursion =  world.checkCollisions(
        entity,
        [[entity.x_pos,entity.y_pos],[entity.x_pos+x_total,entity.y_pos]]
      );
      if(collisionRecursion){
        entity.setPosition(entity.x_pos+x_total,entity.y_pos);
      }
      return collisionRecursion;
    }
  },
  "alert": function(world,entityCollider,entity,direction, message){
    //If mainCharacter collides with entity, display a message
    if(entityCollider.isCharacter){
      entityCollider.stopCharacter();
      alert(message);
    }
    return true;
  },
  "reload": function(world,entityCollider,entity,direction){
    //If any object collides with current object, page is reloaded, but not refreshed. Great for restarting maps
    window.location.reload(false);
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

    if(entity.getAnimation() == "up"){
      y_move = -entity.movement_unit;
      var collisionRecursion =  world.checkCollisions(entity, [[entity.x_pos, entity.y_pos],[entity.x_pos, entity.y_pos+y_move]]);
      if(!collisionRecursion){
        entity.setAnimation("down");
      }
    }
    else if(entity.getAnimation() == "down"){
      y_move = entity.movement_unit;
      var collisionRecursion =  world.checkCollisions(entity, [[entity.x_pos, entity.y_pos],[entity.x_pos, entity.y_pos+y_move]]);
      if(!collisionRecursion){
        entity.setAnimation("up");
      }
    }
    else if(entity.getAnimation() == "right"){
      x_move = entity.movement_unit;
      var collisionRecursion =  world.checkCollisions(entity, [[entity.x_pos, entity.y_pos],[entity.x_pos+x_move, entity.y_pos]]);
      if(!collisionRecursion){
        entity.setAnimation("left");
      }
    }
    else if(entity.getAnimation() == "left"){
      x_move = -entity.movement_unit;
      var collisionRecursion =  world.checkCollisions(entity, [[entity.x_pos, entity.y_pos],[entity.x_pos+x_move, entity.y_pos]]);
      if(!collisionRecursion){
        entity.setAnimation("right");
      }
    }
    else if(entity.getAnimation() == "up_left"){
      y_move = -entity.movement_unit;
      x_move = -entity.movement_unit;
      var collisionRecursion =  world.checkCollisions(entity, [[entity.x_pos, entity.y_pos],[entity.x_pos+x_move, entity.y_pos+y_move]]);
      if(!collisionRecursion){
        entity.setAnimation("down_right");
      }
    }
    else if(entity.getAnimation() == "up_right"){
      y_move = -entity.movement_unit;
      x_move = entity.movement_unit;
      var collisionRecursion =  world.checkCollisions(entity, [[entity.x_pos, entity.y_pos],[entity.x_pos+x_move, entity.y_pos+y_move]]);
      if(!collisionRecursion){
        entity.setAnimation("down_left");
      }
    }
    else if(entity.getAnimation() == "down_right"){
      y_move = entity.movement_unit;
      x_move = entity.movement_unit;
      var collisionRecursion =  world.checkCollisions(entity, [[entity.x_pos, entity.y_pos],[entity.x_pos+x_move, entity.y_pos+y_move]]);
      if(!collisionRecursion){
        entity.setAnimation("up_left");
      }
    }
    else if(entity.getAnimation() == "down_left"){
      y_move = entity.movement_unit;
      x_move = -entity.movement_unit;
      var collisionRecursion =  world.checkCollisions(entity, [[entity.x_pos, entity.y_pos],[entity.x_pos+x_move, entity.y_pos+y_move]]);
      if(!collisionRecursion){
        entity.setAnimation("up_right");
      }
    }

    return [[entity.x_pos, entity.y_pos],[entity.x_pos+x_move, entity.y_pos+y_move]];
  },
  "moveInDirection":function(world, entity){
    let x_move = 0;
    let y_move = 0;
    if(entity.getAnimation() == "up"){
      y_move = -entity.movement_unit;
    }
    else if(entity.getAnimation() == "down"){
      y_move = entity.movement_unit;
    }
    else if(entity.getAnimation() == "right"){
      x_move = entity.movement_unit;
    }
    else if(entity.getAnimation() == "left"){
      x_move = -entity.movement_unit;
    }
    else if(entity.getAnimation() == "up_left"){
      y_move = -entity.movement_unit;
      x_move = -entity.movement_unit;
    }
    else if(entity.getAnimation() == "up_right"){
      y_move = -entity.movement_unit;
      x_move = entity.movement_unit;
    }
    else if(entity.getAnimation() == "down_right"){
      y_move = entity.movement_unit;
      x_move = entity.movement_unit;
    }
    else if(entity.getAnimation() == "down_left"){
      y_move = entity.movement_unit;
      x_move = -entity.movement_unit;
    }
    return [[entity.x_pos, entity.y_pos],[entity.x_pos+x_move, entity.y_pos+y_move]];
  }
}
