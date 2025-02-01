import { ComitManager } from "./ComitManager";
import { comitEntity } from "./common-types/canvas-util-class-common-types";
import { generateComit } from "./utils/generateComits";

export class AnimateComits {
  private manager;
  private ctx;
  private canvas;
  private velVec;
  private animationId;

  constructor(
    manager: ComitManager,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    velVec?: { x: number; y: number }
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.manager = manager;
    this.velVec = velVec || {
      x: 1,
      y: 1,
    };
    this.animationId = -1;
  }

  private draw(comit: comitEntity) {
    this.ctx.beginPath();
    this.ctx.arc(comit.pos.x, comit.pos.y, comit.pos.r, 0, Math.PI * 2);
    this.ctx.fillStyle = comit.color;
    this.ctx.fill();
    this.ctx.closePath();
  }

  private move(comit: comitEntity) {
    comit.pos.x -= this.velVec.x;
    comit.pos.y += this.velVec.y;
    comit.opacity -= 2;
  }

  private animate() {
    this.animationId = requestAnimationFrame(this.animate.bind(this));

    this.manager.mentain();

    const newComit = generateComit(this.canvas.height, this.canvas.width);
    this.manager.submit(newComit);

    this.ctx.fillStyle = "rgba(225, 225, 225, 0.3)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.manager.getAll().forEach((comit) => {
      this.move(comit);
      this.draw(comit);
    });
  }

  start() {
    if (this.animationId !== -1) return; // if not in ready state this return
    this.ctx.fillStyle = "rgba(225, 225, 225, 0.3)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.animate();
  }

  stop() {
    if (this.animationId === -1) return; // if in ready state then return
    cancelAnimationFrame(this.animationId);
    this.animationId = -1; // make it in ready state
  }
}
