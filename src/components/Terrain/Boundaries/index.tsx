import { Vector3 } from "three";
import { grid } from "../../../constants";
import { RigidBody } from "@react-three/rapier";

const top = grid.y + grid.height / 2;
const bottom = grid.y - grid.height / 2;
const left = grid.x - grid.width / 2;
const right = grid.x + grid.width / 2;

type Wall = {
  pos: Vector3;
  args: number[];
};
const walls: Wall[] = [
  {
    pos: new Vector3(grid.x, top, grid.z),
    args: [grid.width, 4, 5],
  },
  {
    pos: new Vector3(grid.x, bottom, grid.z),
    args: [grid.width, 4, 5],
  },
  {
    pos: new Vector3(left, grid.y, grid.z),
    args: [4, grid.height, 5],
  },
  {
    pos: new Vector3(right, grid.y, grid.z),
    args: [4, grid.height, 5],
  },
];

export const Boundaries = () => {
  return (
    <>
      {walls.map((w, i) => {
        return (
          <RigidBody
            key={`wall-${i}`}
            type='fixed'
            restitution={0.2}
            friction={1}
            position={w.pos}
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
