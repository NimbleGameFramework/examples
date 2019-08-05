var Character = function() {
  var rpg_character_properties = {};
  //Texture name of character when he is facing left, down, right, up
  //Can be changed to other values for other expressions or actions manually, updates on draw() call
  var mainCharacter_texture = "down";

  //Status of the menu
  var menu = 0;
  //measured left to right the starting location of the main character on the x axis on current map
  var mainCharacter_x = 1;
  //measured top to bottom the starting location of the main character on the y axis on current map
  var mainCharacter_y = 1;

  //Determines the size of the world (map, character and entities) on screen in pixels per unit(size of a single tile or size of character)
  var world_scale = 100;

  //Determines where on screen the main character is painted based on the screen size and the world scale.
  var x_character_px_displacement = (width / 2) - (world_scale / 2);
  var y_character_px_displacement = (hight / 2) - (world_scale / 2);


  //Determines if a arrow key is currently pressed
  var toggle_key_up = false;
  var toggle_key_right = false;
  var toggle_key_down = false;
  var toggle_key_left = false;

  //Determines how far the character moves should be 1 divided by a multiple of 2
  //1, 0.5, 0.25, 0.125, etc
  var character_movement_unit = 0.125;

  //Initializes the character and all its properties
  function initCharacter() {
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
    rpg_character_properties = data;
    console.log(rpg_character_properties);
    let character_properties_init = Object.keys(rpg_character_properties["init"]);
    for (let i = 0; i < character_properties_init.length; i++) {
      let current_property = character_properties_init[i];
      let current_property_value = rpg_character_properties["init"][current_property];
      eval(current_property + "=" + current_property_value + ";");
    }
    //Redraws everything to make sure things are consistent
    drawMapEntitiesCharacter();
  }

  //Draws the character based on the current character status.
  function drawCharacter() {
    let characterTexturePath = rpg_character_properties["texture"][mainCharacter_texture];
    x_character_img_px_displacement = x_character_px_displacement;
    y_character_img_px_displacement = y_character_px_displacement;
    let character_layer_inyection = "<img class='character_element' style='width:" + world_scale + "px;top:" +
      y_character_img_px_displacement + "px;left:" + x_character_img_px_displacement + "px' src='" + characterTexturePath + "'>";
    document.getElementById("CharacterContent").innerHTML = character_layer_inyection;
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

  function moveCharacterBasedOnKeys() {
    let y_total = (-1 * toggle_key_up) + toggle_key_down;
    let x_total = (-1 * toggle_key_left) + toggle_key_right;
    if (y_total == -1 && x_total == 0) {
      mainCharacter_texture = "up";
    } else if (y_total == 1 && x_total == 0) {
      mainCharacter_texture = "down";
    } else if (y_total == 0 && x_total == 1) {
      mainCharacter_texture = "right";
    } else if (y_total == 0 && x_total == -1) {
      mainCharacter_texture = "left";
    } else if (y_total == 1 && x_total == 1) {
      mainCharacter_texture = "down_right";
    } else if (y_total == -1 && x_total == -1) {
      mainCharacter_texture = "up_left";
    } else if (y_total == -1 && x_total == 1) {
      mainCharacter_texture = "up_right";
    } else if (y_total == 1 && x_total == -1) {
      mainCharacter_texture = "down_left";
    }
    moveCharacter([mainCharacter_x, mainCharacter_y], [mainCharacter_x, mainCharacter_y + (y_total * character_movement_unit)]);
    moveCharacter([mainCharacter_x, mainCharacter_y], [mainCharacter_x + (x_total * character_movement_unit), mainCharacter_y]);
  }

  //Movement action of a character on Arrow key down
  function moveCharacter(origin, destination) {
    let rounded_destination = [Math.round(destination[0]), Math.round(destination[1])]
    if (!checkSpaceCollision(origin, rounded_destination)) {
      mainCharacter_x = destination[0];
      mainCharacter_y = destination[1];
    }
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
        mainCharacter_texture = "left";
        moveCharacter([mainCharacter_x, mainCharacter_y], [mainCharacter_x - 1, mainCharacter_y]);
      } else {
        mainCharacter_texture = "right";
        moveCharacter([mainCharacter_x, mainCharacter_y], [mainCharacter_x + 1, mainCharacter_y]);
      }
    } else {
      if (yDiff > 0) {
        mainCharacter_texture = "up";
        moveCharacter([mainCharacter_x, mainCharacter_y], [mainCharacter_x, mainCharacter_y - 1]);
      } else {
        mainCharacter_texture = "down";
        moveCharacter([mainCharacter_x, mainCharacter_y], [mainCharacter_x, mainCharacter_y + 1]);
      }
    }
    /* reset values */
    xDown = null;
    yDown = null;
  };
}
