import { createContext } from "react";
import { PlayerPositions, PlayerPosition } from "../../types";

interface contextProps {
  playerPosition: [
    playerPosition: PlayerPosition,
    setPlayerPosition: (e: PlayerPosition) => void
  ];
  playerPositions: [
    playerPositions: PlayerPositions,
    setPlayerPositions: (e: PlayerPositions) => void
  ];
}

const AppContext = createContext<contextProps | null>(null);

export default AppContext;
