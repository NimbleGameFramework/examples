var World = function() {
  var mainCharacter = Character();
  var mainMap = Map();

  //Initializes the world building the character layer, the map layer and the entity layer
  function initWorld(scriptPath) {
    initMap();
    initCharacter();
    //initEntities();
  }

  //Draws everything in the game world based on current properties.
  function drawWorld() {
    calculateDisplacement();
    drawCharacter();
    drawMap();
  }

  //Moves elements to position based on current properties.
  function updateWorld() {
    calculateDisplacement();
    drawCharacter();
    moveMap();
  }

  //Calculates character, map, and entity pixel displacement on screen.
  function calculateDisplacement() {
    x_character_px_displacement = width / 2 - (world_scale / 2);
    y_character_px_displacement = hight / 2 - (world_scale / 2);
    x_map_px_displacement = x_character_px_displacement - (mainCharacter_x * world_scale);
    y_map_px_displacement = y_character_px_displacement - (mainCharacter_y * world_scale);
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

  //Manages the movement seen on screen of the character or the entities.
  //It is recommended to use only one interval to activate all movements
  window.setInterval(function() {
    moveCharacterBasedOnKeys();
    updateMapEntitiesCharacter();
  }, 33);


  function message(messageString) {
    stopCharacter();
    alert(messageString);
  }
}
