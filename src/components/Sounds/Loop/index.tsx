import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, Mesh, MeshBasicMaterial } from "three";
import { hihat, kick, playSound, snare } from "../Tone";
import { grid, postDebounce } from "../../../Stores/constants";
import useGame from "../../../Stores/useGame";
import { useKeyboardControls } from "@react-three/drei";
import { Note } from "../../../Stores/types";
import { RigidBody } from "@react-three/rapier";

const getNoteGridPosition = (step: number, stepCount: number) => {
  const stepWidth = grid.width / stepCount;
  return step * stepWidth - grid.width / 2;
};

export const Loop = () => {
  const players = useGame((s) => s.players);
  const tempo = useGame((s) => s.tempo);
  const setTempoUp = useGame((s) => s.setTempoUp);
  const setTempoDown = useGame((s) => s.setTempoDown);

  const worldTile = useGame((s) => s.worldTile);

  const loopPattern = worldTile.pattern;

  const ref = useRef<Mesh | null>(null);
  const [playedList, setPlayedList] = useState<string[]>([]);
  const [playedPattern, setPlayedPattern] = useState<number[]>([]);

  const [playedRhythm, setPlayedRhythm] = useState<number[]>([]);

  const enemies = useGame((s) => s.enemies);
  const setEnemies = useGame((s) => s.setEnemies);

  const [subscribeKeys] = useKeyboardControls();

  useEffect(() => {
    const unsubscribeUp = subscribeKeys(
      (state) => state.up,
      () => {
        setTempoUp();
      }
    );

    const unsubscribeDown = subscribeKeys(
      (state) => state.down,
      () => {
        setTempoDown();
      }
    );

    return () => {
      unsubscribeUp();
      unsubscribeDown();
    };
  }, []);

  useEffect(() => {
    const newPlayed: number[] = [];

    loopPattern.notes.forEach((note) => {
      const x = getNoteGridPosition(note.step, loopPattern.stepCount);

      if (
        !newPlayed?.includes(note.id) &&
        x < (ref?.current?.position.x || 0)
      ) {
        newPlayed.push(note.id);
      }
    });

    setPlayedPattern(newPlayed);
  }, [loopPattern]);

  useEffect(() => {
    // do enemy damage
    const enemiesCopy = { ...enemies };
    Object.keys(enemies).forEach((id: string) => {
      enemiesCopy[id].health -= 1;
    });
    setEnemies(enemiesCopy);
  }, [playedPattern.length]);

  const resetLoop = () => {
    if (ref.current) {
      ref.current.position.x = -grid.width / 2;
    }

    setPlayedList([]);
    setPlayedPattern([]);
    setPlayedRhythm([]);
  };

  useEffect(() => {
    if (worldTile.shrine) {
      resetLoop();
    }
  }, [worldTile]);

  useFrame((_, delta) => {
    if (worldTile.shrine) {
      return;
    }

    if (!ref.current) {
      return;
    }

    // move loop forward
    ref.current.position.x += delta * tempo;

    // reset looper
    if (ref.current.position.x > grid.width / 2) {
      ref.current.position.x = -grid.width / 2;
      kick();
      resetLoop();
    }

    // halfway
    if (ref.current.position.x > 0 && !playedRhythm.includes(0)) {
      snare();
      setPlayedRhythm([...playedRhythm, 0]);
    }

    if (
      ref.current.position.x > -(grid.width / 2 / 2) &&
      !playedRhythm.includes(2)
    ) {
      hihat();
      setPlayedRhythm([...playedRhythm, 2]);
    }

    if (
      ref.current.position.x > grid.width / 2 / 2 &&
      !playedRhythm.includes(1)
    ) {
      hihat();
      setPlayedRhythm([...playedRhythm, 1]);
    }

    // // for other players
    // Object.keys(players).forEach((playerId) => {
    //   const pp = players[playerId];

    //   const { x } = pp?.body?.current?.translation() || { x: 0 };

    //   if (
    //     !playedList?.includes(playerId) &&
    //     x < (ref?.current?.position.x || 0)
    //   ) {
    //     // playSound(999);
    //     setPlayedList([...playedList, playerId]);

    //     // do enemy damage
    //     const enemiesCopy = { ...enemies };
    //     Object.keys(enemies).forEach((id: string) => {
    //       enemiesCopy[id].health -= 10;
    //     });
    //     setEnemies(enemiesCopy);
    //   }
    // });

    // do pattern
    loopPattern.notes.forEach((note) => {
      const x = getNoteGridPosition(note.step, loopPattern.stepCount);

      if (
        !playedPattern?.includes(note.id) &&
        x < (ref?.current?.position.x || 0)
      ) {
        postDebounce(
          "pattern",
          () => {
            playSound(note.pitch);
            setPlayedPattern([...playedPattern, note.id]);
          },
          10
        );
      }
    });
  });

  return (
    <>
      <mesh ref={ref}>
        <boxGeometry args={[3, grid.height, 1]} />
        <meshStandardMaterial />
      </mesh>

      {/* patterns */}
      {loopPattern.notes.map((note, i) => {
        return (
          <NoteComponent
            loopX={ref?.current?.position.x || 0}
            played={playedPattern?.includes(note.id)}
            stepCount={loopPattern.stepCount}
            color={worldTile.color}
            note={note}
            key={`note-${i}`}
          />
        );
      })}
    </>
  );
};

type NoteComponentProps = {
  stepCount: number;
  note: Note;
  color: string;
  played: boolean;
  loopX: number;
};

const NoteComponent = ({
  note,
  stepCount,
  color,
  played,
  loopX,
}: NoteComponentProps) => {
  const x = useMemo(() => getNoteGridPosition(note.step, stepCount), []);
  const material = useRef<MeshBasicMaterial | null>(null);

  useEffect(() => {
    if (played) {
      material.current?.color.set(new Color("red"));

      setTimeout(() => {
        material.current?.color.set(new Color(color));
      }, 60);
    }
  }, [played]);

  return (
    <RigidBody type={"fixed"} position={[x, note.y, 0]} userData={note}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial ref={material} color={color} />
      </mesh>
    </RigidBody>
  );
};
