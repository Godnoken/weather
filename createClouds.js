import { global } from "./index.js";
import { random } from "./utils.js";
import { createEllipse, createRect } from "./createSvgShapes.js";
import { createRainfield } from "./createRain.js";

const animatedBackgroundElement = document.querySelector(
  ".animated-background"
);

export function createClouds(
  amountOfClouds,
  amountOfRainfields,
  amountOfRaindrops
) {
  const cloudElementContainer = document.querySelector(".clouds");

  // Creates clouds based on percentage of the sky that is filled with clouds, divided by a number
  // as to not impact performance too much
  for (let i = global.amountOfCloudsOnScreen; i < amountOfClouds / 5; i++) {
    const newSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    // SVG HAS to be absolute otherwise the animation jumps on DOM deletion
    newSvg.style.position = "absolute";

    // So raindrops can be rendered
    newSvg.style.overflow = "visible";

    const timeline = gsap.timeline();

    let randomGrayValue = random(150, 190);
    let fill = `rgb(${randomGrayValue}, ${randomGrayValue}, ${randomGrayValue})`;

    const width = 400;
    const height = 200;
    const x = random(width, window.innerWidth);
    const y = random(height, window.innerHeight);
    const moveToX = -window.innerWidth + random(0, window.innerWidth) * 2;
    const moveToY = -window.innerHeight + random(0, window.innerHeight) * 2;
    const duration = random(200, 1000);
    const delay = random(8, 120);

    // Initializes position, size, color etc
    timeline.set(newSvg, {
      x: x - width,
      y: y - height,
      width: width,
      height: height,
      fill: fill,
      opacity: 0,
    });

    // Makes new svg fully visible after 8 seconds
    timeline.to(newSvg, {
      duration: 8,
      opacity: 1,
    });

    // Svg moves to random destination
    timeline.to(
      newSvg,
      {
        x: `+=${moveToX}`,
        y: `+=${moveToY}`,
        duration: duration,
        ease: "none",
      },
      0
    );

    // Sets opacity to 0 after delay and deletes svg on animation completion
    timeline.to(
      newSvg,
      {
        delay: delay,
        opacity: 0,
        duration: 8,
        onComplete: destroy,
      },
      0
    );

    const baseCloudWidth = random(160, 300);
    const baseCloudHeight = random(40, 80);

    const baseCloudObject = {
      x: 0 + (width - baseCloudWidth) / 2,
      y: height - baseCloudHeight,
      rx: 40,
      ry: 40,
      width: baseCloudWidth,
      height: baseCloudHeight,
      fill: fill,
    };

    for (let j = 0; j < 6; j++) {
      let randomGrayValue = random(150, 190);
      let fill = `rgb(${randomGrayValue}, ${randomGrayValue}, ${randomGrayValue})`;

      const cloudRy = random(30, 60);

      const extraCloud = createEllipse({
        x: 0 + random(125, 275),
        y: 180 - cloudRy,
        rx: random(30, 60),
        ry: cloudRy,
        fill: fill,
      });

      newSvg.appendChild(extraCloud);
    }

    const baseCloud = createRect(baseCloudObject);

    animatedBackgroundElement.appendChild(cloudElementContainer);
    cloudElementContainer.appendChild(newSvg);
    newSvg.appendChild(baseCloud);
    global.amountOfCloudsOnScreen++;

    if (amountOfRainfields > global.amountOfRainOnScreen || amountOfRainfields > 0 && global.amountOfRainOnScreen === 0) {
      createRainfield(newSvg, amountOfRaindrops);
      newSvg.dataset.rainfield = true;
    }

    function destroy() {
      timeline.killTweensOf(newSvg);
      newSvg.remove();
      global.amountOfCloudsOnScreen--;

      if (newSvg.dataset.rainfield) {
        global.amountOfRainOnScreen--;
        global.amountOfRaindropsOnScreen -= newSvg.dataset.raindrops;
      }
    }
  }
}
