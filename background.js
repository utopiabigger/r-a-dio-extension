let audio = null;
let isPlaying = false; // Variable to store the playback state

function getAudio() {
    if (!audio) {
        audio = new Audio('https://relay0.r-a-d.io/main.mp3');
    }
    return audio;
}

// Initialize the audio when the background script starts
getAudio();

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const audio = getAudio();
    if (message.command === 'togglePlay') {
        if (audio.paused) {
            audio.play();
            isPlaying = true;
        } else {
            audio.pause();
            isPlaying = false;
        }
        sendResponse({ isPlaying: isPlaying });
    } else if (message.command === 'changeVolume') {
        audio.volume = message.volume;
    } else if (message.command === 'getPlaybackState') {
        sendResponse({ isPlaying: !audio.paused });
    }
});