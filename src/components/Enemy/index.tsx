import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Mesh, Vector3 } from "three";

import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { MOVEMENT_DAMPING } from "../../constants";
import HealthBar from "../UI/HealthBar";
import useGame from "../../Stores/useGame";

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
  const playerPositions = useGame((s) => s.playerPositions);

  let timeout: Timeout = useMemo(
    () =>
      setTimeout(() => {
        updateDestination();
      }, movementInterval),
    []
  );

  const body = useRef<RapierRigidBody | null>(null);

  const [destination, setDestination] = useState<Vector3>(
    new Vector3(
      playerPositions["me"]?.x || 0,
      playerPositions["me"]?.y || 0,
      playerPositions["me"]?.z || 0
    )
  );

  useEffect(() => {
    return function () {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  const updateDestination = useCallback(() => {
    const closestPlayer = playerPositions["me"] || new Vector3();
    setDestination(closestPlayer.clone());
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      updateDestination();
    }, movementInterval);
  }, [playerPositions]);

  useEffect(() => {
    applyForce();
  }, [destination]);

  const applyForce = () => {
    if (body.current) {
      const currentPosition = body.current.translation();
      const impulse = { x: 0, y: 0, z: 0 };

      if (destination.x < currentPosition.x) {
        impulse.x -= speed;
      }
      if (destination.x > currentPosition.x) {
        impulse.x += speed;
      }
      if (destination.y < currentPosition.y) {
        impulse.y -= speed;
      }
      if (destination.y > currentPosition.y) {
        impulse.y += speed;
      }

      body.current.applyImpulse(impulse, true);
    }
  };

  return (
    <>
      <HealthBar health={80} bodyRef={body} />
      <RigidBody
        ref={body}
        restitution={0.2}
        friction={1}
        onWake={() => {
          console.log("wake!");
        }}
        position={startPosition}
        canSleep={false}
        lockRotations
        colliders='ball'
        linearDamping={MOVEMENT_DAMPING}
        angularDamping={MOVEMENT_DAMPING}
      >
        <mesh>
          <sphereGeometry />
          <meshBasicMaterial color='red' />
        </mesh>
      </RigidBody>
    </>
  );
};

export default Enemy;
