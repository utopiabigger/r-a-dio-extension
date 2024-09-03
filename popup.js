// AudioPlayer class definition
class AudioPlayer {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.audioElement = new Audio('https://relay0.r-a-d.io/main.mp3');
    this.gainNode = this.audioContext.createGain();
    this.audioElement.addEventListener('canplaythrough', () => {
      const source = this.audioContext.createMediaElementSource(this.audioElement);
      source.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);
    });
  }

  async play() {
    try {
      await this.audioElement.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }

  pause() {
    this.audioElement.pause();
  }

  setVolume(volume) {
    this.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
  }
}

const audioPlayer = new AudioPlayer();

document.addEventListener('DOMContentLoaded', () => {
  const playButton = document.getElementById('toggleButton');
  const volumeSlider = document.getElementById('volumeSlider');
  const trackInfo = document.getElementById('trackInfo');
  const artistInfo = document.getElementById('artistInfo');
  const durationInfo = document.getElementById('durationInfo');
  const listenersInfo = document.getElementById('listenersInfo');

  // Update UI elements with track information
  function updateTrackInfo(trackData) {
    if (trackData) {
      trackInfo.textContent = trackData.np;
      artistInfo.textContent = trackData.np.split(' - ')[0];
      listenersInfo.textContent = `${trackData.listeners} listeners`;
      // ... (update duration and progress bar)
    } else {
      trackInfo.textContent = 'Error fetching track info';
    }
  }

  // Handle play/stop button click
  playButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ command: 'togglePlayback' }, (response) => {
      if (response) {
        playButton.textContent = response.isPlaying ? 'Stop' : 'Play';
        if (response.isPlaying) {
          audioPlayer.play();
        } else {
          audioPlayer.pause();
        }
      }
    });
  });

  // Handle volume slider change
  volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    audioPlayer.setVolume(volume);
    chrome.runtime.sendMessage({ command: 'changeVolume', volume: volume }, (response) => {
      if (response && !response.error) {
        document.getElementById('volumeLabel').textContent = `${Math.round(response.volume * 100)}%`;
      } else {
        console.error('Failed to change volume:', response.error);
        document.getElementById('volumeLabel').textContent = 'Error';
      }
    });
  });

  // Fetch initial track information
  chrome.runtime.sendMessage({ command: 'fetchTrackInfo' }, (response) => {
    if (response && response.trackInfo) {
      updateTrackInfo(response.trackInfo);
    }
  });

  // Listen for track info updates from the background
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === 'trackInfoUpdated') {
      updateTrackInfo(message.trackInfo);
    } else if (message.command === 'updatePlaybackState') {
      playButton.textContent = message.isPlaying ? 'Stop' : 'Play';
      if (message.isPlaying) {
        audioPlayer.play();
      } else {
        audioPlayer.pause();
      }
    } else if (message.command === 'updateVolume') {
      audioPlayer.setVolume(message.volume);
    }
  });
});