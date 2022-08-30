async function getWeatherData() {
    const response = await fetch("https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=61d324f1999587686e64cc75ed85aad0");
    const data = await response.json();

    console.log(data)

    return data;
}

getWeatherData();