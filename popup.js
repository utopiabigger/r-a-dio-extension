let audioElement;

document.addEventListener('DOMContentLoaded', () => {
  const playButton = document.getElementById('toggleButton');
  const volumeSlider = document.getElementById('volumeSlider');
  const trackInfo = document.getElementById('trackInfo');
  const artistInfo = document.getElementById('artistInfo');
  const durationInfo = document.getElementById('durationInfo');
  const listenersInfo = document.getElementById('listenersInfo');
  const volumeLabel = document.getElementById('volumeLabel');

  let currentTrackStartTime = 0;
  let currentTrackDuration = 0;

  function initializeAudio() {
    audioElement = new Audio('https://relay0.r-a-d.io/main.mp3');
    audioElement.preload = 'none'; // Don't preload audio to improve initial load time
  }

  function updateTrackInfo(trackData) {
    if (trackData && trackData.main) {
      const main = trackData.main;
      trackInfo.textContent = main.np || 'Unknown track';
      artistInfo.textContent = main.artist || 'Unknown artist';
      listenersInfo.textContent = `${main.listeners || 0} listeners`;

      currentTrackStartTime = main.start_time * 1000;
      // Check if end_time is available and calculate duration
      if (main.end_time && main.start_time) {
        currentTrackDuration = main.end_time - main.start_time;
      } else {
        currentTrackDuration = null; // Set to null if duration is not available
      }

      updateDurationDisplay();
    } else {
      trackInfo.textContent = 'Error fetching track info';
      artistInfo.textContent = '';
      listenersInfo.textContent = '';
      durationInfo.textContent = '00:00';
    }
  }

  function updateDurationDisplay() {
    const currentTime = new Date();
    const elapsedTime = Math.max(0, (currentTime - new Date(currentTrackStartTime)) / 1000);

    const formatTime = (seconds) => {
      if (seconds === null || isNaN(seconds)) return '--:--';
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (currentTrackDuration === null) {
      durationInfo.textContent = formatTime(elapsedTime);
    } else {
      durationInfo.textContent = `${formatTime(elapsedTime)} / ${formatTime(currentTrackDuration)}`;
    }

    const progressBar = document.getElementById('progressBar');
    if (currentTrackDuration !== null) {
      const progress = (elapsedTime / currentTrackDuration) * 100;
      progressBar.style.width = `${Math.min(progress, 100)}%`;
    } else {
      progressBar.style.width = '0%'; // Hide progress bar if duration is unknown
    }

    requestAnimationFrame(updateDurationDisplay);
  }

  playButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ command: 'togglePlayback' }, (response) => {
      if (response) {
        playButton.textContent = response.isPlaying ? 'Stop' : 'Play';
        if (response.isPlaying) {
          audioElement.play();
        } else {
          audioElement.pause();
        }
      }
    });
  });

  volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    audioElement.volume = volume;
    volumeLabel.textContent = `${Math.round(volume * 100)}%`;
  });

  function updateVolumeUI(volume) {
    volumeSlider.value = volume * 100;
    volumeLabel.textContent = `${Math.round(volume * 100)}%`;
  }

  // Initialize audio and volume
  initializeAudio();
  const initialVolume = 0.5;
  updateVolumeUI(initialVolume);
  audioElement.volume = initialVolume;

  // Start updating duration display
  updateDurationDisplay();

  // Fetch initial track information
  chrome.runtime.sendMessage({ command: 'fetchTrackInfo' }, (response) => {
    if (response && response.trackInfo) {
      updateTrackInfo(response.trackInfo);
    } else {
      console.error('Failed to fetch initial track info');
      trackInfo.textContent = 'Loading...';
    }
  });

  // Update track info every 5 seconds
  setInterval(() => {
    chrome.runtime.sendMessage({ command: 'fetchTrackInfo' }, (response) => {
      if (response && response.trackInfo) {
        updateTrackInfo(response.trackInfo);
      }
    });
  }, 5000);

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === 'trackInfoUpdated') {
      updateTrackInfo(message.trackInfo);
    } else if (message.command === 'updatePlaybackState') {
      playButton.textContent = message.isPlaying ? 'Stop' : 'Play';
      if (message.isPlaying) {
        audioElement.play();
      } else {
        audioElement.pause();
      }
    }
  });
});