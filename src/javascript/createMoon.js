import { convertDurationtoSeconds } from "./utils.js";
import { createSun } from "./createSun.js";
import { global } from "./index.js";

const animatedBackgroundElement = document.querySelector(
  ".animated-background"
);
const backgroundElement = document.querySelector(".background");

let scheduledAnimationFrame;

export function createMoon(timeData, cloudData) {
  const moonElement = document.createElement("div");
  moonElement.classList.add("moon");

  const sunriseTimeInSeconds = convertDurationtoSeconds(
    timeData.sunriseTime,
    true
  );
  const sunsetTimeInSeconds = convertDurationtoSeconds(
    timeData.sunsetTime,
    true
  );
  const currentTimeInSeconds = convertDurationtoSeconds(
    timeData.currentTime,
    true
  );

  const secondsSinceSunset =
    Math.max(currentTimeInSeconds, sunsetTimeInSeconds) -
    Math.min(currentTimeInSeconds, sunsetTimeInSeconds);
  const secondsOfMoonlight =
    Math.max(sunsetTimeInSeconds, sunriseTimeInSeconds) -
    Math.min(sunsetTimeInSeconds, sunriseTimeInSeconds);
  const currentMoonPosition = secondsSinceSunset / secondsOfMoonlight;

  if (currentMoonPosition >= 1) {
    createMoon(timeData, cloudData);
    return;
  }

  animatedBackgroundElement.appendChild(moonElement);
  const moonTimeline = gsap.timeline();

  const moonElementWidth = global.mobile ? 25 : 100;
  const moonElementHeight = global.mobile ? 25 : 100;

  moonTimeline.set(moonElement, {
    x: 0,
    y: global.backgroundHeight,
    width: moonElementWidth,
    height: moonElementHeight,
    opacity: 0,
  });

  moonElement.style.setProperty("--moonSize", moonElementWidth + 20 + "px");

  const path = [
    { x: 0, y: global.backgroundHeight },
    { x: global.backgroundWidth / 4, y: global.backgroundHeight / 3 },
    { x: global.backgroundWidth / 2, y: global.backgroundHeight / 10 },
    {
      x: global.backgroundWidth - global.backgroundWidth / 4 - moonElementWidth,
      y: global.backgroundHeight / 3,
    },
    {
      x: global.backgroundWidth - moonElementWidth,
      y: global.backgroundHeight,
    },
  ];

  const motionPath = {
    path: path,
    curviness: 1.5,
    alignOrigin: [0.5, 0.5],
  };

  let rawPath = MotionPathPlugin.getRawPath(path),
    point;

  MotionPathPlugin.cacheRawPathMeasurements(rawPath);

  point = MotionPathPlugin.getPositionOnPath(rawPath, 0.5, true);

  moonTimeline.to(
    moonElement,
    {
      motionPath: motionPath,
      duration: secondsOfMoonlight,
      ease: "none",
      onUpdate: throttle,
      onUpdateParams: [moonTimeline],
      onComplete: swapFromMoonToSun,
      onCompleteParams: [moonElement, timeData, cloudData],
    },
    0
  );

  moonTimeline.progress(currentMoonPosition);

  // Separate timeline due to progress being set above
  // in turn cancelling the opacity animation
  gsap.to(moonElement, {
    delay: 2,
    duration: 4,
    opacity: 1,
  });

  checkProgress(moonTimeline);
}

function throttle(timeline) {
  if (scheduledAnimationFrame) {
    return;
  }

  scheduledAnimationFrame = true;

  setTimeout(() => checkProgress(timeline), 20000);
}

function checkProgress(timeline) {
  scheduledAnimationFrame = false;

  const progress = timeline.progress();

  // Prevents the throttle to trigger opacity switch when it shouldn't because of setTimeout
  // if changing between locations fast
  if (progress === 0) return;

  if (progress < 0.5) {
    changeBackgroundOpacity(progress + 0.5);
  } else if (progress < 1) {
    changeBackgroundOpacity(1 + (1 + (progress + 0.5) * -1));
  }
}

function changeBackgroundOpacity(progress) {
  backgroundElement.style.setProperty("--opacity", progress);
}

function swapFromMoonToSun(moonElement, timeData, cloudData) {
  gsap.killTweensOf(moonElement);
  moonElement.remove();

  createSun(timeData, cloudData);
}
