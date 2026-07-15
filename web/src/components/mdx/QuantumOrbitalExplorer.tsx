"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Eye, Sliders, CircleDot } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { STATIC_UI_STRINGS } from '@/lib/translations';

interface Lobe {
  x: number;
  y: number;
  z: number;
  radius: number;
  color: string;
  phase: '+' | '-';
}

interface OrbitalPreset {
  id: string;
  name: string;
  description: string;
  geometry: string;
  lobes: Lobe[];
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Face {
  indices: number[];
  phase: '+' | '-';
  avgZ: number;
  normal: Point3D;
  color: string;
}

interface Mesh {
  vertices: Point3D[];
  faces: Face[];
}

const ORBITALS: OrbitalPreset[] = [
  {
    id: "1s",
    name: "1s Orbital",
    description: "The lowest energy orbital, showing perfect spherical symmetry. Electron probability density peaks at the nucleus.",
    geometry: "Spherical (l = 0, m = 0)",
    lobes: []
  },
  {
    id: "2s",
    name: "2s Orbital",
    description: "Spherical orbital with a radial node (a spherical shell where electron probability drops to zero).",
    geometry: "Spherical with Node (l = 0, m = 0)",
    lobes: []
  },
  {
    id: "2px",
    name: "2p_x Orbital",
    description: "Bilobed orbital oriented along the x-axis. The yz-plane acts as a nodal plane.",
    geometry: "Dumbbell / Bilobed (l = 1, m = ±1)",
    lobes: []
  },
  {
    id: "2py",
    name: "2p_y Orbital",
    description: "Bilobed orbital oriented along the y-axis (depth). The xz-plane acts as a nodal plane.",
    geometry: "Dumbbell / Bilobed (l = 1, m = ±1)",
    lobes: []
  },
  {
    id: "2pz",
    name: "2p_z Orbital",
    description: "Features two opposing lobes oriented vertically along the z-axis. Wave phases of positive (blue) and negative (red) represent wave sign.",
    geometry: "Dumbbell / Bilobed (l = 1, m = 0)",
    lobes: []
  },
  {
    id: "3d", // id kept as "3d" for backward compatibility, renders 3d_xy
    name: "3d_xy Orbital",
    description: "Four-lobed (quadrupolar) d-orbital. Lobes of alternating wave signs populate the four quadrants of the screen plane.",
    geometry: "Clover / Quadrupolar (l = 2, m = ±2)",
    lobes: []
  },
  {
    id: "3d_z2",
    name: "3d_z² Orbital",
    description: "Features a prominent dumbbell along the vertical axis with a surrounding donut ring in the horizontal plane.",
    geometry: "Dumbbell & Torus (l = 2, m = 0)",
    lobes: []
  },
  {
    id: "sp",
    name: "sp Hybrid",
    description: "Linear combination of one s and one p orbital. Creates two hybrid orbitals pointing at 180° (linear geometry).",
    geometry: "Linear (180° angle)",
    lobes: []
  },
  {
    id: "sp2",
    name: "sp² Hybrid",
    description: "Linear combination of one s and two p orbitals. Shapes three hybrid orbitals coplanar at 120°.",
    geometry: "Trigonal Planar (120° angle)",
    lobes: []
  },
  {
    id: "sp3",
    name: "sp³ Hybrid",
    description: "Combination of one s and three p orbitals. Yields four hybrid orbitals oriented toward the vertices of a regular tetrahedron.",
    geometry: "Tetrahedral (109.5° angle)",
    lobes: []
  }
];

const _dummy_translations = (t: any) => [
  t("1s Orbital"),
  t("The lowest energy orbital, showing perfect spherical symmetry. Electron probability density peaks at the nucleus."),
  t("Spherical (l = 0, m = 0)"),
  t("2s Orbital"),
  t("Spherical orbital with a radial node (a spherical shell where electron probability drops to zero)."),
  t("Spherical with Node (l = 0, m = 0)"),
  t("2p_z Orbital"),
  t("Features two opposing lobes oriented vertically along the z-axis. Wave phases of positive (blue) and negative (red) represent wave sign."),
  t("Dumbbell / Bilobed (l = 1, m = 0)"),
  t("2p_x Orbital"),
  t("Bilobed orbital oriented along the x-axis. The yz-plane acts as a nodal plane."),
  t("Dumbbell / Bilobed (l = 1, m = ±1)"),
  t("2p_y Orbital"),
  t("Bilobed orbital oriented along the y-axis (depth). The xz-plane acts as a nodal plane."),
  t("3d_xy Orbital"),
  t("Four-lobed (quadrupolar) d-orbital. Lobes of alternating wave signs populate the four quadrants of the screen plane."),
  t("Clover / Quadrupolar (l = 2, m = ±2)"),
  t("3d_z² Orbital"),
  t("Features a prominent dumbbell along the vertical axis with a surrounding donut ring in the horizontal plane."),
  t("Dumbbell & Torus (l = 2, m = 0)"),
  t("sp Hybrid"),
  t("Linear combination of one s and one p orbital. Creates two hybrid orbitals pointing at 180° (linear geometry)."),
  t("Linear (180° angle)"),
  t("sp² Hybrid"),
  t("Linear combination of one s and two p orbitals. Shapes three hybrid orbitals coplanar at 120°."),
  t("Trigonal Planar (120° angle)"),
  t("sp³ Hybrid"),
  t("Combination of one s and three p orbitals. Yields four hybrid orbitals oriented toward the vertices of a regular tetrahedron."),
  t("Tetrahedral (109.5° angle)"),

  // UI labels
  t("Quantum Orbital & Hybridization Explorer"),
  t("Drag to rotate 3D wave probability density. Step through energy levels on the sidebar."),
  t("Aufbau Shell Filler"),
  t("Empty"),
  t("Subshell 2p"),
  t("Subshell 2s"),
  t("Subshell 1s"),
  t("Bond Geometry"),
  t("Add Electron"),
  t("Remove Electron"),
  t("Toggle Auto Rotation"),
  t("Toggle Wave Sign Phases (+ / -)")
];

// Helper to generate a 3D sphere mesh modulated by spherical harmonics
const generateOrbitalMesh = (
  radiusFn: (theta: number, phi: number) => number,
  signFn: (theta: number, phi: number) => '+' | '-',
  scale: number,
  latBands: number,
  lonBands: number
): Mesh => {
  const vertices: Point3D[] = [];

  for (let lat = 0; lat <= latBands; lat++) {
    const theta = (lat * Math.PI) / latBands;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let lon = 0; lon <= lonBands; lon++) {
      const phi = (lon * 2 * Math.PI) / lonBands;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      const r = radiusFn(theta, phi) * scale;

      // Map spherical to Cartesian where:
      // Y is vertical, X is horizontal, Z is depth.
      const x = r * sinTheta * cosPhi;
      const y = r * cosTheta;
      const z = r * sinTheta * sinPhi;

      vertices.push({ x, y, z });
    }
  }

