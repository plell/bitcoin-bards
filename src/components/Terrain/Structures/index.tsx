import { RigidBody } from "@react-three/rapier";
import useGame from "../../../Stores/useGame";
import HealthBar from "../../UI/HealthBar";
import { RigidBodyData, Structure } from "../../../Stores/types";
import { useCallback, useEffect } from "react";
import { dieSound } from "../../Sounds/Tone";

export const Structures = () => {
  const worldTile = useGame((s) => s.worldTile);
  const { shrine, structures } = worldTile;

  if (shrine) {
    return null;
  }

  return (
    <>
      {Object.keys(structures).map((id: string) => {
        const s = structures[id];
        return <StructureComponent {...s} key={id} />;
      })}
    </>
  );
};

const StructureComponent = ({
  health,
  dead,
  position,
  id,
  color,
}: Structure) => {
  const world = useGame((s) => s.world);
  const setWorld = useGame((s) => s.setWorld);
  const worldTile = useGame((s) => s.worldTile);

  useEffect(() => {
    if (health < 0 && !dead) {
      const worldCopy = world.map((w) => ({ ...w }));

      worldCopy[worldTile.id].structures[id].dead = true;

      setWorld(worldCopy);
    }
  }, [health, dead, id]);

  const takeDamage = useCallback(
    (damage: number, id: string) => {
      const worldCopy = world.map((w) => ({ ...w }));

      worldCopy[worldTile.id].structures[id].health -= damage;

      setWorld(worldCopy);
    },
    [worldTile, world, setWorld]
  );

  return (
    <group position={position}>
      <HealthBar health={health} />
      <RigidBody
        restitution={4}
        type='fixed'
        onCollisionEnter={({ other }: any) => {
          const object = other.rigidBodyObject?.userData as RigidBodyData;
          if (object?.type === "enemy") {
            const damage = object?.strength || 10;
            takeDamage(damage, id);
          }
        }}
      >
        <mesh scale={2}>
          <boxGeometry args={[2, 2, 0.8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </RigidBody>
    </group>
  );
};
