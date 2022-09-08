import { global } from "./index.js";
import { random } from "./utils.js";
import { createPath } from "./createSvgShapes.js";

export function createSnowfield(cloudElement, amountOfSnowflakes) {
  const snowfieldSVG = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );

  // SVG HAS to be absolute otherwise the animation jumps on DOM deletion
  snowfieldSVG.style.position = "absolute";
  snowfieldSVG.style.overflow = "visible";

  cloudElement.appendChild(snowfieldSVG);

  const cloudObject = {
    width: cloudElement.clientWidth,
    height: cloudElement.clientHeight
  }
  let amountOfSnowflakesInCloud = 0;
  global.amountOfSnowfieldsOnScreen++;

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  (async () => {
    for (let i = 0; i < Math.min(amountOfSnowflakes / 2, 5); i++) {
      if (
        amountOfSnowflakes / 2 > global.amountOfSnowflakesOnScreen &&
        global.amountOfSnowfieldsOnScreen > 0
      ) {
        createSnowflake(snowfieldSVG, cloudObject);
        global.amountOfSnowflakesOnScreen++;
        amountOfSnowflakesInCloud++;
        cloudElement.dataset.snowflakes = amountOfSnowflakesInCloud;
        await sleep(2000);
      }
    }
  })();

  return snowfieldSVG;
}

export function createSnowflake(snowfieldSVG, cloudObject) {
  const snowflakePath = createPath();

  const d = `m290 141h-25l11-12a7 7 0 1 0-11-10l-21 22h-37l16-18a8 8 0 0 0-4-12h-22l24-24h31a7 7 0 1 0 0-15h-16l18-18c3-3 3-8 0-11s-8-3-11 0l-18 18V46a7 7 0 1 0-15 0v30l-25 25V78l-2-5c-3-3-8-3-11 0l-16 15V53l22-21c3-3 3-8 0-11s-8-3-11 0l-11 11V8a7 7 0 1 0-15 0v24l-10-11c-3-3-8-3-11 0s-3 8 0 11l21 21v36l-16-16a7 7 0 0 0-12 4l-1 2v21L87 75V46a7 7 0 1 0-15 0v14L55 43c-3-3-7-3-10 0s-3 8 0 11l17 18H47a7 7 0 1 0 0 15h30l25 24-23 1c-4 0-7 4-7 7l-1 1h1c0 2 0 4 2 5l16 16H55l-22-22a8 8 0 0 0-10 10l11 11H9a7 7 0 1 0 0 15h25l-11 11a8 8 0 1 0 10 11l22-21h35l-15 16a8 8 0 0 0 5 13v-1 1l22-1-25 26H47a7 7 0 1 0 0 15h15l-17 17a8 8 0 0 0 5 13l5-2 17-18v16a7 7 0 1 0 15 0v-31l26-25 1 24c0 4 3 8 7 8l4-2 16-16v36l-21 21c-3 3-3 7 0 10l6 3c2 0 3-1 5-3l10-10v25a7 7 0 1 0 15 0v-26l12 11a8 8 0 0 0 10 0c3-3 3-7 0-10l-22-22v-36a5625 5625 0 0 0 23 19c4 0 7-4 7-8v-24l24 25v31a7 7 0 1 0 15 0v-16l18 18a8 8 0 0 0 11 0c3-3 3-8 0-11l-17-17h15a7 7 0 1 0 0-15h-30l-26-26 23-1a7 7 0 0 0 4-14l-14-13h35l21 21a7 7 0 0 0 11 0c3-3 3-8 0-11l-11-10h25a7 7 0 1 0 0-15zm-89-16-14 16h-20l15-16h19zm-31-29 1 20-15 14v-21l14-13zm-43 0 14 13v20l-14-14V96zm-30 30h20l14 15h-20l-14-15zm0 43 13-13h21l-14 13H97zm31 33-1-21 14-15v22l-13 14zm43-1-15-13v-22l15 14v21zm30-32h-20l-13-14h20l13 14z`;
  const fill = `rgb(${random(130, 140)}, ${random(200, 210)}, ${random(
    230,
    255
  )})`;
  const moveToY = random(global.backgroundHeight + 2000, global.backgroundHeight + 6000);
  const moveDuration = random(250, 500);
  const delay = random(4, 20);

  const timeline = gsap.timeline();

  timeline.set(snowflakePath, {
    attr: { d: d },
    fill: fill,
    opacity: 0,
    x: random(cloudObject.width / 4, cloudObject.width - cloudObject.width / 4),
    y: random(
      cloudObject.height - cloudObject.height / 4,
      cloudObject.height + cloudObject.height / 4
    ),
    scale: global.mobile ? 0.03 : 0.1,
  });

  timeline.to(snowflakePath, {
    duration: 3,
    opacity: 1,
  });

  timeline.to(
    snowflakePath,
    {
      y: `+=${moveToY}`,
      duration: moveDuration,
      rotation: random(-6000, 6000),
      ease: "none",
    },
    0
  );

  timeline.to(
    snowflakePath,
    {
      delay: delay,
      opacity: 0,
      duration: 2,
      onComplete: respawnSnowflake,
    },
    0
  );

  snowfieldSVG.appendChild(snowflakePath);

  function respawnSnowflake() {
    const snowfieldSVG = snowflakePath.parentElement;
    timeline.killTweensOf(snowflakePath);
    snowflakePath.remove();
    createSnowflake(snowfieldSVG, cloudObject);
  }
}
