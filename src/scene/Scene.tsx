import { useFrame } from '@react-three/fiber'
import { BackSide } from 'three'
import { Environment, Lightformer } from '@react-three/drei'
import { CD } from './CD'
import { RetroGrid } from './RetroGrid'
import { Shadow } from './Shadow'
import { theme } from '../theme'

export function Scene() {
  // Pionowy ekran: odsuwamy kamerę, żeby płyta mieściła się na szerokość.
  // Szeroki ekran: podnosimy kamerę, płyta z cieniem ląduje ok. 60 px niżej.
  useFrame(({ camera, size }) => {
    const aspect = size.width / size.height
    camera.position.z = Math.max(6.2, 4.6 / aspect)
    camera.position.y = aspect > 1.2 ? 0.5 : 0.2
  })

  return (
    <>
      {/* Studio z samych Lightformerów: 0 KB assetów. Główny refleks leci z prawego górnego rogu. */}
      <Environment resolution={256} frames={1}>
        {/* delikatne tło otoczenia: odbicia nie schodzą do czerni */}
        <mesh scale={100}>
          <sphereGeometry />
          <meshBasicMaterial color="#2a6f78" side={BackSide} />
        </mesh>
        <Lightformer form="rect" intensity={1.6} color="#dff6f8" position={[0, 1, 8]} scale={[12, 7, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={3.5} color="#c9f7f4" position={[-8, 1, 0]} scale={[6, 6, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={3.5} color="#ffffff" position={[8, -1, 0]} scale={[6, 6, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={3} color="#9fe9ff" position={[0, 1, -8]} scale={[14, 6, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={14} color={theme.light} position={[5, 4.5, 2]} scale={[4, 3, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={2.2} color={theme.rim} position={[-5, 0.5, 3]} scale={[3, 5, 1]} target={[0, 0, 0]} />
        <Lightformer form="ring" intensity={1.4} color={theme.gridGlow} position={[0, -3, 2]} scale={4} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.8} color="#ffffff" position={[0, 6, -3]} scale={[8, 2, 1]} target={[0, 0, 0]} />
      </Environment>
      <directionalLight position={[5, 4.5, 3]} intensity={1.6} color={theme.light} />

      <RetroGrid />
      <Shadow />
      <CD />
    </>
  )
}
