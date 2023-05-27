import { useEffect, useContext, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import AppContext from "../hooks/createContext";
import { RigidBody } from "@react-three/rapier";

type EnemyProps = {
  startPosition: Vector3;
  movementInterval: number;
  speed: number;
};

type Timeout = ReturnType<typeof setTimeout>;

export const Enemy = ({
  startPosition,
  movementInterval,
  speed,
}: EnemyProps) => {
  const {
    playerPosition: [playerPosition],
  } = useContext(AppContext)!;

  const [enemyTurnTimeout, setEnemyTurnTimeout] = useState<Timeout | null>(
    null
  );
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
    setDestination(playerPosition.clone());

    const nextMoveTimeout = setTimeout(() => {
      updateDestination();
    }, movementInterval);

    setEnemyTurnTimeout(nextMoveTimeout);
  };

  useFrame(() => {
    if (enemyRef.current) {
      enemyRef.current.position.lerp(destination, speed * 0.01);
    }
  });

  return (
    <RigidBody type={"kinematicVelocity"}>
      <mesh ref={enemyRef} position={startPosition}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color='red' />
      </mesh>
    </RigidBody>
  );
};

export default Enemy;
