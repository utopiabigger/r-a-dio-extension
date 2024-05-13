// When the popup is loaded, set the volume slider to the last saved value
document.addEventListener('DOMContentLoaded', (event) => {
  const savedVolume = localStorage.getItem('volume');
  if (savedVolume) {
    const volumeValue = parseInt(savedVolume);
    document.getElementById('volumeSlider').value = volumeValue;
    document.getElementById('volumeLabel').textContent = `${volumeValue}%`;
    browser.runtime.sendMessage({ command: 'changeVolume', volume: volumeValue / 100 });
  }
});

document.getElementById('toggleButton').addEventListener('click', function() {
  browser.runtime.sendMessage({ command: 'togglePlay' }, function(response) {
    const playText = document.getElementById('playText');
    const stopText = document.getElementById('stopText');
    
    if (response.isPlaying) {
      playText.style.display = 'none';
      stopText.style.display = 'inline';
    } else {
      playText.style.display = 'inline';
      stopText.style.display = 'none';
    }
  });
});

document.getElementById('volumeSlider').addEventListener('input', function() {
  // Save the volume level when it's changed
  const volumeValue = parseInt(this.value);
  localStorage.setItem('volume', volumeValue);
  document.getElementById('volumeLabel').textContent = `${volumeValue}%`;
  browser.runtime.sendMessage({ command: 'changeVolume', volume: volumeValue / 100 });
});