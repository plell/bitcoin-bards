import { useEffect, useRef } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { HealthBar } from "../UI/HealthBar";
import { MOVEMENT_DAMPING } from "../../constants";
import useGame from "../../Stores/useGame";

const step = 5;

const variableVector3 = new Vector3();

export const Player = () => {
  const playerPositions = useGame((s) => s.playerPositions);
  const setPlayerPositions = useGame((s) => s.setPlayerPositions);

  const body = useRef<RapierRigidBody | null>(null);
  const [subscribeKeys, getKeys] = useKeyboardControls();

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

  useFrame(() => {
    if (body.current) {
      const { left, right, up, down } = getKeys();

      let _x = 0;
      let _y = 0;
      let _z = 0;

      const impulse = { x: 0, y: 0, z: 0 };

      if (left) {
        impulse.x -= step;
      }
      if (right) {
        impulse.x += step;
      }
      if (up) {
        impulse.y += step;
      }
      if (down) {
        impulse.y -= step;
      }

      body.current.applyImpulse(impulse, true);

      const { x, y, z } = body.current.translation();
      const newPosition = variableVector3.set(x + _x, y + _y, z + _z);
      // console.log("newPosition", newPosition);
      const positions = { ...playerPositions };
      positions["me"] = newPosition;
      setPlayerPositions(positions);
    }
  });

  return (
    <>
      <HealthBar health={50} bodyRef={body} />
      <RigidBody
        ref={body}
        lockRotations
        canSleep={false}
        restitution={0.2}
        friction={1}
        linearDamping={MOVEMENT_DAMPING * 3}
        angularDamping={MOVEMENT_DAMPING * 2}
      >
        <mesh>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
      </RigidBody>
    </>
  );
};
