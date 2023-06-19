import * as Tone from "tone";
import { postDebounce } from "../../../Stores/constants";

const tomSynth0 = new Tone.MembraneSynth({
  envelope: {
    attack: 0,
    decay: 0.02,
    sustain: 0.4,
    release: 0.7,
  },
}).toDestination();

tomSynth0.volume.value = -10;

const distortion = new Tone.Distortion({
  distortion: 10,
});

const tomSynth1 = new Tone.MembraneSynth({
  envelope: {
    attack: 0,
    decay: 0.02,
    sustain: 0,
    release: 0,
  },
})
  .connect(distortion)
  .toDestination();

const tomSynth2 = new Tone.MembraneSynth({
  envelope: {
    attack: 0,
    decay: 0.02,
    sustain: 0,
    release: 0,
  },
}).toDestination();

tomSynth2.volume.value = -18;

const highPassFilter = new Tone.Filter(900, "highpass");

const effectsBus = new Tone.Volume(0);

effectsBus.chain(highPassFilter, Tone.Destination);

const reverb = new Tone.Reverb(3).connect(effectsBus);

const polySynth0 = new Tone.PolySynth().connect(reverb);

polySynth0.chain(highPassFilter, Tone.Destination);
const polySynth1 = new Tone.PolySynth().connect(reverb);

polySynth0.chain(highPassFilter, Tone.Destination);
const polySynth2 = new Tone.PolySynth().connect(reverb);

polySynth0.chain(highPassFilter, Tone.Destination);

polySynth0.volume.value = 6;
polySynth1.volume.value = 6;
polySynth2.volume.value = 6;

const monoSynth2 = new Tone.MonoSynth({
  envelope: {
    attack: 0.1,
    decay: 0.9,
    sustain: 0.7,
    release: 0.6,
  },
}).connect(reverb);

monoSynth2.oscillator.type = "square";
monoSynth2.chain(highPassFilter, Tone.Destination);

const init = async () => {
  // start if not started
  if (!toneStarted) {
    await Tone.start();
    toneStarted = true;
  }
};

function addOrganicVariant() {
  return Math.floor((Math.random() - 0.5) * 20);
}

let toneStarted = false;

const synths = [polySynth0, polySynth1, polySynth2];

export const playSound = async (note = "A3") => {
  try {
    await init();

    postDebounce(
      "tone",
      () => {
        let triggered = false;
        synths.forEach((s) => {
          if (!triggered && s.activeVoices < 10) {
            s.triggerAttackRelease(note, 0.001);
            triggered = true;
          }
        });
      },
      50
    );
  } catch (e) {
    console.warn(e);
  }
};

export const dieSound = async (note = "A1") => {
  try {
    await init();

    monoSynth2.triggerAttackRelease(note, 0.2);
  } catch (e) {
    console.warn(e);
  }
};

export const kick = async (note = "A1") => {
  try {
    await init();
    postDebounce("kick", () => {
      tomSynth0.triggerAttackRelease(note, 0.2);
    });
  } catch (e) {
    console.warn(e);
  }
};

export const snare = async (note = "D1") => {
  try {
    await init();
    postDebounce("snare", () => {
      tomSynth1.triggerAttackRelease(note, 0.02);
    });
  } catch (e) {
    console.warn(e);
  }
};

export const hihat = async (note = "D4") => {
  try {
    await init();
    postDebounce("hihat", () => {
      tomSynth2.triggerAttackRelease(note, 0.1);
    });
  } catch (e) {
    console.warn(e);
  }
};
