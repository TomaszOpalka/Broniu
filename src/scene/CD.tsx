import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { bob } from "../config";
import { theme } from "../theme";
import { useSpinPhysics } from "./useSpinPhysics";

const R = 1.0; // promień płyty
const HOLE = 0.14;
const THICK = 0.045;
const HUB = 0.34; // promień strefy hubu przy otworze
export const DISC_Y = 0.75;

// Tęczowy połysk CD narysowany raz na canvasie: stożkowy gradient + pierścienie.
function makeFaceTextures() {
  const size = 1024;
  const c = size / 2;
  const px = (r: number) => (r / (2 * R)) * size;

  const color = document.createElement("canvas");
  color.width = color.height = size;
  const g = color.getContext("2d")!;

  g.fillStyle = theme.discTint;
  g.fillRect(0, 0, size, size);

  const cone = g.createConicGradient(0.6, c, c);
  const stops = [
    "#5fd8ff",
    "#6f9dff",
    "#4fe0c0",
    "#8fe58a",
    "#4fd0e8",
    "#5fd8ff",
  ];
  stops.forEach((s, i) => cone.addColorStop(i / (stops.length - 1), s));
  g.globalAlpha = 0.55;
  g.globalCompositeOperation = "multiply";
  g.fillStyle = cone;
  g.fillRect(0, 0, size, size);
  g.globalCompositeOperation = "source-over";
  g.globalAlpha = 1;

  // przezroczysty hub przy otworze
  g.beginPath();
  g.arc(c, c, px(HUB), 0, Math.PI * 2);
  g.arc(c, c, px(HOLE), 0, Math.PI * 2, true);
  g.fillStyle = "rgba(210,235,240,0.55)";
  g.fill("evenodd");

  // cienki ciemny pierścień granicy strefy danych i krawędź
  g.lineWidth = 3;
  g.strokeStyle = "rgba(10,30,34,0.55)";
  g.beginPath();
  g.arc(c, c, px(HUB), 0, Math.PI * 2);
  g.stroke();
  g.lineWidth = 10;
  g.beginPath();
  g.arc(c, c, c - 5, 0, Math.PI * 2);
  g.stroke();

  // mikro-rowki jako roughness map: dają pierścieniowy błysk
  const rough = document.createElement("canvas");
  rough.width = rough.height = size;
  const r = rough.getContext("2d")!;
  r.fillStyle = "#404040";
  r.fillRect(0, 0, size, size);
  for (let rad = px(HUB) + 6; rad < c - 12; rad += 2.2) {
    r.strokeStyle = `rgba(255,255,255,${0.1 + Math.random() * 0.25})`;
    r.lineWidth = 1;
    r.beginPath();
    r.arc(c, c, rad, 0, Math.PI * 2);
    r.stroke();
  }

  const map = new THREE.CanvasTexture(color);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  const roughnessMap = new THREE.CanvasTexture(rough);
  roughnessMap.anisotropy = 8;
  return { map, roughnessMap };
}

function makeGeometry() {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, R, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absarc(0, 0, HOLE, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: THICK,
    bevelEnabled: true,
    bevelThickness: 0.006,
    bevelSize: 0.006,
    bevelSegments: 2,
    curveSegments: 96,
  });
  geo.translate(0, 0, -THICK / 2);
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, pos.getX(i) / (2 * R) + 0.5, pos.getY(i) / (2 * R) + 0.5);
  }
  return geo;
}

function circle(radius: number, n = 128): [number, number, number][] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [Math.cos(a) * radius, Math.sin(a) * radius, 0];
  });
}

let glintHost: HTMLElement | null = null;

export function CD() {
  const group = useRef<THREE.Group>(null);
  const angle = useSpinPhysics();
  const geometry = useMemo(() => makeGeometry(), []);
  const { map, roughnessMap } = useMemo(() => makeFaceTextures(), []);
  const rimOuter = useMemo(() => circle(R * 1.002), []);
  const rimHub = useMemo(() => circle(HUB), []);

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime;
    g.position.y = DISC_Y + Math.sin(t * bob.speed) * bob.amplitude;
    g.rotation.y = angle.current;
    g.rotation.z = Math.sin(t * bob.speed * 0.6) * 0.035;
    g.rotation.x = -0.08;

    // Połysk ikon i podpisu jedzie razem z obrotem płyty (0..2 = jeden cykl gradientu)
    glintHost ??= document.querySelector<HTMLElement>(".overlay");
    const shine = (((angle.current / Math.PI) % 1) + 1) % 1;
    glintHost?.style.setProperty("--shine", (shine * 2).toFixed(4));
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          map={map}
          roughnessMap={roughnessMap}
          roughness={0.55}
          metalness={1}
          clearcoat={1}
          clearcoatRoughness={0.08}
          iridescence={0.35}
          iridescenceIOR={1.7}
          iridescenceThicknessRange={[200, 700]}
          envMapIntensity={1.4}
        />
      </mesh>
      {[1, -1].map((side) => (
        <group key={side} position={[0, 0, side * (THICK / 2 + 0.012)]}>
          <Line points={rimOuter} color={theme.rim} lineWidth={2} />
          <Line
            points={rimHub}
            color={theme.rim}
            lineWidth={1.2}
            transparent
            opacity={0.7}
          />
        </group>
      ))}
    </group>
  );
}