  const faces: Face[] = [];
  for (let lat = 0; lat < latBands; lat++) {
    for (let lon = 0; lon < lonBands; lon++) {
      const i00 = lat * (lonBands + 1) + lon;
      const i10 = (lat + 1) * (lonBands + 1) + lon;
      const i11 = (lat + 1) * (lonBands + 1) + (lon + 1);
      const i01 = lat * (lonBands + 1) + (lon + 1);

      const midTheta = ((lat + 0.5) * Math.PI) / latBands;
      const midPhi = ((lon + 0.5) * 2 * Math.PI) / lonBands;
      const phase = signFn(midTheta, midPhi);

      faces.push({
        indices: [i00, i10, i11, i01],
        phase,
        avgZ: 0,
        normal: { x: 0, y: 0, z: 1 },
        color: ''
      });
    }
  }

  return { vertices, faces };
};

// Generates the meshes for standard and hybrid presets
const generateMeshForPreset = (presetId: string): Mesh[] => {
  const meshes: Mesh[] = [];

  switch (presetId) {
    case '1s': {
      meshes.push(
        generateOrbitalMesh(
          () => 1.0,
          () => '+',
          55,
          18,
          36
        )
      );
      break;
    }

    case '2s': {
      // Outer shell (positive phase, will render transparent)
      meshes.push(
        generateOrbitalMesh(
          () => 1.0,
          () => '+',
          60,
          18,
          36
        )
      );
      // Inner shell (negative phase, will render solid)
      meshes.push(
        generateOrbitalMesh(
          () => 0.45,
          () => '-',
          60,
          18,
          36
        )
      );
      break;
    }

    case '2px': {
      meshes.push(
        generateOrbitalMesh(
          (theta, phi) => Math.abs(Math.sin(theta) * Math.cos(phi)),
          (theta, phi) => Math.sin(theta) * Math.cos(phi) >= 0 ? '+' : '-',
          75,
          18,
          36
        )
      );
      break;
    }

    case '2py': {
      meshes.push(
        generateOrbitalMesh(
          (theta, phi) => Math.abs(Math.sin(theta) * Math.sin(phi)),
          (theta, phi) => Math.sin(theta) * Math.sin(phi) >= 0 ? '+' : '-',
          75,
          18,
          36
        )
      );
      break;
    }

    case '2pz': {
      meshes.push(
        generateOrbitalMesh(
          (theta, phi) => Math.abs(Math.cos(theta)),
          (theta, phi) => Math.cos(theta) >= 0 ? '+' : '-',
          75,
          18,
          36
        )
      );
      break;
    }

    case '3d': // maps to 3d_xy clover
      meshes.push(
        generateOrbitalMesh(
          (theta, phi) => Math.abs(Math.sin(2 * theta) * Math.cos(phi)),
          (theta, phi) => Math.cos(theta) * Math.cos(phi) >= 0 ? '+' : '-',
          75,
          18,
          36
        )
      );
      break;

    case '3d_z2': {
      meshes.push(
        generateOrbitalMesh(
          (theta, phi) => Math.abs(3 * Math.cos(theta) * Math.cos(theta) - 1),
          (theta, phi) => 3 * Math.cos(theta) * Math.cos(theta) - 1 >= 0 ? '+' : '-',
          45,
          20,
          40
        )
      );
      break;
    }

    case 'sp': {
      const directions = [
        { x: 1, y: 0, z: 0 },
        { x: -1, y: 0, z: 0 }
      ];
      directions.forEach((dir) => {
        meshes.push(
          generateOrbitalMesh(
            (theta, phi) => {
              const rx = Math.sin(theta) * Math.cos(phi);
              const ry = Math.cos(theta);
              const rz = Math.sin(theta) * Math.sin(phi);
              const dot = dir.x * rx + dir.y * ry + dir.z * rz;
              const val = 0.5 + 0.5 * dot;
              return val >= 0 ? val : Math.abs(val) * 0.2;
            },
            (theta, phi) => {
              const rx = Math.sin(theta) * Math.cos(phi);
              const ry = Math.cos(theta);
              const rz = Math.sin(theta) * Math.sin(phi);
              const dot = dir.x * rx + dir.y * ry + dir.z * rz;
              const val = 0.5 + 0.5 * dot;
              return val >= 0 ? '+' : '-';
            },
            75,
            12,
            24
          )
        );
      });
      break;
    }

    case 'sp2': {
      const directions = [
        { x: 1, y: 0, z: 0 },
        { x: -0.5, y: 0.866, z: 0 },
        { x: -0.5, y: -0.866, z: 0 }
      ];
      directions.forEach((dir) => {
        meshes.push(
          generateOrbitalMesh(
            (theta, phi) => {
              const rx = Math.sin(theta) * Math.cos(phi);
              const ry = Math.cos(theta);
              const rz = Math.sin(theta) * Math.sin(phi);
              const dot = dir.x * rx + dir.y * ry + dir.z * rz;
              const val = 0.414 + 0.586 * dot;
              return val >= 0 ? val : Math.abs(val) * 0.2;
            },
            (theta, phi) => {
              const rx = Math.sin(theta) * Math.cos(phi);
              const ry = Math.cos(theta);
              const rz = Math.sin(theta) * Math.sin(phi);
              const dot = dir.x * rx + dir.y * ry + dir.z * rz;
              const val = 0.414 + 0.586 * dot;
              return val >= 0 ? '+' : '-';
            },
            75,
            12,
            24
          )
        );
      });
      break;
    }

    case 'sp3': {
      const directions = [
        { x: 0, y: 1, z: 0 },
        { x: 0.94, y: -0.33, z: 0 },
        { x: -0.47, y: -0.33, z: 0.82 },
        { x: -0.47, y: -0.33, z: -0.82 }
      ];
      directions.forEach((dir) => {
        meshes.push(
          generateOrbitalMesh(
            (theta, phi) => {
              const rx = Math.sin(theta) * Math.cos(phi);
              const ry = Math.cos(theta);
              const rz = Math.sin(theta) * Math.sin(phi);
              const dot = dir.x * rx + dir.y * ry + dir.z * rz;
              const val = 0.366 + 0.634 * dot;
              return val >= 0 ? val : Math.abs(val) * 0.2;
            },
            (theta, phi) => {
              const rx = Math.sin(theta) * Math.cos(phi);
              const ry = Math.cos(theta);
              const rz = Math.sin(theta) * Math.sin(phi);
              const dot = dir.x * rx + dir.y * ry + dir.z * rz;
              const val = 0.366 + 0.634 * dot;
              return val >= 0 ? '+' : '-';
            },
            75,
            12,
            24
          )
        );
      });
      break;
    }

    default:
      break;
  }

  return meshes;
};

