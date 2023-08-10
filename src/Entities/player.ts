import { v4 as uuidv4 } from "uuid";
import { Entity } from "../../_SqueletoECS/entity";
import { System as dcSystem } from "detect-collisions";

import steps from "../Assets/testwalk-Sheet.png";
import topsprite from "../Assets/uppersprite.png";
import flash from "../Assets/muzzleflashbig-Sheet.png";
import { Vector } from "../../_SqueletoECS/Vector";

const walkAnimationSequence = {
  frameRate: 8,
  default: "idle",
  sequences: {
    idle: [[0, 0]],
    walk: [
      [0, 32],
      [32, 32],
      [64, 32],
      [96, 32],
      [128, 32],
      [160, 32],
      [192, 32],
      [224, 32],
    ],
  },
};

const muzzleflash = {
  frameRate: 4,
  default: "idle",
  sequences: {
    idle: [[0, 0]],
    firing: [
      [64, 0],
      [128, 0],
      [190, 0],
      [256, 0],
    ],
  },
};

export class PlayerEntity {
  static create(startingPosition: Vector, name: string, localControl: boolean, playercolor: string, collision: dcSystem) {
    return Entity.create({
      id: uuidv4(),
      components: {
        type: { data: "player" },
        orientation: 0,
        color: {
          data: {
            color: playercolor,
            width: 16,
            height: 16,
          },
        },
        collider: {
          data: {
            system: collision,
            shape: "Box",
            size: new Vector(12, 12),
            position: new Vector(startingPosition.x, startingPosition.y),
            options: {
              triggered: false,
              static: false,
              centered: true,
            },
            type: "player",
          },
        },
        keyboard: { data: localControl },
        name: name,
        position: startingPosition,
        velocity: new Vector(0, 0),
        zindex: 2,
        size: { data: [16, 16] },
        sprites: [
          {
            src: steps,
            size: [16, 16],
            angle: 0,
            offset: [-8, -8], //centers on entity
            animation: walkAnimationSequence,
            anchor: new Vector(8, 16),
            fit: "cover",
          },
          {
            src: topsprite,
            size: [16, 16],
            angle: 0,
            offset: [-8, -8], //centers on entity
            anchor: new Vector(8, 16),
            fit: "cover",
          },
          {
            src: flash,
            size: [32, 32],
            angle: 0,
            offset: [-16, -16], //centers on entity
            animation: muzzleflash,
            anchor: new Vector(24, 32),
            fit: "cover",
          },
        ],
      },
    });
  }
}
