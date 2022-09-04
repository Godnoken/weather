//const sunElement = document.querySelector(".sun");
const animatedBackgroundElement = document.querySelector(".animated-background")

export function moveSun(timeData) {
  const sunElement = document.createElement("div");
  sunElement.classList.add("sun");

  

  const sunTimeline = gsap.timeline();

  const sunriseTimeInDecimals =
    timeData.sunriseTime.slice(0, 2) + "." + timeData.sunriseTime.slice(3);
  let sunsetTimeInDecimals =
    timeData.sunsetTime.slice(0, 2) + "." + timeData.sunsetTime.slice(3);

  // Accounts for the times where the location sunset is past 24:00
  if (sunsetTimeInDecimals.charAt(0) === "0") {
    sunsetTimeInDecimals = Number(sunsetTimeInDecimals) + 24;
  }

  const currentTimeInDecimals = timeData.currentTime;
  const hoursOfSunshine = sunsetTimeInDecimals - sunriseTimeInDecimals;
  const hoursSinceSunrise = currentTimeInDecimals - sunriseTimeInDecimals;
  const timeUntilSunsetInSeconds = (sunsetTimeInDecimals - currentTimeInDecimals) * 3600;
  const currentSunPosition = hoursSinceSunrise / hoursOfSunshine;

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  sunTimeline.set(sunElement, {
    x: 0 - sunElement.offsetWidth / 2,
    y: windowHeight + sunElement.offsetHeight,
    opacity: 0
  });
  




  const path = [
    {
      x: 0 - sunElement.offsetWidth / 2,
      y: windowHeight + sunElement.offsetHeight
    },
    { x: windowWidth - windowWidth / 1.25, y: windowHeight / 3 },
    { x: windowWidth / 2 - sunElement.offsetWidth, y: windowHeight / 10 },
    { x: windowWidth / 1.25 - sunElement.offsetWidth, y: windowHeight / 3 },
    {
      x: windowWidth - sunElement.offsetWidth / 2,
      y: windowHeight + sunElement.offsetHeight,
    },
  ];

  const motionPath = {
    path: path,
    curviness: 1.5,
  };

  let rawPath = MotionPathPlugin.getRawPath(path),
    point;

  MotionPathPlugin.cacheRawPathMeasurements(rawPath);

  point = MotionPathPlugin.getPositionOnPath(rawPath, 0.5, true);

  sunTimeline.to(sunElement, {
    motionPath: motionPath,
    duration: timeUntilSunsetInSeconds,
    ease: "none",
  }, 0);
  
  
  sunTimeline.progress(currentSunPosition);

  // Separate timeline due to progress being set above
  // in turn cancelling the opacity animation
  gsap.to(sunElement, {
    duration: 4,
    opacity: 1
  })


  animatedBackgroundElement.appendChild(sunElement);

  createRays();

  const rays = document.querySelectorAll(".ray");
  function isEven(n) {
    return n % 2 == 0;
  }

  for (var i = 0; i < rays.length; i++) {
    const thisRand = Math.floor(Math.random() * 100) + 10;
    let thisRotation = 360;

    if (isEven(i)) {
      thisRotation = -360;
    }

    const tl = gsap.timeline({ repeat: -1 });
    tl.from(rays[i], 0, {
      rotation: 0,
      scale: 1,
    }).to(rays[i], thisRand, {
      rotation: thisRotation,
      scale: 2,
    });
  }
}

function createRays() {
  const sunElement = document.querySelector(".sun");

  const uvIndex = 2;

  for (let i = 0; i < uvIndex * 5; i++) {
    const rayElement = document.createElement("div");

    rayElement.classList.add("ray");

    sunElement.appendChild(rayElement);
  }
}
