import { convertDurationtoSeconds, random } from "./utils.js";
import { createMoon } from "./createMoon.js";
import { global } from "./index.js";

const animatedBackgroundElement = document.querySelector(
  ".animated-background"
);
const backgroundElement = document.querySelector(".background");

// Used to throttle background opacity
let scheduledAnimationFrame;

export function createSun(timeData, cloudData) {
  const sunElement = document.createElement("div");
  sunElement.classList.add("sun");

  const sunriseTimeInSeconds = convertDurationtoSeconds(timeData.sunriseTime);
  const sunsetTimeInSeconds = convertDurationtoSeconds(
    timeData.sunsetTime,
    true
  );
  const currentTimeInSeconds =
    timeData.sunriseTime > timeData.currentTime
      ? convertDurationtoSeconds(timeData.currentTime, true)
      : convertDurationtoSeconds(timeData.currentTime);

  const secondsSinceSunrise =
    Math.max(currentTimeInSeconds, sunriseTimeInSeconds) -
    Math.min(currentTimeInSeconds, sunriseTimeInSeconds);
  const secondsOfSunshine =
    Math.max(sunsetTimeInSeconds, sunriseTimeInSeconds) -
    Math.min(sunsetTimeInSeconds, sunriseTimeInSeconds);
  const currentSunPosition = secondsSinceSunrise / secondsOfSunshine;

  if (currentSunPosition >= 1) {
    createMoon(timeData, cloudData);
    return;
  }

  animatedBackgroundElement.appendChild(sunElement);

  const sunElementWidth = global.mobile ? 25 : 100;
  const sunElementHeight = global.mobile ? 25 : 100;
  const sunTimeline = gsap.timeline();

  // Set the sun's position & size & opacity
  sunTimeline.set(sunElement, {
    x: 0,
    y: global.backgroundHeight,
    width: sunElementWidth,
    height: sunElementHeight,
    opacity: 0,
  });

  // The sun's travel path
  const path = [
    { x: 0, y: global.backgroundHeight },
    { x: global.backgroundWidth / 4, y: global.backgroundHeight / 3 },
    { x: global.backgroundWidth / 2, y: global.backgroundHeight / 10 },
    {
      x: global.backgroundWidth - global.backgroundWidth / 4 - sunElementWidth,
      y: global.backgroundHeight / 3,
    },
    {
      x: global.backgroundWidth - sunElementWidth,
      y: global.backgroundHeight,
    },
  ];

  const motionPath = {
    path: path,
    // Curviness makes the sun move in a curve rather than statically from a to b
    curviness: 1.5,
  };

  // Make sun move along path
  sunTimeline.to(sunElement, {
    motionPath: motionPath,
    duration: secondsOfSunshine,
    ease: "none",
    onUpdate: throttle,
    onUpdateParams: [sunTimeline, cloudData],
    onComplete: swapFromSunToMoon,
    onCompleteParams: [sunElement, timeData, cloudData],
  });

  // Set sun's position to wherever it should be in real life
  sunTimeline.progress(currentSunPosition);

  // Separate timeline due to progress being set above
  // which in turn cancels the opacity animation
  gsap.to(sunElement, {
    delay: 2,
    duration: 4,

    // Sun's opacity is based on the amount of clouds in the sky
    // 1.3 is there so it will always be visible to some degree
    opacity: 1.3 - cloudData.amountOfClouds / 100,
  });

  createSunRays(sunElementWidth, sunElementHeight);
  checkProgress(sunTimeline, cloudData);
}

// Throttle onUpdate so we don't check & update background's opacity every tick
function throttle(timeline, cloudData) {
  if (scheduledAnimationFrame) {
    return;
  }

  scheduledAnimationFrame = true;

  setTimeout(() => checkProgress(timeline, cloudData), 20000);
}

// Checks sun's progress so we know how dark or bright the sky should be
function checkProgress(timeline, cloudData) {
  scheduledAnimationFrame = false;

  const progress = timeline.progress();

  // If user switch locations fast, this will prevent setTimeout to trigger opacity switch
  // when it shouldn't
  if (progress === 0) return;

  if (progress < 0.5) {
    // Calculates how bright the sky will be depending on amount of clouds and time of day
    changeBackgroundOpacity(
      Math.min(
        0.5,
        1.5 + cloudData.amountOfClouds / 100 - 1 + (progress + 0.5) * -1
      )
    );
  } else if (progress < 1) {
    // Same as above but slightly different calculation due to the sky getting darker throughout the day
    changeBackgroundOpacity(
      Math.min(0.5, cloudData.amountOfClouds / 100 - 1 - progress * -1)
    );
  }
}

function changeBackgroundOpacity(progress) {
  backgroundElement.style.setProperty("--opacity", progress);
}

function createSunRays(sunElementWidth, sunElementHeight) {
  const sunElement = document.querySelector(".sun");

  let rotationDegree = 10;
  let stronger = 1;

  // Iterate 36 times so we have sun rays on all 360 degrees around the sun
  for (let i = 0; i < 36; i++) {
    const rayElement = document.createElement("div");
    rayElement.classList.add("sun-ray");

    rayElement.style.transform = `rotate(${rotationDegree}deg)`;
    rayElement.style.opacity = random(0.02, 0.07);
    rayElement.style.setProperty("--width", `${sunElementWidth / 3}px`);
    rayElement.style.setProperty("--height", `${sunElementHeight * 3}px`);

    // Very visible ray
    if (stronger === 3) {
      stronger = 0;
      rayElement.style.opacity = random(0.1, 0.16);
      rayElement.style.setProperty("--width", `${random(1, 8)}}px`);
      rayElement.style.setProperty("--gradientOpacity", random(0.1, 0.4));
    }

    rotationDegree += 10;
    stronger += Math.round(random(0, 1));

    sunElement.appendChild(rayElement);
  }
}

function swapFromSunToMoon(sunElement, timeData, cloudData) {
  // Remove sun & its tweens
  gsap.killTweensOf(sunElement);
  sunElement.remove();

  createMoon(timeData, cloudData);
}
