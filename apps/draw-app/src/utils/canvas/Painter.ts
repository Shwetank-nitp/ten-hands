import {
  LineParams,
  OvelParams,
  RectParams,
  Shape,
} from "./common-types/canvas-util-class-common-types";
import { EntintyManager } from "./EntityManager";

class Rect {
  x;
  y;
  w;
  h;
  constructor() {
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
  }
  getParams() {
    return { x: this.x, y: this.y, w: this.w, h: this.h };
  }

  resetParams() {
    this.x = 0;
    this.y = 0;
    this.h = 0;
    this.w = 0;
  }
}

class Oval {
  x;
  y;
  radiusX;
  radiusY;
  rotation;
  startAngle;
  endAngle;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.radiusX = 0;
    this.radiusY = 0;
    this.rotation = 0;
    this.startAngle = 0;
    this.endAngle = 2 * Math.PI;
  }

  getParams() {
    return {
      x: this.x,
      y: this.y,
      radiusX: this.radiusX,
      radiusY: this.radiusY,
      rotation: this.rotation,
      startAngle: this.startAngle,
      endAngle: this.endAngle,
    };
  }

  resetParams() {
    this.x = 0;
    this.y = 0;
    this.radiusX = 0;
    this.radiusY = 0;
    this.rotation = 0;
    this.startAngle = 0;
    this.endAngle = 2 * Math.PI;
  }
}

class Line {
  collection: {
    stx: number;
    sty: number;
    enx: number;
    eny: number;
  }[];

  constructor() {
    this.collection = [];
  }

  getParams() {
    return this.collection;
  }

  resetParams() {
    this.collection = [];
  }
}

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

  observeRect() {
    let clicked = false;
    const rect = new Rect();

    const mouseDownEvent = (e: MouseEvent) => {
      clicked = true;
      rect.x = e.clientX;
      rect.y = e.clientY;
    };

    const mouseUpEvent = () => {
      clicked = false;
      this.manager.addEntity({ type: "rect", params: rect.getParams() });
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.paintAll();
      rect.resetParams();
    };

    const mouseMoveEvent = (e: MouseEvent) => {
      if (clicked) {
        rect.w = e.clientX - rect.x;
        rect.h = e.clientY - rect.y;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.paintAll();
        this.ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
      }
    };

    this.canvas.addEventListener("mousedown", mouseDownEvent);
    this.canvas.addEventListener("mouseup", mouseUpEvent);
    this.canvas.addEventListener("mouseleave", mouseUpEvent);
    this.canvas.addEventListener("mousemove", mouseMoveEvent);
  }

  observeOval() {
    let clicked = false;
    const oval = new Oval();

    const mouseDownEvent = (e: MouseEvent) => {
      clicked = true;
      oval.x = e.clientX;
      oval.y = e.clientY;
    };

    const mouseUpEvent = () => {
      clicked = false;
      this.manager.addEntity({ type: "oval", params: oval.getParams() });
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.paintAll();
      oval.resetParams();
    };

    const mouseMoveEvent = (e: MouseEvent) => {
      if (clicked) {
        // Calculate radiusX and radiusY based on mouse position
        oval.radiusX = Math.abs(e.clientX - oval.x) / 1.25;
        oval.radiusY = Math.abs(e.clientY - oval.y) / 1.25;

        // Clear the canvas and redraw all shapes
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.paintAll();

        // Draw the current oval being dragged
        this.ctx.beginPath();
        this.ctx.ellipse(
          oval.x,
          oval.y,
          oval.radiusX,
          oval.radiusY,
          oval.rotation,
          oval.startAngle,
          oval.endAngle
        );
        this.ctx.strokeStyle = "white";
        this.ctx.stroke();
        this.ctx.closePath();
      }
    };

    this.canvas.addEventListener("mousedown", mouseDownEvent);
    this.canvas.addEventListener("mouseup", mouseUpEvent);
    this.canvas.addEventListener("mouseleave", mouseUpEvent);
    this.canvas.addEventListener("mousemove", mouseMoveEvent);
  }

  observeLine() {
    let clicked = false;
    const line = new Line();

    const mouseDownEvent = (e: MouseEvent) => {
      clicked = true;
      // Initialize the first segment of the line
      line.collection.push({
        stx: e.clientX,
        sty: e.clientY,
        enx: e.clientX,
        eny: e.clientY,
      });

      // Start the path for freehand drawing
      this.ctx.beginPath();
      this.ctx.moveTo(e.clientX, e.clientY);
    };

    const mouseUpEvent = () => {
      if (clicked) {
        clicked = false;

        // Store the completed line in the manager
        this.manager.addEntity({
          type: "line",
          params: line.getParams(),
        });

        // Clear and repaint everything
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.paintAll();
      }
    };

    const mouseMoveEvent = (e: MouseEvent) => {
      if (clicked) {
        // Get the current mouse position
        const currentSegment = {
          stx: line.collection[line.collection.length - 1].enx,
          sty: line.collection[line.collection.length - 1].eny,
          enx: e.clientX,
          eny: e.clientY,
        };

        // Push the segment to the collection
        line.collection.push(currentSegment);

        // Draw the current segment
        this.ctx.lineTo(currentSegment.enx, currentSegment.eny);
        this.ctx.strokeStyle = "white"; // Set the stroke style for the line
        this.ctx.stroke();
      }
    };

    this.canvas.addEventListener("mousedown", mouseDownEvent);
    this.canvas.addEventListener("mouseup", mouseUpEvent);
    this.canvas.addEventListener("mouseleave", mouseUpEvent);
    this.canvas.addEventListener("mousemove", mouseMoveEvent);
  }

  // remove the resize listment from this class what the hell
  startObserving(type: "rect" | "ovel" | "line") {
    this.paintAll();

    const handleResize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.paintAll();
    };

    if (type === "rect") {
      this.observeRect();
    } else if (type === "ovel") {
      this.observeOval();
    } else if (type === "line") {
      this.observeLine();
    }

    window.addEventListener("resize", handleResize);
  }

  private draw(shape: Shape) {
    if (shape.type === "rect") {
      this.ctx.strokeStyle = "white"; // change it later for diffrent color.
      const { x, y, w, h } = shape.params as RectParams;
      this.ctx.strokeRect(x, y, w, h);
    }

    if (shape.type === "oval") {
      this.ctx.strokeStyle = "white";
      const { x, y, radiusX, radiusY, rotation, startAngle, endAngle } =
        shape.params as OvelParams;
      this.ctx.beginPath();
      this.ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle);
      this.ctx.stroke();
      this.ctx.closePath();
    }

    if (shape.type === "line") {
      const collection = shape.params as LineParams;
      collection.forEach((line) => {
        this.ctx.beginPath();
        this.ctx.strokeStyle = "white";
        this.ctx.moveTo(line.stx, line.sty);
        this.ctx.lineTo(line.enx, line.eny);
        this.ctx.stroke();
        this.ctx.closePath();
      });
    }
  }

  private paintAll() {
    const shapes = this.manager.getEntentys();
    shapes.forEach((shape) => this.draw(shape));
  }
}
