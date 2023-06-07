import { useEffect, useRef, useMemo, useLayoutEffect } from "react";
import { Group, Vector3 } from "three";

import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { MOVEMENT_DAMPING, getMovement, grid } from "../../Stores/constants";
import HealthBar from "../UI/HealthBar";
import useGame from "../../Stores/useGame";
import { Player, Players } from "../../Stores/types";
import { useFrame } from "@react-three/fiber";

type Interval = ReturnType<typeof setInterval>;

const reuseableVector3a = new Vector3();
const reuseableVector3b = new Vector3();
const reuseableVector3c = new Vector3();
const reuseableVector3d = new Vector3();

const movementInterval = 600;
const speed = 2;

const padding = 1;
const getEnemyStartPosition = () => {
  let x =
    Math.random() - 0.5 < 0
      ? -(grid.width / 2) + padding
      : grid.width / 2 - padding;
  let y =
    Math.random() - 0.5 < 0
      ? -(grid.height / 2) + padding
      : grid.height / 2 - padding;

  const side = Math.random() - 0.5;
  if (side < 1) {
    x = Math.random() * grid.width - grid.width / 2;
  } else {
    y = Math.random() * grid.height - grid.height / 2;
  }

  return new Vector3(x, y, 0);
};

export const Enemy = (props: Player) => {
  const players = useGame((s) => s.players);
  const enemies = useGame((s) => s.enemies);
  const setEnemies = useGame((s) => s.setEnemies);

  const body = useRef<RapierRigidBody | null>(null);
  const group = useRef<Group | null>(null);

  const health = useMemo(() => {
    const currentHealth = enemies[props.id]?.health || 0;
    return currentHealth;
  }, [enemies, props.id]);

  let interval: Interval | null = null;

  const startPosition = useMemo(() => {
    return getEnemyStartPosition();
  }, []);

  useEffect(() => {
    if (!enemies[props.id]) {
      return;
    }

    if (health < 1 && !enemies[props.id].dead) {
      const enemiesCopy = { ...enemies };
      enemiesCopy[props.id].dead = true;
      setEnemies(enemiesCopy);
    }
  }, [health, enemies]);

  useLayoutEffect(() => {
    const enemiesCopy = { ...enemies };
    if (enemiesCopy[props.id]) {
      enemiesCopy[props.id].body = body;
      setEnemies(enemiesCopy);
    }
  }, []);

  useFrame(() => {
    if (group?.current && body?.current) {
      const pos = body.current.translation();
      const currentPosition = reuseableVector3c.set(pos.x, pos.y, pos.z);
      group?.current.position.copy(currentPosition);
    }
  });

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
      const pos = body.current.translation();
      const currentPosition = reuseableVector3c.set(pos.x, pos.y, pos.z);

      const impulse = { x: 0, y: 0, z: 0 };

      const destination = getClosestMeshPosition(body, players);

      const movement = getMovement(currentPosition, destination, speed * 0.2);

      impulse.x = movement.x;
      impulse.y = movement.y;

      body.current.applyImpulse(impulse, true);
    }
  };

  return (
    <>
      <group ref={group}>
        <HealthBar health={health} />
      </group>

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
          <sphereGeometry args={[0.4]} />
          <meshBasicMaterial color='red' />
        </mesh>
      </RigidBody>
    </>
  );
};

export default Enemy;
