import { v4 as uuidv4 } from "uuid";
import { Entity } from "../../_SqueletoECS/entity";
import d from "../Assets/dronetoken-Sheet.png";
import a from "../Assets/artilleryToken-Sheet.png";
import g from "../Assets/grenadetoken-Sheet.png";
import r from "../Assets/rpgtoken-Sheet.png";
import shadow from "../Assets/tokenshadow.png";
import { Vector } from "../../_SqueletoECS/Vector";
import { System as dcSystem } from "detect-collisions";

const bounce = {
  frameRate: 8,
  default: "default",
  sequences: {
    default: [
      [0, 0],
      [18, 0],
      [36, -32],
      [54, -32],
      [72, 0],
      [54, 0],
      [36, -32],
      [18, -32],
    ],
  },
};

const bouncingShadow = {
  frameRate: 8,
  default: "shrink",
  sequences: {
    shrink: [
      [0, 0],
      [18, 0],
      [36, 0],
      [54, 0],
      [72, 0],
      [54, 0],
      [36, 0],
      [18, 0],
    ],
  },
};

export class tokenEntity {
  static create(startingPosition: Vector, type: "a" | "d" | "g" | "r", collider: dcSystem) {
    let sprite;
    switch (type) {
      case "a":
        sprite = a;
        break;
      case "d":
        sprite = d;
        break;
      case "g":
        sprite = g;
        break;
      case "r":
        sprite = r;
        break;
    }
    return Entity.create({
      id: uuidv4(),
      components: {
        collider: {
          data: {
            system: collider,
            shape: "Box",
            size: new Vector(16, 24),
            position: new Vector(startingPosition.x, startingPosition.y),
            options: {
              triggered: false,
              static: true,
              centered: true,
            },
            type: "token",
          },
        },
        type: { data: "token" },
        orientation: 0,
        position: startingPosition,
        zindex: 2,
        size: { data: [18, 32] },
        sprites: [
          {
            src: shadow,
            size: [18, 32],
            angle: 0,
            offset: [-9, -16], //centers on entity
            animation: bouncingShadow,
            anchor: new Vector(0, 0),
            fit: "cover",
          },
          {
            src: sprite,
            size: [18, 32],
            angle: 0,
            animation: bounce,
            offset: [-9, -16], //centers on entity
            anchor: new Vector(0, 0),
            fit: "auto",
          },
        ],
      },
    });
  }
}
