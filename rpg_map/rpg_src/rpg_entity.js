//Entity constructor function
//Creates a entity entity
function Entity(world_object) {
  var world = world_object;
  var that = this;
  this.properties = {};
  //Texture name of entity when he is facing left, down, right, up
  //Can be changed to other values for other expressions or actions manually, updates on draw() call
  this.texture = "down";

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

  this.setDisplacement = function(x_displace_param, y_displace_param){
    x_px_displacement = x_displace_param;
    y_px_displacement = y_displace_param;
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
    that.properties = data;
    console.log(that.properties);
    entity = $.extend(entity, that.properties["init"]);
    console.log(that.texture);
  }

  //Draws the entity based on the current entity status.
  this.draw = function(scale) {
    let entityTexturePath = that.properties["texture"][that.texture];
    let entity_layer_inyection = "<img id='"+that.id+"' class='entity_element' style='width:" + scale + "px;top:" +
      that.y_px_displacement + "px;left:" + that.x_px_displacement + "px' src='" + entityTexturePath + "'>";
    document.getElementById("entityContent").innerHTML = entity_layer_inyection;
  }

  //Updates the entity based on the current entity status.
  this.update = function(scale) {
    let entityTexturePath = that.defineAnimationFrame();
    let main_entity_element = $("#"+that.id);
    main_entity_element.css({
      "width":scale+"px",
      "top":that.y_px_displacement+"px",
      "left":that.x_px_displacement+"px"
    });
    main_entity_element.attr("src", entityTexturePath);
  }

  this.advanceAnimationTime = function(){
    that.animation_time = that.animation_time + world.time_per_frame;
  }

  //Based on the current time, the amount of frames in a animation, the total duration of a animation
  //Returns the Current frame that should be painted
  this.defineAnimationFrame = function(){
    let current_animation_group = that.properties["texture"][that.texture];
    let time_per_animation_frame = (that.animation_cycle/current_animation_group.length);
    if(that.animation_time>that.animation_cycle){
      that.animation_time = 0;
      return current_animation_group[0];
    }
    for(var i = 0; i<current_animation_group.length;i++){
      if(that.animation_time>=(i*time_per_animation_frame)&&that.animation_time<=((i+1)*time_per_animation_frame)){
        return current_animation_group[i];
      }
    }
    return "error";
  }

}
