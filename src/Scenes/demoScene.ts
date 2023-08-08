// Library
import { Scene } from "../../_SqueletoECS/Scene";
import { Vector } from "../../_SqueletoECS/Vector";
import { Engine } from "@peasy-lib/peasy-engine";

// Scene Systems
/* *README*
  You will import all your  ECS Systems here for this scene here
  for example
  import { MovementSystem } from "../Systems/Movement";
  The camera is required, so we already included it for you
  ... you're welcome ;)
*/
import { Camera, ICameraConfig } from "../../_SqueletoECS/Camera"; //this is in Squeleto library
import { TemplateComp } from "../Components/templateComponent";

import tileset from "../Assets/mytileset.png";

// Entities
import { TemplateEntity } from "../Entities/entityTemplate";
import { MapEntity } from "../Entities/map";
import { PlayerEntity } from "../Entities/player";
import { LevelMaker } from "../levelmaker";
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
    // add default entities to the array
    const lm = new LevelMaker(64, 64, 16);
    lm.generateNewMap();
    await lm.loadTileset(tileset);
    await lm.loadTileDefinition(setMapping());
    await lm.loadBitmasks(setBitmappings());
    lm.setZeroTiles(["dirt1", "dirt2", "dirt3", "dirt4", "dirt5"]);
    lm.fillMap("dirt1");
    lm.loadRandomObjectTiles(setRandomTiles());
    lm.setBaseTiles();
    lm.drawRandomTiles(0);
    const mapImage = await lm.getMapImage();
    let { x, y } = lm.getMapImageSize();

    this.entities.push(await MapEntity.create(mapImage, x, y));

    //find starting point
    let startArray = findElementIn2DArray(lm.maze, 0);
    let startingPoint: Vector;

    if (startArray && startArray.length == 2) {
      startingPoint = new Vector((startArray[0] + 1) * lm.tilesize, (startArray[1] + 1) * lm.tilesize);
      this.entities.push(PlayerEntity.create(startingPoint));
    }

    console.log(this.entities);

    //establish Scene Systems - Configuring Camera
    let cConfig: ICameraConfig = {
      name: "camera",
      viewPortSystems: [],
      gameEntities: this.entities,
      position: new Vector(0, 0),
      size: new Vector(400, 266.67),
    };
    let camera = Camera.create(cConfig);
    console.log(camera);
    console.log();

    camera.follow(this.entities[1]);

    //give the camera its systems to own
    //camera.vpSystems.push(new KeyboardSystem(), new MovementSystem());

    //Systems being added for Scene to own
    this.sceneSystems.push(camera);

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

function findElementIn2DArray<T>(array: T[][], searchValue: T): undefined | Array<number> {
  for (let row = 0; row < array.length; row++) {
    for (let col = 0; col < array[row].length; col++) {
      if (array[row][col] === searchValue) {
        return [row, col];
      }
    }
  }
  return undefined; // Search value not found
}
