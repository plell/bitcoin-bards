import { grid } from "../../constants";

export const Terrain = () => {
  return (
    <>
      <mesh position={[grid.x, grid.y, grid.z]} rotation-z={Math.PI}>
        <planeGeometry args={[grid.width, grid.height]} />
        <meshStandardMaterial color={"tomato"} />
      </mesh>
    </>
  );
};
