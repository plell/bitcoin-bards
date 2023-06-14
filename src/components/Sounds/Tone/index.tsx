import * as Tone from "tone";
import { postDebounce } from "../../../Stores/constants";

const highPassFilter = new Tone.Filter(900, "highpass");

const effectsBus = new Tone.Volume(-6);

effectsBus.chain(highPassFilter, Tone.Destination);

const reverb = new Tone.Reverb(3).connect(effectsBus);

const polySynth0 = new Tone.PolySynth().connect(reverb);

polySynth0.chain(highPassFilter, Tone.Destination);
const polySynth1 = new Tone.PolySynth().connect(reverb);

polySynth0.chain(highPassFilter, Tone.Destination);
const polySynth2 = new Tone.PolySynth().connect(reverb);

polySynth0.chain(highPassFilter, Tone.Destination);

const monoSynth2 = new Tone.MonoSynth({
  envelope: {
    attack: 0.1,
    decay: 0.9,
    sustain: 0.7,
    release: 0.6,
  },
}).connect(reverb);

monoSynth2.oscillator.type = "square";
monoSynth2.volume.value = -12;
monoSynth2.chain(highPassFilter, Tone.Destination);

function addOrganicVariant() {
  return Math.floor((Math.random() - 0.5) * 20);
}

let toneStarted = false;

const synths = [polySynth0, polySynth1, polySynth2];

export const playSound = async (note = "A3") => {
  try {
    // start if not started
    if (!toneStarted) {
      await Tone.start();
      toneStarted = true;
    }

    postDebounce(() => {
      let triggered = false;
      synths.forEach((s) => {
        if (!triggered && s.activeVoices < 10) {
          s.triggerAttackRelease(note, 0.001);
          triggered = true;
        }
      });
    }, 50);
  } catch (e) {
    console.warn(e);
  }
};

export const dieSound = async (note = "A1") => {
  try {
    // start if not started
    if (!toneStarted) {
      await Tone.start();
      toneStarted = true;
    }

    monoSynth2.triggerAttackRelease(note, 0.2);
  } catch (e) {
    console.warn(e);
  }
};
