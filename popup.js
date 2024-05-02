// When the popup is loaded, set the volume slider to the last saved value
document.addEventListener('DOMContentLoaded', (event) => {
  const savedVolume = localStorage.getItem('volume');
  if (savedVolume) {
      document.getElementById('volumeSlider').value = savedVolume;
      document.getElementById('volumeLabel').textContent = `${savedVolume * 100}%`;
      browser.runtime.sendMessage({command: 'changeVolume', volume: savedVolume});
  }
});

document.getElementById('toggleButton').addEventListener('click', function() {
  browser.runtime.sendMessage({command: 'togglePlay'});
});

document.getElementById('volumeSlider').addEventListener('input', function() {
  // Save the volume level when it's changed
  localStorage.setItem('volume', this.value);
  document.getElementById('volumeLabel').textContent = `${this.value * 100}%`;
  browser.runtime.sendMessage({command: 'changeVolume', volume: this.value});
});