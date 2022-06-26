import { keyboardKeys } from "./computerKeyboardConstants";

const a4PitchHertz = 440;
const a4PianoKeyNumber = 49;

export const keyToHertz = (keyNumber: number) => {
  const n = keyNumber - a4PianoKeyNumber;
  const exponent = n / 12;

  return Math.pow(2, exponent) * a4PitchHertz;
}

export const getHertzForNoteAndOctave = (key: string) => {
  const listPositionIndex = keyboardKeys.indexOf(key);
  if (listPositionIndex < 0) {
    return;
  }

  const keyNumber = 40 + listPositionIndex;
  return keyToHertz(keyNumber);
}