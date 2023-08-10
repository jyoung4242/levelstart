import { Entity } from "../../_SqueletoECS/entity";
import { System } from "../../_SqueletoECS/system";
import { ColliderComponent } from "../Components/collider";
import { PositionComponent } from "../Components/positionComp";
import { VelocityComponent } from "../Components/velocityComp";

// type definition for ensuring the entity template has the correct components
// ComponentTypes are defined IN the components imported
export type TemplateEntity = Entity & PositionComponent & VelocityComponent & ColliderComponent;

export class movementSystem extends System {
  public template = ``;
  public constructor() {
    super("movement");
  }

  public processEntity(entity: TemplateEntity): boolean {
    // return the test to determine if the entity has the correct properties
    return entity.position != null && entity.velocity != null && entity.collider != null;
  }

  // update routine that is called by the gameloop engine
  public update(deltaTime: number, now: number, entities: TemplateEntity[]): void {
    entities.forEach(entity => {
      // This is the screening for skipping entities that aren't impacted by this system
      // if you want to impact ALL entities, you can remove this
      if (!this.processEntity(entity)) {
        return;
      }

      entity.position = entity.position.add(entity.velocity);
      if (entity.collider) {
        entity.collider.setPosition(entity.position.x, entity.position.y);
      }
      // insert code here on how you want to manipulate the entity properties
    });
  }
}
