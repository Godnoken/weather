import { global } from "./index.js";
import { random } from "./utils.js";
import { createPath } from "./createSvgShapes.js";

export function createRainfield(cloudElement, amountOfRaindrops) {
  const rainfieldSVG = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );

  rainfieldSVG.classList.add("rainfield");

  cloudElement.appendChild(rainfieldSVG);

  const cloudObject = {
    width: cloudElement.clientWidth,
    height: cloudElement.clientHeight,
  };

  global.amountOfRainfieldsOnScreen++;

  let amountOfRaindropsInCloud = 0;

  // This lets the loop sleep for x seconds so we don't spawn all raindrops
  // at the same time
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  (async () => {
    // Never spawn more than 5 raindrops per cloud
    for (let i = 0; i < Math.min(amountOfRaindrops / 2, 5); i++) {
      if (
        amountOfRaindrops / 2 > global.amountOfRaindropsOnScreen &&
        global.amountOfRainfieldsOnScreen > 0
      ) {
        createRaindrop(rainfieldSVG, cloudObject);
        global.amountOfRaindropsOnScreen++;
        amountOfRaindropsInCloud++;

        // It is set so we know how many raindrops to remove from global variable
        // later on when cloud disappears
        cloudElement.dataset.raindrops = amountOfRaindropsInCloud;
        await sleep(2000);
      }
    }
  })();

  return rainfieldSVG;
}

export function createRaindrop(rainfield, cloudObject) {
  const raindropPath = createPath();

  // Sets size depending on if user is on mobile or desktop
  const d = `${
    global.mobile
      ? "m0, 0s -2.45 1.75 -2.66 4.2 c -0.245 2.415 2.205 2.94 2.66 2.87 c 2.73 0.07 2.45 -2.275 2.45 -2.59 c 0 -3.15 -2.45 -4.48 -2.45 -4.48 z"
      : "m0, 0s-7 5-7.6 12c-.7 6.9 6.3 8.4 7.6 8.2 7.8.2 7-6.5 7-7.4 0-9-7-12.8-7-12.8z"
  }`;
  const randomBlue = `rgb(${random(0, 50)}, ${random(0, 200)}, ${random(230, 255)})`;
  const moveToY = random(
    global.backgroundHeight * 2,
    global.backgroundHeight * 3
  );
  const moveDuration = random(100, 150);
  const lifetime = random(4, 14);

  const raindropTimeline = gsap.timeline();

  // Sets raindrop's visual, colour, opacity and position
  raindropTimeline.set(raindropPath, {
    attr: { d: d },
    fill: randomBlue,
    opacity: 0,

    // Makes sure raindrop doesn't spawn outside of the cloud
    x: random(cloudObject.width / 4, cloudObject.width - cloudObject.width / 4),

    // Makes sure raindrop doesn't spawn above cloud
    y: random(
      cloudObject.height - cloudObject.height / 4,
      cloudObject.height + cloudObject.height / 4
    ),
    // Takes the raindrop's width into consideration on spawn
    transformOrigin: "100% 100%",
  });

  // Makes raindrop visible
  raindropTimeline.to(raindropPath, {
    duration: 3,
    opacity: 1,
  });

  // Moves raindrop down
  raindropTimeline.to(
    raindropPath,
    {
      y: `+=${moveToY}`,
      duration: moveDuration,
      ease: "none",
    },
    0
  );

  // Respawns raindrop after some time
  raindropTimeline.to(
    raindropPath,
    {
      delay: lifetime,
      opacity: 0,
      duration: 2,
      onComplete: respawnRaindrop,
    },
    0
  );

  rainfield.appendChild(raindropPath);

  function respawnRaindrop() {
    const rainfield = raindropPath.parentElement;

    raindropTimeline.kill();
    raindropPath.remove();

    createRaindrop(rainfield, cloudObject);
  }
}
