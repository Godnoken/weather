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

  const d = `${global.mobile
      ? "M11.6 5.6h-1l.4-.4a.3.3 90 1 0-.4-.4l-.8.8H8.3l.6-.7a.3.3 90 0 0-.1-.5h-1l1-1h1.3a.3.3 90 1 0 0-.5h-.7l.8-.7v-.5h-.5l-.7.7v-.6a.3.3 90 1 0-.6 0V3l-1 1V3a.3.3 0 0 0-.5 0l-.7.6V2.1l1-.8V.8c0-.2-.4 0-.5 0l-.5.5v-1a.3.3 90 1 0-.6 0v1L5.2.8h-.4v.5l.8.8v1.5L5 2.9a.3.3 90 0 0-.5.2V4l-1-1V1.8a.3.3 90 1 0-.6 0v.6l-.7-.7c-.1-.1-.3-.1-.4 0s-.1.3 0 .5l.7.7h-.6a.3.3 90 1 0 0 .6H3l1 1H3c-.1 0-.2.1-.2.3V5l.7.6H2.2l-.9-.8a.3.3 90 0 0-.4.4l.5.4h-1a.3.3 90 1 0 0 .6h1l-.5.4a.3.3 90 1 0 .4.5l.9-.9h1.4L3 7a.3.3 90 0 0 .2.5h.9l-1 1H1.9a.3.3 90 1 0 0 .6h.6l-.7.7a.3.3 90 0 0 .2.5h.2l.7-.8v.6a.3.3 90 1 0 .6 0V8.8l1-1v1l.3.3L5 9l.6-.6v1.4l-.8.8c-.1.2-.1.3 0 .4l.2.2c.1 0 .2 0 .2-.2l.4-.4v1a.3.3 90 1 0 .6 0v-1l.5.4a.3.3 90 0 0 .4 0c.1 0 .1-.2 0-.4l-.9-.8V8.3a225 225 90 0 0 1 .8l.2-.3v-1l1 1V10a.3.3 90 1 0 .6 0v-.6l.7.7a.3.3 90 0 0 .5 0v-.4L9.5 9h.6a.3.3 90 1 0 0-.6H8.9l-1-1h.9a.3.3 90 0 0 .1-.6l-.5-.6h1.4l.8.9a.3.3 90 0 0 .4 0c.2-.1.2-.3 0-.5l-.4-.4h1a.3.3 90 1 0 0-.6zM8 5l-.5.6h-.8l.6-.6H8zM6.8 3.8v.8l-.6.6v-.8l.6-.6zm-1.7 0 .5.6v.8l-.5-.6v-.8zM3.9 5h.8l.5.6h-.8L4 5zm0 1.8.5-.6h.8l-.5.6h-.8zM5 8v-.9l.5-.6v1L5 8zm1.7 0-.6-.6v-.9l.6.6V8zM8 6.7h-.8l-.5-.6h.8l.5.6z"
      : "M74.2 36.1h-6.4l2.9-3a1.8 1.8 90 1 0-2.9-2.6L62.5 36H53l4-4.6a2 2 90 0 0-1-3h-5.6l6.2-6.2h8a1.8 1.8 90 1 0 0-3.9h-4.2l4.6-4.6c.8-.7.8-2 0-2.8s-2-.8-2.8 0l-4.6 4.6v-3.8a1.8 1.8 90 1 0-3.8 0v7.7l-6.4 6.4v-6l-.6-1.2a2 2 0 0 0-2.8 0l-4 3.8v-9l5.6-5.3c.7-.8.7-2 0-2.8s-2-.8-2.8 0l-2.9 2.8V2a1.8 1.8 90 1 0-3.8 0v6.2l-2.6-2.8c-.7-.8-2-.8-2.8 0s-.7 2 0 2.8l5.4 5.4v9.2L32 18.7a1.8 1.8 90 0 0-3 1l-.3.5v5.4l-6.4-6.4v-7.4a1.8 1.8 90 1 0-3.9 0v3.6L14.1 11c-.8-.8-1.8-.8-2.6 0s-.7 2 0 2.8l4.4 4.6H12a1.8 1.8 90 1 0 0 3.9h7.7l6.4 6.1-5.9.3c-1 0-1.8 1-1.8 1.8l-.2.2h.2c0 .5 0 1 .5 1.3l4.1 4.1h-9l-5.6-5.6A2 2 90 0 0 6 33l2.8 2.8H2.3a1.8 1.8 90 1 0 0 3.9h6.4l-2.8 2.8a2 2 90 1 0 2.5 2.8l5.7-5.4h9l-4 4.1a2 2 90 0 0 1.3 3.4V47v.3L26 47l-6.4 6.7H12a1.8 1.8 90 1 0 0 3.8h4L11.5 62a2 2 90 0 0 1.3 3.3l1.3-.5 4.3-4.6v4a1.8 1.8 90 1 0 3.9 0v-7.9l6.6-6.4.3 6.2c0 1 .8 2 1.8 2l1-.5 4.1-4.1v9.2l-5.4 5.4c-.7.8-.7 1.8 0 2.6l1.6.7c.5 0 .7-.2 1.2-.7l2.6-2.6v6.4a1.8 1.8 90 1 0 3.8 0v-6.7l3.1 2.9a2 2 90 0 0 2.6 0c.7-.8.7-1.8 0-2.6l-5.7-5.6v-9.3a1440 1440 90 0 0 6 5c1 0 1.7-1.1 1.7-2.1v-6.2l6.2 6.4v8a1.8 1.8 90 1 0 3.8 0v-4.1l4.6 4.6a2 2 90 0 0 2.8 0c.8-.8.8-2 0-2.8l-4.3-4.4h3.8a1.8 1.8 90 1 0 0-3.8h-7.7L50.2 47l5.9-.3a1.8 1.8 90 0 0 1-3.5l-3.6-3.4h9l5.3 5.4a1.8 1.8 90 0 0 2.9 0c.7-.8.7-2 0-2.8l-2.9-2.6h6.4a1.8 1.8 90 1 0 0-3.8zM51.5 32l-3.6 4.1h-5.1l3.8-4.1h4.9zm-8-7.4.3 5.1-3.9 3.6v-5.4l3.6-3.3zm-11 0 3.6 3.3V33l-3.6-3.6v-4.8zm-7.7 7.7H30l3.5 3.8h-5l-3.7-3.8zm0 11 3.4-3.4h5.3L30 43.3h-5.2zm8 8.4-.3-5.4 3.6-3.8v5.6l-3.3 3.6zm11-.2L39.9 48v-5.6l3.9 3.6v5.4zm7.7-8.2h-5.2L43 39.7h5.1l3.4 3.6z"
  }`;
  const fill = `rgb(${random(130, 140)}, ${random(200, 210)}, ${random(
    230,
    255
  )})`;
  const moveToY = random(global.backgroundHeight * 2, global.backgroundHeight * 3);
  const moveDuration = random(50, 100);
  const delay = random(4, 14);

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
    // Takes the snowflake's width into consideration on spawn
    transformOrigin: "100% 100%"
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
      rotation: random(-2000, 2000),
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
