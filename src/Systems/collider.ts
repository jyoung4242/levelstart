import { Entity } from "../../_SqueletoECS/entity";
import { System } from "../../_SqueletoECS/system";
import { ColliderComponent } from "../Components/collider";
import { PositionComponent } from "../Components/positionComp";
import { System as dcSystem, Response } from "detect-collisions";
import { TypeComponent } from "../Components/typeComponent";
import { KeyboardComponent } from "../Components/keyboard";
import { Camera } from "../../_SqueletoECS/Camera";
import { VelocityComponent } from "../Components/velocityComp";
import { Vector } from "../../_SqueletoECS/Vector";

// type definition for ensuring the entity template has the correct components
// ComponentTypes are defined IN the components imported
export type ColliderEntity = Entity & ColliderComponent & PositionComponent & TypeComponent & KeyboardComponent & VelocityComponent;

export class ColliderSystem extends System {
  //@ts-ignore
  cnv: HTMLCanvasElement;
  //@ts-ignore
  ctx: CanvasRenderingContext2D;
  debug = false;

  public template = `
  <style>
    .detectcollisions{
      transform: translate3d(\${adjustedCamera.x}px, \${adjustedCamera.y}px, 0px);
      position: relative;
      z-index: 999999;
      border: 1px solid red;
    }
  </style>
  <canvas class="detectcollisions" \${===debug}  \${==>cnv}></canvas>
  `;
  collider;
  cam;
  get adjustedCamera() {
    return { x: this.cam.position.x, y: this.cam.position.y };
  }
  public constructor(collider: dcSystem, cam: Camera) {
    super("collider ");
    this.collider = collider;
    this.cam = cam;
    setTimeout(() => {
      console.log(this.cam);

      this.cnv.width = this.cam.size.x;
      this.cnv.height = this.cam.size.y;
      //@ts-ignore
      this.ctx = this.cnv.getContext("2d");
    }, 25);
  }

  public processEntity(entity: ColliderEntity): boolean {
    // return the test to determine if the entity has the correct properties

    return entity.collider != null && entity.position != null && entity.type != null && entity.keyboard && entity.velocity != null;
  }

  // update routine that is called by the gameloop engine
  public update(deltaTime: number, now: number, entities: ColliderEntity[]): void {
    if (this.cnv && this.ctx && this.debug) {
      this.ctx.strokeStyle = "#FFFFFF";
      this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);
      this.ctx.beginPath();
      this.collider.draw(this.ctx);
      this.ctx.stroke();
    }

    entities.forEach(entity => {
      // This is the screening for skipping entities that aren't impacted by this system
      // if you want to impact ALL entities, you can remove this
      if (!this.processEntity(entity)) {
        return;
      }

      this.collider.checkOne(entity.collider, (response: Response) => {
        const entityarray = entities.filter(ent => ent.collider == response.b);
        let typeB = response.b.cat;

        console.log(typeB);

        switch (response.a.cat) {
          case "player":
            switch (typeB) {
              case "player":
                {
                  console.log("hit other player");
                  const { overlapV } = response;
                  //get player entity
                  const plrArray = entities.filter(ent => {
                    return ent.collider == response.b;
                  });
                  const otherPlayer = plrArray[0];
                  otherPlayer.position = new Vector(otherPlayer.position.x + overlapV.x, otherPlayer.position.y + overlapV.y);
                  otherPlayer.collider.setPosition(otherPlayer.position.x, otherPlayer.position.y);
                }
                break;
              case "wall":
                {
                  console.log("hit wall");
                  const { overlapV } = response;
                  entity.position = new Vector(entity.position.x - overlapV.x, entity.position.y - overlapV.y);
                  entity.collider.setPosition(entity.position.x, entity.position.y);
                }
                break;

              case "token":
                {
                  console.log("hit token");
                  this.collider.remove(response.b);
                  //get player entity
                  const entIndex = entities.findIndex(ent => {
                    return ent.collider == response.b;
                  });

                  console.log(entIndex);

                  if (entIndex >= 0) entities.splice(entIndex, 1);
                }
                break;
              case "boost":
                {
                  console.log("hit power up");
                  this.collider.remove(response.b);
                  //get player entity
                  const entIndex = entities.findIndex(ent => {
                    return ent.collider == response.b;
                  });
                  if (entIndex >= 0) entities.splice(entIndex, 1);
                }
                break;
              case "generator":
                console.log("hit generator");
                const { overlapV } = response;
                entity.position = new Vector(entity.position.x - overlapV.x, entity.position.y - overlapV.y);
                entity.collider.setPosition(entity.position.x, entity.position.y);
                break;
            }

            break;
          case "enemy":
            break;
          case "weapon":
            break;
        }
      });
    });
  }
}
