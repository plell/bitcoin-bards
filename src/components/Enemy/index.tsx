import { useEffect, useRef, useState, useMemo, useLayoutEffect } from "react";
import { Vector3 } from "three";

import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { MOVEMENT_DAMPING, getMovement } from "../../constants";
import HealthBar from "../UI/HealthBar";
import useGame from "../../Stores/useGame";
import { Players } from "../../Stores/types";

type EnemyProps = {
  startPosition: Vector3;
  movementInterval: number;
  speed: number;
};

type Interval = ReturnType<typeof setInterval>;

const reuseableVector3a = new Vector3();
const reuseableVector3b = new Vector3();

export const Enemy = ({
  startPosition,
  movementInterval,
  speed,
}: EnemyProps) => {
  const players = useGame((s) => s.players);
  const enemies = useGame((s) => s.enemies);
  const setEnemies = useGame((s) => s.setEnemies);
  const [id, setId] = useState(0);

  const body = useRef<RapierRigidBody | null>(null);

  const health = useMemo(() => {
    const currentHealth = enemies[id]?.health || 0;
    return currentHealth;
  }, [enemies, id]);

  let interval: Interval | null = null;

  useLayoutEffect(() => {
    const id = Object.keys(enemies).length;
    setId(id);
    setEnemies({
      ...enemies,
      [id]: {
        id,
        body,
        health: 100,
        type: "enemy",
      },
    });
  }, [body?.current]);

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
  }, [players]);

  const getClosestMeshPosition = (
    sourceRigidBody: React.MutableRefObject<RapierRigidBody | null>,
    surroundingRigidBodies: Players
  ) => {
    const closest: any = {
      key: "",
      distance: null,
      position: null,
    };

    Object.keys(surroundingRigidBodies).forEach((key) => {
      const player = surroundingRigidBodies[key];
      const meshBodyRef = player.body;

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

      const destination = getClosestMeshPosition(body, players);

      let goX = getMovement(destination.x, currentPosition.x);
      let goY = getMovement(destination.y, currentPosition.y);

      impulse.x = goX * speed * 0.2;
      impulse.y = goY * speed * 0.2;

      body.current.applyImpulse(impulse, true);
    }
  };

  return (
    <>
      <HealthBar health={health} bodyRef={body} />
      <RigidBody
        ref={body}
        restitution={6}
        friction={1}
        position={startPosition}
        canSleep={false}
        lockRotations
        colliders='ball'
        linearDamping={MOVEMENT_DAMPING}
        angularDamping={MOVEMENT_DAMPING}
        userData={{
          type: "enemy",
        }}
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
