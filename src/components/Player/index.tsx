import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Group, Vector3 } from "three";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { HealthBar } from "../UI/HealthBar";
import { MOVEMENT_DAMPING, getMovement } from "../../constants";
import useGame from "../../Stores/useGame";
import { AttackEffect } from "./Effects/Attack";

const speed = 0.2;
const maxSpeed = 5;

const reuseableVector3a = new Vector3();
const reuseableVector3b = new Vector3();

export const Player = () => {
  const players = useGame((s) => s.players);
  const setPlayers = useGame((s) => s.setPlayers);

  const [playerId, setPlayerId] = useState<string>("init");

  const body = useRef<RapierRigidBody | null>(null);
  const group = useRef<Group | null>(null);
  const { viewport } = useThree();
  const [subscribeKeys] = useKeyboardControls();

  const health = useMemo(() => {
    const currentHealth = players[playerId]?.health || 0;
    return currentHealth;
  }, [players, playerId]);

  useEffect(() => {
    if (health < 0) {
      const playersCopy = { ...players };
      playersCopy[playerId].dead = true;
      setPlayers(playersCopy);
    }
  }, [health]);

  useLayoutEffect(() => {
    const id = "p1";

    setPlayerId(id);

    setPlayers({
      ...players,
      [id]: {
        id,
        body,
        health: 100,
        type: "player",
        dead: false,
      },
    });
  }, []);

  useEffect(() => {
    const unsubscribeUp = subscribeKeys(
      (state) => state.up,
      () => {
        console.log("up");
      }
    );

    return () => {
      unsubscribeUp();
    };
  }, []);

  useFrame(({ mouse }) => {
    if (body.current) {
      const x = (mouse.x * viewport.width) / 2;
      const y = (mouse.y * viewport.height) / 2;

      const currentTranslation = body.current.translation();

      const currentPosition = reuseableVector3a.set(
        currentTranslation.x,
        currentTranslation.y,
        currentTranslation.z
      );

      if (group?.current) {
        group?.current.position.copy(currentPosition);
      }

      const mousePosition = reuseableVector3b.set(x, y, currentTranslation.z);

      const impulse = { x: 0, y: 0, z: 0 };

      let goX = getMovement(mousePosition.x, currentPosition.x);
      let goY = getMovement(mousePosition.y, currentPosition.y);

      impulse.x = goX * speed;
      impulse.y = goY * speed;

      if (Math.abs(impulse.x) > maxSpeed) {
        impulse.x = maxSpeed;
      }
      if (Math.abs(impulse.y) > maxSpeed) {
        impulse.y = maxSpeed;
      }

      body.current.applyImpulse(impulse, true);
    }
  });

  const takeDamage = (damage: number) => {
    const playersCopy = { ...players };

    playersCopy[playerId].health -= damage;

    setPlayers(playersCopy);
  };

  return (
    <>
      <group ref={group}>
        <HealthBar health={health} />
        <AttackEffect />
      </group>

      <RigidBody
        ref={body}
        lockRotations
        canSleep={false}
        restitution={0.2}
        friction={1}
        linearDamping={MOVEMENT_DAMPING * 3}
        angularDamping={MOVEMENT_DAMPING * 2}
        onCollisionEnter={({ other }) => {
          if (other.rigidBodyObject?.userData?.type === "enemy") {
            const damage = other.rigidBodyObject?.userData?.strength || 10;
            takeDamage(damage);
          }
        }}
        userData={{
          type: "player",
        }}
      >
        <mesh>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
      </RigidBody>
    </>
  );
};
