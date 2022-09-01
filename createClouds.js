import { global } from "./index.js";
import { random } from "./utils.js";
import { createEllipse, createRect } from "./createSvgShapes.js";

const animatedBackgroundElement = document.querySelector(
    ".animated-background"
  );

export function createClouds(amountOfClouds) {
  // Creates clouds based on percentage of the sky that is filled with clouds, divided by a number
  // as to not impact performance too much
  for (let i = global.amountOfCloudsOnScreen; i < amountOfClouds / 2; i++) {
    const newSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );

    // SVG HAS to be absolute otherwise the animation jumps on DOM deletion
    newSvg.style.position = "absolute";

    const timeline = gsap.timeline();

    let randomGrayValue = random(150, 190);
    let fill = `rgb(${randomGrayValue}, ${randomGrayValue}, ${randomGrayValue})`;

    const x = random(0, window.innerWidth);
    const y = random(0, window.innerHeight);
    const width = 400;
    const height = 200;
    const moveToX = -window.innerWidth + random(0, window.innerWidth) * 2;
    const moveToY = -window.innerHeight + random(0, window.innerHeight) * 2;
    const duration = random(200, 1000);
    const delay = random(8, 120);

    // Initializes position, size, color etc
    timeline.set(newSvg, {
      x: x - width / 2,
      y: y - height / 2,
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

      const cloudRy = random(30, 60)

      const extraCloud = createEllipse(
        {
          x: 0 + random(125, 275),
          y: 180 - cloudRy,
          rx: random(30, 60),
          ry: cloudRy,
          fill: fill,
        }
      );

      newSvg.appendChild(extraCloud);
    }

    const baseCloud = createRect(baseCloudObject);

    animatedBackgroundElement.appendChild(newSvg);
    newSvg.appendChild(baseCloud);
    global.amountOfCloudsOnScreen++;

    function destroy() {
      timeline.killTweensOf(newSvg);
      newSvg.remove();
      global.amountOfCloudsOnScreen--;
    }
  }
}
