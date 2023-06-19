import { RigidBody } from "@react-three/rapier";
import useGame from "../../../Stores/useGame";
import HealthBar from "../../UI/HealthBar";
import { RigidBodyData } from "../../../Stores/types";
import { useCallback } from "react";

export const Structures = () => {
  const world = useGame((s) => s.world);
  const setWorld = useGame((s) => s.setWorld);
  const worldTile = useGame((s) => s.worldTile);
  const { shrine, structures } = worldTile;

  if (shrine) {
    return null;
  }

  const takeDamage = useCallback(
    (damage: number, id: string) => {
      const { row, column } = worldTile.position;

      const tileIndex = world.findIndex(
        (f) => f.position.column === column && f.position.row === row
      );

      const worldCopy = world.map((w) => ({ ...w }));

      console.log(damage, id);

      worldCopy[tileIndex].structures[id].health -= damage;

      setWorld(worldCopy);
    },
    [worldTile, world, setWorld]
  );

  return (
    <>
      {Object.keys(structures).map((id: string, i) => {
        const s = structures[id];
        return (
          <group position={s.position} key={`structure-${i}`}>
            <HealthBar health={s.health} />
            <RigidBody
              type='fixed'
              onCollisionEnter={({ other }: any) => {
                console.log("hit");
                const object = other.rigidBodyObject?.userData as RigidBodyData;
                if (object?.type === "enemy") {
                  console.log("is enemy");
                  const damage = object?.strength || 10;
                  takeDamage(damage, id);
                }
              }}
            >
              <mesh scale={2}>
                <boxGeometry args={[2, 2, 0.8]} />
                <meshStandardMaterial color={s.color} />
              </mesh>
            </RigidBody>
          </group>
        );
      })}
    </>
  );
};
