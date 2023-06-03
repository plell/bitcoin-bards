import { useContext, useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { playSound } from "../Tone";
import { grid } from "../../../constants";
import useGame from "../../../Stores/useGame";

const step = 50;

export const Loop = () => {
  const playerBodyRefs = useGame((s) => s.playerBodyRefs);

  const ref = useRef<Mesh | null>(null);
  const [played, setPlayed] = useState(false);
  const [playedList, setPlayedList] = useState<string[]>([]);

  useEffect(() => {
    // console.log("played", played);
  }, [played, playedList]);

  useFrame((_, delta) => {
    if (!ref.current) {
      return;
    }

    // reset looper
    if (ref.current.position.x > grid.width / 2) {
      ref.current.position.x = -grid.width / 2;
      setPlayed(false);
      setPlayedList([]);
    }

    // move loop forward
    ref.current.position.x += delta * step;

    // for other players
    Object.keys(playerBodyRefs).forEach((playerId) => {
      const pp = playerBodyRefs[playerId];

      if (
        !playedList?.includes(playerId) &&
        pp.x < (ref?.current?.position.x || 0)
      ) {
        playSound();
        setPlayedList([...playedList, playerId]);
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
