const locationInputElement = document.querySelector(".location-input");
const locationHeaderElement = document.querySelector(".weather-location");
const animatedBackgroundElement = document.querySelector(".animated-background");
const weatherDataElement = document.querySelector(".weather-data-container");
const weatherDescriptionElement = document.querySelector(".weather-description");
const weatherActualTemperatureElement = document.querySelector(".weather-actual-temperature");
const weatherFeelsLikeElement = document.querySelector(".weather-feels-like");
const weatherWindSpeedElement = document.querySelector(".weather-wind-speed");
const weatherPrecipitationElement = document.querySelector(".weather-precipitation");
const weatherHumidityElement = document.querySelector(".weather-humidity");
const weatherErrorElement = document.querySelector(".weather-error");

locationInputElement.addEventListener("change", changeLocation);

const random = gsap.utils.random;

let amountOfCloudsOnScreen = 0;

async function getCoordinatesData(location) {
    try {
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=61d324f1999587686e64cc75ed85aad0`);
        const data = await response.json();

        if (data.length === 0) throw 'Location not found. Maybe you spelt it wrong?';
        else return data;
    }
    catch(error) {
        console.log(error);

        weatherErrorElement.textContent = error;

        weatherDataElement.style.opacity = 0;
        weatherErrorElement.style.opacity = 1;
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

        weatherErrorElement.textContent = "Something went wrong.. maybe the API hit its limit. Try again tomorrow."

        weatherDataElement.style.opacity = 0;
        weatherErrorElement.style.opacity = 1;
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
    weatherPrecipitationElement.textContent = Math.floor(data.hourly[0].pop * 100) + " %";

    weatherDataElement.style.opacity = 1;
    weatherErrorElement.style.opacity = 0;

    displayWeatherAnimation(data);
}


function displayWeatherAnimation(data) {

    svgData = {
        amountOfClouds: data.current.clouds,
        amountOfRain: data.hourly[0].pop * 100
    }

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

   
   createSVGShapes(svgData);
}


function createSVGShapes(svgData) {
    
    createClouds(svgData.amountOfClouds);

    setInterval(() => {
        createClouds(svgData.amountOfClouds);
    }, 8000);
}

function createClouds(amountOfClouds) {
    
    // Creates clouds based on percentage of the sky that is filled with clouds, divided by a number
    // as to not impact performance too much
    for (let i = amountOfCloudsOnScreen; i < amountOfClouds / 5; i++) {

        let randomGrayValue = random(140, 190);
        let fill = `rgb(${randomGrayValue}, ${randomGrayValue}, ${randomGrayValue})`;

        const x = random(0, window.innerWidth);
        const y = random(0, window.innerHeight);
        const moveToX = -window.innerWidth + random(0, window.innerWidth) * 2;
        const moveToY = -window.innerHeight + random(0, window.innerHeight) * 2
        const duration = random(100, 300);
        const delay = random(8, 120);

        const baseCloudObject = {
            x: x,
            y: y,
            rx: 40,
            width: random(160, 300),
            height: random(40, 80),
            moveToX: moveToX,
            moveToY: moveToY,
            duration: duration,
            delay: delay,
            fill: fill
        }

        for (let j = 0; j < 6; j++) {
            let randomGrayValue = random(140, 190);
            let fill = `rgb(${randomGrayValue}, ${randomGrayValue}, ${randomGrayValue})`;

            const extraCloud = createEllipse({
                x: x + random(-baseCloudObject.width / 4, baseCloudObject.width / 4),
                y: y + random(-35, -50),
                rx: random(30, 60),
                ry: random(30, 60),
                moveToX: moveToX,
                moveToY: moveToY,
                duration: duration,
                delay: delay,
                fill: fill
            });

            animatedBackgroundElement.appendChild(extraCloud);
        }
        
        const baseCloud = createRect(baseCloudObject);

        animatedBackgroundElement.appendChild(baseCloud);
        amountOfCloudsOnScreen++;

        // Removes cloud from count after it is fully transparent & removed
        // so that we can create a new cloud
        setTimeout(() => {
            amountOfCloudsOnScreen--;
        }, delay * 1000 + 8000);
    }

    
}

function createRect(rect) {

    const newRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

    const timeline = gsap.timeline();

    // Initializes position, size, color etc
    timeline.set(newRect, {
        x: rect.x - rect.width / 2,
        y: rect.y - rect.height / 2,
        rx: rect.rx,
        ry: rect.rx,
        width: rect.width,
        height: rect.height,
        fill: rect.fill,
        opacity: 0,
    });

    // Makes new rect fully visible after 8 seconds
    timeline.to(newRect, {
        duration: 8,
        opacity: 1,
    });

    // Rects move to random destination
    timeline.to(newRect, {
        x: `+=${rect.moveToX}`,
        y: `+=${rect.moveToY}`,
        duration: rect.duration,
        ease: "none",
    }, 0);

    // Sets opacity to 0 after delay and deletes rect on animation completion
    timeline.to(newRect, {
        delay: rect.delay,
        opacity: 0,
        duration: 8,
        onComplete: removeSVGShape,
        onCompleteParams: [newRect]
    }, 0);

    return newRect;
}


function createEllipse(ellipse) {

    const newEllipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");

    const timeline = gsap.timeline();

    // Initializes position, size, color etc
    timeline.set(newEllipse, {
        cx: ellipse.x,
        cy: ellipse.y,
        rx: ellipse.rx,
        ry: ellipse.ry,
        fill: ellipse.fill,
        opacity: 0,
    });

    // Makes new ellipse fully visible after 8 seconds
    timeline.to(newEllipse, {
        duration: 8,
        opacity: 1,
    });

    // Ellipse move to random destination
    timeline.to(newEllipse, {
        x: `+=${ellipse.moveToX}`,
        y: `+=${ellipse.moveToY}`,
        duration: ellipse.duration,
        ease: "none",
    }, 0);

    // Sets opacity to 0 after delay and deletes rect on animation completion
    timeline.to(newEllipse, {
        delay: ellipse.delay,
        opacity: 0,
        duration: 8,
        onComplete: removeSVGShape,
        onCompleteParams: [newEllipse]
    }, 0);

    return newEllipse;
}


const removeSVGShape = (shape) => {
    shape.remove();
}