import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, Mesh, MeshBasicMaterial, Vector3 } from "three";
import { hihat, kick, playSound, snare } from "../Tone";
import { getPushMovement, grid, postDebounce } from "../../../Stores/constants";
import useGame from "../../../Stores/useGame";
import { useKeyboardControls } from "@react-three/drei";
import { Note, Player, Players } from "../../../Stores/types";
import { RigidBody } from "@react-three/rapier";
import { Emitter } from "../../Effects/Emitter";

const reuseableVector3 = new Vector3();

export const Loop = () => {
  const players = useGame((s) => s.players);
  const tempo = useGame((s) => s.tempo);
  const setTempoUp = useGame((s) => s.setTempoUp);
  const setTempoDown = useGame((s) => s.setTempoDown);

  const worldTile = useGame((s) => s.worldTile);

  const loopPattern = worldTile.pattern;

  const ref = useRef<Mesh | null>(null);
  const [playedList, setPlayedList] = useState<string[]>([]);
  const [playedPattern, setPlayedPattern] = useState<string[]>([]);

  const [playedRhythm, setPlayedRhythm] = useState<number[]>([]);

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
    if (ref.current) {
      let scale = 1;

      if (worldTile.shrine) {
        scale = 0;
      }

      ref.current.scale.set(scale, scale, scale);
    }
  }, [worldTile]);

  useEffect(() => {
    const newPlayed: string[] = [];

    loopPattern.notes.forEach((note) => {
      if (
        !newPlayed?.includes(note.id) &&
        note.position.x < (ref?.current?.position.x || 0)
      ) {
        newPlayed.push(note.id);
      }
    });

    setPlayedPattern(newPlayed);
  }, [loopPattern]);

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
    if (worldTile.shrine || players["p1"]?.dead) {
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
      if (
        !playedPattern?.includes(note.id) &&
        note.position.x < (ref?.current?.position.x || 0)
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
            played={playedPattern?.includes(note.id)}
            color={worldTile.color}
            note={note}
            key={`note-${note.id}-${i}`}
          />
        );
      })}
    </>
  );
};

type NoteComponentProps = {
  note: Note;
  color: string;
  played: boolean;
};

const NoteComponent = ({ note, color, played }: NoteComponentProps) => {
  const { position } = note;

  const material = useRef<MeshBasicMaterial | null>(null);
  const [loaded, setLoaded] = useState(false);
  const enemies = useGame((s) => s.enemies);
  const setEnemies = useGame((s) => s.setEnemies);
  const [emitterActive, setEmitterActive] = useState(false);

  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
    } else if (played) {
      emit();
    }
  }, [played]);

  const emit = () => {
    //  do enemy damage

    const enemiesClone = { ...enemies };
    let hit = false;
    Object.values(enemies).forEach((e) => {
      const { body, dead } = e;

      if (dead) {
        return;
      }

      const aPosition = body?.current?.translation();
      const targetPosition = reuseableVector3.set(
        aPosition?.x || 0,
        aPosition?.y || 0,
        aPosition?.z || 0
      );

      const distance = position.distanceTo(targetPosition);

      if (distance < 6) {
        hit = true;
        enemiesClone[e.id].health -= 20;
        if (enemiesClone[e.id]?.body?.current) {
          const impulse = getPushMovement(position, targetPosition);
          enemiesClone[e.id].body?.current?.applyImpulse(impulse, true);
        }
      }
    });

    if (hit) {
      setEnemies(enemiesClone);
    }

    // flash
    material.current?.color.set(new Color("red"));
    setEmitterActive(true);

    setTimeout(() => {
      material.current?.color.set(new Color(color));
      setEmitterActive(false);
    }, 200);
  };

  return (
    <group position={position}>
      <Emitter position={position} active={emitterActive} />
      <RigidBody type={"fixed"} userData={note} restitution={2}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial ref={material} color={color} />
        </mesh>
      </RigidBody>
    </group>
  );
};
