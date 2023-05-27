import { useContext } from "react";
import { grid } from "../../constants";
import AppContext from "../hooks/createContext";

export const Terrain = () => {
  const {
    zones: [zones],
  } = useContext(AppContext)!;

  return (
    <>
      <mesh position={[grid.x, grid.y, grid.z]} rotation-z={Math.PI}>
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
