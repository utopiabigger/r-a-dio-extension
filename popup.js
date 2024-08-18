// Variables
let isPlaying = false; // Variable to store the playback state

// Event Listeners
document.addEventListener('DOMContentLoaded', (event) => {
  // When the popup is loaded, set the volume slider to the last saved value
  const savedVolume = localStorage.getItem('volume');
  if (savedVolume) {
    const volumeValue = parseInt(savedVolume);
    document.getElementById('volumeSlider').value = volumeValue;
    document.getElementById('volumeLabel').textContent = `${volumeValue}%`;
    browser.runtime.sendMessage({ command: 'changeVolume', volume: volumeValue / 100 });
  }

  // Check the initial playback state and update the button text
  browser.runtime.sendMessage({ command: 'getPlaybackState' }, function(response) {
    isPlaying = response.isPlaying;
    updateButtonText();
  });

  // Fetch and display the current track information
  fetch('https://r-a-d.io/api')
    .then(response => response.json())
    .then(data => {
      const trackInfo = document.getElementById('trackInfo');
      trackInfo.textContent = `Now Playing: ${data.main.np} by DJ: ${data.main.djname}`;
    })
    .catch(error => {
      console.error('Error fetching the API:', error);
    });
});

document.getElementById('toggleButton').addEventListener('click', function() {
  browser.runtime.sendMessage({ command: 'togglePlay' }, function(response) {
    isPlaying = response.isPlaying;
    updateButtonText();
  });
});

document.getElementById('volumeSlider').addEventListener('input', function() {
  // Save the volume level when it's changed
  const volumeValue = parseInt(this.value);
  localStorage.setItem('volume', volumeValue);
  document.getElementById('volumeLabel').textContent = `${volumeValue}%`;
  browser.runtime.sendMessage({ command: 'changeVolume', volume: volumeValue / 100 });
});

// Remove the event listener for the refresh icon
document.getElementById('refreshIcon').addEventListener('click', function() {
  // Do nothing
});

// Functions
function updateButtonText() {
  const playText = document.getElementById('playText');
  const stopText = document.getElementById('stopText');

  if (isPlaying) {
    playText.style.display = 'none';
    stopText.style.display = 'inline';
  } else {
    playText.style.display = 'inline';
    stopText.style.display = 'none';
  }
}