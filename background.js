let audio;

function getAudio() {
    if (!audio) {
        audio = new Audio('https://relay0.r-a-d.io/main.mp3');
    }
    return audio;
}

browser.runtime.onMessage.addListener((message) => {
    const audio = getAudio();
    if (message.command === 'togglePlay') {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    } else if (message.command === 'changeVolume') {
        audio.volume = message.volume;
    }
});











// Yeah...

/* let audio = new Audio('https://relay0.r-a-d.io/main.mp3');

browser.runtime.onMessage.addListener((message) => {
    if (message.command === 'togglePlay') {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    } else if (message.command === 'changeVolume') {
        audio.volume = message.volume;
    }
}); */