// Custom mesh generator for arbitrary quantum numbers n, l, m
const generateCustomMesh = (n: number, l: number, m: number): Mesh[] => {
  const meshes: Mesh[] = [];
  const numShells = n - l;
  
  // Radial nodes correspond to alternating nested shells
  for (let s = 0; s < numShells; s++) {
    const scale = 75 * (1.0 - (s * 0.3) / numShells);
    const shellSignMultiplier = s % 2 === 0 ? 1 : -1;

    meshes.push(
      generateOrbitalMesh(
        (theta, phi) => {
          let val = 0;
          if (l === 0) {
            val = 1.0;
          } else if (l === 1) {
            if (m === 0) val = Math.cos(theta);
            else if (m === 1) val = Math.sin(theta) * Math.cos(phi);
            else if (m === -1) val = Math.sin(theta) * Math.sin(phi);
          } else if (l === 2) {
            if (m === 0) val = 0.5 * (3 * Math.cos(theta) * Math.cos(theta) - 1);
            else if (m === 1 || m === -1) val = Math.sin(theta) * Math.cos(theta) * (m === 1 ? Math.cos(phi) : Math.sin(phi));
            else if (m === 2 || m === -2) val = Math.sin(theta) * Math.sin(theta) * (m === 2 ? Math.cos(2 * phi) : Math.sin(2 * phi));
          } else if (l === 3) {
            if (m === 0) val = 0.5 * Math.cos(theta) * (5 * Math.cos(theta) * Math.cos(theta) - 3);
            else if (m === 1 || m === -1) val = 0.25 * Math.sin(theta) * (5 * Math.cos(theta) * Math.cos(theta) - 1) * (m === 1 ? Math.cos(phi) : Math.sin(phi));
            else if (m === 2 || m === -2) val = Math.sin(theta) * Math.sin(theta) * Math.cos(theta) * (m === 2 ? Math.cos(2 * phi) : Math.sin(2 * phi));
            else if (m === 3 || m === -3) val = Math.sin(theta) * Math.sin(theta) * Math.sin(theta) * (m === 3 ? Math.cos(3 * phi) : Math.sin(3 * phi));
          }
          return Math.abs(val);
        },
        (theta, phi) => {
          let val = 0;
          if (l === 0) {
            val = 1.0;
          } else if (l === 1) {
            if (m === 0) val = Math.cos(theta);
            else if (m === 1) val = Math.sin(theta) * Math.cos(phi);
            else if (m === -1) val = Math.sin(theta) * Math.sin(phi);
          } else if (l === 2) {
            if (m === 0) val = 3 * Math.cos(theta) * Math.cos(theta) - 1;
            else if (m === 1 || m === -1) val = Math.cos(theta) * (m === 1 ? Math.cos(phi) : Math.sin(phi));
            else if (m === 2 || m === -2) val = m === 2 ? Math.cos(2 * phi) : Math.sin(2 * phi);
          } else if (l === 3) {
            if (m === 0) val = Math.cos(theta) * (5 * Math.cos(theta) * Math.cos(theta) - 3);
            else if (m === 1 || m === -1) val = (5 * Math.cos(theta) * Math.cos(theta) - 1) * (m === 1 ? Math.cos(phi) : Math.sin(phi));
            else if (m === 2 || m === -2) val = Math.cos(theta) * (m === 2 ? Math.cos(2 * phi) : Math.sin(2 * phi));
            else if (m === 3 || m === -3) val = m === 3 ? Math.cos(3 * phi) : Math.sin(3 * phi);
          }
          const sign = val >= 0 ? '+' : '-';
          if (shellSignMultiplier === -1) {
            return sign === '+' ? '-' : '+';
          }
          return sign;
        },
        scale,
        18,
        36
      )
    );
  }
  return meshes;
};

