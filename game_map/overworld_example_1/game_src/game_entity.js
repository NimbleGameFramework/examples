//Entity constructor function
//Creates a entity entity
function Entity(world_object) {
  var world = world_object;
  var that = this;
  this.show_entity = true;
  this.imgNaturalHeight = undefined;
  this.imgNaturalWidth = undefined;
  this.nature = new Nature(undefined, undefined, undefined, movementLibrary.still);
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

  this.z_index = 1;
  this.div_content = "";
  this.size = 1;
  //Returns the coordinates of this entities hitbox
  this.getHitbox = function(){
    return [this.x_pos+(that.x_hitbox_start*that.size), this.y_pos+(that.y_hitbox_start*that.size), this.x_pos+(that.x_hitbox_end*that.size), this.y_pos+(that.y_hitbox_end*that.size)];
  }

  //this.setDisplacement = function(x_displace_param, y_displace_param){
  //  x_px_displacement = x_displace_param;
  //  y_px_displacement = y_displace_param;
  //}

  this.getPos = function(){
    return [that.x_pos,that.y_pos];
  }

  //Determines how far the entity moves should be 1 divided by a multiple of 2
  //1, 0.5, 0.25, 0.125, etc
  this.movement_unit = 0.125;

  this.current_max_movement_unit = 1.0;

  //Initializes the entity and all its properties
  this.init = function(entity_properties) {
    processEntityProperties(entity_properties);
  }

  //Processes the entity properties file
  //All properties defined in the in the init object are overwritten
  function processEntityProperties(data) {
    //console.log(data);
    that.properties = data;
    //Defines initial variable values
    that = $.extend(that, that.properties["init"]);
    if(that.properties.extensions !== undefined){
      for(let i = 0; i<that.properties.extensions.length;i++){
        console.log("Extending")
        that = $.extend(that, that.properties.extensions[i]);
        console.log(that.properties.extensions[i].toString())
      }
    }
    console.log(that);
  }

  //Draws the entity based on the current entity status.
  this.draw = function(scale) {
    let img_width = scale*that.size;
    //Preloads character animation images outside of window
    console.log(that.properties);

    var div_insertion = document.createElement("div");
    let div_z_index = that.z_index+1;
    div_insertion.style = "width:" + img_width + "px;top:" +0 + "px;left:" + 0 + "px;z-index:"+div_z_index+";";
    div_insertion.id = that.id+"_div";
    div_insertion.style.height = img_width + "px";
    div_insertion.style.width = img_width + "px";
    div_insertion.style.zIndex = div_z_index;
    div_insertion.className = "entity_div";
    document.getElementById("EntityContent").appendChild(div_insertion);

    if(that.show_entity){
      document.getElementById(that.id+"_div").style.display = "inline";
    }
    else{
      document.getElementById(that.id+"_div").style.display = "none";
    }

    let all_textures_listed = that.properties["texture"];
    let textures_keys = Object.keys(all_textures_listed);
    var img_promise_array = [];
    for(let i = 0; i<textures_keys.length;i++){
      let animation_frames = that.properties["texture"][textures_keys[i]];
      for(let j = 0;j<animation_frames.length;j++){
        let current_frame = animation_frames[j];
        let current_image_promise = filesCapsule.getImgAsync(current_frame, function(imageObject){
          imageObject.id = that.id+"_"+textures_keys[i]+"_"+j;
          imageObject.style.display = "none";
          //imageObject.style.visibility = "hidden";
          imageObject.style.width = img_width + "px";
          imageObject.style.top = 0// + "px";
          imageObject.style.left = 0// + "px";
          imageObject.style.zIndex = that.z_index;
          imageObject.className = "entity_element";
          document.getElementById(that.id+"_div").appendChild(imageObject);
          imageObject.onload = function(){
            that.imgNaturalWidth = document.getElementById(that.id+"_"+textures_keys[i]+"_"+j).naturalWidth;
            that.imgNaturalHeight = document.getElementById(that.id+"_"+textures_keys[i]+"_"+j).naturalHeight;
          };
        });
        img_promise_array.push(current_image_promise);
      }
    }
    var joint_img_promise = Promise.all(img_promise_array);

    current_animation_frame = that.defineAnimationFrame();
    //document.getElementById(current_animation_frame).style.visibility = "hidden";
    document.getElementById(current_animation_frame).style.display = "inline";
    return joint_img_promise;
  }

  //Updates the entity based on the current entity status.
  // this.update = function(x_px_displacement_param, y_px_displacement_param) {
  //   previous_animation_frame = current_animation_frame;
  //   current_animation_frame = that.defineAnimationFrame();
  //   var new_animation_frame_obj = document.getElementById(current_animation_frame);
  //
  //   document.getElementById(previous_animation_frame).style.visibility = "hidden";
  //   new_animation_frame_obj.style.visibility = "visible";
  //   new_animation_frame_obj.style.left = x_px_displacement_param + "px";
  //   that.x_px_displacement = x_px_displacement_param;
  //   new_animation_frame_obj.style.top = y_px_displacement_param + "px";
  //   that.y_px_displacement = y_px_displacement_param;
  // }


  //Updates the entity based on the current entity status.
  this.updatePosition = function(x_px_displacement_param, y_px_displacement_param) {
    let previous_animation_frame = current_animation_frame;
    current_animation_frame = that.defineAnimationFrame();
    var new_animation_frame_obj = document.getElementById(current_animation_frame);


    if(previous_animation_frame != current_animation_frame){
      document.getElementById(previous_animation_frame).style.display = "none";
      //document.getElementById(previous_animation_frame).style.visibility = "hidden";
      new_animation_frame_obj.style.display = "inline";
      //new_animation_frame_obj.style.visibility = "visible";
      new_animation_frame_obj.style.left = x_px_displacement_param + "px";
      that.x_px_displacement = x_px_displacement_param;
      new_animation_frame_obj.style.top = y_px_displacement_param + "px";
      that.y_px_displacement = y_px_displacement_param;
    }
    else{
      if(x_px_displacement_param != that.x_px_displacement){
        new_animation_frame_obj.style.left = x_px_displacement_param + "px";
        that.x_px_displacement = x_px_displacement_param;
      }
      if(y_px_displacement_param != that.y_px_displacement){
        new_animation_frame_obj.style.top = y_px_displacement_param + "px";
        that.y_px_displacement = y_px_displacement_param;
      }
    }
  }

  //Updates the entity size based on the current entity status.
  this.updateSize = function(size_param, scale_param) {
    that.size = size_param;
    let img_width = scale*that.size;
    document.getElementById(current_animation_frame).style.width =  img_width+"px";
  }

  //Updates the entity zindex based on the current entity status.
  this.updateZIndex = function(z_index_param) {
    that.z_index = z_index_param;
    let html_z_index = that.z_index+1;
    document.getElementById(current_animation_frame).style.zIndex =  that.z_index;
  }

  this.toggleShowEntity = function(){
    if(that.show_entity){
      that.show_entity = false;
      document.getElementById(that.id+"_div").style.display = "none";
    }
    else{
      that.show_entity = true;
      document.getElementById(that.id+"_div").style.display = "inline";
    }
  }

  //Removes all animation frames from window.
  this.remove = function(){
    let all_textures_listed = that.properties["texture"];
    let textures_keys = Object.keys(all_textures_listed);
    for(let i = 0; i<textures_keys.length;i++){
      let animation_frames = that.properties["texture"][textures_keys[i]];
      for(let j = 0;j<animation_frames.length;j++){
        let image_x = document.getElementById(that.id+"_"+textures_keys[i]+"_"+j);
        image_x.parentNode.removeChild(image_x);
      }
    }
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

//This function creates a series of entity groups that are compatible with the game world.
//You need to provide the main character object as well as a list of entities with their respective properties.
//You also need to provide the world object

//The other_entities parameter allows you to add other entities to the resulting list, these entities may use a different entity constructor, though they still need to be compliant with the general framework.
//The other_entities parameter needs to be a tuple with 5 list:
//1. entities: a list of all extra entity objects
//2. entitiesThatCollide: a list of all extra entity objects that have a collision behavior
//3. entitiesThatMove: a list of all extra entity objects that have a move behavior
//4. entitiesThatOverlap: a list of all extra entity objects that have a overlap behavior
//5. entitiesThatInteract: a list of all extra entity objects that have a interact behavior

//The EntityFactory function returns a touple of 5 lists of entities:
//1. entities: a list of all entity objects
//2. entitiesThatCollide: a list of all entity objects that have a collision behavior
//3. entitiesThatMove: a list of all entity objects that have a move behavior
//4. entitiesThatOverlap: a list of all entity objects that have a overlap behavior
//5. entitiesThatInteract: a list of all entity objects that have a interact behavior
function MultipleEntityFactory(entity_prop_list, world_object, other_entities){
  let entities = [];
  let entitiesThatCollide = [];
  let entitiesThatMove = [];
  let entitiesThatOverlap = [];
  let entitiesThatInteract = [];

  if(other_entities !== undefined){
    entities = other_entities[0];
    entitiesThatCollide = other_entities[1];
    entitiesThatMove = other_entities[2];
    entitiesThatOverlap = other_entities[3];
    entitiesThatInteract = other_entities[4];
  }

  for(let i = 0; i<entity_prop_list.length; i++){
    let current_entity_type = entity_prop_list[i];
    for(let j = 0; j<current_entity_type.init.length;j++){
      let entity_properties = {};
      let new_entity = new Entity(world_object);
      new_entity.id = "entity_"+i+"_"+j;
      entity_properties.init = current_entity_type.init[j];
      entity_properties.texture = current_entity_type.texture;
      entity_properties.extensions = current_entity_type.extensions;
      new_entity.init(entity_properties);
      //Adds entity to the complete entity array
      entities.push(new_entity);
      //Adds entity to the optimized small arrays.
      //List of all entities that have a collide nature that is not empty
      if(new_entity.nature.collision !== undefined){
        entitiesThatCollide.push(new_entity);
      }
      //List of all entities that have a movement nature that is not still
      if(new_entity.nature.movement !== undefined){
        entitiesThatMove.push(new_entity);
      }
      //List of all entities that have a overlap nature that is not doNothing
      if(new_entity.nature.overlap !== undefined){
        entitiesThatOverlap.push(new_entity);
      }
      //list of all entities that have a interact nature that is not doNothing
      if(new_entity.nature.collision !== undefined){
        entitiesThatInteract.push(new_entity);
      }
    }
  }

  return [entities, entitiesThatCollide, entitiesThatMove, entitiesThatOverlap, entitiesThatInteract];
}
