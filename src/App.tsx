import React from 'react';

import Synth from './models/Synth';
import './App.css';

function App() {
  const context = React.useMemo(() => new AudioContext(), []);
  const synth = React.useMemo(() => new Synth(context), [context]);

  React.useEffect(() => {
    const playNote = synth.play.bind(synth);
    const stopNote = synth.stopPlay.bind(synth);

    window.addEventListener("keydown", playNote);
    window.addEventListener("keyup", stopNote);

    return () => {
      window.removeEventListener("keydown", playNote);
      window.removeEventListener("keyup", stopNote);
    }
  });

  const [waveform, setWaveform] = React.useState(synth.getWaveform());
  const handleSetWaveform = (waveform: OscillatorType) => {
    synth.setWaveform(waveform);
    setWaveform(waveform);
  }

  return (
    <div className="App">
      <select value={waveform} onChange={(e) => handleSetWaveform(e.target.value as OscillatorType)}>
        <option value="sine">Sine</option>
        <option value="sawtooth">Sawtooth</option>
        <option value="square">Square</option>
      </select>
    </div>
  );
}

export default App;
