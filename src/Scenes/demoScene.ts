// Library
import { Scene } from "../../_SqueletoECS/Scene";
import { Vector } from "../../_SqueletoECS/Vector";
import { Engine } from "@peasy-lib/peasy-engine";

import tileset from "../Assets/mytileset.png";
import { Box, Circle, System as dcSystem } from "detect-collisions";
// Scene Systems
/* *README*
  You will import all your  ECS Systems here for this scene here
  for example
  import { MovementSystem } from "../Systems/Movement";
  The camera is required, so we already included it for you
  ... you're welcome ;)
*/
import { Camera, ICameraConfig } from "../../_SqueletoECS/Camera"; //this is in Squeleto library
import { KeypressSystem } from "../Systems/keypress";
import { animateSpriteSystem } from "../Systems/animateSprite";
import { movementSystem } from "../Systems/movement";

// Entities
import { MapEntity } from "../Entities/map";
import { PlayerEntity } from "../Entities/player";
import { LevelMaker } from "../levelmaker";
import { GeneratorEntity } from "../Entities/monsterGenerator";
import { tokenEntity } from "../Entities/token";
import { BoostEntity } from "../Entities/powerup";
import { ColliderSystem } from "../Systems/collider";

export type myCollider = (Box & { cat?: string }) | (Circle & { cat?: string });

