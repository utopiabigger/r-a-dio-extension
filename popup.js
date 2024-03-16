let audio = new Audio('https://relay0.r-a-d.io/main.mp3');

document.getElementById('toggleButton').addEventListener('click', function() {
  if(audio.paused) {
    audio.play();
  } else {
    audio.pause();
    audio.currentTime = 0;
  }
});

document.getElementById('toggleButton').addEventListener('click', function() {
  browser.runtime.sendMessage({command: 'togglePlay'});
});

document.getElementById('volumeSlider').addEventListener('input', function() {
  browser.runtime.sendMessage({command: 'changeVolume', volume: this.value});
});