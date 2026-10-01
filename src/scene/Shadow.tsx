import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { bob } from '../config'
import { GRID_Y } from './RetroGrid'

// Miękki owalny cień na gridzie: przy podskoku mniejszy i bledszy, jak w GTA.
export function Shadow() {
  const mesh = useRef<THREE.Mesh>(null)
  const texture = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 128
    const g = c.getContext('2d')!
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
    grad.addColorStop(0, 'rgba(0,0,0,0.85)')
    grad.addColorStop(0.5, 'rgba(0,0,0,0.45)')
    grad.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = grad
    g.fillRect(0, 0, 128, 128)
    return new THREE.CanvasTexture(c)
  }, [])

  useFrame(({ clock }) => {
    const m = mesh.current
    if (!m) return
    const k = Math.sin(clock.elapsedTime * bob.speed) // -1 niżej, 1 wyżej
    const s = 1 - k * 0.1
    m.scale.set(s, s, 1)
    ;(m.material as THREE.MeshBasicMaterial).opacity = 0.9 - k * 0.2
  })

  return (
    <mesh ref={mesh} rotation-x={-Math.PI / 2} position={[0, GRID_Y + 0.01, 0]}>
      <planeGeometry args={[2.8, 1.1]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  )
}
