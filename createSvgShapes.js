import { random } from "./utils.js";

export function createRect(rect) {
  const newRect = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );
  const timeline = gsap.timeline();

  // Initializes position, size, color etc
  timeline.set(newRect, {
    x: 0 + (400 - rect.width) / 2,
    y: 200 - rect.height,
    rx: rect.rx,
    ry: rect.rx,
    width: rect.width,
    height: rect.height,
    fill: rect.fill,
  });

  return newRect;
}

export function createEllipse(ellipse) {
  const newEllipse = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "ellipse"
  );
  const timeline = gsap.timeline();

  // Initializes position, size, color etc
  timeline.set(newEllipse, {
    cx: 0 + random(150, 250),
    cy: 180 - ellipse.ry,
    rx: ellipse.rx,
    ry: ellipse.ry,
    fill: ellipse.fill,
  });

  return newEllipse;
}
