import { createRaindrop } from "./createRain.js";

export function createRect(rect) {
  const newRect = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );
  const timeline = gsap.timeline();

  // Initializes position, size, color etc
  timeline.set(newRect, {
    x: rect.x,
    y: rect.y,
    rx: rect.rx,
    ry: rect.ry,
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
    cx: ellipse.x,
    cy: ellipse.y,
    rx: ellipse.rx,
    ry: ellipse.ry,
    fill: ellipse.fill,
  });

  return newEllipse;
}

export function createPath(path) {
  const newPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  const timeline = gsap.timeline();

  timeline.set(newPath, {
    attr: { d: path.d },
    fill: path.fill,
    opacity: 0,
  });

  timeline.to(
    newPath,
    {
      duration: 2,
      opacity: 1,
    },
    0
  );

  timeline.to(
    newPath,
    {
      y: `+=${path.moveToY}`,
      duration: path.moveDuration,
      ease: "none",
    },
    0
  );

  timeline.to(
    newPath,
    {
      delay: path.delay,
      opacity: 0,
      duration: 2,
      onComplete: respawnRaindrop,
    },
    0
  );

  function respawnRaindrop() {
    const rainfield = newPath.parentElement;
    timeline.killTweensOf(newPath);
    newPath.remove();
    createRaindrop(rainfield);
  }

  return newPath;
}
