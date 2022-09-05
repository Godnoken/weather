import { convertDurationtoSeconds } from "./utils.js";

//const sunElement = document.querySelector(".sun");
const animatedBackgroundElement = document.querySelector(".animated-background")

export function createSun(timeData) {
  const sunElement = document.createElement("div");
  sunElement.classList.add("sun");
  
  const sunriseTimeInSeconds = convertDurationtoSeconds(timeData.sunriseTime);
  const sunsetTimeInSeconds = convertDurationtoSeconds(timeData.sunsetTime, true);
  const currentTimeInSeconds = timeData.sunriseTime > timeData.currentTime ? convertDurationtoSeconds(timeData.currentTime, true) : convertDurationtoSeconds(timeData.currentTime);

  const secondsSinceSunrise = Math.max(currentTimeInSeconds, sunriseTimeInSeconds) - Math.min(currentTimeInSeconds, sunriseTimeInSeconds);
  const secondsOfSunshine = Math.max(sunsetTimeInSeconds, sunriseTimeInSeconds) - Math.min(sunsetTimeInSeconds, sunriseTimeInSeconds);
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
    opacity: 0
  });

  const path = [
    {
      x: 0 - sunElementWidth / 2,
      y: windowHeight + sunElementHeight
    },
    { x: windowWidth - windowWidth / 1.25, y: windowHeight / 3 },
    { x: windowWidth / 2 - sunElementWidth, y: windowHeight / 10 },
    { x: windowWidth / 1.25 - sunElementWidth, y: windowHeight / 3 },
    {
      x: windowWidth - sunElementWidth / 2,
      y: windowHeight + sunElementHeight / 2,
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
    onComplete: swapFromSunToMoon,
    onCompleteParams: [sunElement, timeData]
  }, 0);


  sunTimeline.progress(currentSunPosition);

  // Separate timeline due to progress being set above
  // in turn cancelling the opacity animation
  gsap.to(sunElement, {
    duration: 4,
    opacity: 1
  })


  createSunRays();

  const rays = document.querySelectorAll(".ray");
  function isEven(n) {
    return n % 2 == 0;
  }

  for (var i = 0; i < rays.length; i++) {
    const thisRand = Math.floor(Math.random() * 100) + 10;
    let thisRotation = 360;

    if (isEven(i)) {
      thisRotation = -360;
    }

    const tl = gsap.timeline({ repeat: -1 });
    tl.from(rays[i], 0, {
      rotation: 0,
      scale: 1,
    }).to(rays[i], thisRand, {
      rotation: thisRotation,
      scale: 2,
    });
  }
}

function createSunRays() {
  const sunElement = document.querySelector(".sun");

  const uvIndex = 2;

  for (let i = 0; i < uvIndex * 5; i++) {
    const rayElement = document.createElement("div");

    rayElement.classList.add("ray");

    sunElement.appendChild(rayElement);
  }
}


function swapFromSunToMoon(sunElement, timeData) {
  gsap.killTweensOf(sunElement);
  sunElement.remove();

  createMoon(timeData);
}

export function createMoon(timeData) {
  const moonElement = document.createElement("div");
  moonElement.classList.add("moon");

  
  const sunriseTimeInSeconds = convertDurationtoSeconds(timeData.sunriseTime);
  const sunsetTimeInSeconds = convertDurationtoSeconds(timeData.sunsetTime, true);
  const currentTimeInSeconds = convertDurationtoSeconds(timeData.currentTime, true);
  
  const secondsSinceSunset = Math.max(currentTimeInSeconds, sunsetTimeInSeconds) - Math.min(currentTimeInSeconds, sunsetTimeInSeconds);
  const secondsOfMoonlight = Math.max(sunsetTimeInSeconds, sunriseTimeInSeconds) - Math.min(sunsetTimeInSeconds, sunriseTimeInSeconds);
  const currentMoonPosition = secondsSinceSunset / secondsOfMoonlight;

  if (currentMoonPosition >= 1) {
    createMoon(timeData);
    return;
  }

  animatedBackgroundElement.appendChild(moonElement);
  const moonTimeline = gsap.timeline();
  
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const moonElementWidth = moonElement.offsetWidth;
  const moonElementHeight = moonElement.offsetHeight;
  
  moonTimeline.set(moonElement, {
    x: 0 - moonElementWidth / 2,
    y: windowHeight + moonElementHeight,
    opacity: 0
  });

  const path = [
    {
      x: 0 - moonElementWidth / 2,
      y: windowHeight + moonElementHeight
    },
    { x: windowWidth - windowWidth / 1.25, y: windowHeight / 3 },
    { x: windowWidth / 2 - moonElementWidth, y: windowHeight / 10 },
    { x: windowWidth / 1.25 - moonElementWidth, y: windowHeight / 3 },
    {
      x: windowWidth - moonElementWidth / 2,
      y: windowHeight + moonElementHeight,
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

  moonTimeline.to(moonElement, {
    motionPath: motionPath,
    duration: secondsOfMoonlight,
    ease: "none",
    onComplete: swapFromMoonToSun,
    onCompleteParams: [moonElement, timeData]
  }, 0);


  moonTimeline.progress(currentMoonPosition);

  // Separate timeline due to progress being set above
  // in turn cancelling the opacity animation
  gsap.to(moonElement, {
    duration: 4,
    opacity: 1
  })

  createMoonRays();

  const rays = document.querySelectorAll(".ray");
  function isEven(n) {
    return n % 2 == 0;
  }

  for (var i = 0; i < rays.length; i++) {
    const thisRand = Math.floor(Math.random() * 100) + 10;
    let thisRotation = 360;

    if (isEven(i)) {
      thisRotation = -360;
    }

    const tl = gsap.timeline({ repeat: -1 });
    tl.from(rays[i], 0, {
      rotation: 0,
      scale: 1,
    }).to(rays[i], thisRand, {
      rotation: thisRotation,
      scale: 2,
    });
  }
}

function createMoonRays() {
  const moonElement = document.querySelector(".moon");

  const uvIndex = 2;

  for (let i = 0; i < uvIndex * 5; i++) {
    const rayElement = document.createElement("div");

    rayElement.classList.add("ray");

    moonElement.appendChild(rayElement);
  }
}

function swapFromMoonToSun(moonElement, timeData) {
  gsap.killTweensOf(moonElement);
  moonElement.remove();

  createSun(timeData);
}