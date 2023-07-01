import useGame from "../../../Stores/useGame";
import { ALL_NOTES, grid } from "../../../Stores/constants";
import { useMemo } from "react";
import { Line } from "@react-three/drei";
import { Vector3 } from "three";
import { Pattern } from "../../../Stores/types";

export const getGridPointsAndLines = (pattern: Pattern) => {
  const s: Vector3[][] = [];

  const stepWidth = grid.width / pattern.stepCount;
  for (let i = 0; i < pattern.stepCount; i += 1) {
    const x = grid.left + i * stepWidth;
    const topPoint = new Vector3(x, grid.top, 0);
    const bottomPoint = new Vector3(x, grid.bottom, 0);

    s.push([topPoint, bottomPoint]);
  }

  const n: Vector3[][] = [];

  const scaleStepHeight = grid.height / ALL_NOTES.length;
  for (let i = 0; i < ALL_NOTES.length; i += 1) {
    const y = grid.top - i * scaleStepHeight;
    const topPoint = new Vector3(grid.left, y, 0);
    const bottomPoint = new Vector3(grid.right, y, 0);

    n.push([topPoint, bottomPoint]);
  }

  const i: Vector3[] = [];

  s.forEach((step) => {
    n.forEach((note) => {
      const intersect = new Vector3(step[0].x, note[0].y, 0);
      i.push(intersect);
    });
  });

  return { steps: s, notes: n, intersections: i };
};

export const Grid = () => {
  const worldTile = useGame((s) => s.worldTile);
  const patterns = useGame((s) => s.patterns);

  const pattern = patterns[worldTile.patternId];

  const { steps, notes, intersections } = useMemo(() => {
    return getGridPointsAndLines(pattern);
  }, [pattern]);

  return (
    <>
      {/* {steps.map((s, i) => {
        return <Line points={s} key={`${i}-steps`} color={"#000"} />;
      })}

      {notes.map((n, i) => {
        return <Line points={n} key={`${i}-scale-steps`} color={"#000"} />;
      })} */}

      {intersections.map((n, i) => {
        return (
          <mesh position={n} key={`${i}-intersects-steps`} scale={0.5}>
            <circleGeometry />
            <meshBasicMaterial color={"black"} transparent opacity={0.1} />
          </mesh>
        );
      })}
    </>
  );
};
