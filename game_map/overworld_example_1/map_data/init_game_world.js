//These are the main properties that need to be defined in order to load the map.
//You can change map by either changing these variables, or by changing the url using javascript.
//The csv describing the current map and the location of all elements
var game_map_data_path = "./map_data/game_map_data.csv";

var simple_solid_nature = new Nature(collisionLibrary.solid,undefined,undefined,undefined);
var simple_empty_nature = new Nature(collisionLibrary.empty,undefined,undefined,undefined);

var init_game_map_properties = {
  "layer_list" : [
    {
      "z_index" : 0,
      "type": "grid",
      "x_distance_displacement":0,
      "y_distance_displacement":0,
      "file_path":"./map_data/game_map_data.csv"
    },
    {
      "z_index" : -1,
      "type": "image",
      "x_distance_displacement":0,
      "y_distance_displacement":0,
      "file_path":"/map_data/game_map_data.csv"
    }
  ],
  "gridBlocks" : {
    "wall":{
      "texture":"game_data/textures/wall.png",
      "nature":simple_solid_nature
    },
    "door":{
      "texture":"game_data/textures/door.png",
      "nature":new Nature(
        function(world,entity,entityCollider,direction){
          collisionLibrary.alert(world,entity,entityCollider,direction,"Cant go outside yet")
        },
        undefined,
        undefined,
        undefined)
    },
    "floor":{
      "texture":"game_data/textures/empty.png",
      "nature":simple_empty_nature
    },
    "coatHanger":{
      "texture":"game_data/textures/coatHanger.png",
      "nature":new Nature(
        function(world,entity, entityCollider,direction){

          collisionLibrary.alert(world,entity,entityCollider,direction,"Damn, nothing fits")
        },
        undefined,
        undefined,
        undefined)
    },
    "table":{
      "texture":"game_data/textures/table.png",
      "nature":simple_solid_nature
    },
    "library":{
      "texture":"game_data/textures/library.png",
      "nature":simple_solid_nature
    },
    "desk":{
      "texture":"game_data/textures/desk.png",
      "nature":simple_solid_nature
    },
    "bed":{
      "texture":"game_data/textures/bed.png",
      "nature":simple_solid_nature
    },
    "painting":{
      "texture":"game_data/textures/painting.png",
      "nature":simple_solid_nature
    },
    "canvas":{
      "texture":"game_data/textures/canvas.png",
      "nature":simple_solid_nature
    }
  }
}


