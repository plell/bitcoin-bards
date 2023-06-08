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
import { Group } from "three";
import { LevelManager } from "./components/LevelManager";
import styled from "styled-components";

let enemyGeneratorTimeout: Interval = null;

const generatorSpeed = 2000;

function App() {
  const enemies = useGame((s) => s.enemies);
  const setEnemies = useGame((s) => s.setEnemies);
  const setWorldTileRef = useGame((s) => s.setWorldTileRef);
  const setAttack = useGame((s) => s.setAttack);
  const worldTileRef = useRef<Group | null>(null);
  const worldTile = useGame((s) => s.worldTile);
  const [tick, setTick] = useState(false);

  useLayoutEffect(() => {
    if (worldTileRef.current) {
      setWorldTileRef(worldTileRef);
    }
  }, [worldTileRef.current]);

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
      console.log("t");
      const { row, column } = t.position;
      const selected =
        worldTile.position.row === row && worldTile.position.column === column;
      return (
        <TileIcon key={`tile-${i}`} selected={selected} background={t.color} />
      );
    });
  }, [worldTile]);

  return (
    <>
      <KeyboardControls map={controls}>
        <Canvas
          onPointerDown={() => {
            setAttack((attack) => !attack);
          }}
        >
          <OrthographicCamera
            makeDefault // Make this camera the default
            position={[0, 0, 20]}
            near={0.1}
            far={60}
            zoom={14} // Zoom level (1 is default, higher values zoom out)
          />
          {/* <OrbitControls /> */}
          {/* <Perf position='top-left' /> */}
          <Lights />

          <LevelManager />

          <Physics gravity={[0, 0, 0]}>
            <Player />
            <group ref={worldTileRef}>
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
            </group>
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
  background: #00000011;
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
  background: string;
};
const TileIcon = styled.div<TileIconProps>`
  flex-grow: 0;
  display: flex;
  border-radius: 2px;
  margin: 0 2px 2px 0;
  width: 10px;
  height: 10px;
  border: 1px solid;
  border-color: ${(p) => (p.selected ? p.background : "#000")};
  background: ${(p) => (p.selected ? p.background : "#fff")};
`;
