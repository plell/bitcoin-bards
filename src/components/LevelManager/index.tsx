import { useEffect, useState } from "react";
import useGame from "../../Stores/useGame";
import { Vector3 } from "three";
import { getNeighborTiles, grid } from "../../Stores/constants";
import { useFrame } from "@react-three/fiber";
import { Direction } from "../../Stores/types";
import { vec3 } from "@react-three/rapier";

const reuseableVector3 = new Vector3();

export const LevelManager = () => {
  const setWorldTile = useGame((s) => s.setWorldTile);
  const setNextWorldTile = useGame((s) => s.setNextWorldTile);
  const nextWorldTile = useGame((s) => s.nextWorldTile);
  const setEnemies = useGame((s) => s.setEnemies);
  const players = useGame((s) => s.players);

  useEffect(() => {
    if (nextWorldTile) {
      console.log("nextWorldTile", nextWorldTile);
      setWorldTile(nextWorldTile);
      setNextWorldTile(null);
      setEnemies({});
    }
  }, [nextWorldTile]);

  return null;
};
