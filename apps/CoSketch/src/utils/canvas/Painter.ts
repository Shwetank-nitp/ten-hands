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
  private ctx: CanvasRenderingContext2D;
  private manager: EntintyManager;
  private canvas: HTMLCanvasElement;
  private color: string;
  private socket: WebSocket;
  private roomId: number;

  // Store event listeners so they can be removed later
  private mouseDownListener: ((e: MouseEvent) => void) | null = null;
  private mouseUpListener: ((e: MouseEvent) => void) | null = null;
  private mouseMoveListener: ((e: MouseEvent) => void) | null = null;
  private resizeListener: (() => void) | null = null;
  private keyDownListener: ((e: KeyboardEvent) => void) | null = null;

  constructor(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    manager: EntintyManager,
    color: string,
    socket: WebSocket,
    roomId: number
  ) {
    this.ctx = ctx;
    this.manager = manager;
    this.canvas = canvas;
    this.color = color;
    this.socket = socket;
    this.roomId = roomId;
  }

  observeRect() {
    let clicked = false;
    const rect = new Rect();

    this.mouseDownListener = (e: MouseEvent) => {
      clicked = true;
      rect.x = e.clientX;
      rect.y = e.clientY;
    };

    this.mouseUpListener = () => {
      clicked = false;
      const shape = {
        type: "rect" as "rect",
        params: rect.getParams(),
        color: this.color,
      };
      this.socket.send(
        JSON.stringify({
          type: "draw",
          message: shape,
          roomId: this.roomId,
        })
      );
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.paintAll();
      rect.resetParams();
    };

    this.mouseMoveListener = (e: MouseEvent) => {
      if (clicked) {
        rect.w = e.clientX - rect.x;
        rect.h = e.clientY - rect.y;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.paintAll();
        this.ctx.strokeStyle = this.color;
        this.ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
      }
    };

    this.canvas.addEventListener("mousedown", this.mouseDownListener);
    this.canvas.addEventListener("mouseup", this.mouseUpListener);
    this.canvas.addEventListener("mouseleave", this.mouseUpListener);
    this.canvas.addEventListener("mousemove", this.mouseMoveListener);
  }

  observeOval() {
    let clicked = false;
    const oval = new Oval();

    this.mouseDownListener = (e: MouseEvent) => {
      clicked = true;
      oval.x = e.clientX;
      oval.y = e.clientY;
    };

    this.mouseUpListener = () => {
      clicked = false;
      const data = {
        type: "oval" as "oval",
        params: oval.getParams(),
        color: this.color,
      };
      this.socket.send(
        JSON.stringify({
          type: "draw",
          message: data,
          roomId: this.roomId,
        })
      );
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.paintAll();
      oval.resetParams();
    };

    this.mouseMoveListener = (e: MouseEvent) => {
      if (clicked) {
        oval.radiusX = Math.abs(e.clientX - oval.x) / 1.25;
        oval.radiusY = Math.abs(e.clientY - oval.y) / 1.25;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.paintAll();
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
        this.ctx.strokeStyle = this.color;
        this.ctx.stroke();
        this.ctx.closePath();
      }
    };

    this.canvas.addEventListener("mousedown", this.mouseDownListener);
    this.canvas.addEventListener("mouseup", this.mouseUpListener);
    this.canvas.addEventListener("mouseleave", this.mouseUpListener);
    this.canvas.addEventListener("mousemove", this.mouseMoveListener);
  }

  observeLine() {
    let clicked = false;
    const line = new Line();

    this.mouseDownListener = (e: MouseEvent) => {
      clicked = true;
      line.collection.push({
        stx: e.clientX,
        sty: e.clientY,
        enx: e.clientX,
        eny: e.clientY,
      });
      this.ctx.beginPath();
      this.ctx.moveTo(e.clientX, e.clientY);
    };

    this.mouseUpListener = () => {
      if (clicked) {
        clicked = false;
        const data = {
          type: "line" as "line",
          params: line.getParams(),
          color: this.color,
        };
        this.socket.send(
          JSON.stringify({
            type: "draw",
            roomId: this.roomId,
            message: data,
          })
        );
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        line.resetParams();
        this.paintAll();
      }
    };

    this.mouseMoveListener = (e: MouseEvent) => {
      if (clicked) {
        const currentSegment = {
          stx: line.collection[line.collection.length - 1].enx,
          sty: line.collection[line.collection.length - 1].eny,
          enx: e.clientX,
          eny: e.clientY,
        };
        line.collection.push(currentSegment);
        this.ctx.lineTo(currentSegment.enx, currentSegment.eny);
        this.ctx.strokeStyle = this.color;
        this.ctx.stroke();
      }
    };

    this.canvas.addEventListener("mousedown", this.mouseDownListener);
    this.canvas.addEventListener("mouseup", this.mouseUpListener);
    this.canvas.addEventListener("mouseleave", this.mouseUpListener);
    this.canvas.addEventListener("mousemove", this.mouseMoveListener);
  }

  startListning() {
    this.socket.onmessage = (brodcast) => {
      const data = JSON.parse(brodcast.data);
      const { type, shapeId, senderId } = data;
      if (type === "add") {
        const { type: shapeType, color, params } = data.message;
        this.manager.addEntity(
          {
            type: shapeType,
            color,
            params,
          },
          shapeId,
          senderId
        );
      } else if (type === "remove") {
        this.manager.deleteEntityById(shapeId, senderId);
      }
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.paintAll();
    };
  }

  startObserving(type: "rect" | "ovel" | "line") {
    this.paintAll();
    this.resizeListener = () => {
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

    this.keyDownListener = (e) => {
      if (e.key === "z" && e.ctrlKey) {
        const entity = this.manager.undo();
        this.socket.send(
          JSON.stringify({
            type: "del",
            roomId: this.roomId,
            shapeId: entity?._id,
          })
        );
      } else if (e.key === "y" && e.ctrlKey) {
        const entity = this.manager.redo();
        this.socket.send(
          JSON.stringify({
            type: "draw",
            roomId: this.roomId,
            message: entity?.shape,
          })
        );
      }
    };

    window.addEventListener("resize", this.resizeListener);
    window.addEventListener("keydown", this.keyDownListener);
  }

  stopObserving() {
    if (this.mouseDownListener) {
      this.canvas.removeEventListener("mousedown", this.mouseDownListener);
    }
    if (this.mouseUpListener) {
      this.canvas.removeEventListener("mouseup", this.mouseUpListener);
      this.canvas.removeEventListener("mouseleave", this.mouseUpListener);
    }
    if (this.mouseMoveListener) {
      this.canvas.removeEventListener("mousemove", this.mouseMoveListener);
    }

    if (this.resizeListener) {
      window.removeEventListener("resize", this.resizeListener);
    }

    if (this.keyDownListener) {
      window.removeEventListener("keydown", this.keyDownListener);
    }

    // Reset listener references
    this.mouseDownListener = null;
    this.mouseUpListener = null;
    this.mouseMoveListener = null;
    this.resizeListener = null;
    this.keyDownListener = null;
  }

  private draw(shape: Shape) {
    if (shape.type === "rect") {
      this.ctx.strokeStyle = shape.color;
      const { x, y, w, h } = shape.params as RectParams;
      this.ctx.strokeRect(x, y, w, h);
    }

    if (shape.type === "oval") {
      this.ctx.strokeStyle = shape.color;
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
        this.ctx.strokeStyle = shape.color;
        this.ctx.moveTo(line.stx, line.sty);
        this.ctx.lineTo(line.enx, line.eny);
        this.ctx.stroke();
        this.ctx.closePath();
      });
    }
  }

  private paintAll() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const shapes = this.manager.getEntentys();
    shapes.forEach((shape) => this.draw(shape));
  }
}