/* *README*
  You will import all your  ECS entities for this scene here
  for example
  import { MapEntity } from "../Entities/mapEntity";
  import { DemoEntity } from "../Entities/demo";
*/
export class Test extends Scene {
  name: string = "test";
  entities: any = [];
  entitySystems: any = [];
  sceneSystems: any = [];
  public template = `
    <scene-layer>
        < \${ sceneSystem === } \${ sceneSystem <=* sceneSystems }
    </scene-layer>
  `;
  public init = async (): Promise<void> => {
    //setup collision system
    const dc = new dcSystem();

    // add default entities to the array
    let startArray;
    let mapImage;
    let x, y;
    let downflag = false;
    let longflag = false;
    let lm;
    let arrayOfRandomObjects;
    do {
      lm = new LevelMaker(64, 64, 16);
      lm.generateNewMap();
      await lm.loadTileset(tileset);
      await lm.loadTileDefinition(setMapping());
      await lm.loadBitmasks(setBitmappings());
      lm.setZeroTiles(["dirt1", "dirt2", "dirt3", "dirt4", "dirt5"]);
      lm.fillMap("dirt1");
      lm.loadRandomObjectTiles(setRandomTiles());
      lm.setBaseTiles();
      arrayOfRandomObjects = lm.drawRandomTiles(0);
      mapImage = await lm.getMapImage();
      x = lm.getMapImageSize().x;
      y = lm.getMapImageSize().y;

      startArray = findPattern(lm.maze, [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ]);

      if (startArray == null) {
        startArray = findPattern(lm.maze, [
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ]);
        if (startArray != null) longflag = true;
      } else downflag = true;
    } while (startArray == null);

    //find starting point

    let startingPoint: Vector;
    let startingPoint2: Vector;
    let startingPoint3: Vector;
    let startingPoint4: Vector;

    let playerArray = [];
    if (startArray && startArray.length == 2) {
      if (downflag) {
        startingPoint = new Vector((startArray[0] + 1) * lm.tilesize, (startArray[1] + 1) * lm.tilesize);
        playerArray.push([startArray[0] + 1, startArray[1] + 1]);
        startingPoint2 = new Vector((startArray[0] + 2) * lm.tilesize, (startArray[1] + 1) * lm.tilesize);
        playerArray.push([startArray[0] + 2, startArray[1] + 1]);
        startingPoint3 = new Vector((startArray[0] + 1) * lm.tilesize, (startArray[1] + 2) * lm.tilesize);
        playerArray.push([startArray[0] + 1, startArray[1] + 2]);
        startingPoint4 = new Vector((startArray[0] + 2) * lm.tilesize, (startArray[1] + 2) * lm.tilesize);
        playerArray.push([startArray[0] + 2, startArray[1] + 2]);
      } else if (longflag) {
        startingPoint = new Vector((startArray[0] + 1) * lm.tilesize, (startArray[1] + 1) * lm.tilesize);
        playerArray.push([startArray[0] + 1, startArray[1] + 1]);
        startingPoint2 = new Vector((startArray[0] + 2) * lm.tilesize, (startArray[1] + 1) * lm.tilesize);
        playerArray.push([startArray[0] + 2, startArray[1] + 1]);
        startingPoint3 = new Vector((startArray[0] + 3) * lm.tilesize, (startArray[1] + 1) * lm.tilesize);
        playerArray.push([startArray[0] + 3, startArray[1] + 1]);
        startingPoint4 = new Vector((startArray[0] + 4) * lm.tilesize, (startArray[1] + 1) * lm.tilesize);
        playerArray.push([startArray[0] + 4, startArray[1] + 1]);
      }
    }

    //add map tiles to collision system
    const colliderTiles = findEdgeCoordinates(lm.maze);
    console.log("edge tiles: ", colliderTiles);

    addTilesToCollisionSystem(colliderTiles, dc, lm);

    //Find random spots for power ups
    //2 monster generators
    //4 tokens
    //4 health jewels

    let exclusionArrayOfCoors = [...playerArray, ...arrayOfRandomObjects];
    const randomCoords = selectRandomCoordinates(lm.maze, 2, 10, exclusionArrayOfCoors);
    /* console.log("player coords", playerArray);
    console.log("exclusion coords", exclusionArrayOfCoors);
    console.log("random coords", randomCoords); */

    this.entities.push(await MapEntity.create(mapImage, x, y));

    //@ts-ignore
    this.entities.push(PlayerEntity.create(startingPoint, "Mookie", true, "red", dc));

    //@ts-ignore
    this.entities.push(PlayerEntity.create(startingPoint2, "Curly", false, "purple", dc));
    //@ts-ignore
    this.entities.push(PlayerEntity.create(startingPoint3, "Larry", false, "orange", dc));
    //@ts-ignore
    this.entities.push(PlayerEntity.create(startingPoint4, "Moe", false, "lightgreen", dc));

    //monster generators
    this.entities.push(GeneratorEntity.create(new Vector(randomCoords[0][0] * lm.tilesize, randomCoords[0][1] * lm.tilesize), dc));
    this.entities.push(GeneratorEntity.create(new Vector(randomCoords[1][0] * lm.tilesize, randomCoords[1][1] * lm.tilesize), dc));

    //tokens
    this.entities.push(tokenEntity.create(new Vector(randomCoords[2][0] * lm.tilesize, randomCoords[2][1] * lm.tilesize), "a", dc));
    this.entities.push(tokenEntity.create(new Vector(randomCoords[3][0] * lm.tilesize, randomCoords[3][1] * lm.tilesize), "d", dc));
    this.entities.push(tokenEntity.create(new Vector(randomCoords[4][0] * lm.tilesize, randomCoords[4][1] * lm.tilesize), "g", dc));
    this.entities.push(tokenEntity.create(new Vector(randomCoords[5][0] * lm.tilesize, randomCoords[5][1] * lm.tilesize), "r", dc));

    //health boosts
    this.entities.push(BoostEntity.create(new Vector(randomCoords[6][0] * lm.tilesize, randomCoords[6][1] * lm.tilesize), dc));
    this.entities.push(BoostEntity.create(new Vector(randomCoords[7][0] * lm.tilesize, randomCoords[7][1] * lm.tilesize), dc));
    this.entities.push(BoostEntity.create(new Vector(randomCoords[8][0] * lm.tilesize, randomCoords[8][1] * lm.tilesize), dc));
    this.entities.push(BoostEntity.create(new Vector(randomCoords[9][0] * lm.tilesize, randomCoords[9][1] * lm.tilesize), dc));

    console.log(this.entities);

    //establish Scene Systems - Configuring Camera
    let cConfig: ICameraConfig = {
      name: "camera",
      viewPortSystems: [],
      gameEntities: this.entities,
      position: new Vector(0, 0),
      size: new Vector(x, y),
    };
    let camera = Camera.create(cConfig);
    camera.follow(this.entities[1]);
    camera.vpSystems.push(new animateSpriteSystem(), new KeypressSystem(), new movementSystem(), new ColliderSystem(dc, camera));

    console.log(camera.vpSystems);

    //Systems being added for Scene to own
    this.sceneSystems.push(camera);
    console.log("system data", dc.data);

    //Start GameLoop
    Engine.create({ fps: 60, started: true, callback: this.update });
  };

