import { convertDurationtoSeconds, random } from "./utils.js";
import { createMoon } from "./createMoon.js";
import { global } from "./index.js";

const animatedBackgroundElement = document.querySelector(
  ".animated-background"
);
const backgroundElement = document.querySelector(".background");

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
  const sunTimeline = gsap.timeline();

  const sunElementWidth = global.mobile ? 25 : 100;
  const sunElementHeight = global.mobile ? 25 : 100;

  sunTimeline.set(sunElement, {
    x: 0,
    y: global.backgroundHeight,
    width: sunElementWidth,
    height: sunElementHeight,
    opacity: 0,
  });

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
    curviness: 1.5,
  };

  let rawPath = MotionPathPlugin.getRawPath(path),
    point;

  MotionPathPlugin.cacheRawPathMeasurements(rawPath);

  point = MotionPathPlugin.getPositionOnPath(rawPath, 0.5, true);

  sunTimeline.to(sunElement, {
    motionPath: motionPath,
    duration: secondsOfSunshine,
    ease: "none",
    onUpdate: throttle,
    onUpdateParams: [sunTimeline, cloudData],
    onComplete: swapFromSunToMoon,
    onCompleteParams: [sunElement, timeData, cloudData],
  });

  sunTimeline.progress(currentSunPosition);

  // Separate timeline due to progress being set above
  // in turn cancelling the opacity animation
  gsap.to(sunElement, {
    delay: 2,
    duration: 4,
    opacity: 1.3 - cloudData.amountOfClouds / 100,
  });

  createSunRays(sunElementWidth, sunElementHeight);
  checkProgress(sunTimeline, cloudData);
}

function throttle(timeline, cloudData) {
  if (scheduledAnimationFrame) {
    return;
  }

  scheduledAnimationFrame = true;

  setTimeout(() => checkProgress(timeline, cloudData), 20000);
}

function checkProgress(timeline, cloudData) {
  scheduledAnimationFrame = false;

  const progress = timeline.progress();

  // Prevents the throttle to trigger opacity switch when it shouldn't because of setTimeout
  // if changing between locations fast
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

  for (let i = 0; i < 36; i++) {
    const rayElement = document.createElement("div");
    rayElement.classList.add("sun-ray");

    rayElement.style.transform = `rotate(${rotationDegree}deg)`;
    rayElement.style.opacity = random(0.02, 0.07);
    rayElement.style.setProperty("--width", `${sunElementWidth / 3}px`);
    rayElement.style.setProperty("--height", `${sunElementHeight * 3}px`);

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
  gsap.killTweensOf(sunElement);
  sunElement.remove();

  createMoon(timeData, cloudData);
}
