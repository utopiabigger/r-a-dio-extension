let audio = new Audio('https://relay0.r-a-d.io/main.mp3');

document.getElementById('toggleButton').addEventListener('click', function() {
  if(audio.paused) {
    audio.play();
  } else {
    audio.pause();
    audio.currentTime = 0;
  }
});


// When the popup is loaded, set the volume slider to the last saved value
document.addEventListener('DOMContentLoaded', (event) => {
  const savedVolume = localStorage.getItem('volume');
  if (savedVolume) {
      document.getElementById('volumeSlider').value = savedVolume;
      browser.runtime.sendMessage({command: 'changeVolume', volume: savedVolume});
  }
});

document.getElementById('toggleButton').addEventListener('click', function() {
  browser.runtime.sendMessage({command: 'togglePlay'});
});

document.getElementById('volumeSlider').addEventListener('input', function() {
  // Save the volume level when it's changed
  localStorage.setItem('volume', this.value);
  browser.runtime.sendMessage({command: 'changeVolume', volume: this.value});
});