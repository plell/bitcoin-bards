import { grid } from "../../Stores/constants";
import { Boundaries } from "./Boundaries";
import useGame from "../../Stores/useGame";
import { useEffect } from "react";
import { Shrine } from "./Shrine";
import { Structures } from "./Structures";
import { Grid } from "./Grid";

export const Terrain = () => {
  const zones = useGame((s) => s.zones);
  const worldTile = useGame((s) => s.worldTile);
  const discoveredWorldTiles = useGame((s) => s.discoveredWorldTiles);
  const setDiscoveredWorldTiles = useGame((s) => s.setDiscoveredWorldTiles);

  useEffect(() => {
    const discoveredWorldTilesCopy = [...discoveredWorldTiles];
    if (!discoveredWorldTilesCopy.includes(worldTile?.id)) {
      discoveredWorldTilesCopy.push(worldTile?.id);
      setDiscoveredWorldTiles(discoveredWorldTilesCopy);
    }
  }, [worldTile]);

  return (
    <>
      <Boundaries />

      <mesh
        receiveShadow
        position={[grid.x, grid.y, grid.z]}
        rotation-z={Math.PI}
      >
        <planeGeometry args={[grid.width, grid.height]} />
        <meshStandardMaterial color={worldTile.color || "white"} />
      </mesh>

      <Grid />
      <Shrine />
      <Structures />

      {/* {zones.map((z, i) => {
        return (
          <mesh key={`zones-${i}`} position={z.position}>
            <planeGeometry args={[z.width, z.height]} />
            <meshStandardMaterial color={z.color} transparent opacity={0.4} />
          </mesh>
        );
      })} */}
    </>
  );
};
