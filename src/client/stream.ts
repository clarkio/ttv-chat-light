const captains = console;
const STORE_OVERLAY_COLOR_NAME = 'streamOverlayColor';
const beeDooAudio = new Audio('/assets/sounds/beedoo.mp3');
// @ts-ignore
const socket = io();
socket.on('color-effect', (effectColors: string[]) => {
  startOverlayEffect(effectColors);
});

function triggerCopModeEffect() {
  startCopModeAudio();
}

function startOverlayEffect(colors: string[]) {
  const originalColor = String(localStorage.getItem(STORE_OVERLAY_COLOR_NAME));
  let counter = 0;
  let colorIndex = 0;
  let effectColor = colors[colorIndex];
  if (colors[0].includes('cop')) {
    startCopModeAudio();
  }
  const overlayEffectInterval = setInterval(() => {
    counter += 1;
    if (counter === 20) {
      setOverlayColor(originalColor);
      clearInterval(overlayEffectInterval);
    } else {
      setOverlayColor(effectColor);
      colorIndex = colorIndex === colors.length - 1 ? 0 : ++colorIndex;
      effectColor = colors[colorIndex];
    }
  }, 1000);
}

function startCopModeAudio() {
  const minionDiv = $('#minion-bee-doo');
  minionDiv.toggleClass('copmode');
  beeDooAudio.loop = true;
  beeDooAudio.play();

  window.setTimeout(() => {
    minionDiv.toggleClass('copmode');
    beeDooAudio.pause();
  }, 10000);
}

socket.on('color-change', (color: string) => {
  captains.log(`Changing color to ${color}`);
  setOverlayColor(color);
});

function setOverlayColor(color: string) {
  localStorage.setItem(STORE_OVERLAY_COLOR_NAME, color);
  $('#container').removeClass();
  $('#container').addClass(color);
}

function getCurrentBulbColor() {
  $.get('/bulb/color', (result: any) => {
    captains.log(result);
    const bulbColor = result.color;
    setOverlayColor(bulbColor);
  });
}

getCurrentBulbColor();
