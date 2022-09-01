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

    let randomGrayValue = random(140, 190);
    let fill = `rgb(${randomGrayValue}, ${randomGrayValue}, ${randomGrayValue})`;

    const x = random(0, window.innerWidth);
    const y = random(0, window.innerHeight);
    const moveToX = -window.innerWidth + random(0, window.innerWidth) * 2;
    const moveToY = -window.innerHeight + random(0, window.innerHeight) * 2;
    const duration = random(200, 1000);
    const delay = random(8, 120);

    // Initializes position, size, color etc
    timeline.set(newSvg, {
      x: x - 200,
      y: y - 100,
      width: 400,
      height: 200,
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

    const baseCloudObject = {
      x: x,
      y: y,
      rx: 40,
      width: random(160, 300),
      height: random(40, 80),
      fill: fill,
    };

    for (let j = 0; j < 6; j++) {
      let randomGrayValue = random(140, 190);
      let fill = `rgb(${randomGrayValue}, ${randomGrayValue}, ${randomGrayValue})`;

      const extraCloud = createEllipse(
        {
          x: x + random(-baseCloudObject.width / 4, baseCloudObject.width / 4),
          y: y + random(-35, -50),
          rx: random(30, 60),
          ry: random(30, 60),
          fill: fill,
        },
        timeline
      );

      newSvg.appendChild(extraCloud);
    }

    const baseCloud = createRect(baseCloudObject, timeline);

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