var init_game_character_properties = {
  "init":{
    "x_pos":3,
    "y_pos":3,
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
      overlapLibrary.doNothing,
      undefined,
      movementLibrary.bounceOnCollide
    )
  },
  "texture":{
    "up":[
      "game_data/textures/character/up1.png",
      "game_data/textures/character/up2.png",
      "game_data/textures/character/up3.png",
      "game_data/textures/character/up4.png",
      "game_data/textures/character/up5.png",
      "game_data/textures/character/up6.png",
      "game_data/textures/character/up7.png",
      "game_data/textures/character/up8.png",
      "game_data/textures/character/up9.png"
    ],
    "right":[
      "game_data/textures/character/right1.png",
      "game_data/textures/character/right2.png",
      "game_data/textures/character/right3.png",
      "game_data/textures/character/right4.png",
      "game_data/textures/character/right5.png",
      "game_data/textures/character/right6.png",
      "game_data/textures/character/right7.png",
      "game_data/textures/character/right8.png",
      "game_data/textures/character/right9.png"
    ],
    "down":[
      "game_data/textures/character/down1.png",
      "game_data/textures/character/down2.png",
      "game_data/textures/character/down3.png",
      "game_data/textures/character/down4.png",
      "game_data/textures/character/down5.png",
      "game_data/textures/character/down6.png",
      "game_data/textures/character/down7.png",
      "game_data/textures/character/down8.png",
      "game_data/textures/character/down9.png"
    ],
    "left":[
      "game_data/textures/character/left1.png",
      "game_data/textures/character/left2.png",
      "game_data/textures/character/left3.png",
      "game_data/textures/character/left4.png",
      "game_data/textures/character/left5.png",
      "game_data/textures/character/left6.png",
      "game_data/textures/character/left7.png",
      "game_data/textures/character/left8.png",
      "game_data/textures/character/left9.png"
    ],
    "up_left":[
      "game_data/textures/character/left1.png",
      "game_data/textures/character/left2.png",
      "game_data/textures/character/left3.png",
      "game_data/textures/character/left4.png",
      "game_data/textures/character/left5.png",
      "game_data/textures/character/left6.png",
      "game_data/textures/character/left7.png",
      "game_data/textures/character/left8.png",
      "game_data/textures/character/left9.png"
    ],
    "down_left":[
      "game_data/textures/character/left1.png",
      "game_data/textures/character/left2.png",
      "game_data/textures/character/left3.png",
      "game_data/textures/character/left4.png",
      "game_data/textures/character/left5.png",
      "game_data/textures/character/left6.png",
      "game_data/textures/character/left7.png",
      "game_data/textures/character/left8.png",
      "game_data/textures/character/left9.png"
    ],
    "up_right":[
      "game_data/textures/character/right1.png",
      "game_data/textures/character/right2.png",
      "game_data/textures/character/right3.png",
      "game_data/textures/character/right4.png",
      "game_data/textures/character/right5.png",
      "game_data/textures/character/right6.png",
      "game_data/textures/character/right7.png",
      "game_data/textures/character/right8.png",
      "game_data/textures/character/right9.png"
    ],
    "down_right":[
      "game_data/textures/character/right1.png",
      "game_data/textures/character/right2.png",
      "game_data/textures/character/right3.png",
      "game_data/textures/character/right4.png",
      "game_data/textures/character/right5.png",
      "game_data/textures/character/right6.png",
      "game_data/textures/character/right7.png",
      "game_data/textures/character/right8.png",
      "game_data/textures/character/right9.png"
    ]
  }
}

var init_game_html_entity_properties = [
  {
    "init": [{
      "x_pos": 4,
      "y_pos": 4,
      "nature": new Nature( collisionLibrary.pushable, undefined, undefined, movementLibrary.still),
      "size":0.75,
      "div_content":"<div style='color:white;font-size:8px;top:20%;left:25%;position:relative;height:80%;width:50%;'>Handle with care</div>"
    }],
    "texture": {
      "up": ["game_data/textures/entity/box.png"],
      "down": ["game_data/textures/entity/box.png"],
      "left": ["game_data/textures/entity/box.png"],
      "right": ["game_data/textures/entity/box.png"],
      "up_left": ["game_data/textures/entity/box.png"],
      "up_right": ["game_data/textures/entity/box.png"],
      "down_left": ["game_data/textures/entity/box.png"],
      "down_right": ["game_data/textures/entity/box.png"],
    }
  }
];

