let isPlaying = false;
let currentTrack = null;

chrome.runtime.onInstalled.addListener(() => {
  console.log("Service worker installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === 'togglePlayback') {
    isPlaying = !isPlaying;
    chrome.runtime.sendMessage({ command: 'updatePlaybackState', isPlaying: isPlaying });
    sendResponse({ isPlaying: isPlaying });
  } else if (message.command === 'getPlaybackState') {
    sendResponse({ isPlaying: isPlaying });
  } else if (message.command === 'changeVolume') {
    chrome.runtime.sendMessage({ command: 'updateVolume', volume: message.volume });
    sendResponse({ volume: message.volume });
  } else if (message.command === 'fetchTrackInfo') {
    // Implement fetchMainData function or use the appropriate method to fetch track info
    fetchMainData()
      .then(data => {
        currentTrack = data.main;
        sendResponse({ trackInfo: currentTrack });
      })
      .catch(error => {
        console.error('Error fetching track info:', error);
        sendResponse({ error: 'Failed to fetch track info' });
      });
    return true; // Indicates that the response is asynchronous
  }
});

// Update track info periodically
setInterval(() => {
  chrome.runtime.sendMessage({ command: 'fetchTrackInfo' });
}, 30000); // Update every 30 seconds

// Implement fetchMainData function if it's not in a separate file
function fetchMainData() {
  return fetch('https://r-a-d.io/api')
    .then(response => response.json())
    .then(data => data)
    .catch(error => {
      console.error('Error fetching main data:', error);
      throw error;
    });
}