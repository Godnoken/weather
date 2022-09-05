import { changeLocation } from "./apiCalls.js";

gsap.registerPlugin(MotionPathPlugin);

const locationInputElement = document.querySelector(".location-input");
locationInputElement.addEventListener("change", changeLocation);

let amountOfCloudsOnScreen = 0;
let amountOfRainOnScreen = 0;
let amountOfRaindropsOnScreen = 0;

export let global = {
    amountOfCloudsOnScreen: amountOfCloudsOnScreen,
    amountOfRainOnScreen: amountOfRainOnScreen,
    amountOfRaindropsOnScreen: amountOfRaindropsOnScreen
}