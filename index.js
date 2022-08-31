const locationInputElement = document.querySelector("input");
const locationHeaderElement = document.querySelector(".weather-location");
const weatherDataElement = document.querySelector(".weather-data-container");
const weatherDescriptionElement = document.querySelector(".weather-description");
const weatherActualTemperatureElement = document.querySelector(".weather-actual-temperature");
const weatherFeelsLikeElement = document.querySelector(".weather-feels-like");
const weatherWindSpeedElement = document.querySelector(".weather-wind-speed");
const weatherPrecipitationElement = document.querySelector(".weather-precipitation");
const weatherHumidityElement = document.querySelector(".weather-humidity");

locationInputElement.addEventListener("change", changeLocation);


async function getCoordinatesData(location) {
    try {
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=61d324f1999587686e64cc75ed85aad0`);
        const data = await response.json();
    
        return data;
    }
    catch(error) {
        console.log("Couldn't get the coordinates", error);
    }
}


async function getWeatherData(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,daily,alerts&units=metric&appid=61d324f1999587686e64cc75ed85aad0`);
        const data = await response.json();
        
        return data;
    }
    catch(error) {
        console.log("Couldn't get the weather data", error);
    }
}


async function changeLocation(event) {
    const coordinatesData = await getCoordinatesData(event.target.value);
    const weatherData = await getWeatherData(coordinatesData[0].lat, coordinatesData[0].lon);

    console.log(weatherData);
    displayWeatherData(weatherData);
}

function displayWeatherData(data) {
    locationHeaderElement.textContent = locationInputElement.value.toUpperCase();
    weatherDescriptionElement.textContent = data.current.weather[0].description.toUpperCase();
    weatherActualTemperatureElement.textContent = data.current.temp;
    weatherFeelsLikeElement.innerText = data.current.feels_like;
    weatherWindSpeedElement.textContent = data.current.wind_speed + " m/s";
    weatherHumidityElement.textContent = data.current.humidity + " %";
    weatherPrecipitationElement.textContent = data.hourly[0].pop * 100 + " %";
    weatherDataElement.style.opacity = 1;
}