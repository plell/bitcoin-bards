import { useEffect } from "react";
import useGame from "../../Stores/useGame";

export const LevelManager = () => {
  const setWorldTile = useGame((s) => s.setWorldTile);
  const setNextWorldTile = useGame((s) => s.setNextWorldTile);
  const nextWorldTile = useGame((s) => s.nextWorldTile);
  const setEnemies = useGame((s) => s.setEnemies);

  useEffect(() => {
    if (nextWorldTile?.worldTile) {
      setEnemies({});
      setTimeout(() => {
        setWorldTile(nextWorldTile.worldTile);
        setNextWorldTile(null);
      }, 50);
    }
  }, [nextWorldTile]);

  return null;
};