  //GameLoop update method
  update = (deltaTime: number): void | Promise<void> => {
    this.sceneSystems.forEach((system: any) => {
      system.update(deltaTime / 1000, 0, this.entities);
    });
  };
}

function setMapping() {
  return [
    { name: "grass", tiles: [{ tilelocX: 96, tilelocY: 32 }] },
    { name: "bush", tiles: [{ tilelocX: 16, tilelocY: 16 }] },
    { name: "bush2", tiles: [{ tilelocX: 96, tilelocY: 16 }] },
    { name: "bush3", tiles: [{ tilelocX: 112, tilelocY: 16 }] },
    { name: "bush4", tiles: [{ tilelocX: 128, tilelocY: 16 }] },
    { name: "bush5", tiles: [{ tilelocX: 144, tilelocY: 16 }] },
    { name: "bush6", tiles: [{ tilelocX: 160, tilelocY: 16 }] },
    { name: "bushA_TL", tiles: [{ tilelocX: 0, tilelocY: 0 }] },
    { name: "bushA_TM", tiles: [{ tilelocX: 16, tilelocY: 0 }] },
    { name: "bushA_TR", tiles: [{ tilelocX: 32, tilelocY: 0 }] },
    { name: "bushA_ML", tiles: [{ tilelocX: 0, tilelocY: 16 }] },
    { name: "bushA_MR", tiles: [{ tilelocX: 32, tilelocY: 16 }] },
    { name: "bushA_BL", tiles: [{ tilelocX: 0, tilelocY: 32 }] },
    { name: "bushA_BM", tiles: [{ tilelocX: 16, tilelocY: 32 }] },
    { name: "bushA_BR", tiles: [{ tilelocX: 32, tilelocY: 32 }] },
    { name: "bushB_TL", tiles: [{ tilelocX: 48, tilelocY: 0 }] },
    { name: "bushB_TM", tiles: [{ tilelocX: 64, tilelocY: 0 }] },
    { name: "bushB_TR", tiles: [{ tilelocX: 80, tilelocY: 0 }] },
    { name: "bushB_ML", tiles: [{ tilelocX: 48, tilelocY: 16 }] },
    { name: "bushB_MM", tiles: [{ tilelocX: 64, tilelocY: 16 }] },
    { name: "bushB_MR", tiles: [{ tilelocX: 80, tilelocY: 16 }] },
    { name: "bushB_BL", tiles: [{ tilelocX: 48, tilelocY: 32 }] },
    { name: "bushB_BM", tiles: [{ tilelocX: 64, tilelocY: 32 }] },
    { name: "bushB_BR", tiles: [{ tilelocX: 80, tilelocY: 32 }] },
    { name: "bushC_L", tiles: [{ tilelocX: 112, tilelocY: 32 }] },
    { name: "bushC_R", tiles: [{ tilelocX: 128, tilelocY: 32 }] },
    { name: "bushC_T", tiles: [{ tilelocX: 144, tilelocY: 32 }] },
    { name: "bushC_B", tiles: [{ tilelocX: 144, tilelocY: 48 }] },
    { name: "bush_TR", tiles: [{ tilelocX: 128, tilelocY: 64 }] },
    { name: "bush_TD", tiles: [{ tilelocX: 144, tilelocY: 64 }] },
    { name: "bush_TL", tiles: [{ tilelocX: 160, tilelocY: 64 }] },
    { name: "bush_TU", tiles: [{ tilelocX: 144, tilelocY: 80 }] },
    { name: "bush_FTR", tiles: [{ tilelocX: 176, tilelocY: 64 }] },
    { name: "bush_FTD", tiles: [{ tilelocX: 192, tilelocY: 64 }] },
    { name: "bush_FTU", tiles: [{ tilelocX: 192, tilelocY: 80 }] },
    { name: "bush_FTL", tiles: [{ tilelocX: 208, tilelocY: 64 }] },
    { name: "bushD_TL", tiles: [{ tilelocX: 176, tilelocY: 0 }] },
    { name: "bushD_TM", tiles: [{ tilelocX: 192, tilelocY: 0 }] },
    { name: "bushD_TR", tiles: [{ tilelocX: 208, tilelocY: 0 }] },
    { name: "bushD_ML", tiles: [{ tilelocX: 176, tilelocY: 16 }] },
    { name: "bushD_MR", tiles: [{ tilelocX: 208, tilelocY: 16 }] },
    { name: "bushD_BL", tiles: [{ tilelocX: 176, tilelocY: 32 }] },
    { name: "bushD_BM", tiles: [{ tilelocX: 192, tilelocY: 32 }] },
    { name: "bushD_BR", tiles: [{ tilelocX: 208, tilelocY: 32 }] },
    { name: "dirt1", tiles: [{ tilelocX: 96, tilelocY: 0 }] },
    { name: "dirt2", tiles: [{ tilelocX: 112, tilelocY: 0 }] },
    { name: "dirt3", tiles: [{ tilelocX: 128, tilelocY: 0 }] },
    { name: "dirt4", tiles: [{ tilelocX: 144, tilelocY: 0 }] },
    { name: "dirt5", tiles: [{ tilelocX: 160, tilelocY: 0 }] },
    { name: "specialA", tiles: [{ tilelocX: 240, tilelocY: 0 }] },
    { name: "specialB", tiles: [{ tilelocX: 240, tilelocY: 16 }] },
    { name: "specialC", tiles: [{ tilelocX: 240, tilelocY: 32 }] },
    { name: "specialD", tiles: [{ tilelocX: 240, tilelocY: 48 }] },
    { name: "specialE", tiles: [{ tilelocX: 240, tilelocY: 64 }] },
    { name: "specialF", tiles: [{ tilelocX: 240, tilelocY: 80 }] },
    { name: "specialG", tiles: [{ tilelocX: 224, tilelocY: 80 }] },
    { name: "specialH", tiles: [{ tilelocX: 224, tilelocY: 64 }] },
    { name: "specialI", tiles: [{ tilelocX: 224, tilelocY: 48 }] },
    { name: "specialJ", tiles: [{ tilelocX: 224, tilelocY: 32 }] },
    { name: "specialK", tiles: [{ tilelocX: 224, tilelocY: 16 }] },
    { name: "specialL", tiles: [{ tilelocX: 224, tilelocY: 0 }] },
    { name: "specialM", tiles: [{ tilelocX: 208, tilelocY: 48 }] },
    {
      name: "shrub",
      tiles: [
        { tilelocX: 96, tilelocY: 0 },
        { tilelocX: 96, tilelocY: 80 },
      ],
    },
    {
      name: "rock1",
      tiles: [
        { tilelocX: 96, tilelocY: 0 },
        { tilelocX: 0, tilelocY: 80 },
      ],
    },
    {
      name: "rock2",
      tiles: [
        { tilelocX: 96, tilelocY: 0 },
        { tilelocX: 16, tilelocY: 80 },
      ],
    },
    {
      name: "rock3",
      tiles: [
        { tilelocX: 96, tilelocY: 0 },
        { tilelocX: 32, tilelocY: 80 },
      ],
    },
    {
      name: "rock4",
      tiles: [
        { tilelocX: 96, tilelocY: 0 },
        { tilelocX: 48, tilelocY: 80 },
      ],
    },
    {
      name: "rock5",
      tiles: [
        { tilelocX: 96, tilelocY: 0 },
        { tilelocX: 64, tilelocY: 80 },
      ],
    },
    {
      name: "rock6",
      tiles: [
        { tilelocX: 96, tilelocY: 0 },
        { tilelocX: 80, tilelocY: 80 },
      ],
    },
    {
      name: "flower1",
      tiles: [
        { tilelocX: 96, tilelocY: 0 },
        { tilelocX: 0, tilelocY: 48 },
      ],
    },
    {
      name: "flower2",
      tiles: [
        { tilelocX: 96, tilelocY: 0 },
        { tilelocX: 16, tilelocY: 48 },
      ],
    },
    {
      name: "flower3",
      tiles: [
        { tilelocX: 96, tilelocY: 0 },
        { tilelocX: 32, tilelocY: 48 },
      ],
    },
    {
      name: "flower4",
      tiles: [
        { tilelocX: 96, tilelocY: 0 },
        { tilelocX: 48, tilelocY: 48 },
      ],
    },
    {
      name: "flower5",
      tiles: [
        { tilelocX: 96, tilelocY: 0 },
        { tilelocX: 64, tilelocY: 48 },
      ],
    },
    {
      name: "flower6",
      tiles: [
        { tilelocX: 96, tilelocY: 0 },
        { tilelocX: 80, tilelocY: 48 },
      ],
    },
    {
      name: "flower7",
      tiles: [
        { tilelocX: 96, tilelocY: 0 },
        { tilelocX: 96, tilelocY: 48 },
      ],
    },
    {
      name: "flower8",
      tiles: [
        { tilelocX: 96, tilelocY: 0 },
        { tilelocX: 0, tilelocY: 64 },
      ],
    },
    {
      name: "flower9",
      tiles: [
        { tilelocX: 96, tilelocY: 0 },
        { tilelocX: 16, tilelocY: 64 },
      ],
    },
    {
      name: "flower10",
      tiles: [
        { tilelocX: 96, tilelocY: 0 },
        { tilelocX: 32, tilelocY: 64 },
      ],
    },
    {
      name: "flower11",
      tiles: [
        { tilelocX: 96, tilelocY: 0 },
        { tilelocX: 48, tilelocY: 64 },
      ],
    },
    {
      name: "flower12",
      tiles: [
        { tilelocX: 96, tilelocY: 0 },
        { tilelocX: 64, tilelocY: 64 },
      ],
    },
    {
      name: "flower13",
      tiles: [
        { tilelocX: 96, tilelocY: 0 },
        { tilelocX: 80, tilelocY: 64 },
      ],
    },
    {
      name: "flower14",
      tiles: [
        { tilelocX: 96, tilelocY: 0 },
        { tilelocX: 96, tilelocY: 64 },
      ],
    },
  ];
}

