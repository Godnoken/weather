import { global } from "./index.js";
import { random } from "./utils.js";
import { createEllipse, createRect } from "./createSvgShapes.js";
import { createRainfield } from "./createRain.js";

const animatedBackgroundElement = document.querySelector(
  ".animated-background"
);


export function createClouds(
  amountOfClouds,
  amountOfRainfields,
  amountOfRaindrops
) {

  const cloudElementContainer = document.createElement("div");
  cloudElementContainer.classList.add("clouds");
  animatedBackgroundElement.appendChild(cloudElementContainer);

  // Creates clouds based on percentage of the sky that is filled with clouds, divided by a number
  // as to not impact performance too much
  for (let i = global.amountOfCloudsOnScreen; i < amountOfClouds / 10; i++) {
    createCloud(amountOfRainfields, amountOfRaindrops);
  }
}

function createCloud(amountOfRainfields, amountOfRaindrops) {
  const cloudElementContainer = document.querySelector(".clouds");

  const cloudSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  // SVG HAS to be absolute otherwise the animation jumps on DOM deletion
  cloudSVG.style.position = "absolute";

  // So raindrops can be rendered
  cloudSVG.style.overflow = "visible";

  const timeline = gsap.timeline();

  const width = 400;
  const height = 200;
  const x = random(width / 1.5, window.innerWidth);
  const y = random(height, window.innerHeight);
  const moveToX = -window.innerWidth + random(0, window.innerWidth) * 2;
  const moveToY = -window.innerHeight + random(0, window.innerHeight) * 2;
  const duration = random(200, 1000);
  const delay = random(8, 120);

  // Initializes position, size, color etc
  timeline.set(cloudSVG, {
    x: x - width / 1.5,
    y: y - height * 1.5,
    width: width,
    height: height,
    opacity: 0,
  });

  // Makes new svg fully visible after 8 seconds
  timeline.to(cloudSVG, {
    duration: 8,
    opacity: 1,
  });

  // Svg moves to random destination
  timeline.to(
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
  timeline.to(
    cloudSVG,
    {
      delay: delay,
      opacity: 0,
      duration: 8,
      onComplete: respawnCloud,
    },
    0
  );
  
  const baseCloud = createBaseCloud(width, height);

  for (let j = 0; j < 6; j++) {
    const extraCloud = createExtraCloud();

    cloudSVG.appendChild(extraCloud);
  }

  cloudElementContainer.appendChild(cloudSVG);
  cloudSVG.appendChild(baseCloud);

  global.amountOfCloudsOnScreen++;

  setTimeout(() => {
    if (
      amountOfRainfields > global.amountOfRainOnScreen ||
      (amountOfRainfields > 0 && global.amountOfRainOnScreen === 0)
    ) {
      createRainfield(cloudSVG, amountOfRaindrops);
      cloudSVG.dataset.rainfield = true;
    }
  }, 2000);

  function respawnCloud() {
    timeline.killTweensOf(cloudSVG);
    cloudSVG.remove();
    global.amountOfCloudsOnScreen--;

    if (cloudSVG.dataset.rainfield) {
      global.amountOfRainOnScreen--;
      global.amountOfRaindropsOnScreen -= cloudSVG.dataset.raindrops;
    }

    // Not sure why, but after refactoring to creating
    // a new cloud with a callback instead of with setInterval
    // the new cloud jumps to the top left of the screen

    // The fix is to wait a little before creating the new cloud

    // I realise that this has something to do with the timeline
    // but I don't understand it enough to fix it properly
    setTimeout(() => {
      createCloud(amountOfRainfields, amountOfRaindrops);
    }, 100)
  }
}

function createBaseCloud(width, height) {
  const baseCloud = createRect();

  const randomGrayValue = random(150, 190);
  const baseCloudFill = `rgb(${randomGrayValue}, ${randomGrayValue}, ${randomGrayValue})`;
  const baseCloudRy = 40;
  const baseCloudRx = 40;
  const baseCloudWidth = random(160, 300);
  const baseCloudHeight = random(40, 80);
  
  const baseCloudTimeline = gsap.timeline();

  // Initializes position, size, color etc
  baseCloudTimeline.set(baseCloud, {
    x: 0 + (width - baseCloudWidth) / 2,
    y: height - baseCloudHeight,
    rx: baseCloudRx,
    ry: baseCloudRy,
    width: baseCloudWidth,
    height: baseCloudHeight,
    fill: baseCloudFill,
  });

  return baseCloud;
}

function createExtraCloud() {
  const extraCloud = createEllipse();
  
  const randomGrayValue = random(150, 190);
  const extraCloudFill = `rgb(${randomGrayValue}, ${randomGrayValue}, ${randomGrayValue})`;
  const extraCloudRy = random(30, 60);
  const extraCloudRx = random(30, 60);
  const extraCloudX = 0 + random(125, 275);
  const extraCloudY = 180;
  
  const extraCloudTimeline = gsap.timeline();

  extraCloudTimeline.set(extraCloud, {
    cx: extraCloudX,
    cy: extraCloudY - extraCloudRy,
    rx: extraCloudRx,
    ry: extraCloudRy,
    fill: extraCloudFill,
  });

  return extraCloud;
}