import { createContext } from "react";
import { PlayerPositions, PlayerPosition, Zone } from "../../types";

interface contextProps {
  playerPosition: [
    playerPosition: PlayerPosition,
    setPlayerPosition: (e: PlayerPosition) => void
  ];
  playerPositions: [
    playerPositions: PlayerPositions,
    setPlayerPositions: (e: PlayerPositions) => void
  ];
  zones: [zones: Zone[], setZones: (e: Zone[]) => void];
}

const AppContext = createContext<contextProps | null>(null);

export default AppContext;
