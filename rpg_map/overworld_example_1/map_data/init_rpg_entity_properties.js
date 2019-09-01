var init_rpg_entity_properties = [{
    "init": [{
      "x_pos": 9,
      "y_pos": 9,
      "nature": new Nature( collisionLibrary.pushable, undefined, undefined, movementLibrary.still)
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