function setBitmappings() {
  return [
    [0x0, "shrub"],
    [0xd0, "bushA_TL"],
    [0xf8, "bushA_TM"],
    [0x78, "bushA_TM"],
    [0xd8, "bushA_TM"],
    [0x68, "bushA_TR"],
    [0xd6, "bushA_ML"],
    [0x6b, "bushA_MR"],
    [0x16, "bushA_BL"],
    [0x0b, "bushA_BR"],
    [0x50, "bushB_TL"],
    [0x18, "bushB_TM"],
    [0x48, "bushB_TR"],
    [0x42, "bushB_ML"],
    [0x12, "bushB_BL"],
    [0xa, "bushB_BR"],
    [0x40, "bushC_T"],
    [0x10, "bushC_L"],
    [0x2, "bushC_B"],
    [0x8, "bushC_R"],
    [0x52, "bush_TR"],
    [0x4a, "bush_TL"],
    [0x1a, "bush_TU"],
    [0x58, "bush_TD"],
    [0x7b, "bush_FTR"],
    [0xde, "bush_FTL"],
    [0xfa, "bush_FTU"],
    [0x5f, "bush_FTD"],
    [0xd4, "bushD_TL"],
    [0x7f, "bushD_TL"],
    [0x9f, "bushD_TM"],
    [0x3f, "bushD_TM"],
    [0x1f, "bushD_TM"],
    [0xdf, "bushD_TR"],
    [0xfb, "bushD_BL"],
    [0xfe, "bushD_BR"],
    [0x1e, "specialA"],
    [0x4b, "specialB"],
    [0x56, "specialC"],
    [0x6a, "specialD"],
    [0xdb, "specialE"],
    [0x1b, "specialF"],
    [0xd2, "specialG"],
    [0x7e, "specialH"],
    [0xda, "specialI"],
    [0x5a, "specialJ"],
    [0x5b, "specialK"],
    [0x7a, "specialL"],
    [0x5e, "specialM"],
    [0xff, "bush2"],
  ];
}

