import { useContext, useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import AppContext from "../../hooks/createContext";
import { playSound } from "../Tone";

const step = 0.2;
const startX = -20;

export const Loop = () => {
  const {
    playerPosition: [playerPosition],
    playerPositions: [playerPositions],
  } = useContext(AppContext)!;

  const ref = useRef<Mesh | null>(null);
  const [played, setPlayed] = useState(false);
  const [playedList, setPlayedList] = useState<string[]>([]);

  useEffect(() => {
    console.log("played", played);
  }, [played, playedList]);

  useFrame(() => {
    if (!ref.current) {
      return;
    }

    // reset looper
    if (ref.current.position.x > 16) {
      ref.current.position.x = startX;
      setPlayed(false);
      setPlayedList([]);
    }

    // move loop forward
    ref.current.position.x += step;

    // for the player
    if (!played && playerPosition.x < ref.current.position.x) {
      playSound();
      setPlayed(true);
    }

    // for other players
    Object.keys(playerPositions).forEach((playerId) => {
      const pp = playerPositions[playerId];

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
      <boxGeometry args={[1, 300, 1]} />
      <meshStandardMaterial />
    </mesh>
  );
};
