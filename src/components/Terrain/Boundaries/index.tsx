import { Vector3 } from "three";
import {
  NeighborTiles,
  getNeighborTiles,
  grid,
} from "../../../Stores/constants";
import { RigidBody } from "@react-three/rapier";
import useGame from "../../../Stores/useGame";
import { useMemo } from "react";

type Wall = {
  pos: Vector3;
  args: [
    width?: number | undefined,
    height?: number | undefined,
    depth?: number | undefined,
    widthSegments?: number | undefined,
    heightSegments?: number | undefined,
    depthSegments?: number | undefined
  ];
  name: "top" | "bottom" | "left" | "right";
};
const walls: Wall[] = [
  {
    pos: new Vector3(grid.x, grid.top, grid.z),
    args: [grid.width, 4, 5],
    name: "top",
  },
  {
    pos: new Vector3(grid.x, grid.bottom, grid.z),
    args: [grid.width, 4, 5],
    name: "bottom",
  },
  {
    pos: new Vector3(grid.left, grid.y, grid.z),
    args: [4, grid.height, 5],
    name: "left",
  },
  {
    pos: new Vector3(grid.right, grid.y, grid.z),
    args: [4, grid.height, 5],
    name: "right",
  },
];

export const Boundaries = () => {
  const worldTile = useGame((s) => s.worldTile);

  const openPaths: NeighborTiles = useMemo(() => {
    return getNeighborTiles(worldTile.position);
  }, [worldTile]);

  return (
    <>
      {walls
        .filter((f) => !openPaths[f.name])
        .map((w, i) => {
          return (
            <RigidBody
              key={`wall-${i}`}
              type='fixed'
              restitution={0.5}
              friction={1}
              position={w.pos}
              userData={{ type: "wall", direction: w.name }}
            >
              <mesh>
                <boxGeometry args={w.args} />
                <meshStandardMaterial transparent opacity={0} />
              </mesh>
            </RigidBody>
          );
        })}
    </>
  );
};
