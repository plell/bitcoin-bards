import React, { useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Plane } from "@react-three/drei";
import { Group, Mesh, Vector3 } from "three";

interface HealthBarProps {
  health: number;
  position: Vector3;
}

export const HealthBar: React.FC<HealthBarProps> = ({ health, position }) => {
  const barWidth = 1;
  const barHeight = 0.2;
  const barColor = "teal";
  const groupRef = useRef<Group | null>(null);
  const ref = useRef<Mesh | null>(null);

  useFrame(() => {
    // Update the width of the health bar based on the health value
    const newWidth = (health / 100) * barWidth;
    if (ref.current && newWidth > 0 && newWidth <= barWidth) {
      // Only update the width if it's within valid range
      ref.current.scale.x = newWidth;
    }
    if (groupRef?.current) {
      groupRef?.current.position.copy(position);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Empty health bar */}
      <Plane args={[barWidth, barHeight]} position={[0, 0.6, 0.6]}>
        <meshStandardMaterial color='white' />
      </Plane>

      {/* Filled health bar */}
      <Plane ref={ref} args={[barWidth, barHeight]} position={[0, 0.6, 0.61]}>
        <meshStandardMaterial color={barColor} />
      </Plane>
    </group>
  );
};

export default HealthBar;
