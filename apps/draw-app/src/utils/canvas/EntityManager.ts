import { Shape } from "./common-types/canvas-util-class-common-types";

// make its methode protected
export class EntintyManager {
  private entintyMap: Map<number, Shape>;

  constructor() {
    this.entintyMap = new Map();
  }

  addEntity(params: Shape) {
    const size = this.entintyMap.size;
    this.entintyMap.set(size, params);
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
