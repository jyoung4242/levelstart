import { v4 as uuidv4 } from "uuid";
import { Entity } from "../../_SqueletoECS/entity";
import boost from "../Assets/healthjewel.png";
import { Vector } from "../../_SqueletoECS/Vector";
import { System as dcSystem } from "detect-collisions";

const twinkle = {
  frameRate: 7,
  default: "default",
  sequences: {
    default: [
      [0, 0],
      [16, 0],
      [32, 0],
      [64, 0],
      [80, 0],
      [96, 0],
      [112, 0],
      [128, 0],
      [144, 0],
      [160, 0],
      [176, 0],
    ],
  },
};

export class BoostEntity {
  static create(startingPosition: Vector, collider: dcSystem) {
    return Entity.create({
      id: uuidv4(),
      components: {
        collider: {
          data: {
            system: collider,
            shape: "Circle",
            size: new Vector(8, 8),
            position: new Vector(startingPosition.x, startingPosition.y),
            options: {
              triggered: false,
              static: true,
              centered: true,
            },
            type: "boost",
          },
        },
        type: { data: "boost" },
        orientation: 0,
        position: startingPosition,
        zindex: 2,
        size: { data: [16, 16] },
        sprites: [
          {
            src: boost,
            size: [16, 16],
            angle: 0,
            animation: twinkle,
            offset: [-8, -8], //centers on entity
            anchor: new Vector(0, 0),
            fit: "cover",
          },
        ],
      },
    });
  }
}
