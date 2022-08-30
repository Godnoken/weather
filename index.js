const locationInput = document.querySelector("input");

locationInput.addEventListener("change", changeLocation);


async function getCoordinatesData(location) {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=61d324f1999587686e64cc75ed85aad0`);
    const data = await response.json();

    return data;
}


async function getWeatherData(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=61d324f1999587686e64cc75ed85aad0`);
    const data = await response.json();

    return data;
}


async function changeLocation(event) {
    const coordinatesData = await getCoordinatesData(event.target.value);
    const weatherData = await getWeatherData(coordinatesData[0].lat, coordinatesData[0].lon);

    console.log(weatherData);
}