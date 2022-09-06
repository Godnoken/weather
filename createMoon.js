import { convertDurationtoSeconds } from "./utils.js";
import { createSun } from "./createSun.js";

const animatedBackgroundElement = document.querySelector(".animated-background")

export function createMoon(timeData) {
    const moonElement = document.createElement("div");
    moonElement.classList.add("moon");
  
    animatedBackgroundElement.style.backgroundColor = "black";
  
    const sunriseTimeInSeconds = convertDurationtoSeconds(timeData.sunriseTime, true);
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
    
    moonTimeline.set(moonElement, {
      x: 0 - moonElementWidth / 2,
      y: windowHeight,
      opacity: 0
    });
  
    const path = [
      {
        x: 0 - moonElementWidth / 2,
        y: windowHeight
      },
      { x: windowWidth - windowWidth / 1.25, y: windowHeight / 3 },
      { x: windowWidth / 2 - moonElementWidth, y: windowHeight / 10 },
      { x: windowWidth / 1.25 - moonElementWidth, y: windowHeight / 3 },
      {
        x: windowWidth - moonElementWidth / 2,
        y: windowHeight,
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
  }
  
  function swapFromMoonToSun(moonElement, timeData) {
    gsap.killTweensOf(moonElement);
    moonElement.remove();
  
    createSun(timeData);
  }