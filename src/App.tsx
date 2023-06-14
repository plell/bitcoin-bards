import { Canvas, useFrame } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { Lights } from "./components/Lights";
import { Player } from "./components/Player";
import { Terrain } from "./components/Terrain";
import { KeyboardControls } from "@react-three/drei";
import { columnLimit, controls, worldTiles } from "./Stores/constants";
import { Loop } from "./components/Sounds/Loop";
import { Enemy } from "./components/Enemy";
import { Physics } from "@react-three/rapier";
import useGame from "./Stores/useGame";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Interval } from "./Stores/types";
import { v4 as uuidv4 } from "uuid";
import { LevelManager } from "./components/LevelManager";
import styled from "styled-components";
import mqtt from "mqtt/dist/mqtt";
import { Fort } from "@mui/icons-material";

let enemyGeneratorTimeout: Interval = null;

const generatorSpeed = 2000;

function App() {
  const enemies = useGame((s) => s.enemies);
  const setEnemies = useGame((s) => s.setEnemies);
  const setAttack = useGame((s) => s.setAttack);
  const setNextWorldTile = useGame((s) => s.setNextWorldTile);
  const discoveredWorldTiles = useGame((s) => s.discoveredWorldTiles);
  const worldTile = useGame((s) => s.worldTile);
  const [tick, setTick] = useState(false);

  // mqtt stuff start
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    try {
      console.log("mqtt", mqtt);
      let client: mqtt.MqttClient = mqtt.connect("mqtt://test.mosquitto.org");
      client.on("connect", () => setConnectionStatus(true));
      client.on("message", (topic, payload, packet) => {
        setMessages(messages.concat(payload.toString()));
      });
    } catch (e) {
      console.error(e);
    }
  }, []);
  // mqtt stuff end

  useEffect(() => {
    if (enemyGeneratorTimeout) {
      clearInterval(enemyGeneratorTimeout);
    }

    enemyGeneratorTimeout = setInterval(() => {
      setTick((tick) => !tick);
    }, generatorSpeed);

    return function cleanup() {
      setEnemies({});
    };
  }, []);

  useEffect(() => {
    addNewEnemy();
  }, [tick]);

  const addNewEnemy = () => {
    const enemiesCopy = { ...enemies };
    const newEnemyId = uuidv4();
    enemiesCopy[newEnemyId] = {
      id: newEnemyId,
      body: null,
      health: 100,
      type: "enemy",
      dead: false,
    };

    setEnemies(enemiesCopy);
  };

  const mapTiles = useMemo(() => {
    return worldTiles.map((t, i) => {
      const { row, column } = t.position;
      const selected =
        worldTile.position.row === row && worldTile.position.column === column;
      const discovered = discoveredWorldTiles.includes(t.id);
      const hasShrine = !!t.shrine;
      return (
        <TileIcon
          onPointerDown={() =>
            setNextWorldTile({
              worldTile: t,
              relativeDirection: "top",
            })
          }
          key={`tile-${i}`}
          discovered={discovered ? true : false}
          selected={selected}
          background={t.color}
        >
          {hasShrine && <Fort fontSize='8px' />}
        </TileIcon>
      );
    });
  }, [worldTile]);

  return (
    <>
      <KeyboardControls map={controls}>
        <Canvas
          onPointerDown={() => {
            setAttack((attack: boolean) => !attack);
          }}
        >
          <OrthographicCamera
            makeDefault // Make this camera the default
            position={[0, 0, 20]}
            near={0.1}
            far={60}
            zoom={16}
          />
          {/* <OrbitControls /> */}
          {/* <Perf position='top-left' /> */}
          <Lights />

          <LevelManager />

          <Physics gravity={[0, 0, 0]}>
            <Player />

            <Loop />
            <Terrain />

            {/* {Object.values(players).map((p, i) => {
            if (p.dead) {
              return null;
            }
            return <RemotePlayer key={`remore-player-${i}`} {...p} />;
          })} */}

            {Object.values(enemies).map((e, i) => {
              if (e.dead) {
                return null;
              }
              return <Enemy key={`enemy-${i}`} {...e} />;
            })}
          </Physics>
        </Canvas>
      </KeyboardControls>

      <MapWrapWrap>
        <MapWrap width={(columnLimit + 1) * 14}>{mapTiles}</MapWrap>
      </MapWrapWrap>
    </>
  );
}

export default App;

const MapWrapWrap = styled.div`
  position: fixed;
  top: 30px;
  right: 30px;
  padding: 7px;
  border-radius: 4px;
`;

type MapWrapProps = {
  width: number;
};
const MapWrap = styled.div<MapWrapProps>`
  display: flex;
  flex-grow: 0;
  flex-wrap: wrap;
  width: ${(p) => `${p.width}`}px;
  height: 200px;
`;

type TileIconProps = {
  selected: boolean;
  discovered: boolean;
  background: string;
};
const TileIcon = styled.div<TileIconProps>`
  flex-grow: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 9px;
  font-weight: 900;
  border-radius: 2px;
  margin: 0 2px 2px 0;
  width: 10px;
  height: 10px;
  border: 1px solid;
  border-color: ${(p) =>
    p.selected ? p.background : p.discovered ? `${p.background}44` : "#000"};
  background: ${(p) =>
    p.selected ? p.background : p.discovered ? `${p.background}44` : "#fff"};
`;
