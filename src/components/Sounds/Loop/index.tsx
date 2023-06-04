import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { playSound } from "../Tone";
import { grid } from "../../../constants";
import useGame from "../../../Stores/useGame";
import { pattern } from "./constants";

const speed = 50;

const getNoteGridPosition = (step: number, stepCount: number) => {
  const stepWidth = grid.width / stepCount;
  return step * stepWidth - grid.width / 2;
};

export const Loop = () => {
  const playerBodyRefs = useGame((s) => s.playerBodyRefs);

  const ref = useRef<Mesh | null>(null);
  const [playedList, setPlayedList] = useState<string[]>([]);
  const [playedPattern, setPlayedPattern] = useState<number[]>([]);

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
    Object.keys(playerBodyRefs).forEach((playerId) => {
      const pp = playerBodyRefs[playerId];

      const { x } = pp?.current?.translation() || { x: 0 };

      if (
        !playedList?.includes(playerId) &&
        x < (ref?.current?.position.x || 0)
      ) {
        playSound();
        setPlayedList([...playedList, playerId]);
      }
    });

    // do pattern
    pattern.notes.forEach((p) => {
      const x = getNoteGridPosition(p.step, pattern.stepCount);

      if (
        !playedPattern?.includes(p.id) &&
        x < (ref?.current?.position.x || 0)
      ) {
        playSound();
        setPlayedPattern([...playedPattern, p.id]);
      }
    });
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, grid.height, 1]} />
      <meshStandardMaterial />
    </mesh>
  );
};
