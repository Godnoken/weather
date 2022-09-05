export function removeAllElementChildren(element) {
  element.replaceChildren();
}

export const random = gsap.utils.random;


export function convertUnixSecondsToHoursAndMinutes(unix) {

  const date = new Date(unix * 1000);

  return date.getUTCHours() + ":" + date.getUTCMinutes();
}

export function getSecondsFromUnix(unix) {

  const date = new Date(unix * 1000);

  return date.toLocaleString([], {second: "numeric"});
}

export function convertDurationtoSeconds(duration, add24Hours){
  console.log(duration)
  let [hours, minutes] = duration.split(':');

  if (add24Hours === true && hours.charAt(0) === "0" || add24Hours === true && hours.length === 1) {
    hours = Number(hours) + 24;
  }

  return Number(hours) * 60 * 60 + Number(minutes) * 60;
};