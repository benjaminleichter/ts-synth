import { connectNodes } from "../utils/ioUtil";

type IVoice = {
  context: AudioContext;
  waveform: OscillatorType;
  frequency: number;
  keyboardKey: string;
  ramp?: AudioParam;
  destinationValue?: number;
}
export default class Voice {
  private context: AudioContext;
  private oscillator: OscillatorNode;
  private gain: GainNode;
  private keyboardKey: string;
  private ramp: null | AudioParam = null;
  private destinationValue: null | number = null;

  constructor({ context, waveform, frequency, keyboardKey, ramp, destinationValue }: IVoice) {
    this.context = context;
    this.oscillator = this.initOscillator(waveform, frequency);
    this.gain = this.context.createGain();
    this.keyboardKey = keyboardKey;

    if (ramp) {
      this.ramp = ramp;
    }

    if (destinationValue) {
      this.destinationValue = destinationValue;
    }

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

    this.destinationValue = endValue;
    this.ramp = ramp;

    this.oscillator.start(now);
    this.oscillator.stop(now + durationSeconds);
  }

  setDestinationValue(destinationValue: number) {
    this.destinationValue = destinationValue;
  }

  getKeyboardKey() {
    return this.keyboardKey;
  }
}