var init_game_entity_properties = [
  {
    "init": [{
        "x_pos": 1,
        "y_pos": 2,
        "nature": new Nature( undefined, overlapLibrary.removeEntity, undefined, undefined),
        "x_hitbox_start":0.3,
        "y_hitbox_start":0.3,
        "x_hitbox_end":0.6,
        "y_hitbox_end":0.6
      }],
      "texture": {
        "up": ["game_data/textures/entity/orb.png"],
        "down": ["game_data/textures/entity/orb.png"],
        "left": ["game_data/textures/entity/orb.png"],
        "right": ["game_data/textures/entity/orb.png"],
        "up_left": ["game_data/textures/entity/orb.png"],
        "up_right": ["game_data/textures/entity/orb.png"],
        "down_left": ["game_data/textures/entity/orb.png"],
        "down_right": ["game_data/textures/entity/orb.png"],
      }

    },
  {
    "init": [{
      "x_pos": 5,
      "y_pos": 5,
      "animation": "down",
      "animation_cycle": 1000,
      "movement_unit": 0.0625,
      "nature": new Nature( collisionLibrary.reload, undefined, undefined, movementLibrary.bounceOnCollide),
      "type":"slime"
    }, {
      "x_pos": 8,
      "y_pos": 8,
      "animation": "left",
      "animation_cycle": 1000,
      "nature": new Nature(
        function(world,entity, entityCollider,direction){
          if(entity.isCharacter){window.location.reload(false);}
        },
        undefined,
        undefined,
        movementLibrary.bounceOnCollide),
      "type":"slime"
    }],
    "texture": {
      "up": [
        "game_data/textures/entity/slime/slime1.png",
        "game_data/textures/entity/slime/slime2.png",
        "game_data/textures/entity/slime/slime3.png",
        "game_data/textures/entity/slime/slime4.png",
        "game_data/textures/entity/slime/slime5.png",
        "game_data/textures/entity/slime/slime6.png"
      ],
      "right": [
        "game_data/textures/entity/slime/slime1.png",
        "game_data/textures/entity/slime/slime2.png",
        "game_data/textures/entity/slime/slime3.png",
        "game_data/textures/entity/slime/slime4.png",
        "game_data/textures/entity/slime/slime5.png",
        "game_data/textures/entity/slime/slime6.png"
      ],
      "down": [
        "game_data/textures/entity/slime/slime1.png",
        "game_data/textures/entity/slime/slime2.png",
        "game_data/textures/entity/slime/slime3.png",
        "game_data/textures/entity/slime/slime4.png",
        "game_data/textures/entity/slime/slime5.png",
        "game_data/textures/entity/slime/slime6.png"
      ],
      "left": [
        "game_data/textures/entity/slime/slime1.png",
        "game_data/textures/entity/slime/slime2.png",
        "game_data/textures/entity/slime/slime3.png",
        "game_data/textures/entity/slime/slime4.png",
        "game_data/textures/entity/slime/slime5.png",
        "game_data/textures/entity/slime/slime6.png"
      ],
      "up_left": [
        "game_data/textures/entity/slime/slime1.png",
        "game_data/textures/entity/slime/slime2.png",
        "game_data/textures/entity/slime/slime3.png",
        "game_data/textures/entity/slime/slime4.png",
        "game_data/textures/entity/slime/slime5.png",
        "game_data/textures/entity/slime/slime6.png"
      ],
      "down_left": [
        "game_data/textures/entity/slime/slime1.png",
        "game_data/textures/entity/slime/slime2.png",
        "game_data/textures/entity/slime/slime3.png",
        "game_data/textures/entity/slime/slime4.png",
        "game_data/textures/entity/slime/slime5.png",
        "game_data/textures/entity/slime/slime6.png"
      ],
      "up_right": [
        "game_data/textures/entity/slime/slime1.png",
        "game_data/textures/entity/slime/slime2.png",
        "game_data/textures/entity/slime/slime3.png",
        "game_data/textures/entity/slime/slime4.png",
        "game_data/textures/entity/slime/slime5.png",
        "game_data/textures/entity/slime/slime6.png"
      ],
      "down_right": [
        "game_data/textures/entity/slime/slime1.png",
        "game_data/textures/entity/slime/slime2.png",
        "game_data/textures/entity/slime/slime3.png",
        "game_data/textures/entity/slime/slime4.png",
        "game_data/textures/entity/slime/slime5.png",
        "game_data/textures/entity/slime/slime6.png"
      ]
    }
  }
]

//Entity performance tester
for(let i = 0; i<1; i++){
  init_game_entity_properties[1]["init"].push(
    {
      "x_pos": 10,
      "y_pos": 10,
      "animation": "left",
      "animation_cycle": 1000,
      "nature": new Nature(
        function(world,entity, entityCollider,direction){
          if(entity.isCharacter){window.location.reload(false);}
        },
        undefined,
        undefined,
        movementLibrary.bounceOnCollide),
      "type":"slime"
    }
  );
}

//Call to initialize and paint the world with all objects based on file paths
var world_example_1 = new World();
var map_object = MapFactory(init_game_map_properties, world_example_1);
var character_object = CharacterFactory(init_game_character_properties, world_example_1);
var html_entity_tuple = MultipleHTMLEntityFactory(init_game_html_entity_properties, world_example_1);
var entity_tuple = MultipleEntityFactory(init_game_entity_properties, world_example_1, html_entity_tuple);
world_example_1.init(map_object, character_object, entity_tuple);
