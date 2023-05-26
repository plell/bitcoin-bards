import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
// import { OrbitControls } from '@react-three/drei'
import { Lights } from "./components/Lights";
import { Player } from "./components/Player";
import { Terrain } from "./components/Terrain";
import { KeyboardControls } from "@react-three/drei";
import { controls } from "./constants";
import { Loop } from "./components/Sounds/Loop";
import { Enemy } from "./components/Enemy";
import { Physics } from "@react-three/rapier";

function App() {
  return (
    <KeyboardControls map={controls}>
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [0, 0, 20],
        }}
      >
        <Perf position='top-left' />
        <Lights />
        <Loop />
        <Terrain />

        <Physics gravity={[0, 0, 0]}>
          <Player />
          <Enemy />
        </Physics>
      </Canvas>
    </KeyboardControls>
  );
}

export default App;
