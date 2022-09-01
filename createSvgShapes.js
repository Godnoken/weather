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
