import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useKeyboardControls, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Group, Vector3 } from "three";
import { RigidBody, RapierRigidBody, vec3 } from "@react-three/rapier";
import { HealthBar } from "../UI/HealthBar";
import {
  MOVEMENT_DAMPING,
  NeighborTiles,
  getMovement,
  getNeighborTiles,
} from "../../Stores/constants";
import useGame from "../../Stores/useGame";
import { AttackEffect } from "./Effects/Attack";

import { RigidBodyData, WorldTile } from "../../Stores/types";

const speed = 0.2;

const reuseableVector3a = new Vector3();
const reuseableVector3b = new Vector3();

export const Player = () => {
  const players = useGame((s) => s.players);
  const setPlayers = useGame((s) => s.setPlayers);
  const worldTile = useGame((s) => s.worldTile);
  const setNextWorldTile = useGame((s) => s.setNextWorldTile);

  const playerTexture = useTexture("sprites/tomo.png");

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
    if (worldTile && body.current) {
      const current = body.current.translation();

      console.log("set translation!");

      body.current.setTranslation(vec3({ x: 0, y: 0, z: 0 }), true);
    }
  }, [worldTile]);

  useEffect(() => {
    if (health < 0 && !players[playerId].dead) {
      const playersCopy = { ...players };
      playersCopy[playerId].dead = true;
      setPlayers(playersCopy);
    }
  }, [health, players]);

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

      let movement = getMovement(currentPosition, mousePosition, speed);

      impulse.x = movement.x;
      impulse.y = movement.y;

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
        type='dynamic'
        lockRotations
        canSleep={false}
        restitution={0.2}
        friction={1}
        colliders={"ball"}
        linearDamping={MOVEMENT_DAMPING * 3}
        angularDamping={MOVEMENT_DAMPING * 2}
        onCollisionEnter={({ other }) => {
          const object = other.rigidBodyObject?.userData as RigidBodyData;
          if (object?.type === "enemy") {
            const damage = object?.strength || 10;
            takeDamage(damage);
          }
          if (object?.type === "portal") {
            const neighborTiles: NeighborTiles = getNeighborTiles(
              worldTile.position
            );

            const tile: WorldTile | null = object?.name
              ? neighborTiles[object.name]
              : null;

            if (tile && body?.current) {
              // body.current.lockTranslations(true, true);
              setNextWorldTile(tile);
            }
          }
        }}
        userData={{
          type: "player",
        }}
      >
        <mesh>
          <planeGeometry />
          <meshStandardMaterial transparent map={playerTexture} />
        </mesh>
      </RigidBody>
    </>
  );
};
