import { displayWeatherData } from "./displayWeather.js";

const weatherErrorElement = document.querySelector(".weather-error");
const weatherDataElement = document.querySelector(".weather-data-container");

async function getCoordinatesData(location) {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=61d324f1999587686e64cc75ed85aad0`, {mode: "cors"}
    );
    const data = await response.json();

    if (data.length === 0)
      throw "Location not found. Maybe you spelt it wrong?";
    else return data;
  } catch (error) {
    console.log(error);

    weatherErrorElement.textContent = error;

    weatherDataElement.style.opacity = 0;
    weatherErrorElement.style.opacity = 1;
  }
}

async function getWeatherData(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,daily,alerts&units=metric&appid=61d324f1999587686e64cc75ed85aad0` {mode: "cors"}
    );
    const data = await response.json();

    return data;
  } catch (error) {
    console.log("Couldn't get the weather data", error);

    weatherErrorElement.textContent =
      "Something went wrong.. maybe the API hit its limit. Try again tomorrow.";

    weatherDataElement.style.opacity = 0;
    weatherErrorElement.style.opacity = 1;
  }
}

export async function changeLocation(event) {
  const coordinatesData = await getCoordinatesData(event.target.value);
  const weatherData = await getWeatherData(
    coordinatesData[0].lat,
    coordinatesData[0].lon
  );

  console.log(weatherData);
  displayWeatherData(weatherData);
}
