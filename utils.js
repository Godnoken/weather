export function removeAllElementChildren(element) {
  element.replaceChildren();
}

export const random = gsap.utils.random;

export function getHoursAndMinutesFromUnix(unix) {

  const date = new Date(unix * 1000);

  return date.toLocaleString([], {hour: "2-digit", minute: "2-digit", hour12: false});
}