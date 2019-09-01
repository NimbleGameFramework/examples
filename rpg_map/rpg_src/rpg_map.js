var Map = function(world_object_param) {
  var that = this;
  var world_object = world_object_param;

  //Initial loading of map
  this.layout_data = undefined;
  this.properties = undefined;
  this.init_rpg_map_properties = undefined;

  //Determines the displacement of the map based on the location of the mainCharacter and the world scale
  var x_px_displacement = 0;
  var y_px_displacement = 0;

  this.setDisplacement = function(x_displace_param, y_displace_param){
    x_px_displacement = x_displace_param;
    y_px_displacement = y_displace_param;
  }

  //Initial sequence to load map and properties
  this.init = function(init_rpg_map_properties, rpg_map_data_path) {
    that.init_rpg_map_properties = init_rpg_map_properties;
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
    that.layout_data = $.csv.toArrays(data);
    processProperties(that.init_rpg_map_properties);
  };

  function processProperties(data) {
    console.log(data);
    that.properties = data;
    world_object.load_assertion();
  };

  //Draw function that places the images of the world elements inside the MapContent space (Does not paint character or entities)
  //Takes into account both window size and character location
  this.draw = function(scale) {
    let map_layer_inyection = "<div id='mapLayer' style='height:" + scale + "px;left:" + x_px_displacement + "px;top:" + y_px_displacement + "px;'>";
    let y_added_displacement = 0;
    for (let i = 0; i < that.layout_data.length; i++) {
      let current_row = that.layout_data[i];
      y_total_row_displacement = y_px_displacement + y_added_displacement;
      y_added_displacement = y_added_displacement + scale;
      map_layer_inyection = map_layer_inyection + "<div id='map_row_" + i + "' class='map_row' style='height:" + scale + "px;'>";
      for (let j = 0; j < current_row.length; j++) {

        let current_square = current_row[j];
        let current_texture = that.properties[current_square]["texture"];
        map_layer_inyection = map_layer_inyection + "<img id='map_img_" + i + "_" + j + "' class='map_element' src='" + current_texture + "' style='width:" + scale + "px;'>";
      }
      map_layer_inyection = map_layer_inyection + "</div>";
    }
    map_layer_inyection = map_layer_inyection+"</div>";
    document.getElementById("MapContent").innerHTML = map_layer_inyection;
  };

  //This function changes the style of each individual map row and map image instead of redrawing it, this makes movement smoother
  this.update = function(scale) {
      $("#mapLayer").css({
        "height": scale + "px",
        "left": x_px_displacement + "px",
        "top": y_px_displacement + "px"
      });
  }
}
