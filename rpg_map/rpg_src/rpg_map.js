var Map = function() {
  //Initial loading of map
  var map_array = undefined;
  var rpg_map_properties = undefined;

  //Determines the displacement of the map based on the location of the mainCharacter and the world scale
  var x_map_px_displacement = x_character_px_displacement - (mainCharacter_x * world_scale);
  var y_map_px_displacement = y_character_px_displacement - (mainCharacter_y * world_scale);

  //Initial sequence to load map and properties
  function initMap() {
    getMap(rpg_map_data_path);
  }

  function getMap(map_url) {
    return $.ajax({
      type: "GET",
      url: map_url,
      dataType: "text",
      success: function(data) {
        processMap(data);
      }
    });
  };

  function processMap(data) {
    map_array = $.csv.toArrays(data);
    getMapProperties(rpg_map_element_properties_path);
  };

  function getMapProperties(rpg_map_element_properties_url) {
    return $.ajax({
      type: "GET",
      url: rpg_map_element_properties_url,
      dataType: "json",
      success: function(data) {
        processProperties(data);
      }
    });
  };

  function processProperties(data) {
    console.log(data);
    rpg_map_properties = data;
    //Redraws everything to make sure things are consistent
    drawMapEntitiesCharacter();
  };

  //Draw function that places the images of the world elements inside the MapContent space (Does not paint character or entities)
  //Takes into account both window size and character location
  function drawMap() {
    let map_layer_inyection = "";
    let y_added_displacement = 0;
    for (let i = 0; i < map_array.length; i++) {
      let current_row = map_array[i];
      y_total_row_displacement = y_map_px_displacement + y_added_displacement;
      y_added_displacement = y_added_displacement + world_scale;
      map_layer_inyection = map_layer_inyection + "<div id='map_row_" + i + "' class='map_row' style='height:" + world_scale + "px;left:" + x_map_px_displacement + "px;top:" + y_total_row_displacement + "px;'>";
      for (let j = 0; j < current_row.length; j++) {
        let current_square = current_row[j];
        let current_texture = rpg_map_properties[current_square]["texture"];
        map_layer_inyection = map_layer_inyection + "<img id='map_img_" + i + "_" + j + "' class='map_element' src='" + current_texture + "' style='width:" + world_scale + "px;'>";
      }
      map_layer_inyection = map_layer_inyection + "</div>";
    }
    document.getElementById("MapContent").innerHTML = map_layer_inyection;
  };

  //This function changes the style of each individual map row and map image instead of redrawing it, this makes movement smoother
  function moveMap() {
    let y_added_displacement = 0;
    for (let i = 0; i < map_array.length; i++) {
      let current_row = map_array[i];
      y_total_row_displacement = y_map_px_displacement + y_added_displacement;
      y_added_displacement = y_added_displacement + world_scale;
      $("#map_row_" + i).css({
        "height": world_scale + "px",
        "left": x_map_px_displacement + "px",
        "top": y_total_row_displacement + "px"
      });
      for (let j = 0; j < current_row.length; j++) {
        let current_square = current_row[j];
        let current_texture = rpg_map_properties[current_square]["texture"];
        $("#map_img_" + i + "_" + j).css({
          "width": world_scale + "px"
        });
      }
    }
  }

  function checkElementCollision() {
    return 0;
  }
}
