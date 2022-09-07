import { global } from "./index.js";
import { random } from "./utils.js";
import { createPath } from "./createSvgShapes.js";

export function createRainfield(cloud, amountOfRaindrops) {
  const rainfieldSVG = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );

  // SVG HAS to be absolute otherwise the animation jumps on DOM deletion
  rainfieldSVG.style.position = "absolute";
  rainfieldSVG.style.overflow = "visible";

  cloud.appendChild(rainfieldSVG);

  let amountOfRaindropsInCloud = 0;
  global.amountOfRainOnScreen++;

  const sleep = ms => new Promise(res => setTimeout(res, ms));

  (async () => {
    
    for (let i = 0; i < Math.min(amountOfRaindrops / 2, 5); i++) {
      if (amountOfRaindrops / 2 > global.amountOfRaindropsOnScreen && global.amountOfRainOnScreen > 0) {
        createRaindrop(rainfieldSVG);
        global.amountOfRaindropsOnScreen++;
        amountOfRaindropsInCloud++;
        cloud.dataset.raindrops = amountOfRaindropsInCloud;
        await sleep(2000);
      }
    }
  })();

  return rainfieldSVG;
}

export function createRaindrop(rainfield) {
  const raindropPath = createPath();

  const d = `m${random(125, 275)},${random(
    150,
    225
  )}c0,0 -6.96763,5.04017 -7.62085,11.97041c-0.65322,6.93024 6.31441,8.40028 7.62085,8.19028c7.83858,0.21001 6.96763,-6.51022 6.96763,-7.35025c0,-9.03031 -6.96763,-12.81043 -6.96763,-12.81043z`;
  const fill = `rgb(${random(0, 50)}, ${random(0, 200)}, ${random(230, 255)})`;
  //const fill = `rgb(0, 0, ${random(200, 255)})`;
  const moveToY = random(window.innerHeight + 2000, window.innerHeight + 6000);
  const moveDuration = random(250, 500);
  const delay = random(4, 12);

  const timeline = gsap.timeline();

  timeline.set(raindropPath, {
    attr: { d: d },
    fill: fill,
    opacity: 0,
  });

  timeline.to(raindropPath, {
    duration: 3,
    opacity: 1,
  });

  timeline.to(
    raindropPath,
    {
      y: `+=${moveToY}`,
      duration: moveDuration,
      ease: "none",
    },
    0
  );

  timeline.to(
    raindropPath,
    {
      delay: delay,
      opacity: 0,
      duration: 2,
      onComplete: respawnRaindrop,
    },
    0
  );

  rainfield.appendChild(raindropPath);

  function respawnRaindrop() {
    const rainfield = raindropPath.parentElement;
    timeline.killTweensOf(raindropPath);
    raindropPath.remove();
    createRaindrop(rainfield);
  }
}
