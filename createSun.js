const sunElement = document.querySelector(".sun");

export function moveSun(timeData) {
  const sunTimeline = gsap.timeline();

  const sunriseTimeInDecimals =
    timeData.sunriseTime.slice(0, 2) + "." + timeData.sunriseTime.slice(3);
  let sunsetTimeInDecimals =
    timeData.sunsetTime.slice(0, 2) + "." + timeData.sunsetTime.slice(3);

  // Accounts for the times where the location sunset is past 24:00
  if (sunsetTimeInDecimals.charAt(0) === "0") {
    sunsetTimeInDecimals = Number(sunsetTimeInDecimals) + 24;
  }

  const currentTime = timeData.currentTime;
  const amountOfSunshine = sunsetTimeInDecimals - sunriseTimeInDecimals;
  const timeSinceSunrise = currentTime - sunriseTimeInDecimals;
  const currentSunPosition = timeSinceSunrise / amountOfSunshine;

  console.log(
    sunriseTimeInDecimals,
    sunsetTimeInDecimals,
    currentTime,
    currentSunPosition
  );

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  sunTimeline.set(sunElement, {
    x: 0 - sunElement.offsetWidth / 2,
    y: windowHeight + sunElement.offsetHeight,
  });

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

  const path = [
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
    duration: 10000,
    ease: "none",
  });

  sunTimeline.progress(currentSunPosition);
  setInterval(() => {
    //console.log(sunTimeline.progress())
  }, 10);
}

function createRays() {
  const uvIndex = 2;

  for (let i = 0; i < uvIndex * 5; i++) {
    const rayElement = document.createElement("div");

    rayElement.classList.add("ray");

    sunElement.appendChild(rayElement);
  }
}
