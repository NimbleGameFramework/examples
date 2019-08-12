var World = function() {
  //Determines the size of the world (map, character and entities) on screen in pixels per unit(size of a single tile or size of character)
  var world = this;
  this.scale = 100;
  this.time_per_frame = 33;

  var mainCharacter = new Character(this);
  var currentMap = new Map(this);
  console.log("Creating world");

  //allows other classes to inform the world that they have loaded
  //When all elements are loaded they are drawn
  var loading_assertion_array = [false, false];
  this.load_assertion = function(){
    for(let i = 0; i<loading_assertion_array.length; i++){
      if(loading_assertion_array[i]==false){
        loading_assertion_array[i] = true;
        if(i==loading_assertion_array.length-1){
          console.log("Drawing world")
          world.draw();
        }
        return;
      }
    }
  }

  //Initializes the world building the character layer, the map layer and the entity layer
  this.init = function() {
    console.log("Creating Character");
    mainCharacter.init();
    currentMap.init();
    calculateDisplacement();
    window.setInterval(function() {
      mainCharacter.moveBasedOnKeys();
      world.update();
    }, world.time_per_frame);
  }

  //Draws everything in the game world based on current properties.

  this.draw = function() {
    calculateDisplacement();
    mainCharacter.draw(world.scale);
    currentMap.draw(world.scale);
  }

  //Moves elements to position based on current properties.
  this.update = function() {
    calculateDisplacement();
    mainCharacter.update(world.scale);
    currentMap.update(world.scale);
  }

  //Calculates character, map, and entity pixel displacement on screen.
  function calculateDisplacement() {
    x_character_px_displacement = width / 2 - (world.scale / 2);
    y_character_px_displacement = hight / 2 - (world.scale / 2);
    mainCharacter.setDisplacement(x_character_px_displacement, y_character_px_displacement);
    let mainCharacter_current_pos = mainCharacter.getPos();
    x_map_px_displacement = x_character_px_displacement - (mainCharacter_current_pos[0] * world.scale);
    y_map_px_displacement = y_character_px_displacement - (mainCharacter_current_pos[1] * world.scale);
    currentMap.setDisplacement(x_map_px_displacement, y_map_px_displacement);
  }

  //In rpg dynamics, all interactions, collisions, and overlaps, between the map, the character and the entities are processed

  //Collision detection determines if the character or an entity will be able to move in a certain direction.
  //If the map element or the entity in the block to move to has a "solid" collision nature, the algorithm will return true and the character or entity will not be able to move.
  //The character is not solid, meaning that entities can overlap its space if they themselves are not solid.
  //If other nature properties are found these are called as javascript functions including the origin and destination information
  function checkSpaceCollision(origin, destination, entity_nature) {
    let collisionHappens = false;

    let element_destination = map_array[destination[1]][destination[0]];
    let element_collision_nature = rpg_map_properties[element_destination]["nature"]["collision"];

    //Checks if map element has solid attribute
    //Executes all other natures as functions, give priority to given JSON parameters
    for (let i = 0; i < element_collision_nature.length; i++) {
      if (element_collision_nature[i] == "solid") {
        collisionHappens = true;
      } else {
        let param_string = "(";
        let natureFunction = "";
        if (typeof element_collision_nature[i] == 'object') {
          natureFunction = Object.keys(element_collision_nature[i])[0];
          console.log(element_collision_nature[i][natureFunction]);
          param_string = param_string + element_collision_nature[i][natureFunction] + ",";
        } else {
          natureFunction = element_collision_nature[i]
        }
        param_string = param_string + "[" + origin + "],[" + destination + "])";
        console.log(natureFunction + param_string);
        eval(natureFunction + param_string + ";");
      }
    }

    if (entity_nature != null) {
      let arrayContainsSolid = (myarr.indexOf("solid") > -1);
      if (entity_nature == "solid") {
        if (destination[0] == mainCharacter_x && destination[1] == mainCharacter_y) {
          collisionHappens = true;
        }
      }
    }

    //TODO
    //Entity collision detection
    return collisionHappens;
  }

  //Redraws map to ensure alignment
  document.getElementsByTagName("BODY")[0].onresize = function() {
    width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    hight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    world.update();
  };
}
