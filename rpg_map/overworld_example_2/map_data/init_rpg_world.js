//These are the main properties that need to be defined in order to load the map.
//You can change map by either changing these variables, or by changing the url using javascript.
//The csv describing the current map and the location of all elements
var rpg_map_data_path = "./map_data/rpg_map_data.csv";
//Call to initialize and paint the world with all objects based on file paths
var world_example_1 = new World();

var simple_solid_nature = new Nature(collisionLibrary.solid,undefined,undefined,undefined);
var simple_empty_nature = new Nature(collisionLibrary.empty,undefined,undefined,undefined);

var init_rpg_map_properties = {
  "WallTop":{
    "texture":"./map_data/textures/WallTop.png",
    "nature":simple_solid_nature
  },
  "WallRight":{
    "texture":"./map_data/textures/WallRight.png",
    "nature":simple_solid_nature
  },
  "WallLeft":{
    "texture":"./map_data/textures/WallLeft.png",
    "nature":simple_solid_nature
  },
  "WallBottom":{
    "texture":"./map_data/textures/WallBottom.png",
    "nature":simple_solid_nature
  },
  "Chair":{
    "texture":"./map_data/textures/Chair.png",
    "nature":simple_solid_nature
  },
  "Wood":{
    "texture":"./map_data/textures/WoodFloor.png",
    "nature":simple_empty_nature
  },
  "Carpet":{
    "texture":"./map_data/textures/RedCarpet.png",
    "nature":simple_empty_nature
  },
  "Empty":{
    "texture":"./map_data/textures/Empty.png",
    "nature":simple_empty_nature
  }
}


var init_rpg_character_properties = {
  "init":{
    "x_pos":1,
    "y_pos":6,
    "animation":"down",
    "animation_cycle":1500,
    "x_hitbox_start":0.35,
    "y_hitbox_start":0.22,
    "x_hitbox_end":0.65,
    "y_hitbox_end":0.78,
    "nature": new Nature(
      function(world,entity, entityCollider,direction){
        if(entity.type=="slime"){window.location.reload(false);}
      },
      undefined,
      undefined,
      movementLibrary.bounceOnCollide
    )
  },
  "texture":{
    "up":[
      "../rpg_data/textures/character/up1.png",
      "../rpg_data/textures/character/up2.png",
      "../rpg_data/textures/character/up3.png",
      "../rpg_data/textures/character/up4.png",
      "../rpg_data/textures/character/up5.png",
      "../rpg_data/textures/character/up6.png",
      "../rpg_data/textures/character/up7.png",
      "../rpg_data/textures/character/up8.png",
      "../rpg_data/textures/character/up9.png"
    ],
    "right":[
      "../rpg_data/textures/character/right1.png",
      "../rpg_data/textures/character/right2.png",
      "../rpg_data/textures/character/right3.png",
      "../rpg_data/textures/character/right4.png",
      "../rpg_data/textures/character/right5.png",
      "../rpg_data/textures/character/right6.png",
      "../rpg_data/textures/character/right7.png",
      "../rpg_data/textures/character/right8.png",
      "../rpg_data/textures/character/right9.png"
    ],
    "down":[
      "../rpg_data/textures/character/down1.png",
      "../rpg_data/textures/character/down2.png",
      "../rpg_data/textures/character/down3.png",
      "../rpg_data/textures/character/down4.png",
      "../rpg_data/textures/character/down5.png",
      "../rpg_data/textures/character/down6.png",
      "../rpg_data/textures/character/down7.png",
      "../rpg_data/textures/character/down8.png",
      "../rpg_data/textures/character/down9.png"
    ],
    "left":[
      "../rpg_data/textures/character/left1.png",
      "../rpg_data/textures/character/left2.png",
      "../rpg_data/textures/character/left3.png",
      "../rpg_data/textures/character/left4.png",
      "../rpg_data/textures/character/left5.png",
      "../rpg_data/textures/character/left6.png",
      "../rpg_data/textures/character/left7.png",
      "../rpg_data/textures/character/left8.png",
      "../rpg_data/textures/character/left9.png"
    ],
    "up_left":[
      "../rpg_data/textures/character/left1.png",
      "../rpg_data/textures/character/left2.png",
      "../rpg_data/textures/character/left3.png",
      "../rpg_data/textures/character/left4.png",
      "../rpg_data/textures/character/left5.png",
      "../rpg_data/textures/character/left6.png",
      "../rpg_data/textures/character/left7.png",
      "../rpg_data/textures/character/left8.png",
      "../rpg_data/textures/character/left9.png"
    ],
    "down_left":[
      "../rpg_data/textures/character/left1.png",
      "../rpg_data/textures/character/left2.png",
      "../rpg_data/textures/character/left3.png",
      "../rpg_data/textures/character/left4.png",
      "../rpg_data/textures/character/left5.png",
      "../rpg_data/textures/character/left6.png",
      "../rpg_data/textures/character/left7.png",
      "../rpg_data/textures/character/left8.png",
      "../rpg_data/textures/character/left9.png"
    ],
    "up_right":[
      "../rpg_data/textures/character/right1.png",
      "../rpg_data/textures/character/right2.png",
      "../rpg_data/textures/character/right3.png",
      "../rpg_data/textures/character/right4.png",
      "../rpg_data/textures/character/right5.png",
      "../rpg_data/textures/character/right6.png",
      "../rpg_data/textures/character/right7.png",
      "../rpg_data/textures/character/right8.png",
      "../rpg_data/textures/character/right9.png"
    ],
    "down_right":[
      "../rpg_data/textures/character/right1.png",
      "../rpg_data/textures/character/right2.png",
      "../rpg_data/textures/character/right3.png",
      "../rpg_data/textures/character/right4.png",
      "../rpg_data/textures/character/right5.png",
      "../rpg_data/textures/character/right6.png",
      "../rpg_data/textures/character/right7.png",
      "../rpg_data/textures/character/right8.png",
      "../rpg_data/textures/character/right9.png"
    ]
  }
}


var init_rpg_entity_properties = [
  {
    "init": [{
      "x_pos": 5,
      "y_pos": 1,
      "nature": new Nature( collisionLibrary.solid, undefined, undefined, movementLibrary.still),
      "size":5,
      "div_content":"<iframe style='width:100%;height:100%;' src='https://ia902901.us.archive.org/7/items/CharlieChaplinModernTimes19361/Charlie.Chaplin.Modern.Times.1936.720p.BrRip.x264.YIFY.mp4'></iframe>"
    }],
    "texture": {
      "up": ["./map_data/textures/Empty.png"],
      "down": ["./map_data/textures/Empty.png"],
      "left": ["./map_data/textures/Empty.png"],
      "right": ["./map_data/textures/Empty.png"],
      "up_left": ["./map_data/textures/Empty.png"],
      "up_right": ["./map_data/textures/Empty.png"],
      "down_left": ["./map_data/textures/Empty.png"],
      "down_right": ["./map_data/textures/Empty.png"],
    }

  }]


world_example_1.init(rpg_map_data_path, init_rpg_map_properties, init_rpg_character_properties, init_rpg_entity_properties);
