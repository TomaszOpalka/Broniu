import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { Scene } from './scene/Scene'
import { SocialBar } from './ui/SocialBar'
import { SwipeHint } from './ui/SwipeHint'
import { artist } from './config'

function App() {
  const [dpr, setDpr] = useState(2)

  return (
    <>
      <Canvas
        className="stage"
        dpr={dpr}
        camera={{ position: [0, 0.2, 6.2], fov: 36 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(2)} />
        <Scene />
      </Canvas>

      <SwipeHint />

      <div className="overlay">
        <SocialBar />
        <h1 className="signature" aria-label={artist}>
          <span className="signature__ink" />
        </h1>
      </div>
    </>
  )
}

export default App
