import { comitEntity } from "../common-types/canvas-util-class-common-types";

export function generateComit(
  viewHight: number,
  viewWidth: number,
  radiusMax = 3.53
): comitEntity {
  const x = Math.random() * viewWidth;
  const y = Math.random() * viewHight;
  const r = Math.random() * radiusMax;

  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 100);
  const lightness = Math.floor(Math.random() * 100);
  const opacity = 360;
  const color = `hsl(${hue}, ${saturation}%, ${lightness}%, ${opacity})`;

  return { pos: { x, y, r }, color, opacity };
}
