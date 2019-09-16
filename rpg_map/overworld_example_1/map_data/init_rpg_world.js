//These are the main properties that need to be defined in order to load the map.
//You can change map by either changing these variables, or by changing the url using javascript.
//The csv describing the current map and the location of all elements
var rpg_map_data_path = "./map_data/rpg_map_data.csv";
//Call to initialize and paint the world with all objects based on file paths
var world_example_1 = new World();

var simple_solid_nature = new Nature(collisionLibrary.solid,undefined,undefined,undefined);
var simple_empty_nature = new Nature(collisionLibrary.empty,undefined,undefined,undefined);

var init_rpg_map_properties = {
  "wall":{
    "texture":"../rpg_data/textures/wall.png",
    "nature":simple_solid_nature
  },
  "door":{
    "texture":"../rpg_data/textures/door.png",
    "nature":new Nature(
      function(world,entity,entityCollider,direction){
        collisionLibrary.alert(world,entity,entityCollider,direction,"Cant go outside yet")
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
      function(world,entity, entityCollider,direction){

        collisionLibrary.alert(world,entity,entityCollider,direction,"Damn, nothing fits")
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


var init_rpg_character_properties = {
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


var init_rpg_entity_properties = [{
    "init": [{
      "x_pos": 9,
      "y_pos": 9,
      "nature": new Nature( collisionLibrary.pushable, undefined, undefined, movementLibrary.still),
      "size":0.75,
      "div_content":"<div style='color:white;font-size:8px;top:20%;left:25%;position:relative;height:80%;width:50%;'>Handle with care</div>"
    }],
    "texture": {
      "up": ["../rpg_data/textures/entity/box.png"],
      "down": ["../rpg_data/textures/entity/box.png"],
      "left": ["../rpg_data/textures/entity/box.png"],
      "right": ["../rpg_data/textures/entity/box.png"],
      "up_left": ["../rpg_data/textures/entity/box.png"],
      "up_right": ["../rpg_data/textures/entity/box.png"],
      "down_left": ["../rpg_data/textures/entity/box.png"],
      "down_right": ["../rpg_data/textures/entity/box.png"],
    }

  },
  {
    "init": [{
        "x_pos": 1,
        "y_pos": 2,
        "nature": new Nature( collisionLibrary.empty, overlapLibrary.removeEntity, undefined, movementLibrary.still),
        "x_hitbox_start":0.3,
        "y_hitbox_start":0.3,
        "x_hitbox_end":0.6,
        "y_hitbox_end":0.6
      }],
      "texture": {
        "up": ["../rpg_data/textures/entity/orb.png"],
        "down": ["../rpg_data/textures/entity/orb.png"],
        "left": ["../rpg_data/textures/entity/orb.png"],
        "right": ["../rpg_data/textures/entity/orb.png"],
        "up_left": ["../rpg_data/textures/entity/orb.png"],
        "up_right": ["../rpg_data/textures/entity/orb.png"],
        "down_left": ["../rpg_data/textures/entity/orb.png"],
        "down_right": ["../rpg_data/textures/entity/orb.png"],
      }

    },
  {
    "init": [{
      "x_pos": 5,
      "y_pos": 5,
      "animation": "down",
      "animation_cycle": 1000,
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
        "../rpg_data/textures/entity/slime/slime1.png",
        "../rpg_data/textures/entity/slime/slime2.png",
        "../rpg_data/textures/entity/slime/slime3.png",
        "../rpg_data/textures/entity/slime/slime4.png",
        "../rpg_data/textures/entity/slime/slime5.png",
        "../rpg_data/textures/entity/slime/slime6.png"
      ],
      "right": [
        "../rpg_data/textures/entity/slime/slime1.png",
        "../rpg_data/textures/entity/slime/slime2.png",
        "../rpg_data/textures/entity/slime/slime3.png",
        "../rpg_data/textures/entity/slime/slime4.png",
        "../rpg_data/textures/entity/slime/slime5.png",
        "../rpg_data/textures/entity/slime/slime6.png"
      ],
      "down": [
        "../rpg_data/textures/entity/slime/slime1.png",
        "../rpg_data/textures/entity/slime/slime2.png",
        "../rpg_data/textures/entity/slime/slime3.png",
        "../rpg_data/textures/entity/slime/slime4.png",
        "../rpg_data/textures/entity/slime/slime5.png",
        "../rpg_data/textures/entity/slime/slime6.png"
      ],
      "left": [
        "../rpg_data/textures/entity/slime/slime1.png",
        "../rpg_data/textures/entity/slime/slime2.png",
        "../rpg_data/textures/entity/slime/slime3.png",
        "../rpg_data/textures/entity/slime/slime4.png",
        "../rpg_data/textures/entity/slime/slime5.png",
        "../rpg_data/textures/entity/slime/slime6.png"
      ],
      "up_left": [
        "../rpg_data/textures/entity/slime/slime1.png",
        "../rpg_data/textures/entity/slime/slime2.png",
        "../rpg_data/textures/entity/slime/slime3.png",
        "../rpg_data/textures/entity/slime/slime4.png",
        "../rpg_data/textures/entity/slime/slime5.png",
        "../rpg_data/textures/entity/slime/slime6.png"
      ],
      "down_left": [
        "../rpg_data/textures/entity/slime/slime1.png",
        "../rpg_data/textures/entity/slime/slime2.png",
        "../rpg_data/textures/entity/slime/slime3.png",
        "../rpg_data/textures/entity/slime/slime4.png",
        "../rpg_data/textures/entity/slime/slime5.png",
        "../rpg_data/textures/entity/slime/slime6.png"
      ],
      "up_right": [
        "../rpg_data/textures/entity/slime/slime1.png",
        "../rpg_data/textures/entity/slime/slime2.png",
        "../rpg_data/textures/entity/slime/slime3.png",
        "../rpg_data/textures/entity/slime/slime4.png",
        "../rpg_data/textures/entity/slime/slime5.png",
        "../rpg_data/textures/entity/slime/slime6.png"
      ],
      "down_right": [
        "../rpg_data/textures/entity/slime/slime1.png",
        "../rpg_data/textures/entity/slime/slime2.png",
        "../rpg_data/textures/entity/slime/slime3.png",
        "../rpg_data/textures/entity/slime/slime4.png",
        "../rpg_data/textures/entity/slime/slime5.png",
        "../rpg_data/textures/entity/slime/slime6.png"
      ]
    }
  }
]


world_example_1.init(rpg_map_data_path, init_rpg_map_properties, init_rpg_character_properties, init_rpg_entity_properties);
