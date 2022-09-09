import { changeLocation } from "./apiCalls.js";

gsap.registerPlugin(MotionPathPlugin);

const backgroundElement = document.querySelector(".background");
const locationInputElement = document.querySelector(".location-input");
locationInputElement.addEventListener("change", changeLocation);

export let global = {
  mobile: navigator.maxTouchPoints > 0 ? true : false,
  amountOfCloudsOnScreen: 0,
  amountOfRainOnScreen: 0,
  amountOfRaindropsOnScreen: 0,
  amountOfSnowfieldsOnScreen: 0,
  amountOfSnowflakesOnScreen: 0,
  backgroundWidth: backgroundElement.clientWidth,
  backgroundHeight: backgroundElement.clientHeight,
};
