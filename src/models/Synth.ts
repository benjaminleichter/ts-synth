import { keyboardKeys } from "../utils/computerKeyboardConstants";
import { getHertzForNoteAndOctave } from "../utils/pitchUtil";
import Voice from "./Voice";

export default class Synth {
  context: AudioContext;
  activeVoices: Array<Voice> = [];
  currentOctave = 0;
  waveform: OscillatorType = "sine";

  constructor(context: AudioContext) {
    this.context = context;
  }

  createRamp(gain: GainNode, initialValue: number, endValue: number, start: number, durationSeconds: number) {
    const gainNode = gain.gain;

    gainNode.setValueAtTime(initialValue, start);

    const ramp = gainNode.exponentialRampToValueAtTime(endValue, start + durationSeconds);

    return ramp;
  }

  initVoice(oscillatorType: OscillatorType, oscillatorFrequency: number, keyboardKey: string): Voice {
    const voice = new Voice({ context: this.context, waveform: oscillatorType, frequency: oscillatorFrequency, keyboardKey })
    this.activeVoices.push(voice);

    return voice;
  }

  connectNodes(source: AudioNode, destination: AudioNode) {
    source.connect(destination);
  }

  killVoiceByIndex(voiceIndex: number) {
    this.activeVoices = [
      ...this.activeVoices.slice(0, voiceIndex),
      ...this.activeVoices.slice(voiceIndex + 1, this.activeVoices.length)
    ]
  }

  tearDownVoice(voiceIndex: number) {
    const voice = this.activeVoices[voiceIndex];
    if (!voice) {
      return;
    }

    voice.destroy();
    this.killVoiceByIndex(voiceIndex)
  }

  getIndexForVoiceByKeybordKey(keyboardKey: string) {
    return this.activeVoices.findIndex(voice => voice.getKeyboardKey() === keyboardKey);
  }

  play(e: KeyboardEvent) {
    const key = e.key;
    if (!keyboardKeys.includes(key)) {
      return;
    }
    const voiceIndex = this.getIndexForVoiceByKeybordKey(key);
    if (voiceIndex >= 0) {
      return;
    }

    const hertz = getHertzForNoteAndOctave(key)

    if (!hertz) {
      return;
    }

    const voice = this.initVoice(this.waveform, hertz, key);
    voice.play();
  }

  stopPlay(e: KeyboardEvent) {
    const key = e.key;
    const indexOfKey = this.getIndexForVoiceByKeybordKey(key);
    if (indexOfKey < 0) {
      return;
    }

    this.tearDownVoice(indexOfKey);
  }
}