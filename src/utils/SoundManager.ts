class SoundManager {
  private audioCtx: AudioContext | null = null;
  private initialized = false;
  private ambientGainNodes: GainNode[] = [];
  private ambientOscillators: OscillatorNode[] = [];

  init() {
    if (this.initialized) return;
    try {
      // @ts-expect-error: vendor prefix fallback for older browsers
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      this.initialized = true;
    } catch {
      console.error('Web Audio API not supported');
    }
  }

  playHover() {
    if (!this.initialized || !this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.audioCtx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.015, this.audioCtx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);

    osc.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.05);
  }

  playClick() {
    if (!this.initialized || !this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.audioCtx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.05, this.audioCtx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.1);

    osc.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.1);
  }

  playAmbientMusic() {
    if (!this.initialized || !this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    // Prevent duplicate ambient tracks
    if (this.ambientOscillators.length > 0) return;

    // Create a very soft, relaxing ambient chord drone (C major extended or similar)
    const frequencies = [130.81, 196.00, 261.63, 329.63, 392.00]; // frequencies for C3, G3, C4, E4, G4

    frequencies.forEach((freq, i) => {
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();
      const panner = this.audioCtx.createStereoPanner();

      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      
      // Pan each note slightly differently for a wide stereo feel
      panner.pan.value = (i / frequencies.length) * 2 - 1;

      // Start completely silent, fade in over 5 seconds
      gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.005, this.audioCtx.currentTime + 5);

      osc.connect(gainNode);
      gainNode.connect(panner);
      panner.connect(this.audioCtx.destination);

      osc.start();
      this.ambientOscillators.push(osc);
      this.ambientGainNodes.push(gainNode);
    });
  }

  stopAmbientMusic() {
    if (!this.audioCtx) return;
    this.ambientGainNodes.forEach(gainNode => {
      // Fade out over 2 seconds
      gainNode.gain.linearRampToValueAtTime(0, this.audioCtx!.currentTime + 2);
    });
    
    setTimeout(() => {
      this.ambientOscillators.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // Ignore if already stopped
        }
      });
      this.ambientOscillators = [];
      this.ambientGainNodes = [];
    }, 2000);
  }
}

export const soundManager = new SoundManager();
