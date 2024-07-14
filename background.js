let audio = null;
let isPlaying = false; // Variable to store the playback state
let lastPlayTime = 0;

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
        const currentTime = Date.now();
        if (audio.paused) {
            if (currentTime - lastPlayTime > 30 * 60 * 1000) {
                audio.src = 'https://relay0.r-a-d.io/main.mp3';
                audio.load();
            }
            audio.play();
            isPlaying = true;
        } else {
            audio.pause();
            isPlaying = false;
        }
        lastPlayTime = currentTime;
        sendResponse({ isPlaying: isPlaying });
    } else if (message.command === 'changeVolume') {
        audio.volume = message.volume;
    } else if (message.command === 'getPlaybackState') {
        sendResponse({ isPlaying: !audio.paused });
    } else if (message.command === 'refreshStream') {
        audio.src = 'https://relay0.r-a-d.io/main.mp3';
        audio.load();
        if (isPlaying) {
            audio.play();
        }
        lastPlayTime = Date.now();
    }
});