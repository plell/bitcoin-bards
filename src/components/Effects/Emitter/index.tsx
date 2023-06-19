import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Mesh, Vector3 } from "three";

type Props = {
  active: boolean;
  position: Vector3;
};

export const Emitter = ({ active, position }: Props) => {
  const ref = useRef<Mesh | null>(null);
  const [intensity, setIntensity] = useState(0);

  useEffect(() => {
    if (ref.current) {
      ref.current.scale.set(0, 0, 0);
    }

    if (active) {
      setIntensity(1);
    } else {
      setIntensity(0);
    }
  }, [active]);

  useFrame((_, delta) => {
    if (active && ref.current) {
      const scale = ref.current.scale.x + 6 * delta;
      ref.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <>
      <mesh ref={ref}>
        <ringGeometry args={[2, 3, 20]} />
        <meshStandardMaterial wireframe color={"purple"} />
      </mesh>
    </>
  );
};
