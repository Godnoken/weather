import { changeLocation } from "./apiCalls.js";

gsap.registerPlugin(MotionPathPlugin);

const locationInputElement = document.querySelector(".location-input");
locationInputElement.addEventListener("change", changeLocation);

export let global = {
    amountOfCloudsOnScreen: 0,
    amountOfRainOnScreen: 0,
    amountOfRaindropsOnScreen: 0
}