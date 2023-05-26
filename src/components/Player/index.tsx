import AppContext from "../hooks/createContext";
import { useEffect, useRef, useContext } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import { RigidBody } from "@react-three/rapier";

const step = 0.1;

const variableVector3 = new Vector3();

export const Player = () => {
  const {
    playerPosition: [, setPlayerPosition],
  } = useContext(AppContext)!;

  const ref = useRef<Mesh | null>(null);
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
    if (ref.current) {
      const { left, right, up, down } = getKeys();

      let _x = 0;
      let _y = 0;
      let _z = 0;

      if (left) {
        _x -= step;
      }
      if (right) {
        _x += step;
      }
      if (up) {
        _y += step;
      }
      if (down) {
        _y -= step;
      }

      const { x, y, z } = ref.current.position;
      const newPosition = variableVector3.set(x + _x, y + _y, z + _z);
      ref.current.position.set(newPosition.x, newPosition.y, newPosition.z);
      setPlayerPosition(newPosition);
    }
  });

  return (
    <RigidBody type={"kinematicVelocity"}>
      <mesh ref={ref}>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </RigidBody>
  );
};
