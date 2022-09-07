import { global } from "./index.js";
import { createClouds } from "./createClouds.js";
import {
  convertUnixSecondsToHoursAndMinutes,
  removeAllElementChildren,
} from "./utils.js";
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

export function displayWeather(data) {
  const cloudData = {
    amountOfClouds: data.current.clouds,
    amountOfRainfields: data.hourly[0].pop * 10,
    amountOfRaindrops: data.hourly[0].pop * 100,
  };

  const timeData = {
    sunriseTime: convertUnixSecondsToHoursAndMinutes(
      data.current.sunrise + data.timezone_offset
    ),
    sunsetTime: convertUnixSecondsToHoursAndMinutes(
      data.current.sunset + data.timezone_offset
    ),
    currentTime: convertUnixSecondsToHoursAndMinutes(
      new Date().getTime() / 1000 + data.timezone_offset
    ),
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

  const moonElement = document.querySelector(".moon");
  const sunElement = document.querySelector(".sun");

  // Checks if moon or sun already exists so we can do a smooth transition
  if (moonElement || sunElement) {
    gsap.to(animatedBackgroundElement, {
      duration: 2,
      opacity: 0,
      onComplete: initiateNewLocation,
      onCompleteParams: [timeData, cloudData],
    });

    fadeWeatherData(2, data);

    gsap.to(animatedBackgroundElement, {
      delay: 2,
      duration: 2,
      opacity: 1,
    });
  } else {
    createSun(timeData);
    createClouds(
      cloudData.amountOfClouds,
      cloudData.amountOfRainfields,
      cloudData.amountOfRaindrops
    );
    fadeWeatherData(0, data);
  }
}

function displayWeatherData(data) {
  locationHeaderElement.textContent = locationInputElement.value.toUpperCase();
  weatherDescriptionElement.textContent =
    data.current.weather[0].description.toUpperCase();
  weatherActualTemperatureElement.textContent = data.current.temp;
  weatherFeelsLikeElement.innerText = data.current.feels_like;
  weatherWindSpeedElement.textContent = data.current.wind_speed + " m/s";
  weatherHumidityElement.textContent = data.current.humidity + " %";
  weatherPrecipitationElement.textContent =
    Math.floor(data.hourly[0].pop * 100) + " %";
}

function fadeWeatherData(duration, data) {
  gsap.to(weatherDataElement, {
    duration: duration,
    opacity: 0,
    onComplete: displayWeatherData,
    onCompleteParams: [data]
  });

  gsap.to(weatherDataElement, {
    delay: duration,
    duration: 2,
    opacity: 1,
  });
}

function initiateNewLocation(timeData, cloudData) {
  // Kill all tweens before removing the DOM elements
  killAllTweens();

  // Clear all remaining SVG's and set counts back to 0
  removeAllElementChildren(animatedBackgroundElement);
  resetAllSVGCounts();

  createSun(timeData);
  createClouds(
    cloudData.amountOfClouds,
    cloudData.amountOfRainfields,
    cloudData.amountOfRaindrops
  );
}

function resetAllSVGCounts() {
  global.amountOfCloudsOnScreen = 0;
  global.amountOfRainOnScreen = 0;
  global.amountOfRaindropsOnScreen = 0;
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
  } else if (moonElement) {
    gsap.killTweensOf(moonElement);
  }
}
