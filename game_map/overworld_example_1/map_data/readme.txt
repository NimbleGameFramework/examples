Here you can find all the data required for the game mapping system.
The textures folder holds the images of each section of the map. Each image must be square(150*150 pixels) in order for the movement system to work. Its also recomended to use PNG formated images for consistency.


The game_map_data.csv file holds the actual layout of the map. Since its a csv file, it can easily be edited with Excel, Google sheets, or OpenOffice SpreadSheets. It doesn't need to be a rectangular layout, however I've found its easier to navigate and design if it is. Each box space is given a element id which tells the map generator what element goes where.


The game_map_element_properties.json file holds the properties of each element in the map. There are several basic characteristics to take into account.
First, the name of each json object will be the element id (The one used in the map layout).
Second, the texture property is the path to the texture image (Preferably a relative path).
Third, the "nature" property allows you to add player and entity interactivity (Collision Detection, Message display, Menu options, etc).
The nature property is further divided into 3 sub-categories:
"collision" nature allows you to add distinct behavior if the collision of the character and the element is detected (A border, or a push mechanic for example).
"overlap" nature allows you to add distinct behavior when the character and the element overlaps (A pressure plate, a hole, etc).
"interact" nature allows you to add distinct behavior when the character interacts with a element in the world (Depends on both the location and the direction of the character).

Other natures types can be added to interact with the character or the entities.
