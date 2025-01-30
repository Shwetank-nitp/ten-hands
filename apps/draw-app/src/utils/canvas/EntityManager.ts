import { Shapes } from "lucide-react";
import { Shape } from "./common-types/canvas-util-class-common-types";

// make its methode protected
export class EntintyManager {
  private entintyMap: Map<number, Shape>;
  private entityStack: Shape[];
  private socket: WebSocket;
  constructor(socket: WebSocket) {
    this.entintyMap = new Map();
    this.entityStack = [];
    this.socket = socket;
    socket.onmessage = (message) => {
      const { type, color, draw } = message.data;
      this.entintyMap.set(this.entintyMap.size, {
        type,
        color,
        params: draw,
      });
    };
  }

  addEntity(data: Shape) {
    const size = this.entintyMap.size;
    this.entintyMap.set(size, data);
    this.socket.send(
      JSON.stringify({
        type: data.type,
        color: data.color,
        draw: data.params,
      })
    );
    return size;
  }

  undo() {
    if (this.entintyMap.size === 0) return;

    const id = this.entintyMap.size - 1;
    const shape = this.getEntentyById(id);
    if (!shape) {
      console.log("error in manager class undo : id is invalid");
      return;
    }

    this.entintyMap.delete(id);
    this.entityStack.push(shape);
  }

  redo() {
    if (this.entityStack.length === 0) return;

    const shape = this.entityStack.pop();
    if (!shape) {
      console.log("error in manager class redo : id is invalid");
      return;
    }

    const id = this.entintyMap.size;
    this.entintyMap.set(id, shape);
  }

  getEntentys() {
    return Array.from(this.entintyMap.values());
  }

  getEntentyById(id: number) {
    return this.entintyMap.get(id);
  }

  removeEntintyById(id: number) {
    this.entintyMap.delete(id);
  }

  updateEntityById(id: number, params: Shape) {
    this.entintyMap.set(id, params);
  }
}
