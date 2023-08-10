import { v4 as uuidv4 } from "uuid";
import { Entity } from "../../_SqueletoECS/entity";
import bonesl from "../Assets/boneslarge.png";
import bonesm from "../Assets/bonesmedium.png";
import boness from "../Assets/bonessmall.png";
import { Vector } from "../../_SqueletoECS/Vector";
import { System as dcSystem } from "detect-collisions";

export class GeneratorEntity {
  static create(startingPosition: Vector, collider: dcSystem) {
    return Entity.create({
      id: uuidv4(),
      components: {
        type: { data: "generator" },
        collider: {
          data: {
            system: collider,
            shape: "Box",
            size: new Vector(16, 16),
            position: new Vector(startingPosition.x, startingPosition.y),
            options: {
              triggered: false,
              static: true,
              centered: true,
            },
            type: "generator",
          },
        },
        orientation: 0,
        position: startingPosition,
        zindex: 2,
        size: { data: [16, 16] },
        sprites: [
          {
            src: bonesl,
            size: [16, 16],
            angle: 0,
            offset: [-8, -8], //centers on entity
            anchor: new Vector(0, 0),
            fit: "cover",
          },
        ],
      },
    });
  }
}