function setRandomTiles() {
  return [
    "shrub",
    "rock1",
    "rock2",
    "rock3",
    "rock4",
    "rock5",
    "rock6",
    "flower1",
    "flower2",
    "flower3",
    "flower4",
    "flower5",
    "flower6",
    "flower7",
    "flower8",
    "flower9",
    "flower10",
    "flower11",
    "flower12",
    "flower13",
    "flower14",
  ];
}

function findPattern(matrix: number[][], pattern: number[][]): [number, number] | null {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const patternRows = pattern.length;
  const patternCols = pattern[0].length;

  function isPatternMatch(row: number, col: number): boolean {
    for (let r = 0; r < patternRows; r++) {
      for (let c = 0; c < patternCols; c++) {
        if (matrix[row + r][col + c] !== pattern[r][c]) {
          return false;
        }
      }
    }
    return true;
  }

  for (let row = 0; row <= rows - patternRows; row++) {
    for (let col = 0; col <= cols - patternCols; col++) {
      if (isPatternMatch(row, col)) {
        return [row, col];
      }
    }
  }

  return null;
}
// Function to select multiple coordinates with value 0 from a 2D array
function selectRandomCoordinates(
  array: number[][],
  homogeneityFactor: number,
  quantity: number,
  excludeCoordinates: [number, number][]
): [number, number][] {
  const flatCoordinates: [number, number][] = [];

  for (let row = 0; row < array.length; row++) {
    for (let col = 0; col < array[row].length; col++) {
      if (array[row][col] === 0) {
        flatCoordinates.push([row, col]);
      }
    }
  }

  const filteredCoordinates = flatCoordinates.filter(coord => {
    return !excludeCoordinates.some(excludeCoord => coord[0] === excludeCoord[0] && coord[1] === excludeCoord[1]);
  });

  const selectedCoordinates: [number, number][] = [];

  for (let i = 0; i < quantity; i++) {
    if (filteredCoordinates.length === 0) {
      break; // No more available coordinates with value 0
    }

    const shuffledCoordinates = shuffleArray(filteredCoordinates);
    const selectedIndex = Math.floor(Math.pow(Math.random(), homogeneityFactor) * shuffledCoordinates.length);
    selectedCoordinates.push(shuffledCoordinates[selectedIndex]);
    filteredCoordinates.splice(filteredCoordinates.indexOf(shuffledCoordinates[selectedIndex]), 1);
  }

  return selectedCoordinates;
}

