var Character = function(world_object) {
  var world = world_object;
  var character = this;
  var properties = {};
  //Texture name of character when he is facing left, down, right, up
  //Can be changed to other values for other expressions or actions manually, updates on draw() call
  this.texture = "down";

  //Status of the menu
  var menu = 0;

  //measured left to right the starting location of the main character on the x axis on current map
  this.x_pos = 1;
  //measured top to bottom the starting location of the main character on the y axis on current map
  this.y_pos = 1;

  //Determines where on screen the main character is painted based on the screen size and the world scale.
  var x_px_displacement; //= (width / 2) - (scale / 2);
  var y_px_displacement; //= (hight / 2) - (scale / 2);

  this.setDisplacement = function(x_displace_param, y_displace_param){
    x_px_displacement = x_displace_param;
    y_px_displacement = y_displace_param;
  }

  this.getPos = function(){
    return [character.x_pos,character.y_pos];
  }


  //Determines if a arrow key is currently pressed
  var toggle_key_up = false;
  var toggle_key_right = false;
  var toggle_key_down = false;
  var toggle_key_left = false;

  //Determines how far the entity moves should be 1 divided by a multiple of 2
  //1, 0.5, 0.25, 0.125, etc
  var movement_unit = 0.125;

  //Initializes the character and all its properties
  this.init = function() {
    getCharacterProperties(rpg_character_properties_path);
  }

  //Gets the character properties file
  function getCharacterProperties(character_url) {
    return $.ajax({
      type: "GET",
      url: character_url,
      dataType: "json",
      success: function(data) {
        processCharacter(data);
      }
    });
  };

  //Processes the character properties file
  //All properties defined in the in the init object are overwritten
  function processCharacter(data) {
    properties = data;
    console.log(properties);
    character = $.extend(character, properties["init"]);
    console.log(character.texture);
    world.load_assertion();
  }

  //Draws the character based on the current character status.
  this.draw = function(scale) {
    let characterTexturePath = properties["texture"][character.texture];
    x_character_img_px_displacement = x_character_px_displacement;
    y_character_img_px_displacement = y_character_px_displacement;
    let character_layer_inyection = "<img id='main_character' class='character_element' style='width:" + scale + "px;top:" +
      y_character_img_px_displacement + "px;left:" + x_character_img_px_displacement + "px' src='" + characterTexturePath + "'>";
    document.getElementById("CharacterContent").innerHTML = character_layer_inyection;
  }

  //Updates the character based on the current character status.
  this.update = function(scale) {

    let characterTexturePath = properties["texture"][character.texture];
    x_character_img_px_displacement = x_character_px_displacement;
    y_character_img_px_displacement = y_character_px_displacement;
    let main_character_element = $("#main_character");
    main_character_element.css({
      "width":scale+"px",
      "top":y_character_img_px_displacement+"px",
      "left":x_character_img_px_displacement+"px"
    });
    main_character_element.attr("src", characterTexturePath);
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
    }
  }

  this.moveBasedOnKeys = function() {
    let y_total = (-1 * toggle_key_up) + toggle_key_down;
    let x_total = (-1 * toggle_key_left) + toggle_key_right;
    if (y_total == -1 && x_total == 0) {
      character.texture = "up";
    } else if (y_total == 1 && x_total == 0) {
      character.texture = "down";
    } else if (y_total == 0 && x_total == 1) {
      character.texture = "right";
    } else if (y_total == 0 && x_total == -1) {
      character.texture = "left";
    } else if (y_total == 1 && x_total == 1) {
      character.texture = "down_right";
    } else if (y_total == -1 && x_total == -1) {
      character.texture = "up_left";
    } else if (y_total == -1 && x_total == 1) {
      character.texture = "up_right";
    } else if (y_total == 1 && x_total == -1) {
      character.texture = "down_left";
    }
    moveCharacter([character.x_pos, character.y_pos], [character.x_pos, character.y_pos + (y_total * movement_unit)]);
    moveCharacter([character.x_pos, character.y_pos], [character.x_pos + (x_total * movement_unit), character.y_pos]);
  }

  //Movement action of a character on Arrow key down
  function moveCharacter(origin, destination) {
    let rounded_destination = [Math.round(destination[0]), Math.round(destination[1])]
    character.x_pos = destination[0];
    character.y_pos = destination[1];
  }

  //Cancels all currently pressed arrow keys
  function stopCharacter() {
    toggle_key_up = false;
    toggle_key_down = false;
    toggle_key_left = false;
    toggle_key_right = false;
  }


  //TODO
  //Cellphone controls
  document.addEventListener('touchstart', handleTouchStart, false);
  document.addEventListener('touchmove', handleTouchMove, false);

  var xDown = null;
  var yDown = null;

  function getTouches(evt) {
    return evt.touches || // browser API
      evt.originalEvent.touches; // jQuery
  }

  function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
  };

  function handleTouchMove(evt) {
    if (!xDown || !yDown) {
      return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      /*most significant*/
      if (xDiff > 0) {
        character.texture = "left";
        moveCharacter([character.x_pos, character.y_pos], [character.x_pos - 1, character.y_pos]);
      } else {
        character.texture = "right";
        moveCharacter([character.x_pos, character.y_pos], [character.x_pos + 1, character.y_pos]);
      }
    } else {
      if (yDiff > 0) {
        character.texture = "up";
        moveCharacter([character.x_pos, character.y_pos], [character.x_pos, character.y_pos - 1]);
      } else {
        character.texture = "down";
        moveCharacter([character.x_pos, character.y_pos], [character.x_pos, character.y_pos + 1]);
      }
    }
    /* reset values */
    xDown = null;
    yDown = null;
  };
}
