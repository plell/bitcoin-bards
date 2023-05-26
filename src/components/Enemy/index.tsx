import { useEffect, useContext, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import AppContext from "../hooks/createContext";
import { RigidBody } from "@react-three/rapier";

let enemyTurnTimeout: ReturnType<typeof setTimeout> | null = null;

export const Enemy = () => {
  const {
    playerPosition: [playerPosition],
  } = useContext(AppContext)!;

  const enemyRef = useRef<THREE.Mesh>(null);
  const [destination, setDestination] = useState<Vector3>(new Vector3(0, 0, 0));

  useEffect(() => {
    updateDestination();

    return () => {
      if (enemyTurnTimeout) {
        clearTimeout(enemyTurnTimeout);
      }
    };
  }, [playerPosition]);

  const updateDestination = () => {
    enemyTurnTimeout = setTimeout(() => {
      console.log("updateDestination");
      setDestination(playerPosition.clone());
      updateDestination();
    }, 1600);
  };

  useFrame(() => {
    if (enemyRef.current) {
      enemyRef.current.position.lerp(destination, 0.04);
    }
  });

  return (
    <RigidBody type={"kinematicVelocity"}>
      <mesh ref={enemyRef}>
        <boxBufferGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color='red' />
      </mesh>
    </RigidBody>
  );
};

export default Enemy;
