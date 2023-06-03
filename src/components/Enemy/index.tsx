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

const reuseableVector3 = new Vector3();

export const Enemy = ({
  startPosition,
  movementInterval,
  speed,
}: EnemyProps) => {
  const playerBodyRefs = useGame((s) => s.playerBodyRefs);

  let timeout: Timeout = useMemo(
    () =>
      setTimeout(() => {
        updateDestination();
      }, movementInterval),
    []
  );

  const body = useRef<RapierRigidBody | null>(null);

  const getClosestPlayerPosition = () => {
    const closest: any = {
      key: "",
      distance: null,
      position: null,
    };

    Object.keys(playerBodyRefs).forEach((key) => {
      const playerBodyRef = playerBodyRefs[key];
      const aPosition = playerBodyRef?.current?.translation();
      const bPosition = body?.current?.translation();
      if (aPosition !== undefined && bPosition !== undefined) {
        const playerPosition = reuseableVector3.set(
          aPosition?.x,
          aPosition?.y,
          aPosition?.z
        );
        const enemyPosition = reuseableVector3.set(
          bPosition?.x,
          bPosition?.y,
          bPosition?.z
        );

        const distance = enemyPosition.distanceTo(playerPosition);
        if (!closest.distance || closest.distance > distance) {
          closest.key = key;
          closest.distance = distance;
          closest.position = playerPosition;
        }
      }
    });

    if (closest.position) {
      return closest.position;
    }

    return reuseableVector3.set(0, 0, 0);
  };

  const [destination, setDestination] = useState<Vector3>(
    getClosestPlayerPosition()
  );

  useEffect(() => {
    return function () {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  const updateDestination = useCallback(() => {
    const closestPlayerPosition = getClosestPlayerPosition();

    setDestination(closestPlayerPosition.clone());
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      updateDestination();
    }, movementInterval);
  }, [playerBodyRefs]);

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
