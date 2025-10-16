class Metronome {
    constructor(settings) {
        this.isPlaying = false;
        this.audioContext = null;
        this.currentNote = 0;
        this.beatsPerMeasure = settings.beatsPerMeasure;
        this.bpm = settings.bpm;
        this.volume = settings.volume;
        this.intervalId = null;
    }

    initAudio() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    playSound(volume = 0.5) {
        if (!this.audioContext) this.initAudio();

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(this.currentNote === 0 ? 800 : 400, this.audioContext.currentTime);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(volume * this.volume / 100, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    start() {
        if (this.isPlaying) return;

        this.isPlaying = true;
        const interval = 60000 / this.bpm;

        this.intervalId = setInterval(() => {
            this.playSound(this.currentNote === 0 ? 0.7 : 0.5);
            this.updateVisualization();
            this.currentNote = (this.currentNote + 1) % this.beatsPerMeasure;
        }, interval);
    }

    stop() {
        this.isPlaying = false;
        clearInterval(this.intervalId);
        this.currentNote = 0;
        this.resetVisualization();
    }

    updateVisualization() {
        const indicators = document.querySelectorAll('.beat-indicator');
        indicators.forEach((indicator, index) => {
            indicator.style.background = index === this.currentNote ? '#ff4444' : '#4444ff';
        });
    }

    resetVisualization() {
        const indicators = document.querySelectorAll('.beat-indicator');
        indicators.forEach(indicator => {
            indicator.style.background = '#ccc';
        });
    }

    updateBpm(newBpm) {
        this.bpm = newBpm;
        if (this.isPlaying) {
            this.stop();
            this.start();
        }

        // Отправляем событие об изменении BPM
        const event = new CustomEvent('bpmChanged', { detail: { bpm: newBpm } });
        document.dispatchEvent(event);
    }
}