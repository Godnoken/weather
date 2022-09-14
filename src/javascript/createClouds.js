import { global } from "./index.js";
import { random } from "./utils.js";
import { createEllipse, createRect } from "./createSvgShapes.js";
import { createRainfield } from "./createRain.js";
import { createSnowfield } from "./createSnow.js";

const animatedBackgroundElement = document.querySelector(
  ".animated-background"
);

export function createClouds(cloudData) {
  const cloudElementContainer = document.createElement("div");

  cloudElementContainer.classList.add("clouds");
  
  animatedBackgroundElement.appendChild(cloudElementContainer);

  // Creates clouds based on percentage of the sky that is filled with clouds, divided by a number
  // as to not impact performance too much
  for (
    let i = global.amountOfCloudsOnScreen;
    i < cloudData.amountOfClouds / 10;
    i++
  ) {
    createCloud(cloudData);
  }
}

function createCloud(cloudData) {
  const cloudElementContainer = document.querySelector(".clouds");

  const cloudSVG = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );

  cloudSVG.classList.add("cloud");

  const cloudTimeline = gsap.timeline();

  const width = global.mobile ? 50 : 400;
  const height = global.mobile ? 25 : 200;

  // Sets initial x position to the left 80% of the screen
  const x = random(width, global.backgroundWidth * 0.8);
  const y = random(height, global.backgroundHeight);
  const moveToX = global.backgroundWidth + x / 2;
  const moveToY = random(25, 100);

  // Speed determined by how high up the cloud is in the atmosphere
  const duration = y * 1.5 + 100;
  const lifetime = random(8, 120);

  // Initializes position, size, color etc
  cloudTimeline.set(cloudSVG, {
    x: x - width / 1.5,
    y: y - height * 1.5,
    width: width,
    height: height,
    opacity: 0,
    zIndex: 1,
    scale: random(0.7, 1),
  });

  // Makes new cloud fully visible after 6 seconds
  cloudTimeline.to(cloudSVG, {
    delay: 2,
    duration: 6,
    opacity: 1,
  });

  // Cloud moves to random destination to the right of the screen
  cloudTimeline.to(
    cloudSVG,
    {
      x: `+=${moveToX}`,
      y: `+=${moveToY}`,
      duration: duration,
      ease: "none",
    },
    0
  );

  // Sets opacity to 0 after delay and deletes current cloud &
  // spawns new random cloud on animation completion
  cloudTimeline.to(
    cloudSVG,
    {
      delay: lifetime,
      opacity: 0,
      duration: 6,
      onComplete: respawnCloud,
    },
    0
  );

  // Create the cloud's visuals
  const baseCloud = createBaseCloud(width, height);

  for (let j = 0; j < 4; j++) {
    const extraCloud = createExtraCloud(width, height);

    cloudSVG.appendChild(extraCloud);
  }

  cloudElementContainer.appendChild(cloudSVG);
  cloudSVG.appendChild(baseCloud);

  global.amountOfCloudsOnScreen++;

  // Create snow or rain afer 2 seconds if the data says there should be
  setTimeout(() => {
    if (cloudData.amountOfSnowfields) {
      if (
        cloudData.amountOfSnowfields > global.amountOfSnowfieldsOnScreen ||
        (cloudData.amountOfSnowfields > 0 &&
          global.amountOfSnowfieldsOnScreen === 0)
      ) {
        createSnowfield(cloudSVG, cloudData.amountOfSnowflakes);
      }
    } else {
      if (
        cloudData.amountOfRainfields > global.amountOfRainfieldsOnScreen ||
        (cloudData.amountOfRainfields > 0 && global.amountOfRainfieldsOnScreen === 0)
      ) {
        createRainfield(cloudSVG, cloudData.amountOfRaindrops);
      }
    }
  }, 2000);

  function respawnCloud() {

    cloudTimeline.kill();
    cloudSVG.remove();

    global.amountOfCloudsOnScreen--;

    // Removes amount of rainfields/snowfields & raindrops/snowflakes from global variables
    if (cloudSVG.dataset.raindrops) {
      global.amountOfRainfieldsOnScreen--;
      global.amountOfRaindropsOnScreen -= cloudSVG.dataset.raindrops;
    } else if (cloudSVG.dataset.snowflakes) {
      global.amountOfSnowfieldsOnScreen--;
      global.amountOfSnowflakesOnScreen -= cloudSVG.dataset.snowflakes;
    }

    // Not sure why, but after refactoring to creating
    // a new cloud with a callback instead of with setInterval
    // the new cloud jumps to the top left of the screen

    // The fix is to wait a little before creating the new cloud

    // I realise that this has something to do with the cloudTimeline
    // but I don't understand it enough to fix it properly
    setTimeout(() => {
      createCloud(cloudData);
    }, 100);
  }
}

function createBaseCloud(width, height) {
  const baseCloud = createRect();

  const randomGrayValue = random(160, 180);
  const baseCloudFill = `rgb(${randomGrayValue}, ${randomGrayValue}, ${randomGrayValue})`;

  // Sets the curve radius on the left and right edges
  const baseCloudRx = width / 5;
  const baseCloudRy = width / 5;
  
  const baseCloudWidth = width;
  const baseCloudHeight = random(height / 3, height - height / 3);
  const baseCloudX = 0;
  const baseCloudY = height - baseCloudHeight;

  const baseCloudTimeline = gsap.timeline();

  // Initializes position, size, color etc
  baseCloudTimeline.set(baseCloud, {
    x: baseCloudX,
    y: baseCloudY,
    rx: baseCloudRx,
    ry: baseCloudRy,
    width: baseCloudWidth,
    height: baseCloudHeight,
    fill: baseCloudFill,
  });

  return baseCloud;
}

function createExtraCloud(width, height) {
  const extraCloud = createEllipse();

  const randomGrayValue = random(180, 200);
  const extraCloudFill = `rgb(${randomGrayValue}, ${randomGrayValue}, ${randomGrayValue})`;

  // Creates a random size for the extra cloud
  const extraCloudRx = random(width / 5, width / 4);
  const extraCloudRy = random(width / 5, width / 4);

  // Makes sure that the extra cloud doesn't spawn outside of the base
  const extraCloudX = random(
    (width - extraCloudRx / 2) / 4,
    width - (width + extraCloudRx / 2) / 4
  );

  // Makes sure that the extra cloud doesn't spawn below of the base
  const extraCloudY = height - extraCloudRy * 1.5;

  const extraCloudTimeline = gsap.timeline();

  extraCloudTimeline.set(extraCloud, {
    cx: extraCloudX,
    cy: extraCloudY,
    rx: extraCloudRx,
    ry: extraCloudRy,
    fill: extraCloudFill,
  });

  return extraCloud;
}
