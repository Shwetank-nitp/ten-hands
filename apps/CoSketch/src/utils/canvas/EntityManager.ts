import { Shape } from "./common-types/canvas-util-class-common-types";

// make its methode protected
export class EntintyManager {
  private entintyMap: Map<string, Shape>;
  private undoStack: { _id: string; shape: Shape }[];
  private redoStack: { _id: string; shape: Shape }[];
  private userId;

  constructor(
    entitys: { _id: string; shape: Shape; senderId: string }[],
    userId: string
  ) {
    this.entintyMap = new Map();
    this.undoStack = [];
    this.redoStack = [];
    this.userId = userId;
    entitys.forEach((drawing) =>
      this.addEntity(drawing.shape, drawing._id, drawing.senderId)
    );
  }

  addEntity(shape: Shape, _id: string, senderId: string) {
    if (this.userId === senderId) {
      this.undoStack.push({
        _id,
        shape,
      });
    }
    this.entintyMap.set(_id, shape);
    return _id;
  }

  undo() {
    if (this.undoStack.length === 0) return;
    const entity = this.undoStack.pop();
    if (entity) {
      this.undoEntintyById(entity._id);
    }
    return entity;
  }

  redo() {
    if (this.redoStack.length === 0) return;
    const entity = this.redoStack.pop();
    return entity;
  }

  getEntentys() {
    return Array.from(this.entintyMap.values());
  }

  getEntentyById(_id: string) {
    return this.entintyMap.get(_id);
  }

  private undoEntintyById(_id: string) {
    const shape = this.entintyMap.get(_id);
    if (shape) {
      this.redoStack.push({ _id, shape });
    }
    this.entintyMap.delete(_id);
  }

  deleteEntityById(_id: string, senderId: string) {
    if (senderId === this.userId) {
      this.undoEntintyById(_id);
    } else this.entintyMap.delete(_id);
  }

  updateEntityById(_id: string, params: Shape) {
    this.entintyMap.set(_id, params);
  }
}
