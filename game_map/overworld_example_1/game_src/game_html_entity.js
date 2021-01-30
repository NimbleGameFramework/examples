//Entity constructor function
//Creates a entity entity
function HTML_Entity(world_object) {
  var that = this;
  var world = world_object;
  this.show_html = true;
  Entity.call(that, world_object);

  //Draws the entity based on the current entity status.
  this.draw = function(scale) {
    let img_width = scale*that.size;
    //Preloads character animation images outside of window
    console.log(that.properties);

    var div_insertion = document.createElement("div");
    let div_z_index = that.z_index+1;
    div_insertion.style = "width:" + img_width + "px;top:" +0 + "px;left:" + 0 + "px;z-index:"+div_z_index+";";
    div_insertion.id = that.id+"_div";
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

    var span_insertion = document.createElement("span");
    //let div_z_index = that.z_index+1;
    span_insertion.style = "width:" + img_width + "px;top:" +0 + "px;left:" + 0 + "px;z-index:"+div_z_index+";";
    span_insertion.innerHTML = that.div_content;
    span_insertion.id = that.id+"_html";
    span_insertion.style.width = img_width + "px";
    span_insertion.style.top = 0 + "px";
    span_insertion.style.left = 0 + "px";
    span_insertion.style.zIndex = div_z_index;
    span_insertion.className = "entity_element";
    document.getElementById(that.id+"_div").appendChild(span_insertion);

    if(that.show_html){
      document.getElementById(that.id+"_html").style.display = "inline";
    }
    else{
      document.getElementById(that.id+"_html").style.display = "none";
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
          imageObject.style.width = img_width + "px";
          imageObject.style.top = 0// + "px";
          imageObject.style.left = 0// + "px";
          imageObject.style.zIndex = that.z_index;
          imageObject.className = "entity_element";
          document.getElementById(that.id+"_div").appendChild(imageObject);
          imageObject.onload = function(){
            that.imgNaturalWidth = document.getElementById(that.id+"_"+textures_keys[i]+"_"+j).naturalWidth;
            that.imgNaturalHeight = document.getElementById(that.id+"_"+textures_keys[i]+"_"+j).naturalHeight;
            var img_height = (that.imgNaturalHeight * img_width)/that.imgNaturalWidth;
            document.getElementById(that.id+"_html").style.height = img_height + "px";
            document.getElementById(that.id+"_div").style.height = img_height + "px";
          };
        });
        img_promise_array.push(current_image_promise);
      }
    }
    var joint_img_promise = Promise.all(img_promise_array);

    current_animation_frame = that.defineAnimationFrame();
    document.getElementById(current_animation_frame).style.display = "inline";
    return joint_img_promise;
  }



  //Updates the entity based on the current entity status.
  this.updatePosition = function(x_px_displacement_param, y_px_displacement_param) {
    let previous_animation_frame = current_animation_frame;
    current_animation_frame = that.defineAnimationFrame();
    var new_animation_frame_obj = document.getElementById(current_animation_frame);
    var element_div_obj = document.getElementById(that.id+"_html");
    if(previous_animation_frame != current_animation_frame){
      document.getElementById(previous_animation_frame).style.display = "none";
      new_animation_frame_obj.style.display = "inline";

      new_animation_frame_obj.style.left = x_px_displacement_param + "px";
      that.x_px_displacement = x_px_displacement_param;
      new_animation_frame_obj.style.top = y_px_displacement_param + "px";
      that.y_px_displacement = y_px_displacement_param;
      if(that.show_html){
        element_div_obj.style.left = x_px_displacement_param + "px";
        element_div_obj.style.top = y_px_displacement_param + "px";
      }
    }
    else{
      if(x_px_displacement_param != that.x_px_displacement){
        new_animation_frame_obj.style.left = x_px_displacement_param + "px";
        that.x_px_displacement = x_px_displacement_param;
        if(that.show_html){
          element_div_obj.style.left = x_px_displacement_param + "px";
        }
      }
      if(y_px_displacement_param != that.y_px_displacement){
        new_animation_frame_obj.style.top = y_px_displacement_param + "px";
        that.y_px_displacement = y_px_displacement_param;
        if(that.show_html){
          element_div_obj.style.top = y_px_displacement_param + "px";
        }
      }
    }
  }

  //Updates the entity size based on the current entity status.
  this.updateSize = function(size_param, scale_param) {
    that.size = size_param;
    let img_width = scale*that.size;
    document.getElementById(current_animation_frame).style.width =  img_width+"px";
    document.getElementById(that.id+"_html").style.width =  img_width+"px";
    let img_height = (that.imgNaturalHeight*img_width)/that.imgNaturalWidth;
    document.getElementById(that.id+"_html").style.height =  img_height+"px";
  }

  //Updates the entity zindex based on the current entity status.
  this.updateZIndex = function(z_index_param) {
    that.z_index = z_index_param;
    let html_z_index = that.z_index+1;
    document.getElementById(current_animation_frame).style.zIndex =  that.z_index;
    document.getElementById(that.id+"_html").style.zIndex =  html_z_index;
  }

  //Hides or shows the html element of this entity (Hide and show dialog or menu options)
  this.toggleShowHtml = function(){
    if(that.show_html){
      that.show_html = false;
      document.getElementById(that.id+"_html").style.display = "none";
    }
    else{
      that.show_html = true;
      document.getElementById(that.id+"_html").style.display = "inline";
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
function MultipleHTMLEntityFactory(html_entity_prop_list, world_object, other_entities){
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

  for(let i = 0; i<html_entity_prop_list.length; i++){
    let current_entity_type = html_entity_prop_list[i];
    for(let j = 0; j<current_entity_type.init.length;j++){
      let entity_properties = {};
      let new_entity = new HTML_Entity(world_object);
      new_entity.id = "html_entity_"+i+"_"+j;
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