interface QuantumOrbitalExplorerProps {
  initialPresetId?: string;
  gradeLevel?: 'middle_school' | 'high_school' | 'university';
}

export const QuantumOrbitalExplorer = ({
  initialPresetId = "1s",
  gradeLevel = "high_school"
}: QuantumOrbitalExplorerProps) => {
  const { language } = useLanguage();
  const t = (STATIC_UI_STRINGS[language.toUpperCase() as keyof typeof STATIC_UI_STRINGS] || STATIC_UI_STRINGS.EN) as any;

  const [activePreset, setActivePreset] = useState<OrbitalPreset>(() => {
    return ORBITALS.find(o => o.id === initialPresetId) || ORBITALS[0];
  });

  const [mode, setMode] = useState<'preset' | 'schrodinger'>('preset');

  // Custom Schrödinger sandbox states
  const [customN, setCustomN] = useState(3);
  const [customL, setCustomL] = useState(1);
  const [customM, setCustomM] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoom, setZoom] = useState(100);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showPhases, setShowPhases] = useState(true);

  // Euler angles
  const [angleX, setAngleX] = useState(-0.3);
  const [angleY, setAngleY] = useState(0.4);

  const isDragging = useRef(false);
  const lastMouseX = useRef(0);
  const lastMouseY = useRef(0);

  // Quantum electron configuration state (interactive shell filler)
  const [electronCount, setElectronCount] = useState(1);

  // Sync preset if prop updates
  useEffect(() => {
    const found = ORBITALS.find(o => o.id === initialPresetId);
    if (found) {
      setActivePreset(found);
      setMode('preset');
    }
  }, [initialPresetId]);

  // Generate meshes for current state
  const activeMeshes = useMemo(() => {
    if (mode === 'schrodinger') {
      return generateCustomMesh(customN, customL, customM);
    }
    return generateMeshForPreset(activePreset.id);
  }, [mode, activePreset.id, customN, customL, customM]);

  // Helper to blend base colors with light intensity and alpha opacity
  const blendAlphaAndLight = (hex: string, intensity: number, opacity: number) => {
    const num = parseInt(hex.replace("#", ""), 16);
    let R = (num >> 16) & 0xff;
    let G = (num >> 8) & 0xff;
    let B = num & 0xff;

 
    R = Math.min(255, Math.max(0, Math.round(R * intensity)));
    G = Math.min(255, Math.max(0, Math.round(G * intensity)));
    B = Math.min(255, Math.max(0, Math.round(B * intensity)));

    return `rgba(${R}, ${G}, ${B}, ${opacity})`;
  };

  // 3D canvas rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
      }

      const canvasWidth = rect.width;
      const canvasHeight = rect.height;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Background grid lines (blueprint scientific grid)
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.06)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvasWidth; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvasHeight);
        ctx.stroke();
      }
      for (let j = 0; j < canvasHeight; j += 30) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvasWidth, j);
        ctx.stroke();
      }

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      // Projects 3D mesh vertices into 2D canvas coordinates
      const allProjectedMeshes = activeMeshes.map((mesh, meshIdx) => {
        const projectedVertices = mesh.vertices.map((v) => {
          // Rotate around Y-axis (horizontal)
          const x1 = v.x * cosY - v.z * sinY;
          const z1 = v.z * cosY + v.x * sinY;

          // Rotate around X-axis (vertical)
          const y2 = v.y * cosX - z1 * sinX;
          const z2 = z1 * cosX + v.y * sinX;

          // Perspective scaling
          const scaleFactor = (zoom / 100) / (1.2 + (z2 / 250));
          const sx = canvasWidth / 2 + x1 * scaleFactor;
          const sy = canvasHeight / 2 + y2 * scaleFactor;

          return { sx, sy, sz: z2, rx: x1, ry: y2, rz: z2 };
        });

        // Map faces and compute normal vectors + depths
        return mesh.faces.map((face) => {
          const p0 = projectedVertices[face.indices[0]];
          const p1 = projectedVertices[face.indices[1]];
          const p2 = projectedVertices[face.indices[2]];
          const p3 = projectedVertices[face.indices[3]];

          const avgZ = (p0.sz + p1.sz + p2.sz + p3.sz) / 4;

          // Normal calculation from rotated vertices
          const ux = p1.rx - p0.rx;
          const uy = p1.ry - p0.ry;
          const uz = p1.rz - p0.rz;

          const vx = p3.rx - p0.rx;
          const vy = p3.ry - p0.ry;
          const vz = p3.rz - p0.rz;

          let nx = uy * vz - uz * vy;
          let ny = uz * vx - ux * vz;
          let nz = ux * vy - uy * vx;

          const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
          if (len > 0.0001) {
            nx /= len;
            ny /= len;
            nz /= len;
          }

          // Shading: light coming from front (dot product with z-axis)
          const intensity = 0.35 + 0.65 * Math.abs(nz);

          let colorBase = '#10b981'; // Phase off color
          if (showPhases) {
            colorBase = face.phase === '+' ? '#3b82f6' : '#ef4444';
          }

          // Inner shells or outer shells transparent/solid blending (hybrid lobes should be uniform)
          const isHybrid = mode === 'preset' && activePreset.id.startsWith('sp');
          const opacity = (meshIdx === 0 && activeMeshes.length > 1 && !isHybrid) ? 0.32 : 0.82;

          return { p0, p1, p2, p3, avgZ, intensity, colorBase, opacity };
        });
      });

      const allFaces = allProjectedMeshes.flat();
      if (allFaces.length > 0) {
        // Painters Algorithm: sort faces back-to-front
        allFaces.sort((a, b) => b.avgZ - a.avgZ);

        // Draw solid shaded polygons
        allFaces.forEach((face) => {
          const { p0, p1, p2, p3, intensity, colorBase, opacity } = face;

          const color = blendAlphaAndLight(colorBase, intensity, opacity);
          const strokeColor = blendAlphaAndLight(colorBase, intensity * 1.15, opacity * 0.25);

          ctx.fillStyle = color;
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 0.5;

          ctx.beginPath();
          ctx.moveTo(p0.sx, p0.sy);
          ctx.lineTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.lineTo(p3.sx, p3.sy);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        });
      }

      // Draw 3D axis helper in the bottom-left corner
      const axisLen = 22;
      const ox = 40;
      const oy = canvasHeight - 40;

      const rotateVector = (vx: number, vy: number, vz: number) => {
        const x1 = vx * cosY - vz * sinY;
        const z1 = vz * cosY + vx * sinY;
        const y2 = vy * cosX - z1 * sinX;
        const z2 = z1 * cosX + vy * sinX;
        return { x: x1, y: y2, z: z2 };
      };

      const axisX = rotateVector(axisLen, 0, 0);
      const axisY = rotateVector(0, axisLen, 0);
      const axisZ = rotateVector(0, 0, axisLen);

      // Draw X axis (Red)
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(ox + axisX.x, oy - axisX.y);
      ctx.stroke();

      // Draw Y axis (Green)
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(ox + axisY.x, oy - axisY.y);
      ctx.stroke();

      // Draw Z axis (Blue)
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.45)';
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(ox + axisZ.x, oy - axisZ.y);
      ctx.stroke();

      // Draw Axis labels
      ctx.font = 'bold 8.5px sans-serif';
      ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
      ctx.fillText('x', ox + axisX.x + 3.5, oy - axisX.y + 3);

      ctx.fillStyle = 'rgba(16, 185, 129, 0.6)';
      ctx.fillText('y', ox + axisY.x + 3.5, oy - axisY.y - 3.5);

      ctx.fillStyle = 'rgba(59, 130, 246, 0.6)';
      ctx.fillText('z', ox + axisZ.x + 3.5, oy - axisZ.y + 3);

      if (autoRotate && !isDragging.current) {
        setAngleY((prev) => (prev + 0.007) % (Math.PI * 2));
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [activeMeshes, zoom, autoRotate, showPhases, angleX, angleY]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMouseX.current = e.clientX;
    lastMouseY.current = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - lastMouseX.current;
    const deltaY = e.clientY - lastMouseY.current;

    lastMouseX.current = e.clientX;
    lastMouseY.current = e.clientY;

    setAngleY((prev) => prev + deltaX * 0.009);
    setAngleX((prev) => Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, prev + deltaY * 0.009)));
  };

  const renderShellElectrons = (shell: '1s' | '2s' | '2px' | '2py' | '2pz') => {
    let count = 0;

    if (shell === '1s') {
      count = Math.min(2, electronCount);
    } else if (shell === '2s') {
      count = Math.min(2, Math.max(0, electronCount - 2));
    } else {
      const pCount = Math.max(0, electronCount - 4);
      if (pCount > 0) {
        if (pCount <= 3) {
          if (shell === '2px') count = 1;
          if (shell === '2py' && pCount >= 2) count = 1;
          if (shell === '2pz' && pCount >= 3) count = 1;
        } else {
          if (shell === '2px') count = 2;
          if (shell === '2py') count = pCount >= 5 ? 2 : 1;
          if (shell === '2pz') count = pCount >= 6 ? 2 : 1;
        }
      }
    }

    return (
      <div className="flex items-center gap-1.5 h-6 px-2 bg-slate-950/60 border border-slate-900 rounded-lg min-w-[34px] justify-center shadow-inner">
        {count >= 1 && (
          <span className="text-cyan-400 font-black text-sm select-none animate-fadeIn">↑</span>
        )}
        {count >= 2 && (
          <span className="text-amber-400 font-black text-sm select-none animate-fadeIn">↓</span>
        )}
        {count === 0 && <span className="text-slate-700 font-extrabold text-[8px] select-none uppercase tracking-wide">{t["Empty"]}</span>}
      </div>
    );
  };

  // Convert n, l, m numbers to chemical subshell label (e.g. 3d_z2)
  const getCustomOrbitalInfo = () => {
    const lLetters = ['s', 'p', 'd', 'f'];
    const letter = lLetters[customL] || 's';
    
    let sub = '';
    if (customL === 0) sub = '';
    else if (customL === 1) {
      if (customM === 0) sub = '_z';
      else if (customM === 1) sub = '_x';
      else if (customM === -1) sub = '_y';
    } else if (customL === 2) {
      if (customM === 0) sub = '_z²';
      else if (customM === 1) sub = '_xz';
      else if (customM === -1) sub = '_yz';
      else if (customM === 2) sub = '_x²-y²';
      else if (customM === -2) sub = '_xy';
    } else if (customL === 3) {
      if (customM === 0) sub = '_z³';
      else if (customM === 1) sub = '_xz²';
      else if (customM === -1) sub = '_yz²';
      else if (customM === 2) sub = '_z(x²-y²)';
      else if (customM === -2) sub = '_xyz';
      else if (customM === 3) sub = '_x(x²-3y²)';
      else if (customM === -3) sub = '_y(3x²-y²)';
    }

    const name = `${customN}${letter}${sub}`;
    
    // Simple descriptions for custom states
    let desc = (t["Hydrogenic orbital wave function for state |n, l, m⟩."] || "Hydrogenic orbital wave function for state |{n}, {l}, {m}⟩.")
      .replace('{n}', String(customN))
      .replace('{l}', String(customL))
      .replace('{m}', String(customM));

    if (customL === 0) {
      desc = (t["Spherical symmetric orbital (l=0) with radial nodes. Probability density is highest at the nucleus."] || "Spherical symmetric orbital (l=0) with {nodes} radial nodes. Probability density is highest at the nucleus.")
        .replace('{nodes}', String(customN - 1));
    } else if (customL === 1) {
      desc = (t["Dumbbell-shaped orbital with 1 angular nodal plane and radial node shells."] || "Dumbbell-shaped orbital with 1 angular nodal plane and {nodes} radial node shells.")
        .replace('{nodes}', String(customN - 2));
    } else if (customL === 2) {
      desc = (t["Four-lobed clover or dumbbell-ring structure (l=2) with 2 angular nodal planes and radial node shells."] || "Four-lobed clover or dumbbell-ring structure (l=2) with 2 angular nodal planes and {nodes} radial node shells.")
        .replace('{nodes}', String(customN - 3));
    } else if (customL === 3) {
      desc = (t["Complex higher-order angular distribution (l=3) with 3 angular nodal planes. Typical of f-block heavy elements."] || "Complex higher-order angular distribution (l=3) with 3 angular nodal planes. Typical of f-block heavy elements.");
    }

    return { name, desc, geometry: `l = ${customL}, m = ${customM}` };
  };

  const customInfo = getCustomOrbitalInfo();

  return (
    <div className="my-8 rounded-3xl overflow-hidden border border-slate-800/85 bg-slate-950/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-850 pb-5 mb-5">
        <div>
          <h4 className="text-sm font-black text-slate-100 uppercase tracking-widest flex items-center gap-2">
            <CircleDot className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{t["Quantum Orbital & Hybridization Explorer"] || "Quantum Orbital Explorer"}</span>
          </h4>
          <p className="text-[11px] text-slate-400 font-semibold mt-1">
            {mode === 'schrodinger'
              ? (t["Schrödinger Laboratory: Solve wavefunctions by configuring quantum variables n, l, and m."] || "Schrödinger Laboratory: Solve wavefunctions by configuring quantum variables n, l, and m.")
              : (t["Drag to rotate 3D wave probability density. Step through energy levels on the sidebar."] || "Drag to rotate 3D wave probability density. Step through energy levels on the sidebar.")}
          </p>
        </div>

        {/* Orbitals selector pills */}
        <div className="flex flex-wrap gap-1.5 max-w-full md:max-w-[60%]">
          {ORBITALS.map((o) => (
            <button
              key={o.id}
              onClick={() => {
                setActivePreset(o);
                setMode('preset');
              }}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border ${
                mode === 'preset' && activePreset.id === o.id
                  ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                  : "bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200"
              }`}
            >
              {o.id}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Render Viewport (7 cols) */}
        <div className="lg:col-span-7 relative h-[320px] lg:h-[360px] rounded-2xl border border-slate-850 bg-slate-950 overflow-hidden select-none">
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={() => { isDragging.current = false; }}
            onMouseLeave={() => { isDragging.current = false; }}
            className="w-full h-full cursor-grab active:cursor-grabbing block"
          />

          {/* Quick HUD controls */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`p-2 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                autoRotate
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
              title={t["Toggle Auto Rotation"]}
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            </button>

            <button
              onClick={() => setShowPhases(!showPhases)}
              className={`p-2 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                showPhases
                  ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
              title={t["Toggle Wave Sign Phases (+ / -)"]}
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-slate-900/85 border border-slate-800/80 rounded-xl px-2 py-1">
            <button onClick={() => setZoom(z => Math.max(40, z - 10))} className="text-slate-400 hover:text-white cursor-pointer p-1">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setZoom(z => Math.min(180, z + 10))} className="text-slate-400 hover:text-white cursor-pointer p-1">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quantum Sidebar: Interactive Tabbed Panel (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-slate-900/30 border border-slate-850 rounded-2xl p-5 space-y-4">
          <div className="space-y-4">
            {/* Tab switch buttons */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950/60 border border-slate-900 rounded-xl">
              <button
                onClick={() => setMode('preset')}
                className={`py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  mode === 'preset'
                    ? 'bg-slate-900 text-cyan-400 font-extrabold border border-slate-800/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t["Aufbau Shell Filler"] || "Aufbau Filler"}
              </button>
              <button
                onClick={() => setMode('schrodinger')}
                className={`py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  mode === 'schrodinger'
                    ? 'bg-slate-900 text-cyan-400 font-extrabold border border-slate-800/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🔬 {t["Schrödinger Lab"] || "Schrödinger Lab"}
              </button>
            </div>

            {/* TAB CONTENT: AUFBAU FILLER */}
            {mode === 'preset' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider">
                    {t["Aufbau Puzzle"] || "Aufbau Puzzle"}
                  </span>

                  {/* Interactive electron counter */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setElectronCount(e => Math.max(1, e - 1))}
                      className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 hover:text-white text-slate-400 flex items-center justify-center font-bold cursor-pointer text-xs active:scale-95"
                      title={t["Remove Electron"]}
                    >
                      -
                    </button>
                    <span className="text-xs font-mono font-black text-slate-200 w-12 text-center bg-slate-950/50 py-0.5 border border-slate-900 rounded">
                      {electronCount} e⁻
                    </span>
                    <button
                      onClick={() => setElectronCount(e => Math.min(10, e + 1))}
                      className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 hover:text-white text-slate-400 flex items-center justify-center font-bold cursor-pointer text-xs active:scale-95"
                      title={t["Add Electron"]}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Visual Shell levels graph */}
                <div className="relative border-l border-slate-800/80 pl-4 py-1 space-y-3">
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/50 via-indigo-500/30 to-slate-900/10" />

                  {/* 2p Subshell */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">{t["Subshell 2p"]}</span>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-mono font-black text-slate-400">2p_x</span>
                        {renderShellElectrons('2px')}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-mono font-black text-slate-400">2p_y</span>
                        {renderShellElectrons('2py')}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-mono font-black text-slate-400">2p_z</span>
                        {renderShellElectrons('2pz')}
                      </div>
                    </div>
                  </div>

                  {/* 2s Subshell */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">{t["Subshell 2s"]}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-black text-slate-400">2s</span>
                      {renderShellElectrons('2s')}
                    </div>
                  </div>

                  {/* 1s Subshell */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">{t["Subshell 1s"]}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-black text-slate-400">1s</span>
                      {renderShellElectrons('1s')}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: SCHRODINGER SANDBOX */}
            {mode === 'schrodinger' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block">{t["Hydrogenic Quantum Numbers"] || "Hydrogenic Quantum Numbers"}</span>
                
                <div className="space-y-3">
                  {/* n Slider */}
                  <div className="space-y-1 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
                    <label className="text-[9px] font-black uppercase text-cyan-400 tracking-wider flex justify-between">
                      <span>{t["n (Principal)"] || "n (Principal)"}</span>
                      <span className="font-mono text-white text-xs">{customN}</span>
                    </label>
                    <input
                      type="range" min={1} max={4} step={1} value={customN}
                      onChange={(e) => {
                        const nextN = parseInt(e.target.value, 10);
                        setCustomN(nextN);
                        // Restrict l
                        if (customL >= nextN) {
                          const nextL = nextN - 1;
                          setCustomL(nextL);
                          if (Math.abs(customM) > nextL) setCustomM(0);
                        }
                      }}
                      className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                    <span className="text-[8px] text-slate-550 font-bold block">{t["Determines shell energy and size (1 to 4)"] || "Determines shell energy and size (1 to 4)"}</span>
                  </div>

                  {/* l Slider */}
                  <div className="space-y-1 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
                    <label className="text-[9px] font-black uppercase text-indigo-400 tracking-wider flex justify-between">
                      <span>{t["l (Azimuthal)"] || "l (Azimuthal)"}</span>
                      <span className="font-mono text-white text-xs">
                        {customL} ({['s', 'p', 'd', 'f'][customL] || 's'})
                      </span>
                    </label>
                    <input
                      type="range" min={0} max={customN - 1} step={1} value={customL}
                      onChange={(e) => {
                        const nextL = parseInt(e.target.value, 10);
                        setCustomL(nextL);
                        // Restrict m
                        if (Math.abs(customM) > nextL) {
                          setCustomM(0);
                        }
                      }}
                      className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <span className="text-[8px] text-slate-550 font-bold block">{t["Determines subshell shape (0 to n-1)"] || "Determines subshell shape (0 to n-1)"}</span>
                  </div>

                  {/* m Slider */}
                  <div className="space-y-1 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900">
                    <label className="text-[9px] font-black uppercase text-amber-400 tracking-wider flex justify-between">
                      <span>{t["m (Magnetic)"] || "m (Magnetic)"}</span>
                      <span className="font-mono text-white text-xs">{customM >= 0 ? `+${customM}` : customM}</span>
                    </label>
                    <input
                      type="range" min={-customL} max={customL} step={1} value={customM}
                      onChange={(e) => setCustomM(parseInt(e.target.value, 10))}
                      className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      disabled={customL === 0}
                    />
                    <span className="text-[8px] text-slate-550 font-bold block">{t["Determines spatial orientation (-l to +l)"] || "Determines spatial orientation (-l to +l)"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Active Preset or Custom detailed chemical annotation */}
          <div className="pt-4 border-t border-slate-850/80 space-y-2">
            <h5 className="text-xs font-black text-white flex items-center gap-1.5">
              <CircleDot className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {mode === 'schrodinger'
                  ? `${t["Orbital"] || "Orbital"} ${customInfo.name}`
                  : (t[activePreset.name] || activePreset.name)}
              </span>
            </h5>
            <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
              {mode === 'schrodinger'
                ? customInfo.desc
                : (t[activePreset.description] || activePreset.description)}
            </p>

            <div className="bg-slate-950/40 border border-slate-850 p-2.5 rounded-xl flex justify-between items-center text-[10px] font-bold">
              <span className="text-slate-500 uppercase">{t["Bond Geometry"] || "Geometry"}</span>
              <span className="text-cyan-400 font-black">
                {mode === 'schrodinger'
                  ? customInfo.geometry
                  : (t[activePreset.geometry] || activePreset.geometry)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

