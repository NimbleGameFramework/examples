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

function Nature(world_param, collisionNature, overlapNature, interactionNature, movementNature) {
  var world = world_param;
  var that = this;
  this.collision = collisionNature;
  this.overlap = overlapNature;
  this.interaction = interactionNature;
  this.movement = movementNature;
}

function empty() {

}

//Collision nature must have at least 3 paramters, the first is the entity the element is colliding with, the second is the entity/element itself, the third is the direction of the collision
//Extra parameters may be added, however hey must be handled when linking the nature (see map properties, alert example)
//Returns true if allows entityCollider movement, returns false otherwise
var collisionLibrary = {
  "empty": function(entity,entityCollider){
    return true;
  },
  "solid": function(entity, entityCollider) {
    //Solid objects dont allow entityColliders to move in direction.
    return false
  },
  "pushable": function(entity, entityCollider) {
    //Pushble objects will allow movement if no collision detected in direction

  },
  "alert": function(entity, entityCollider, message){
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
  "still":function(entity){
    return [[entity.x_pos, entity.y_pos],[entity.x_pos, entity.y_pos]];
  }
}
