import {
  RectParams,
  Shape,
} from "./common-types/canvas-util-class-common-types";
import { EntintyManager } from "./EntityManager";

export class Painter {
  private ctx;
  private manager;
  private canvas;

  constructor(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    manager: EntintyManager
  ) {
    this.ctx = ctx;
    this.manager = manager;
    this.canvas = canvas;
  }

  startObserving() {
    let clicked = false;
    let x = 0,
      y = 0,
      w = 0,
      h = 0;

    const mouseDownEvent = (e: MouseEvent) => {
      clicked = true;
      x = e.clientX;
      y = e.clientY;
    };
    const mouseUpEvent = () => {
      clicked = false;
      this.manager.addEntity({
        type: "rect",
        params: { x, y, w, h },
      });
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.paintAll();

      // reset the x,y,h,w valuse
      x = 0;
      y = 0;
      h = 0;
      w = 0;
    };
    const mouseMoveEvent = (e: MouseEvent) => {
      if (!clicked) return;
      w = e.clientX - x;
      h = e.clientY - y;

      //change the draw logic for diffrent shapes
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.paintAll();
      this.ctx.fillStyle = "black";
      this.ctx.strokeStyle = "white";
      this.ctx.strokeRect(x, y, w, h);
    };

    const handleResize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.paintAll();
    };

    window.addEventListener("resize", handleResize);
    this.canvas.addEventListener("mousedown", mouseDownEvent);
    this.canvas.addEventListener("mouseup", mouseUpEvent);
    this.canvas.addEventListener("mouseleave", mouseUpEvent);
    this.canvas.addEventListener("mousemove", mouseMoveEvent);
  }

  private draw(shape: Shape) {
    if (shape.type === "rect") {
      this.ctx.strokeStyle = "white"; // change it later for diffrent color.
      const { x, y, w, h } = shape.params as RectParams;
      this.ctx.strokeRect(x, y, w, h);
    }
  }

  private paintAll() {
    const shapes = this.manager.getEntentys();
    shapes.forEach((shape) => this.draw(shape));
  }
}
