//date time
function toDateTime(secs: number) {
  let t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(secs - 3 * 3600);
  return t;
}

function secondsToDhms(seconds: number) {
  seconds = Number(seconds);
  let d = Math.floor(seconds / (3600 * 24));
  let h = Math.floor((seconds % (3600 * 24)) / 3600);
  let m = Math.floor((seconds % 3600) / 60);
  let s = Math.floor(seconds % 60);

  let dDisplay = d > 0 ? d + (d == 1 ? "d:" : "d:") : "";
  let hDisplay = h > 0 ? h + (h == 1 ? "h:" : "h:") : "";
  let mDisplay = m > 0 ? m + (m == 1 ? "m:" : "m:") : "";
  let sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
}

function startTimer(duration: any, display: any, loopCount = 0) {
  if (!display) {
    return;
  }

  let timer: any = duration,
    minutes,
    seconds,
    loopIndex = 0;
  const timerInterval = setInterval(function () {
    // @ts-ignore
    minutes = parseInt(timer / 60, 10);
    // @ts-ignore
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = minutes + ":" + seconds;

    if (--timer < 0) {
      if (loopCount && ++loopIndex >= loopCount) {
        clearInterval(timerInterval);
        return;
      }
      timer = duration;
    }
  }, 1000);
}

export { toDateTime, secondsToDhms, startTimer };
