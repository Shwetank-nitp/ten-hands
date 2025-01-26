export type RectParams = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type Shape = {
  type: "rect" | "circle" | "line"; //etc..
  params: RectParams; //add more sahpe params type later
};