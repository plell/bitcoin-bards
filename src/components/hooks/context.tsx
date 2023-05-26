import React, { useState } from "react";
import AppContext from "./createContext";
import { PlayerPositions, PlayerPosition } from "../../types";
import { Vector3 } from "three";

const AppContextProvider = (props: {
  children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}) => {
  const [playerPosition, setPlayerPosition] = useState<PlayerPosition>(
    new Vector3()
  );
  const [playerPositions, setPlayerPositions] = useState<PlayerPositions>({});

  return (
    <AppContext.Provider
      value={{
        playerPosition: [playerPosition, setPlayerPosition],
        playerPositions: [playerPositions, setPlayerPositions],
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
