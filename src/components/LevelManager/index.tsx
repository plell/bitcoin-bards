import { useEffect } from "react";
import useGame from "../../Stores/useGame";
import { Vector3 } from "three";
import { getNeighborTiles, grid } from "../../Stores/constants";
import { useFrame } from "@react-three/fiber";
import { SlideDirection } from "../../Stores/types";
import { vec3 } from "@react-three/rapier";

const reuseableVector3 = new Vector3();

export const LevelManager = () => {
  const worldTile = useGame((s) => s.worldTile);
  const setWorldTile = useGame((s) => s.setWorldTile);
  const setNextWorldTile = useGame((s) => s.setNextWorldTile);
  const nextWorldTile = useGame((s) => s.nextWorldTile);
  const setEnemies = useGame((s) => s.setEnemies);
  const players = useGame((s) => s.players);

  useEffect(() => {
    console.log("nextWorldTile", nextWorldTile);
    if (nextWorldTile) {
      setWorldTile(nextWorldTile);
      setNextWorldTile(null);
      setEnemies({});

      if (players["p1"]?.body?.current) {
        // move player somehow without breaking physics
        // const pos = vec3(players["p1"].body.current.translation());
        // const pos1 = vec3({ x: 0, y: 0, z: 0 });
        // pos.x = grid.left;
        // console.log("set translation");
        // players["p1"].body.current.setTranslation(pos1, true);
      }
    }
  }, [nextWorldTile]);

  useFrame(() => {
    // boundary check
    if (players["p1"]?.body?.current) {
      const pos = players["p1"].body.current.translation();
      doBoundaryCheck(reuseableVector3.set(pos.x, pos.y, pos.z));
    }
  });

  const doBoundaryCheck = (pos: Vector3) => {
    // in transition
    if (nextWorldTile) {
      return;
    }

    let direction: SlideDirection | null = null;

    if (pos.x > grid.right) {
      direction = "right";
    } else if (pos.x < grid.left) {
      direction = "left";
    } else if (pos.y > grid.top) {
      direction = "top";
    } else if (pos.y < grid.bottom) {
      direction = "bottom";
    }

    if (!direction) {
      return;
    }

    const neighborTiles = getNeighborTiles(worldTile.position);

    if (!!neighborTiles[direction]) {
      setNextWorldTile(neighborTiles[direction]);
    }
  };

  return null;
};
