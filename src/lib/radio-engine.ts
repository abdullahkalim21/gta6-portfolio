/**
 * Procedural radio: a tiny step sequencer + synths built on the Web Audio API.
 * Every station is generated live in the browser — no audio files, no licensing.
 */

export type PresetId = "synthwave" | "lofi" | "darkwave";

interface Preset {
  bpm: number;
  swing: number; // 0..0.3 — delays every other 16th
  chords: number[][]; // MIDI notes, one chord per bar
  kick: number[]; // steps 0..15
  snare: number[];
  hats: number[];
  hatLevel: number;
  bass: { steps: number[]; wave: OscillatorType; cutoff: number; level: number };
  pad: { wave: OscillatorType; cutoff: number; level: number };
  arp?: { wave: OscillatorType; level: number; pattern: number[]; octave: number };
  lead?: { wave: OscillatorType; level: number; scale: number[]; chance: number };
}

const PRESETS: Record<PresetId, Preset> = {
  synthwave: {
    bpm: 100,
    swing: 0,
    chords: [
      [57, 60, 64], // Am
      [53, 57, 60], // F
      [48, 52, 55], // C
      [55, 59, 62], // G
    ],
    kick: [0, 4, 8, 12],
    snare: [4, 12],
    hats: [2, 6, 10, 14],
    hatLevel: 0.12,
    bass: { steps: [0, 2, 3, 6, 8, 10, 11, 14], wave: "sawtooth", cutoff: 700, level: 0.32 },
    pad: { wave: "sawtooth", cutoff: 1500, level: 0.06 },
    arp: { wave: "square", level: 0.05, pattern: [0, 1, 2, 1, 0, 2, 1, 2], octave: 12 },
  },
  lofi: {
    bpm: 76,
    swing: 0.22,
    chords: [
      [50, 53, 57, 60, 64], // Dm9
      [43, 53, 55, 59, 62], // G7
      [48, 52, 55, 59, 62], // Cmaj9
      [45, 52, 55, 60, 64], // Am7
    ],
    kick: [0, 7, 10],
    snare: [4, 12],
    hats: [0, 2, 4, 6, 8, 10, 12, 14],
    hatLevel: 0.06,
    bass: { steps: [0, 7, 10], wave: "triangle", cutoff: 400, level: 0.42 },
    pad: { wave: "triangle", cutoff: 900, level: 0.09 },
    lead: { wave: "sine", level: 0.07, scale: [62, 64, 67, 69, 72, 74], chance: 0.18 },
  },
  darkwave: {
    bpm: 116,
    swing: 0,
    chords: [
      [52, 55, 59], // Em
      [48, 52, 55], // C
      [45, 48, 52], // Am
      [47, 51, 54], // B
    ],
    kick: [0, 4, 8, 12],
    snare: [4, 12],
    hats: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    hatLevel: 0.05,
    bass: { steps: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], wave: "sawtooth", cutoff: 500, level: 0.22 },
    pad: { wave: "sawtooth", cutoff: 900, level: 0.05 },
    arp: { wave: "sawtooth", level: 0.04, pattern: [0, 2, 1, 2], octave: 24 },
  },
};

const mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12);

export class SynthRadio {
  private ctx: AudioContext;
  private master: GainNode;
  private bus: GainNode | null = null;
  private delay: DelayNode;
  private reverb: ConvolverNode;
  private noise: AudioBuffer;
  private timer: number | null = null;
  private step = 0;
  private bar = 0;
  private nextTime = 0;
  private preset: Preset | null = null;

  constructor() {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.6;
    this.master.connect(this.ctx.destination);

    // Feedback delay for arps
    this.delay = this.ctx.createDelay(1);
    const fb = this.ctx.createGain();
    fb.gain.value = 0.35;
    this.delay.connect(fb).connect(this.delay);
    this.delay.connect(this.master);

    // Cheap generated reverb
    this.reverb = this.ctx.createConvolver();
    const len = this.ctx.sampleRate * 2.2;
    const ir = this.ctx.createBuffer(2, len, this.ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
    }
    this.reverb.buffer = ir;
    const wet = this.ctx.createGain();
    wet.gain.value = 0.25;
    this.reverb.connect(wet).connect(this.master);

    // Noise buffer for drums
    this.noise = this.ctx.createBuffer(1, this.ctx.sampleRate, this.ctx.sampleRate);
    const nd = this.noise.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
  }

