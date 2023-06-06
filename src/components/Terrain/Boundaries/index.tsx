import { Vector3 } from "three";
import { grid } from "../../../constants";
import { RigidBody } from "@react-three/rapier";
import useGame from "../../../Stores/useGame";
import { worldTiles } from "../../../Stores/constants";
import { useMemo } from "react";
import { SlideDirection, TilePosition } from "../../../Stores/types";

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
  direction: "top" | "bottom" | "left" | "right";
};
const walls: Wall[] = [
  {
    pos: new Vector3(grid.x, grid.top, grid.z),
    args: [grid.width, 4, 5],
    direction: "top",
  },
  {
    pos: new Vector3(grid.x, grid.bottom, grid.z),
    args: [grid.width, 4, 5],
    direction: "bottom",
  },
  {
    pos: new Vector3(grid.left, grid.y, grid.z),
    args: [4, grid.height, 5],
    direction: "left",
  },
  {
    pos: new Vector3(grid.right, grid.y, grid.z),
    args: [4, grid.height, 5],
    direction: "right",
  },
];

type WallCheck = {
  name: SlideDirection;
  check: (position: TilePosition) => TilePosition;
};

const directionsCheck: WallCheck[] = [
  {
    name: "right",
    check: (position: TilePosition) => ({
      ...position,
      column: position.column + 1,
    }),
  },
  {
    name: "left",
    check: (position: TilePosition) => ({
      ...position,
      column: position.column - 1,
    }),
  },
  {
    name: "top",
    check: (position: TilePosition) => ({
      ...position,
      row: position.row - 1,
    }),
  },
  {
    name: "bottom",
    check: (position: TilePosition) => ({
      ...position,
      row: position.row + 1,
    }),
  },
];

export const Boundaries = () => {
  const worldTile = useGame((s) => s.worldTile);

  const blockedPaths: SlideDirection[] = useMemo(() => {
    const blocked: SlideDirection[] = [];

    directionsCheck.forEach((d) => {
      const { position } = worldTile;
      const { row, column } = d.check(position);

      const tileFound = worldTiles.find(
        (f) => f.position.row === row && f.position.column === column
      );

      if (!tileFound) {
        blocked.push(d.name);
      }
    });

    return blocked;
  }, [worldTile]);

  return (
    <>
      {walls
        .filter((f) => blockedPaths.includes(f.direction))
        .map((w, i) => {
          return (
            <RigidBody
              key={`wall-${i}`}
              type='fixed'
              restitution={0.5}
              friction={1}
              position={w.pos}
              userData={{ type: "wall", direction: w.direction }}
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
