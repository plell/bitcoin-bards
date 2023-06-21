import { Canvas } from "@react-three/fiber";

import { Lights } from "./components/Lights";
import { Player } from "./components/Player";
import { Terrain } from "./components/Terrain";
import { KeyboardControls } from "@react-three/drei";
import { allNotes, columnLimit, controls } from "./Stores/constants";
import { Loop } from "./components/Sounds/Loop";
import { Enemy } from "./components/Enemy";
import { Physics } from "@react-three/rapier";
import useGame from "./Stores/useGame";
import { useEffect, useMemo, useState } from "react";
import { Interval, Patterns } from "./Stores/types";
import { v4 as uuidv4 } from "uuid";
import { LevelManager } from "./components/LevelManager";
import styled from "styled-components";
import mqtt from "mqtt/dist/mqtt";
import { Fort } from "@mui/icons-material";
import { Vector3 } from "three";
import { Perf } from "r3f-perf";

import {
  Bloom,
  DepthOfField,
  EffectComposer,
} from "@react-three/postprocessing";

let enemyGeneratorTimeout: Interval = null;

const generatorSpeed = 2000;

const cameraPosition = new Vector3(0, 0, 30);

function App() {
  const enemies = useGame((s) => s.enemies);
  const players = useGame((s) => s.players);
  const setEnemies = useGame((s) => s.setEnemies);
  const setAttack = useGame((s) => s.setAttack);
  const setNextWorldTile = useGame((s) => s.setNextWorldTile);
  const discoveredWorldTiles = useGame((s) => s.discoveredWorldTiles);
  const worldTile = useGame((s) => s.worldTile);
  const patterns = useGame((s) => s.patterns);
  const setPatterns = useGame((s) => s.setPatterns);

  const world = useGame((s) => s.world);
  const setWorldTile = useGame((s) => s.setWorldTile);
  const setWorld = useGame((s) => s.setWorld);
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
    if (worldTile.shrine) return;
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
    return world.map((t, i) => {
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

  const placeNoteAtPlayersPosition = () => {
    if (players["p1"]?.body?.current) {
      if (players["p1"]?.dead) {
        return;
      }
      const translation = players["p1"]?.body?.current.translation();
      const patternsCopy: Patterns = { ...patterns };
      const { notes } = patternsCopy[worldTile.patternId];

      const randomStep = Math.floor(
        Math.random() * (Object.keys(notes).length - 1)
      );

      const id = uuidv4();

      const pitch =
        allNotes[Math.floor(Math.random() * Object.keys(notes).length)];

      patternsCopy[worldTile.patternId].notes[id] = {
        id,
        body: null,
        step: randomStep,
        position: new Vector3(
          translation.x,
          translation.y - 0.5,
          translation.z
        ),
        pitch,
      };

      setPatterns(patternsCopy);
    }
  };

  return (
    <>
      <KeyboardControls map={controls}>
        <Canvas
          camera={{
            position: cameraPosition,
          }}
          onPointerDown={() => {
            placeNoteAtPlayersPosition();
          }}
        >
          <EffectComposer autoClear={false} multisampling={8}>
            {players["p1"]?.dead && (
              <DepthOfField
                focusDistance={0.01}
                focalLength={0.02}
                bokehScale={20}
                height={280}
              />
            )}
            <Bloom luminanceThreshold={1} mipmapBlur />
          </EffectComposer>

          <color attach='background' args={[worldTile.color || "#fff"]} />

          {/* <OrbitControls /> */}
          <Perf position='top-left' />
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
  opacity: 0.7;
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
