import { Component } from "../../_SqueletoECS/component";
import mask from "../Assets/mask.png";

// you can define the incoming types when the component is created
export interface IColorComponent {
  data: ColorType;
}
export type ColorType = {
  width: number;
  height: number;
  color: string;
  x: number;
  y: number;
};

// this is the exported interface that is used in systems modules
export interface ColorComponent {
  color: ColorType;
}

// classes should have:
// if UI element, a template property with the peasy-ui template literal
// if no UI aspect to the system, do not define a template
// a 'value' property that will be attached to the entity
export class ColorComp extends Component {
  // UI template string literal with UI binding of value property
  public template = `
    <style>
    .mask{
        display: block;
        position:absolute;
        width:\${value.width}px;
        height:\${value.height}px; 
        top: \${value.y}px;
        left: \${value.x}px;
        -webkit-mask-image: url(${mask});
        -webkit-mask-size: contain;
        -webkit-mask-repeat: no-repeat;
        -webkit-mask-position: center;
        image-rendering: pixelated;
    }
      
    </style>
    <color-comp class="mask" style="background: \${value.color};"></color-comp>
    `;

  //setting default value
  public value: ColorType = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    color: "transparent",
  };
  public constructor() {
    //@ts-ignore
    super("color", ColorComp, true);
  }

  public define(data: IColorComponent): void {
    if (data == null) {
      return;
    }

    this.value.color = data.data.color;
    this.value.width = data.data.width;
    this.value.height = data.data.height;
    this.value.x = -data.data.width / 2;
    this.value.y = -data.data.height / 2;
  }
}
