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
  
  // Export the AudioPlayer class
  export default new AudioPlayer();