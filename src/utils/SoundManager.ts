class SoundManager {
  private audioCtx: AudioContext | null = null;
  private initialized = false;
  private backgroundMusic: HTMLAudioElement | null = null;
  private hoverTimeout: ReturnType<typeof setTimeout> | null = null;

  init() {
    if (this.initialized) return;
    try {
      // @ts-expect-error: vendor prefix fallback for older browsers
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      this.initialized = true;
      // Initialize background music
      this.backgroundMusic = new Audio('/assets/music.mp3');
      this.backgroundMusic.volume = 0.2; // Keep it light and non-intrusive
      this.backgroundMusic.loop = true;
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

    // Play background music ONLY while hovering
    if (this.backgroundMusic) {
      this.backgroundMusic.play().catch(e => console.log('Audio play failed', e));
      
      // Clear any existing timeout to stop the music
      if (this.hoverTimeout) clearTimeout(this.hoverTimeout);
      
      // Stop the music slightly after hover ends (assuming continuous hover calls keep this alive, 
      // but if hover ends, it stops after 300ms)
      this.hoverTimeout = setTimeout(() => {
        if (this.backgroundMusic) {
          this.backgroundMusic.pause();
        }
      }, 500); 
    }
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

  }
}

export const soundManager = new SoundManager();
