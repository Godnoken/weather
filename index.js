import { changeLocation } from "./apiCalls.js";

const locationInputElement = document.querySelector(".location-input");
locationInputElement.addEventListener("change", changeLocation);

let amountOfCloudsOnScreen = 0;

export let global = {
    amountOfCloudsOnScreen: amountOfCloudsOnScreen
}