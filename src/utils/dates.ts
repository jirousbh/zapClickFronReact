//date time
function toDateTime(secs: number) {
  var t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(secs - 3 * 3600);
  return t;
}

export { toDateTime };