  setVolume(v: number) {
    this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.05);
  }

  async play(id: PresetId) {
    this.stop();
    await this.ctx.resume();
    this.preset = PRESETS[id];
    this.delay.delayTime.value = (60 / this.preset.bpm) * 0.75;
    this.bus = this.ctx.createGain();
    this.bus.gain.value = 0;
    this.bus.gain.linearRampToValueAtTime(1, this.ctx.currentTime + 0.6);
    this.bus.connect(this.master);
    this.bus.connect(this.reverb);
    this.step = 0;
    this.bar = 0;
    this.nextTime = this.ctx.currentTime + 0.08;
    this.timer = window.setInterval(() => this.schedule(), 25);
  }

  stop() {
    if (this.timer !== null) window.clearInterval(this.timer);
    this.timer = null;
    const bus = this.bus;
    if (bus) {
      const t = this.ctx.currentTime;
      bus.gain.cancelScheduledValues(t);
      bus.gain.setValueAtTime(bus.gain.value, t);
      bus.gain.linearRampToValueAtTime(0, t + 0.3);
      window.setTimeout(() => bus.disconnect(), 400);
    }
    this.bus = null;
  }

  dispose() {
    this.stop();
    window.setTimeout(() => this.ctx.close(), 500);
  }

  private schedule() {
    const p = this.preset;
    if (!p || !this.bus) return;
    const sixteenth = 60 / p.bpm / 4;
    while (this.nextTime < this.ctx.currentTime + 0.15) {
      const swingOffset = this.step % 2 === 1 ? sixteenth * p.swing : 0;
      this.playStep(p, this.step, this.nextTime + swingOffset, sixteenth);
      this.nextTime += sixteenth;
      this.step = (this.step + 1) % 16;
      if (this.step === 0) this.bar++;
    }
  }

  private playStep(p: Preset, step: number, t: number, sixteenth: number) {
    const chord = p.chords[this.bar % p.chords.length];
    if (step === 0) this.pad(chord, t, sixteenth * 16, p.pad);
    if (p.kick.includes(step)) this.kick(t);
    if (p.snare.includes(step)) this.snare(t);
    if (p.hats.includes(step)) this.hat(t, p.hatLevel * (step % 4 === 2 ? 1 : 0.6));
    if (p.bass.steps.includes(step)) this.tone(mtof(chord[0] - 12), t, sixteenth * 0.9, p.bass.wave, p.bass.level, p.bass.cutoff, false);
    if (p.arp) {
      const note = chord[p.arp.pattern[step % p.arp.pattern.length] % chord.length] + p.arp.octave;
      this.tone(mtof(note), t, sixteenth * 0.8, p.arp.wave, p.arp.level, 2400, true);
    }
    if (p.lead && step % 2 === 0 && Math.random() < p.lead.chance) {
      const note = p.lead.scale[Math.floor(Math.random() * p.lead.scale.length)];
      this.tone(mtof(note), t, sixteenth * 3, p.lead.wave, p.lead.level, 3000, true);
    }
  }

  private tone(freq: number, t: number, dur: number, wave: OscillatorType, level: number, cutoff: number, sendDelay: boolean) {
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const g = this.ctx.createGain();
    osc.type = wave;
    osc.frequency.value = freq;
    filter.type = "lowpass";
    filter.frequency.value = cutoff;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(level, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(filter).connect(g).connect(this.bus!);
    if (sendDelay) g.connect(this.delay);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  private pad(chord: number[], t: number, dur: number, cfg: Preset["pad"]) {
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cfg.cutoff * 0.6, t);
    filter.frequency.linearRampToValueAtTime(cfg.cutoff, t + dur * 0.5);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(cfg.level, t + 0.5);
    g.gain.setValueAtTime(cfg.level, t + dur - 0.4);
    g.gain.linearRampToValueAtTime(0.0001, t + dur);
    filter.connect(g).connect(this.bus!);
    for (const note of chord) {
      for (const detune of [-8, 8]) {
        const osc = this.ctx.createOscillator();
        osc.type = cfg.wave;
        osc.frequency.value = mtof(note);
        osc.detune.value = detune;
        osc.connect(filter);
        osc.start(t);
        osc.stop(t + dur + 0.05);
      }
    }
  }

  private kick(t: number) {
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(42, t + 0.12);
    g.gain.setValueAtTime(0.9, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
    osc.connect(g).connect(this.bus!);
    osc.start(t);
    osc.stop(t + 0.45);
  }

  private snare(t: number) {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const hp = this.ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 1200;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.35, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    src.connect(hp).connect(g).connect(this.bus!);
    g.connect(this.reverb);
    src.start(t);
    src.stop(t + 0.25);
  }

  private hat(t: number, level: number) {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const hp = this.ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 7500;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(level, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    src.connect(hp).connect(g).connect(this.bus!);
    src.start(t);
    src.stop(t + 0.06);
  }
}
