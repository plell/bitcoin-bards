import { useEffect, useLayoutEffect, useRef } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { RigidBody, RapierRigidBody } from "@react-three/rapier";
import { HealthBar } from "../UI/HealthBar";
import { MOVEMENT_DAMPING, getMovement } from "../../constants";
import useGame from "../../Stores/useGame";

const speed = 0.2;
const maxSpeed = 5;

const reuseableVector3a = new Vector3();
const reuseableVector3b = new Vector3();

export const Player = () => {
  const playerBodyRefs = useGame((s) => s.playerBodyRefs);
  const setPlayerBodyRefs = useGame((s) => s.setPlayerBodyRefs);

  const body = useRef<RapierRigidBody | null>(null);
  const { viewport } = useThree();
  const [subscribeKeys] = useKeyboardControls();

  useLayoutEffect(() => {
    setPlayerBodyRefs({ ...playerBodyRefs, me: body });
  }, [body?.current]);

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
