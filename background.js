let audio = null;
let isPlaying = false; // Variable to store the playback state
let lastPlayTime = 0;

function getAudio() {
    if (!audio) {
        audio = new Audio('https://relay0.r-a-d.io/main.mp3');
    }
    return audio;
}

// Initialize the audio when the service worker starts
chrome.runtime.onInstalled.addListener(() => {
    console.log("Service worker installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === 'getPlaybackState') {
        chrome.storage.local.get(['isPlaying'], (result) => {
            sendResponse({ isPlaying: result.isPlaying || false });
        });
        return true; // Indicate that the response is asynchronous
    }
});