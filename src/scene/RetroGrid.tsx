import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { theme } from '../theme'

export const GRID_Y = -0.75

const vertex = /* glsl */ `
  varying vec2 vUv;
  varying float vDist;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDist = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`

const fragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uLine;
  uniform vec3 uGlow;
  varying vec2 vUv;
  varying float vDist;

  void main() {
    vec2 p = vec2(vUv.x * 60.0, vUv.y * 60.0 + uTime * 0.9);
    vec2 g = abs(fract(p - 0.5) - 0.5) / fwidth(p);
    float line = 1.0 - min(min(g.x, g.y), 1.0);

    // szeroka poświata wokół linii
    vec2 w = abs(fract(p - 0.5) - 0.5);
    float halo = exp(-min(w.x, w.y) * 14.0) * 0.22;

    float fade = 1.0 - smoothstep(14.0, 46.0, vDist);
    float near = smoothstep(0.0, 3.0, vDist);
    float a = (line + halo) * fade * near;
    vec3 col = mix(uGlow, uLine, line);
    gl_FragColor = vec4(col * (0.7 + 0.8 * fade), a);
  }
`

const uniforms = {
  uTime: { value: 0 },
  uLine: { value: new THREE.Color(theme.grid) },
  uGlow: { value: new THREE.Color(theme.gridGlow) },
}

export function RetroGrid() {
  const material = useRef<THREE.ShaderMaterial>(null)

  useFrame(({ clock }) => {
    if (material.current) material.current.uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, GRID_Y, -22]}>
      <planeGeometry args={[60, 60]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}