// Function to shuffle an array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

type Coordinate = [number, number];

function findEdgeCoordinates(matrix: number[][]): Coordinate[] {
  const rows = matrix.length;
  const cols = matrix[0].length;

  const edgeCoordinates: Coordinate[] = [];

  const isOutOfBounds = (row: number, col: number): boolean => {
    return row < 0 || col < 0 || row >= rows || col >= cols;
  };

  const isEdgeCoordinate = (row: number, col: number): boolean => {
    //console.log("edge check: ", row, col, matrix[row][col]);

    if (matrix[row][col] === 255) {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if ((dx !== 0 || dy !== 0) && !isOutOfBounds(row + dx, col + dy) && matrix[row + dx][col + dy] === 0) {
            return true;
          }
        }
      }
    }
    return false;
  };

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (isEdgeCoordinate(row, col)) {
        edgeCoordinates.push([row, col]);
      }
    }
  }

  return edgeCoordinates;
}

function addTilesToCollisionSystem(tiles: Coordinate[], collider: dcSystem, level: any): void {
  tiles.forEach(tile => {
    let tileCollider: myCollider = new Box({ x: level.tilesize * tile[0] + 8, y: level.tilesize * tile[1] + 8 }, 10, 10, {
      isCentered: true,
      isStatic: true,
    });
    tileCollider.cat = "wall";
    collider.insert(tileCollider);
  });
}
