import { convertDurationtoSeconds } from "./utils.js";
import { createSun } from "./createSun.js";
import { global } from "./index.js";

const animatedBackgroundElement = document.querySelector(
  ".animated-background"
);
const backgroundElement = document.querySelector(".background");

// Used to throttle background opacity
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

  const moonElementWidth = global.mobile ? 25 : 100;
  const moonElementHeight = global.mobile ? 25 : 100;
  const moonTimeline = gsap.timeline();

  // Set the moon's position & size & opacity
  moonTimeline.set(moonElement, {
    x: 0,
    y: global.backgroundHeight,
    width: moonElementWidth,
    height: moonElementHeight,
    opacity: 0,
  });

  // Sets moon's crater image size so it fits the moon element
  moonElement.style.setProperty("--moonSize", moonElementWidth + 20 + "px");

  // The moon's travel path
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
    // Curviness makes the sun move in a curve rather than statically from a to b
    curviness: 1.5,
  };

  // Make moon move along path
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

  // Set moon's position to wherever it should be in real life
  // (well, not quite. We are assuming the moon & sun move exactly the same)
  moonTimeline.progress(currentMoonPosition);

  // Separate timeline due to progress being set above
  // which in turn cancels the opacity animation
  gsap.to(moonElement, {
    delay: 2,
    duration: 4,
    opacity: 1,
  });

  checkProgress(moonTimeline);
}

// Throttle onUpdate so we don't check & update background's opacity every tick
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

  // If user switch locations fast, this will prevent setTimeout to trigger opacity switch
  // when it shouldn't
  if (progress === 0) return;

  // Calculates how bright the sky will be depending on time of day
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
  // Remove moon & its tweens
  gsap.killTweensOf(moonElement);
  moonElement.remove();

  createSun(timeData, cloudData);
}
