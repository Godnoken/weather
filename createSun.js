import { convertDurationtoSeconds, random } from "./utils.js";
import { createMoon } from "./createMoon.js";

const animatedBackgroundElement = document.querySelector(
  ".animated-background"
);

let scheduledAnimationFrame;

export function createSun(timeData) {
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
    createMoon(timeData);
    return;
  }

  animatedBackgroundElement.appendChild(sunElement);
  const sunTimeline = gsap.timeline();

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const sunElementWidth = sunElement.offsetWidth;
  const sunElementHeight = sunElement.offsetHeight;

  sunTimeline.set(sunElement, {
    x: 0 - sunElementWidth / 2,
    y: windowHeight + sunElementHeight,
    opacity: 0,
  });

  const path = [
    {
      x: 0 - sunElementWidth / 2,
      y: windowHeight + sunElementHeight,
    },
    { x: windowWidth - windowWidth / 1.25, y: windowHeight / 3 },
    { x: windowWidth / 2 - sunElementWidth, y: windowHeight / 10 },
    { x: windowWidth / 1.25 - sunElementWidth, y: windowHeight / 3 },
    {
      x: windowWidth - sunElementWidth / 2,
      y: windowHeight + sunElementHeight
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
    duration: 10,
    ease: "none",
    onUpdate: throttle,
    onUpdateParams: [sunTimeline],
    onComplete: swapFromSunToMoon,
    onCompleteParams: [sunElement, timeData],
  });

  sunTimeline.progress(0);

  // Separate timeline due to progress being set above
  // in turn cancelling the opacity animation
  gsap.to(sunElement, {
    duration: 4,
    opacity: 1,
  });

  createSunRays();
}

function throttle(timeline) {
  if (scheduledAnimationFrame) {
    return;
  }

  scheduledAnimationFrame = true;

  setTimeout(() => checkProgress(timeline), 300);
}

function checkProgress(timeline) {
  scheduledAnimationFrame = false;

  const progress = timeline.progress();

  if (progress < 0.5) {
    changeBackgroundColor(1 + (progress + 0.5) * -1);
  } else if (progress < 1) {
    changeBackgroundColor(progress - 0.5);
  }
}

function changeBackgroundColor(progress) {
  animatedBackgroundElement.style.setProperty("--colorOpacity", progress);
}

function createSunRays() {
  const sunElement = document.querySelector(".sun");

  let rotationDegree = 10;
  let stronger = 1;

  for (let i = 0; i < 36; i++) {
    const rayElement = document.createElement("div");
    rayElement.classList.add("sun-ray");

    rayElement.style.transform = `rotate(${rotationDegree}deg)`;
    rayElement.style.opacity = random(0.02, 0.07);

    if (stronger === 3) {
      stronger = 0;
      rayElement.style.opacity = random(0.1, 0.16);
      rayElement.style.width = `${random(1, 8)}px`;
      rayElement.style.setProperty("--gradientOpacity", random(0.1, 0.4));
    }

    rotationDegree += 10;
    stronger += Math.round(random(0, 1));

    sunElement.appendChild(rayElement);
  }
}

function swapFromSunToMoon(sunElement, timeData) {
  gsap.killTweensOf(sunElement);
  sunElement.remove();

  createMoon(timeData);
}
