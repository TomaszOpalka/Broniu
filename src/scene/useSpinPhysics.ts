import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { spin } from "../config";

const clamp = (v: number, lim: number) => Math.max(-lim, Math.min(lim, v));

// Obrót z bezwładnością: drag 1:1, po puszczeniu prędkość wygasa wykładniczo
// (ta sama krzywa co momentum scroll w iOS) do spokojnej prędkości bazowej.
// Wszystko w refach, bez setState w pętli.
export function useSpinPhysics() {
  const el = useThree((s) => s.gl.domElement);
  const angle = useRef(0);
  const vel = useRef<number>(spin.baseSpeed);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const samples = useRef<{ t: number; a: number }[]>([]);

  useEffect(() => {
    const record = () => {
      const now = performance.now();
      const s = samples.current;
      s.push({ t: now, a: angle.current });
      while (s.length && now - s[0].t > spin.velocityWindowMs) s.shift();
    };

    const onDown = (e: PointerEvent) => {
      dragging.current = true;
      lastX.current = e.clientX;
      samples.current = [];
      record();
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      angle.current += (e.clientX - lastX.current) * spin.dragSensitivity;
      lastX.current = e.clientX;
      record();
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging.current) return;
      dragging.current = false;
      if (el.hasPointerCapture(e.pointerId))
        el.releasePointerCapture(e.pointerId);
      const s = samples.current;
      const now = performance.now();
      if (s.length > 1 && now - s[s.length - 1].t < spin.velocityWindowMs) {
        const dt = (s[s.length - 1].t - s[0].t) / 1000;
        if (dt > 0.008)
          vel.current = clamp((s[s.length - 1].a - s[0].a) / dt, spin.maxSpeed);
      } else {
        vel.current = spin.baseSpeed; // przytrzymał bez ruchu
      }
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const d = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY;
      vel.current = clamp(
        vel.current + d * spin.wheelSensitivity,
        spin.maxSpeed,
      );
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("wheel", onWheel);
    };
  }, [el]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (dragging.current) return;
    vel.current +=
      (spin.baseSpeed - vel.current) * (1 - Math.exp(-spin.friction * dt));
    angle.current += vel.current * dt;
  });

  return angle;
}
