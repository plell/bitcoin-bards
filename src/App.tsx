import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { OrthographicCamera } from "@react-three/drei";
import { Lights } from "./components/Lights";
import { Player } from "./components/Player";
import { Terrain } from "./components/Terrain";
import { KeyboardControls } from "@react-three/drei";
import { controls } from "./constants";
import { Loop } from "./components/Sounds/Loop";
import { Enemy } from "./components/Enemy";
import { Physics } from "@react-three/rapier";
import useGame from "./Stores/useGame";
import { useEffect, useState } from "react";
import { Interval } from "./Stores/types";

let enemyGeneratorTimeout: Interval = null;
const generatorSpeed = 2000;

function App() {
  const enemies = useGame((s) => s.enemies);
  const setEnemies = useGame((s) => s.setEnemies);
  const [tick, setTick] = useState(false);

  useEffect(() => {
    if (enemyGeneratorTimeout) {
      clearInterval(enemyGeneratorTimeout);
    }

    enemyGeneratorTimeout = setInterval(() => {
      setTick((tick) => !tick);
    }, generatorSpeed);
  }, []);

  useEffect(() => {
    addNewEnemy();
  }, [tick]);

  const addNewEnemy = () => {
    const enemiesCopy = { ...enemies };
    const newEnemyId = Object.keys(enemiesCopy).length;
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

        <Physics gravity={[0, 0, 0]}>
          <Loop />
          <Terrain />

          <Player />

          {Object.values(enemies).map((e, i) => (
            <Enemy key={`enemy-${i}`} {...e} />
          ))}
        </Physics>
      </Canvas>
    </KeyboardControls>
  );
}

export default App;
