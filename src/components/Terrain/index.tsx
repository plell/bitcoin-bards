import { grid } from "../../constants";
import { Boundaries } from "./Boundaries";
import useGame from "../../Stores/useGame";

export const Terrain = () => {
  const zones = useGame((s) => s.zones);

  const setAttack = useGame((s) => s.setAttack);
  const attack = useGame((s) => s.attack);

  return (
    <>
      <Boundaries />

      <mesh
        onPointerDown={() => {
          setAttack(!attack);
        }}
        position={[grid.x, grid.y, grid.z]}
        rotation-z={Math.PI}
      >
        <planeGeometry args={[grid.width, grid.height]} />
        <meshStandardMaterial color={"white"} />
      </mesh>

      {zones.map((z, i) => {
        return (
          <mesh key={`zones-${i}`} position={z.position}>
            <planeGeometry args={[z.width, z.height]} />
            <meshStandardMaterial color={z.color} transparent opacity={0.4} />
          </mesh>
        );
      })}
    </>
  );
};
