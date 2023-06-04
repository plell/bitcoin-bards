import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Mesh, Vector3 } from "three";

import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { MOVEMENT_DAMPING, getMovement } from "../../constants";
import HealthBar from "../UI/HealthBar";
import useGame from "../../Stores/useGame";

type EnemyProps = {
  startPosition: Vector3;
  movementInterval: number;
  speed: number;
};

type Interval = ReturnType<typeof setInterval>;

const reuseableVector3a = new Vector3();
const reuseableVector3b = new Vector3();

const maxSpeed = 8;

export const Enemy = ({
  startPosition,
  movementInterval,
  speed,
}: EnemyProps) => {
  const playerBodyRefs = useGame((s) => s.playerBodyRefs);

  let interval: Interval | null = null;

  useEffect(() => {
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => {
      applyForce();
    }, movementInterval);

    return function () {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [playerBodyRefs]);

  const body = useRef<RapierRigidBody | null>(null);

  const getClosestMeshPosition = (
    sourceRigidBody: React.MutableRefObject<RapierRigidBody | null>,
    surroundingRigidBodies: Record<
      string,
      React.MutableRefObject<RapierRigidBody | null>
    >
  ) => {
    const closest: any = {
      key: "",
      distance: null,
      position: null,
    };

    Object.keys(surroundingRigidBodies).forEach((key) => {
      const meshBodyRef = surroundingRigidBodies[key];

      const aPosition = meshBodyRef?.current?.translation();
      const bPosition = sourceRigidBody?.current?.translation();
      if (aPosition !== undefined && bPosition !== undefined) {
        const targetPosition = reuseableVector3a.set(
          aPosition?.x,
          aPosition?.y,
          aPosition?.z
        );
        const sourcePosition = reuseableVector3b.set(
          bPosition?.x,
          bPosition?.y,
          bPosition?.z
        );

        const distance = sourcePosition.distanceTo(targetPosition);

        if (!closest.distance || closest.distance > distance) {
          closest.key = key;
          closest.distance = distance;
          closest.position = targetPosition;
        }
      }
    });

    if (closest.position) {
      return closest.position;
    }

    return new Vector3(0, 0, 0);
  };

  const applyForce = () => {
    if (body.current) {
      const currentPosition = body.current.translation();

      const impulse = { x: 0, y: 0, z: 0 };

      const destination = getClosestMeshPosition(body, playerBodyRefs);

      let goX = getMovement(destination.x, currentPosition.x);
      let goY = getMovement(destination.y, currentPosition.y);

      impulse.x = goX * speed * 0.2;
      impulse.y = goY * speed * 0.2;

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
