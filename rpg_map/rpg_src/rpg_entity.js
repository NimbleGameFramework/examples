//Entity constructor function
//Creates a entity entity
function Entity(world_object) {
  var world = world_object;
  var that = this;
  this.nature = undefined;
  this.isCharacter = false;
  this.properties = {};
  //Texture name of entity when he is facing left, down, right, up
  //Can be changed to other values for other expressions or actions manually, updates on draw() call
  this.animation = "down";
  var current_animation_frame = "";

  this.setAnimation = function(newAnimation){
    that.animation = newAnimation;
  }

  this.getAnimation = function(){
    return that.animation;
  }

  //The identifier for this entity, used as the object html id
  this.id = undefined;

  //measured left to right the starting location of the main entity on the x axis on current map
  this.x_pos = 1;
  //measured top to bottom the starting location of the main entity on the y axis on current map
  this.y_pos = 1;

  //Defines how long an animation cycle takes in miliseconds, should be a multiple of world speed
  //Animation frames are displayed equal times within cycle.
  this.animation_cycle = 1980;
  //Defines the current animation time, resets to zero when greater thn animation cycle
  this.animation_time = 0;

  //Determines where on screen the main entity is painted based on the screen size and the world scale.
  this.x_px_displacement; //= (width / 2) - (scale / 2);
  this.y_px_displacement; //= (hight / 2) - (scale / 2);

  //Determines the range of the hitbox of the entity relative to its position, a is a number between 0 and 1.
  this.x_hitbox_start = 0;
  this.y_hitbox_start = 0;
  this.x_hitbox_end = 1;
  this.y_hitbox_end = 1;

  this.size = 1;
  //Returns the coordinates of this entities hitbox
  this.getHitbox = function(){
    return [this.x_pos+(that.x_hitbox_start*that.size), this.y_pos+(that.y_hitbox_start*that.size), this.x_pos+(that.x_hitbox_end*that.size), this.y_pos+(that.y_hitbox_end*that.size)];
  }

  this.setDisplacement = function(x_displace_param, y_displace_param){
    that.x_px_displacement = x_displace_param;
    that.y_px_displacement = y_displace_param;
  }

  this.getPos = function(){
    return [that.x_pos,that.y_pos];
  }

  //Determines how far the entity moves should be 1 divided by a multiple of 2
  //1, 0.5, 0.25, 0.125, etc
  this.movement_unit = 0.125;

  //Initializes the entity and all its properties
  this.init = function(entity_properties) {
    processEntityProperties(entity_properties);
  }

  //Processes the entity properties file
  //All properties defined in the in the init object are overwritten
  function processEntityProperties(data) {
    console.log(data);
    that.properties = data;
    //Defines initial variable values
    that = $.extend(that, that.properties["init"]);
  }

  //Draws the entity based on the current entity status.
  this.draw = function(scale) {
    let img_width = scale*that.size;
    //Preloads character animation images outside of window
    console.log(that.properties);
    let all_textures_listed = that.properties["texture"];
    let textures_keys = Object.keys(all_textures_listed);
    for(let i = 0; i<textures_keys.length;i++){
      let animation_frames = that.properties["texture"][textures_keys[i]];
      for(let j = 0;j<animation_frames.length;j++){
        let current_frame = animation_frames[j];
        let imageObject = new Image();
        imageObject.src = current_frame;
        imageObject.id = that.id+"_"+textures_keys[i]+"_"+j;
        imageObject.style = "display:none;";
        imageObject.className = "entity_element";
        document.getElementById("EntityContent").appendChild(imageObject);
      }
    }
    current_animation_frame = that.defineAnimationFrame();
    document.getElementById(current_animation_frame).style = "width:" + img_width + "px;top:" +that.y_px_displacement + "px;left:" + that.x_px_displacement + "px;";
  }

  //Updates the entity based on the current entity status.
  this.update = function(scale) {
    let img_width = scale*that.size;
    document.getElementById(current_animation_frame).style = "display:none;";
    current_animation_frame = that.defineAnimationFrame();
    document.getElementById(current_animation_frame).style = "width:" + img_width + "px;top:" +that.y_px_displacement + "px;left:" + that.x_px_displacement + "px;";
  }

  this.advanceAnimationTime = function(){
    that.animation_time = that.animation_time + world.time_per_frame;
  }

  //Based on the current time, the amount of frames in a animation, the total duration of a animation
  //Returns the Current frame that should be painted
  this.defineAnimationFrame = function(){
    let current_animation_group = that.properties["texture"][that.getAnimation()];
    let time_per_animation_frame = (that.animation_cycle/current_animation_group.length);
    if(that.animation_time>that.animation_cycle){
      that.animation_time = 0;
      return that.id+"_"+that.getAnimation()+"_0";
    }
    for(var i = 0; i<current_animation_group.length;i++){
      if(that.animation_time>=(i*time_per_animation_frame)&&that.animation_time<=((i+1)*time_per_animation_frame)){
        return that.id+"_"+that.getAnimation()+"_"+i;
      }
    }
    return "error";
  }

  //Determines if this entity is colliding in a certain direction. if true, cant move in said direction
  this.collisionUp = false;
  this.collisionDown = false;
  this.collisionLeft = false;
  this.collisionRight = false;

  //Predicts the apropriate movement based on the entity nature
  //Returns the origin and the destination of the entity
  this.predictMovement = function(){
    return that.nature.movement(world,this);
  }

  //Moves the entity based on its nature and the current collision directions.
  //If colliding in a direction, does not move.
  this.movePosition = function(){
    that.advanceAnimationTime();
    let from_to = that.nature.movement(world,this);
    let destination = from_to[1];
    if(from_to[0][0]<from_to[1][0]&&!that.collisionRight){
      that.x_pos = destination[0];
    }
    if(from_to[0][0]>from_to[1][0]&&!that.collisionLeft){
      that.x_pos = destination[0];
    }
    if(from_to[0][1]<from_to[1][1]&&!that.collisionDown){
      that.y_pos = destination[1];
    }
    if(from_to[0][1]>from_to[1][1]&&!that.collisionUp){
      that.y_pos = destination[1];
    }
    resetCollision();
  }

  this.setPosition = function(x_pos_param,y_pos_param){
    that.x_pos = x_pos_param;
    that.y_pos = y_pos_param;
  }

  function resetCollision(){
    that.collisionUp = false;
    that.collisionDown = false;
    that.collisionLeft = false;
    that.collisionRight = false;
  }

  function activateCollision(){
    that.collisionUp = true;
    that.collisionDown = true;
    that.collisionLeft = true;
    that.collisionRight = true;
  }

}
