let isPlaying = false;
let currentTrack = null;
let lastFetchTime = 0;
const FETCH_INTERVAL = 30000; // 30 seconds

let cachedTrackInfo = null;
let cacheExpiration = 0;
const CACHE_DURATION = 60000; // 1 minute

chrome.runtime.onInstalled.addListener(() => {
  console.log("Service worker installed");
  initializeExtension();
});

chrome.runtime.onStartup.addListener(() => {
  console.log("Background script started");
  initializeExtension();
});

function initializeExtension() {
  console.log("Initializing extension");
  fetchMainData()
    .then(data => {
      console.log("Initial data fetched");
      broadcastMessage({ command: 'trackInfoUpdated', trackInfo: data });
    })
    .catch(error => {
      console.error("Error fetching initial data:", error);
    });
}

function broadcastMessage(message) {
  chrome.runtime.sendMessage(message).catch(() => {
    // Ignore errors when no receivers are available
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message:", message);
  if (message.command === 'togglePlayback') {
    isPlaying = !isPlaying;
    broadcastMessage({ command: 'updatePlaybackState', isPlaying: isPlaying });
    sendResponse({ isPlaying: isPlaying });
  } else if (message.command === 'getPlaybackState') {
    sendResponse({ isPlaying: isPlaying });
  } else if (message.command === 'fetchTrackInfo') {
    fetchMainData()
      .then(trackInfo => {
        sendResponse({ trackInfo: trackInfo });
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
  fetchMainData()
    .then(data => {
      broadcastMessage({ command: 'trackInfoUpdated', trackInfo: data });
    })
    .catch(error => {
      console.error('Error fetching main data:', error);
    });
}, FETCH_INTERVAL);

function fetchMainData() {
  const now = Date.now();
  if (cachedTrackInfo && now < cacheExpiration) {
    return Promise.resolve(cachedTrackInfo);
  }

  return fetch('https://r-a-d.io/api')
    .then(response => response.json())
    .then(data => {
      cachedTrackInfo = data;  // Store the entire API response
      cacheExpiration = now + CACHE_DURATION;
      return cachedTrackInfo;
    })
    .catch(error => {
      console.error('Error fetching main data:', error);
      throw error;
    });
}

// Add this to ensure the background script stays active
chrome.action.onClicked.addListener((tab) => {
  console.log("Extension icon clicked");
});