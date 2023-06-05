import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import { Lights } from "./components/Lights";
import { Player } from "./components/Player";
import { Terrain } from "./components/Terrain";
import { KeyboardControls } from "@react-three/drei";
import { controls } from "./constants";
import { Loop } from "./components/Sounds/Loop";
import { Enemy } from "./components/Enemy";
import { Physics } from "@react-three/rapier";
import { Vector3 } from "three";
import useGame from "./Stores/useGame";

const enemies = [
  {
    startPosition: new Vector3(2, 4, 0),
    movementInterval: 1200,
    speed: 60,
  },
  {
    startPosition: new Vector3(-5, 9, 0),
    movementInterval: 1400,
    speed: 30,
  },
  {
    startPosition: new Vector3(8, -9, 0),
    movementInterval: 1900,
    speed: 20,
  },
  {
    startPosition: new Vector3(-6, -3, 0),
    movementInterval: 2300,
    speed: 10,
  },
  {
    startPosition: new Vector3(1, 9, 0),
    movementInterval: 2000,
    speed: 30,
  },
];

function App() {
  const playerDied = useGame((s) => s.playerDied);

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

          {!playerDied && <Player />}

          {enemies.map((e, i) => (
            <Enemy
              key={`enemy-${i}`}
              movementInterval={e.movementInterval}
              startPosition={e.startPosition}
              speed={e.speed}
            />
          ))}
        </Physics>
      </Canvas>
    </KeyboardControls>
  );
}

export default App;
