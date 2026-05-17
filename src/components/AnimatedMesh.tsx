import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Animated wireframe icosahedron — pure SVG, no WebGL.
 * Rotates continuously, points pulse, edges glow.
 */
export function AnimatedMesh() {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      setT((prev) => prev + (now - last) * 0.0006);
      last = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Icosahedron vertices
  const phi = (1 + Math.sqrt(5)) / 2;
  const baseVerts: [number, number, number][] = [
    [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
    [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
    [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
  ];
  const edges: [number, number][] = [
    [0,1],[0,5],[0,7],[0,10],[0,11],[1,5],[1,7],[1,8],[1,9],
    [2,3],[2,4],[2,6],[2,10],[2,11],[3,4],[3,6],[3,8],[3,9],
    [4,5],[4,9],[4,11],[5,9],[5,11],[6,7],[6,8],[6,10],
    [7,8],[7,10],[8,9],[10,11],
  ];

  const cy = Math.cos(t), sy = Math.sin(t);
  const cx = Math.cos(t * 0.7), sx = Math.sin(t * 0.7);
  const project = ([x, y, z]: [number, number, number]) => {
    // rotate Y
    let X = x * cy + z * sy;
    let Z = -x * sy + z * cy;
    // rotate X
    let Y = y * cx - Z * sx;
    Z = y * sx + Z * cx;
    const scale = 70;
    const persp = 4 / (4 + Z);
    return { x: X * scale * persp, y: Y * scale * persp, z: Z };
  };

  const pts = baseVerts.map(project);

  return (
    <svg viewBox="-220 -220 440 440" className="h-full w-full">
      <defs>
        <radialGradient id="meshGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.82 0.16 195)" stopOpacity="0.4" />
          <stop offset="70%" stopColor="oklch(0.82 0.16 195)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="edgeGrad" x1="0" x2="1">
          <stop offset="0%" stopColor="oklch(0.82 0.16 195)" />
          <stop offset="100%" stopColor="oklch(0.7 0.2 60)" />
        </linearGradient>
      </defs>
      <circle cx="0" cy="0" r="200" fill="url(#meshGlow)" />
      {edges.map(([a, b], i) => {
        const p1 = pts[a], p2 = pts[b];
        const avgZ = (p1.z + p2.z) / 2;
        const opacity = Math.max(0.15, Math.min(1, 0.5 + avgZ * 0.18));
        return (
          <line
            key={i}
            x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke="url(#edgeGrad)"
            strokeWidth={0.8 + opacity * 1.2}
            opacity={opacity}
            strokeLinecap="round"
          />
        );
      })}
      {pts.map((p, i) => (
        <circle
          key={i}
          cx={p.x} cy={p.y}
          r={1.5 + Math.max(0, p.z) * 0.8}
          fill="oklch(0.96 0.01 200)"
          opacity={Math.max(0.3, 0.6 + p.z * 0.15)}
        />
      ))}
      {/* corner crosshairs */}
      {[[-200,-200],[200,-200],[-200,200],[200,200]].map(([x,y], i) => (
        <g key={i} stroke="oklch(0.82 0.16 195)" strokeWidth="1" opacity="0.5">
          <line x1={x} y1={y} x2={x + (x<0?20:-20)} y2={y} />
          <line x1={x} y1={y} x2={x} y2={y + (y<0?20:-20)} />
        </g>
      ))}
      <motion.text
        x="-200" y="-205"
        className="font-display"
        fontSize="10"
        fill="oklch(0.65 0.02 220)"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        ● LIVE · 1,284,902 faces
      </motion.text>
      <text x="115" y="215" className="font-display" fontSize="10" fill="oklch(0.65 0.02 220)">
        rot {(t % (Math.PI * 2)).toFixed(2)}rad
      </text>
    </svg>
  );
}
