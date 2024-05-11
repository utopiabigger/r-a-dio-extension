let audio = null;

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
        } else {
            audio.pause();
        }
        sendResponse({ isPlaying: !audio.paused });
    } else if (message.command === 'changeVolume') {
        audio.volume = message.volume;
    }
});