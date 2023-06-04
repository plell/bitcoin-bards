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
  return (
    <KeyboardControls map={controls}>
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [0, 0, 50],
        }}
      >
        {/* <OrthographicCamera
          makeDefault
          zoom={1}
          top={200}
          bottom={-200}
          left={200}
          right={-200}
          near={1}
          far={2000}
          position={[0, 0, 50]}
        /> */}
        <OrbitControls />
        <Perf position='top-left' />
        <Lights />
        <Loop />

        <Physics gravity={[0, 0, 0]}>
          <Terrain />
          <Player />

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
