import { useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { loopManager } from './engine/core/LoopManager';
import { physicsSystem } from './engine/physics/PhysicsSystem';

/**
 * COMPONENT: GAME LOOP INTEGRATION
 * Hooks the React Three Fiber loop (requestAnimationFrame) into our custom LoopManager.
 */
const GameLoopIntegration = () => {
  useFrame((_state, delta) => {
    // Tick the Game Loop (Physics + Logic)
    loopManager.tick(delta);

    // Note: R3F automatically renders the scene after this callback.
    // If we wanted manual control, we'd use gl.render(scene, camera) inside a render callback.
  });

  return null;
};

/**
 * COMPONENT: DEBUG SCENE
 * A simple visual test to ensure the engine is running.
 */
const DebugScene = () => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight
                position={[10, 20, 10]}
                intensity={1.5}
                castShadow
                shadow-mapSize={[2048, 2048]}
            />

            {/* Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#333" />
            </mesh>

            {/* Test Cube */}
            <mesh position={[0, 1, 0]} castShadow>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="orange" />
            </mesh>

            <gridHelper args={[100, 100]} />
        </>
    );
};

export const GameEngine = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initEngine = async () => {
      console.log("Initializing Engine...");

      // 1. Initialize Physics (WASM)
      await physicsSystem.init();

      // 2. Initialize other core systems if needed
      // await assetManager.init(renderer); // Requires renderer instance, usually done inside Canvas via a hook

      setReady(true);
      console.log("Engine Ready.");
    };

    initEngine();
  }, []);

  if (!ready) {
    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#000',
            color: '#fff',
            fontFamily: 'monospace'
        }}>
            Initializing Core Systems (WASM)...
        </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        shadows
        camera={{ position: [0, 5, 10], fov: 60 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <GameLoopIntegration />
        <DebugScene />
      </Canvas>
    </div>
  );
};
