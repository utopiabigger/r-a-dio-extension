// Variables
let isPlaying = false; // Variable to store the playback state
let currentTime = 0;
let totalDuration = 0;
let updateInterval;

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
  function updateTrackInfo() {
    fetch('https://r-a-d.io/api')
      .then(response => response.json())
      .then(data => {
        const trackInfo = document.getElementById('trackInfo');
        const artistInfo = document.getElementById('artistInfo');
        const durationInfo = document.getElementById('durationInfo');
        const [artist, title] = data.main.np.split(' - ');
        trackInfo.textContent = title;
        artistInfo.textContent = artist;
        
        // Calculate and display duration
        const startTime = data.main.start_time;
        const endTime = data.main.end_time;
        currentTime = Math.floor(Date.now() / 1000) - startTime;
        totalDuration = endTime - startTime;
        
        // Reset progress bar when new track info is fetched
        document.getElementById('progressBar').style.width = '0%';
        
        updateDurationDisplay();
      })
      .catch(error => {
        console.error('Error fetching the API:', error);
      });
  }

  function updateDurationDisplay() {
    const durationInfo = document.getElementById('durationInfo');
    const progressBar = document.getElementById('progressBar');
    const currentMinutes = Math.floor(currentTime / 60);
    const currentSeconds = currentTime % 60;
    const totalMinutes = Math.floor(totalDuration / 60);
    const totalSeconds = totalDuration % 60;
    
    durationInfo.textContent = `${formatTime(currentMinutes, currentSeconds)}/${formatTime(totalMinutes, totalSeconds)}`;
    
    // Update progress bar
    const progress = (currentTime / totalDuration) * 100;
    progressBar.style.width = `${progress}%`;
  }

  function formatTime(minutes, seconds) {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  updateTrackInfo();
  
  // Update current time every second
  updateInterval = setInterval(() => {
    if (currentTime < totalDuration) {
      currentTime++;
      updateDurationDisplay();
    } else {
      // If the song has ended, fetch new track info
      updateTrackInfo();
    }
  }, 1000);
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

// Clean up interval when popup is closed
window.addEventListener('unload', () => {
  clearInterval(updateInterval);
});