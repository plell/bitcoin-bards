import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Plane } from "@react-three/drei";
import { Mesh } from "three";

interface HealthBarProps {
  health: number;
}

export const HealthBar: React.FC<HealthBarProps> = ({ health }) => {
  const barWidth = 1;
  const barHeight = 0.2;
  const barColor = "teal";
  const ref = useRef<Mesh | null>(null);

  useFrame(() => {
    // Update the width of the health bar based on the health value
    const newWidth = (health / 100) * barWidth;
    if (ref.current && newWidth > 0 && newWidth <= barWidth) {
      // Only update the width if it's within valid range
      ref.current.scale.x = newWidth;
    }
  });

  return (
    <>
      {/* Empty health bar */}
      <Plane args={[barWidth, barHeight]} position={[0, 0.6, 1.6]}>
        <meshStandardMaterial color='white' />
      </Plane>

      {/* Filled health bar */}
      <Plane ref={ref} args={[barWidth, barHeight]} position={[0, 0.6, 1.61]}>
        <meshStandardMaterial color={barColor} />
      </Plane>
    </>
  );
};

export default HealthBar;
