import { comitEntity } from "./common-types/canvas-util-class-common-types";

export class ComitManager {
  private comits: comitEntity[];

  constructor() {
    this.comits = [];
  }

  getLength() {
    return this.comits.length;
  }

  mentain() {
    this.comits = this.comits.filter((comit) => comit.opacity > 1);
  }

  getAll() {
    return this.comits;
  }

  submit(comit: comitEntity) {
    this.comits.push(comit);
  }
}
