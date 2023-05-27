import React, { useState } from "react";
import AppContext from "./createContext";
import { PlayerPositions, PlayerPosition, Zone } from "../../types";
import { Vector3 } from "three";
import { initialZones } from "../../constants";

const AppContextProvider = (props: {
  children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}) => {
  const [playerPosition, setPlayerPosition] = useState<PlayerPosition>(
    new Vector3()
  );
  const [playerPositions, setPlayerPositions] = useState<PlayerPositions>({});
  const [zones, setZones] = useState<Zone[]>(initialZones);

  return (
    <AppContext.Provider
      value={{
        playerPosition: [playerPosition, setPlayerPosition],
        playerPositions: [playerPositions, setPlayerPositions],
        zones: [zones, setZones],
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
