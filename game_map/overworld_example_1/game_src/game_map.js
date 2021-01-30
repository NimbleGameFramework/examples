//Constructor for a map element, a set of elements that dont move relative to the mainCharacter
//
var Map = function(world_object_param) {
  var that = this;
  var world_object = world_object_param;

  //Initial loading of map
  this.properties = undefined;
  this.layout_data = undefined;
  this.mainLayer = undefined;
  this.gridBlocks = undefined;

  //Determines the displacement of the map based on the location of the mainCharacter and the world scale
  var x_px_displacement = 0;
  var y_px_displacement = 0;



  //Initial sequence to load map and properties
  this.init = function(init_game_map_properties) {
    that.properties = init_game_map_properties;
    processProperties(init_game_map_properties.gridBlocks);
    //getMap(init_game_map_properties["layer_list"][0].file_path);
  }

  function getMap(map_url) {
    return filesCapsule.getTextAsync(map_url, function(response){
      processMap(response);
    });
  };

  function processProperties(data) {
    let tile_list = Object.keys(data);
    for(let i = 0; i<tile_list.length;i++){
      let default_tile_properties = {
        z_index:0
      }
      data[tile_list[i]] = $.extend(default_tile_properties,data[tile_list[i]]);
    }
    console.log(data);
    that.gridBlocks = data;
  };
  function processMap(data) {
    console.log("Defining layout_data");
    that.layout_data = $.csv.toArrays(data);
    //world_object.load_assertion();
  };

  this.draw = function(scale){
    return that.draw_grid_layer(scale, that.properties["layer_list"][0].file_path);
  };

  //Draw function that places the images of the world elements inside the MapContent space (Does not paint character or entities)
  //Takes into account both window size and character location
  this.draw_grid_layer = function(scale, csv_url) {
    let draw_promise = getMap(csv_url)
    .then(function(){
      var newMapLayerDiv = document.createElement('div');
      newMapLayerDiv.id = "mapLayer";
      newMapLayerDiv.left = x_px_displacement+"px";
      newMapLayerDiv.top = y_px_displacement+"px";
      var img_promise_array = [];
      for (let i = 0; i < that.layout_data.length; i++) {
        let current_row = that.layout_data[i];
        var newImgDiv = document.createElement('div');
        newImgDiv.id = "map_row_"+i;
        newImgDiv.className = "map_row";
        newImgDiv.style.height = scale+"px";
        for (let j = 0; j < current_row.length; j++) {
          let current_square = current_row[j];
          let current_texture = that.gridBlocks[current_square]["texture"];
          let current_image_promise = filesCapsule.getImgAsync(current_texture, function(imageObject){
            imageObject.id = "map_img_"+i+"_"+j;
            imageObject.style.width = scale + "px";
            imageObject.style.zIndex = that.gridBlocks[current_square]["z_index"];
            imageObject.className = "map_element";
            newImgDiv.appendChild(imageObject);
          });
          img_promise_array.push(current_image_promise);
        }
        newMapLayerDiv.appendChild(newImgDiv);
      }
      document.getElementById("MapContent").appendChild(newMapLayerDiv);
      return(Promise.all(img_promise_array));
    });
    return draw_promise;
  };

  //This function changes the style of each individual map row and map image instead of redrawing it, this makes movement smoother
  this.updatePosition = function(x_px_displacement_param, y_px_displacement_param) {
      let map_layer_obj = document.getElementById("mapLayer");
      if(x_px_displacement_param != that.x_px_displacement){
        map_layer_obj.style.left = x_px_displacement_param + "px";
        x_px_displacement = x_px_displacement_param;
      }
      if(y_px_displacement_param != that.y_px_displacement){
        map_layer_obj.style.top = y_px_displacement_param + "px";
        y_px_displacement = y_px_displacement_param;
      }

      x_px_displacement = x_px_displacement_param;
      y_px_displacement = y_px_displacement_param;
  }
}


function MapFactory(init_game_map_properties, world_object){
  let map_obj = new Map(world_object);
  map_obj.init(init_game_map_properties);
  return map_obj;
}
