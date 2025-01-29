export type RectParams = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type OvelParams = {
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  rotation: number;
  endAngle: number;
  startAngle: number;
};

export type LineParams = {
  stx: number;
  sty: number;
  enx: number;
  eny: number;
}[];

export type Shape = {
  type: "rect" | "oval" | "line"; //etc..
  params: RectParams | OvelParams | LineParams; //add more sahpe params type later
  color: string;
};

export type comitEntity = {
  pos: {
    x: number;
    y: number;
    r: number;
  };
  opacity: number;
  color: string;
};
