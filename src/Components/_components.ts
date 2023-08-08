// initialize all your system components here
// simply import then and create a new instance in the array
// for example
// import { Name } from "./nameComp";
// export function LoadComponents(){
//  [new Name(),... and all your other components follow]
// }

import { Name } from "./nameComp";
import { OrientationComp } from "./orientation";
import { Position } from "./positionComp";
import { SizeComp } from "./sizeComp";
import { SpritesComp } from "./sprites";
import { TypeComp } from "./typeComponent";
import { Velocity } from "./velocityComp";
import { ZindexComp } from "./zindexComp";

// The template component is demonstrated by default, you'll probably
// want to replace it

export function LoadComponents() {
  [
    new SpritesComp(),
    new TypeComp(),
    new Position(),
    new ZindexComp(),
    new SizeComp(),
    new Velocity(),
    new OrientationComp(),
    new Name(),
  ];
}
