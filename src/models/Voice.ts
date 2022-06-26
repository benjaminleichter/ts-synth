import { connectNodes } from "../utils/ioUtil";

type IVoice = {
  context: AudioContext;
  waveform: OscillatorType;
  frequency: number;
  keyboardKey: string;
}
export default class Voice {
  private context: AudioContext;
  private oscillator: OscillatorNode;
  private gain: GainNode;
  private keyboardKey: string;

  constructor({ context, waveform, frequency, keyboardKey }: IVoice) {
    this.context = context;
    this.oscillator = this.initOscillator(waveform, frequency);
    this.gain = this.context.createGain();
    this.keyboardKey = keyboardKey;

    connectNodes(this.oscillator, this.gain);
    connectNodes(this.gain, this.context.destination);
  }

  destroy() {
    this.oscillator.disconnect();

    this.gain.gain.linearRampToValueAtTime(0.01, this.context.currentTime + 0.1);
    this.gain.disconnect();
  }

  initOscillator(type: OscillatorType, frequency: number) {
    const oscillator = this.context.createOscillator();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    return oscillator;
  }

  initRamp(initialValue: number, endValue: number, durationSeconds: number) {
    const now = this.context.currentTime;

    const gainNode = this.gain.gain;

    gainNode.setValueAtTime(initialValue, now);

    const ramp = gainNode.exponentialRampToValueAtTime(endValue, now + durationSeconds);

    return ramp;
  }

  play(initialValue: number = 0.5, endValue: number = 0.01, durationSeconds: number = 0.5) {
    const now = this.context.currentTime;

    const ramp = this.initRamp(initialValue, endValue, durationSeconds);

    this.oscillator.start(now);
    this.oscillator.stop(now + durationSeconds);
  }

  getKeyboardKey() {
    return this.keyboardKey;
  }
}