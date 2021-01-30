//Character constructor function
//Creates a character object
function Character(world_object) {
  Entity.call(this, world_object);
  var world = world_object;
  var that = this;
  var current_animation_frame = "";
  this.isCharacter = true;
  this.z_index = 3;
  this.show_html = true;

  //Status of the menu
  var menu = 0;

  this.setDisplacement = function(x_displace_param, y_displace_param){
    that.x_px_displacement = x_displace_param;
    that.y_px_displacement = y_displace_param;
  }

  //Determines if a arrow key is currently pressed
  var toggle_key_up = false;
  var toggle_key_right = false;
  var toggle_key_down = false;
  var toggle_key_left = false;

  //Initializes the character and all its properties
  this.init = function(init_game_character_properties) {
    that.id = "main_character";
    processCharacterProperties(init_game_character_properties);
  }

  //Processes the character properties file
  //All properties defined in the in the init object are overwritten
  function processCharacterProperties(data) {
    that.properties = data;
    console.log(that.properties);
    //Defines initial variable values
    that = $.extend(that, that.properties["init"]);
    //Preloads character animation images outside of window
    let all_textures_listed=that.properties["texture"];
    let textures_keys = Object.keys(all_textures_listed);
    //world.load_assertion();
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
    let img_height = (that.imgNaturalHeight * img_width)/that.imgNaturalWidth;
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

  //Computer controls
  //Handles Key down, depending on menu status can either move the character, interact with object, move within a menu, or select in a menu
  $("body").on("keydown", function(event) {
    checkKey(event);
  });

  $("body").on("keyup", function(event) {
    checkKeyUp(event);
  });

  //document.onkeydown = checkKey;
  function checkKey(e) {
    if (e.which == '90') {
      checkInteraction();
    } else if (e.which == '38') {
      if (menu == 1) {
        menuUp();
      } else {
        toggle_key_up = true;
      }
    } else if (e.which == '40') {
      if (menu == 1) {
        menuDown();
      } else {
        toggle_key_down = true;
      }
    } else if (e.which == '37') {
      if (menu == 1) {
        menuLeft();
      } else {
        toggle_key_left = true;
      }
    } else if (e.which == '39') {
      if (menu == 1) {
        menuRight();
      } else {
        toggle_key_right = true;
      }
    }
  }

  //document.onkeydown = checkKey;
  function checkKeyUp(e) {
    if (e.which == '90') {
      checkInteraction();
    } else if (e.which == '38') {
      if (menu != 1) {
        toggle_key_up = false;
      }
    } else if (e.which == '40') {
      if (menu != 1) {
        toggle_key_down = false;
      }
    } else if (e.which == '37') {
      if (menu != 1)
        toggle_key_left = false;
    } else if (e.which == '39') {
      if (menu != 1) {
        toggle_key_right = false;
      }
    } else if (e.which == '80') {
      if (menu != 1) {
        world.toggleClock();
      }
    }
  }

  //Based on pressed keys calculates the movement of the main character sets his direction and advances the time of animation
  this.moveBasedOnKeys = function() {
    let y_total = (-1 * toggle_key_up) + toggle_key_down;
    let x_total = (-1 * toggle_key_left) + toggle_key_right;
    if (y_total == -1 && x_total == 0) {
      that.setAnimation("up");
      that.advanceAnimationTime();
    } else if (y_total == 1 && x_total == 0) {
      that.setAnimation("down");
      that.advanceAnimationTime();
    } else if (y_total == 0 && x_total == 1) {
      that.setAnimation("right");
      that.advanceAnimationTime();
    } else if (y_total == 0 && x_total == -1) {
      that.setAnimation("left");
      that.advanceAnimationTime();
    } else if (y_total == 1 && x_total == 1) {
      that.setAnimation("down_right");
      that.advanceAnimationTime();
    } else if (y_total == -1 && x_total == -1) {
      that.setAnimation("up_left");
      that.advanceAnimationTime();
    } else if (y_total == -1 && x_total == 1) {
      that.setAnimation("up_right");
      that.advanceAnimationTime();
    } else if (y_total == 1 && x_total == -1) {
      that.setAnimation("down_left");
      that.advanceAnimationTime();
    } else {
      if(that.getAnimation()=="down_left"||that.getAnimation()=="up_left"||that.getAnimation()=="up_left"||that.getAnimation()=="down_right"||that.getAnimation()=="up"||that.getAnimation()=="right"||that.getAnimation()=="down"||that.getAnimation()=="left"){
        that.animation_time = 0;
      }
    }
    return[[that.x_pos, that.y_pos], [that.x_pos + (x_total * that.movement_unit), that.y_pos + (y_total * that.movement_unit)]];
  }


  //Predicts the apropriate movement based on the entity nature
  //Returns the origin and the destination of the character
  this.predictMovement = function(){
    return that.moveBasedOnKeys();
  }

  //Moves the entity based on its nature and the current collision directions.
  //If colliding in a direction, does not move.
  this.movePosition = function(){
    let from_to = that.moveBasedOnKeys();
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

  function resetCollision(){
    that.collisionUp = false;
    that.collisionDown = false;
    that.collisionLeft = false;
    that.collisionRight = false;
  }

  function activateVerticalCollision(){
    that.collisionUp = true;
    that.collisionDown = true;
  }
  function activateHorizontalCollision(){
    that.collisionLeft = true;
    that.collisionRight = true;
  }

  //Cancels all currently pressed arrow keys
  this.stopCharacter = function() {
    toggle_key_up = false;
    toggle_key_down = false;
    toggle_key_left = false;
    toggle_key_right = false;
  }
}

function CharacterFactory(init_character_properties, world_object){
  let character_obj = new Character(world_object);
  character_obj.init(init_character_properties);
  return character_obj;
}
