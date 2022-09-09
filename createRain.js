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

  const cloudObject = {
    width: cloud.clientWidth,
    height: cloud.clientHeight,
  };
  let amountOfRaindropsInCloud = 0;
  global.amountOfRainOnScreen++;

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  (async () => {
    for (let i = 0; i < Math.min(amountOfRaindrops / 2, 5); i++) {
      if (
        amountOfRaindrops / 2 > global.amountOfRaindropsOnScreen &&
        global.amountOfRainOnScreen > 0
      ) {
        createRaindrop(rainfieldSVG, cloudObject);
        global.amountOfRaindropsOnScreen++;
        amountOfRaindropsInCloud++;
        cloud.dataset.raindrops = amountOfRaindropsInCloud;
        await sleep(2000);
      }
    }
  })();

  return rainfieldSVG;
}

export function createRaindrop(rainfield, cloudObject) {
  const raindropPath = createPath();

  const d = `${
    global.mobile
      ? "m0, 0s -2.45 1.75 -2.66 4.2 c -0.245 2.415 2.205 2.94 2.66 2.87 c 2.73 0.07 2.45 -2.275 2.45 -2.59 c 0 -3.15 -2.45 -4.48 -2.45 -4.48 z"
      : "m0, 0s-7 5-7.6 12c-.7 6.9 6.3 8.4 7.6 8.2 7.8.2 7-6.5 7-7.4 0-9-7-12.8-7-12.8z"
  }`;
  const fill = `rgb(${random(0, 50)}, ${random(0, 200)}, ${random(230, 255)})`;
  const moveToY = random(
    global.backgroundHeight * 2,
    global.backgroundHeight * 3
  );
  const moveDuration = random(100, 150);
  const delay = random(4, 14);

  const timeline = gsap.timeline();

  timeline.set(raindropPath, {
    attr: { d: d },
    fill: fill,
    opacity: 0,
    x: random(cloudObject.width / 4, cloudObject.width - cloudObject.width / 4),
    y: random(
      cloudObject.height - cloudObject.height / 4,
      cloudObject.height + cloudObject.height / 4
    ),
    // Takes the raindrop's width into consideration on spawn
    transformOrigin: "100% 100%",
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
    createRaindrop(rainfield, cloudObject);
  }
}
