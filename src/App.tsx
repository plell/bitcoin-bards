import { Canvas, useFrame } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { Lights } from "./components/Lights";
import { Player } from "./components/Player";
import { Terrain } from "./components/Terrain";
import { KeyboardControls } from "@react-three/drei";
import { controls } from "./Stores/constants";
import { Loop } from "./components/Sounds/Loop";
import { Enemy } from "./components/Enemy";
import { Physics } from "@react-three/rapier";
import useGame from "./Stores/useGame";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Interval } from "./Stores/types";
import { v4 as uuidv4 } from "uuid";
import { Group } from "three";
import { LevelManager } from "./components/LevelManager";

let enemyGeneratorTimeout: Interval = null;

const generatorSpeed = 2000;

function App() {
  const enemies = useGame((s) => s.enemies);
  const setEnemies = useGame((s) => s.setEnemies);
  const setWorldTileRef = useGame((s) => s.setWorldTileRef);

  const worldTileRef = useRef<Group | null>(null);

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

  return (
    <KeyboardControls map={controls}>
      <Canvas>
        <OrthographicCamera
          makeDefault // Make this camera the default
          position={[0, 0, 20]}
          near={0.1}
          far={60}
          zoom={14} // Zoom level (1 is default, higher values zoom out)
        />
        {/* <OrbitControls /> */}
        <Perf position='top-left' />
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
  );
}

export default App;
