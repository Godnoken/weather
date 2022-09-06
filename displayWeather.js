import { global } from "./index.js";
import { createClouds } from "./createClouds.js";
import { convertUnixSecondsToHoursAndMinutes, removeAllElementChildren } from "./utils.js";
import { createSun } from "./createSun.js";

const animatedBackgroundElement = document.querySelector(
  ".animated-background"
);
const locationInputElement = document.querySelector(".location-input");
const locationHeaderElement = document.querySelector(".weather-location");
const weatherDataElement = document.querySelector(".weather-data-container");
const weatherDescriptionElement = document.querySelector(
  ".weather-description"
);
const weatherActualTemperatureElement = document.querySelector(
  ".weather-actual-temperature"
);
const weatherFeelsLikeElement = document.querySelector(".weather-feels-like");
const weatherWindSpeedElement = document.querySelector(".weather-wind-speed");
const weatherPrecipitationElement = document.querySelector(
  ".weather-precipitation"
);
const weatherHumidityElement = document.querySelector(".weather-humidity");
const weatherErrorElement = document.querySelector(".weather-error");

export function displayWeatherData(data) {
  locationHeaderElement.textContent = locationInputElement.value.toUpperCase();
  weatherDescriptionElement.textContent =
    data.current.weather[0].description.toUpperCase();
  weatherActualTemperatureElement.textContent = data.current.temp;
  weatherFeelsLikeElement.innerText = data.current.feels_like;
  weatherWindSpeedElement.textContent = data.current.wind_speed + " m/s";
  weatherHumidityElement.textContent = data.current.humidity + " %";
  weatherPrecipitationElement.textContent =
    Math.floor(data.hourly[0].pop * 100) + " %";

  weatherDataElement.style.opacity = 1;
  weatherErrorElement.style.opacity = 0;

  displayWeatherAnimation(data);
}

function displayWeatherAnimation(data) {
  const svgData = {
    amountOfClouds: data.current.clouds,
    amountOfRainfields: data.hourly[0].pop * 10,
    amountOfRaindrops: data.hourly[0].pop * 100,
  };

  /*
      switch (data.current.weather[0].main) {
          case "Clouds":
              
              break;
          case "Rain":
              
              break;
          case "Thunderstorm":
              
              break;
          case "Drizzle":
              d
              break;
          case "Snow":
              
              break;
          case "Atmosphere":
              
              break;
          case "Clear":
              
              break;
      }
      */

  // Debugging

  /*
  setInterval(() => {
    console.log(
      global.amountOfRaindropsOnScreen,
      global.amountOfRainOnScreen,
      global.amountOfCloudsOnScreen
    );
  }, 100);
 */


  const timeData = {
    sunriseTime: convertUnixSecondsToHoursAndMinutes(data.current.sunrise + data.timezone_offset),
    sunsetTime: convertUnixSecondsToHoursAndMinutes(data.current.sunset + data.timezone_offset),
    currentTime: convertUnixSecondsToHoursAndMinutes((new Date().getTime() / 1000) + data.timezone_offset)
  }



  // Kill all tweens before removing the DOM elements
  killAllTweens();

  // Clear all remaining SVG's and set counts back to 0
  removeAllElementChildren(animatedBackgroundElement);
  resetAllSVGCounts();

  createSun(timeData);

  // Create new location's SVG shapes
  createSVGShapes(svgData);


}

function resetAllSVGCounts() {
  global.amountOfCloudsOnScreen = 0;
  global.amountOfRainOnScreen = 0;
  global.amountOfRaindropsOnScreen = 0;
}

function createSVGShapes(svgData) {
  createClouds(
    svgData.amountOfClouds,
    svgData.amountOfRainfields,
    svgData.amountOfRaindrops
  );
}

function killAllTweens() {
  const cloudElementContainer = document.querySelector(".clouds");

  if (cloudElementContainer) {
    for (let i = 0; i < cloudElementContainer.children.length; i++) {
      gsap.killTweensOf(cloudElementContainer.children[i]);
    }
  }

  const sunElement = document.querySelector(".sun");
  const moonElement = document.querySelector(".moon");

  if (sunElement) {
    gsap.killTweensOf(sunElement);
  }
  else if (moonElement) {
    gsap.killTweensOf(moonElement);
  }

}