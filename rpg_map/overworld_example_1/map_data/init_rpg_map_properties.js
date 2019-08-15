var simple_solid_nature = new Nature(world_example_1,collisionLibrary.solid,undefined,undefined,undefined);
var simple_empty_nature = new Nature(world_example_1,collisionLibrary.empty,undefined,undefined,undefined);

var init_rpg_map_properties = {
  "wall":{
    "texture":"../rpg_data/textures/wall.png",
    "nature":simple_solid_nature
  },
  "door":{
    "texture":"../rpg_data/textures/door.png",
    "nature":new Nature(
      world_example_1,
      function(entity, entityCollider){
        collisionLibrary.alert(entity,entityCollider,"Cant go outside yet")
      },
      undefined,
      undefined,
      undefined)
  },
  "floor":{
    "texture":"../rpg_data/textures/empty.png",
    "nature":simple_empty_nature
  },
  "coatHanger":{
    "texture":"../rpg_data/textures/coatHanger.png",
    "nature":new Nature(
      world_example_1,
      function(entity, entityCollider){
        collisionLibrary.alert(entity,entityCollider,"Damn, nothing fits")
      },
      undefined,
      undefined,
      undefined)
  },
  "table":{
    "texture":"../rpg_data/textures/table.png",
    "nature":simple_solid_nature
  },
  "library":{
    "texture":"../rpg_data/textures/library.png",
    "nature":simple_solid_nature
  },
  "desk":{
    "texture":"../rpg_data/textures/desk.png",
    "nature":simple_solid_nature
  },
  "bed":{
    "texture":"../rpg_data/textures/bed.png",
    "nature":simple_solid_nature
  },
  "painting":{
    "texture":"../rpg_data/textures/painting.png",
    "nature":simple_solid_nature
  },
  "canvas":{
    "texture":"../rpg_data/textures/canvas.png",
    "nature":simple_solid_nature
  }
}
