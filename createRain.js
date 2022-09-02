import { global } from "./index.js";
import { random } from "./utils.js";
import { createPath } from "./createSvgShapes.js";

export function createRainfield(cloud, amountOfRaindrops) {
  const newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  // SVG HAS to be absolute otherwise the animation jumps on DOM deletion
  newSvg.style.position = "absolute";
  newSvg.style.overflow = "visible";

  cloud.appendChild(newSvg);

  let amountOfRaindropsInCloud = 0;

  for (let i = 0; i < Math.min(amountOfRaindrops, 10); i++) {
    if (amountOfRaindrops > global.amountOfRaindropsOnScreen) {
      createRaindrop(newSvg);
      global.amountOfRaindropsOnScreen++;
      amountOfRaindropsInCloud++;
      cloud.dataset.raindrops = amountOfRaindropsInCloud;
    }
  }

  global.amountOfRainOnScreen++;

  return newSvg;
}

export function createRaindrop(rainfield) {
  const raindrop = createPath({
    d: `m${random(125, 275)},${random(
      150,
      225
    )}c0,0 -6.96763,5.04017 -7.62085,11.97041c-0.65322,6.93024 6.31441,8.40028 7.62085,8.19028c7.83858,0.21001 6.96763,-6.51022 6.96763,-7.35025c0,-9.03031 -6.96763,-12.81043 -6.96763,-12.81043z`,
    fill: `rgb(0, 0, ${random(128, 255)})`,
    moveToY: random(window.innerHeight + 2000, window.innerHeight + 6000),
    moveDuration: random(250, 500),
    delay: random(4, 12),
  });

  rainfield.appendChild(raindrop);
}
