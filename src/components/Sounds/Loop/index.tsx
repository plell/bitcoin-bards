import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { playSound } from "../Tone";
import { grid } from "../../../constants";
import useGame from "../../../Stores/useGame";

const speed = 50;

const getNoteGridPosition = (step: number, stepCount: number) => {
  const stepWidth = grid.width / stepCount;
  return step * stepWidth - grid.width / 2;
};

export const Loop = () => {
  const players = useGame((s) => s.players);
  const loopPattern = useGame((s) => s.loopPattern);

  const ref = useRef<Mesh | null>(null);
  const [playedList, setPlayedList] = useState<string[]>([]);
  const [playedPattern, setPlayedPattern] = useState<number[]>([]);

  const enemies = useGame((s) => s.enemies);
  const setEnemies = useGame((s) => s.setEnemies);

  useFrame((_, delta) => {
    if (!ref.current) {
      return;
    }

    // reset looper
    if (ref.current.position.x > grid.width / 2) {
      ref.current.position.x = -grid.width / 2;
      setPlayedList([]);
      setPlayedPattern([]);
    }

    // move loop forward
    ref.current.position.x += delta * speed;

    // for other players
    Object.keys(players).forEach((playerId) => {
      const pp = players[playerId];

      const { x } = pp?.body?.current?.translation() || { x: 0 };

      if (
        !playedList?.includes(playerId) &&
        x < (ref?.current?.position.x || 0)
      ) {
        playSound();
        setPlayedList([...playedList, playerId]);

        // do enemy damage
        const enemiesCopy = { ...enemies };
        Object.keys(enemies).forEach((id: string) => {
          enemiesCopy[id].health -= 10;
        });
        setEnemies(enemiesCopy);
      }
    });

    // do pattern
    loopPattern.notes.forEach((note) => {
      const x = getNoteGridPosition(note.step, loopPattern.stepCount);

      if (
        !playedPattern?.includes(note.id) &&
        x < (ref?.current?.position.x || 0)
      ) {
        playSound(note.pitch);
        setPlayedPattern([...playedPattern, note.id]);
      }
    });
  });

  return (
    <>
      <mesh ref={ref}>
        <boxGeometry args={[1, grid.height, 1]} />
        <meshStandardMaterial />
      </mesh>

      {/* patterns */}
      {loopPattern.notes.map((note, i) => {
        const x = getNoteGridPosition(note.step, loopPattern.stepCount);
        return (
          <mesh key={i} position={[x, 0, 0]} userData={note}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={"red"} />
          </mesh>
        );
      })}
    </>
  );
};
