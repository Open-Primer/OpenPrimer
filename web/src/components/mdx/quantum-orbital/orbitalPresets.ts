import React from 'react';

export interface Lobe {
  shape: 'sphere' | 'doughnut' | 'plane';
  center: [number, number, number];
  radii: [number, number, number];
  phase: 1 | -1;
  opacity?: number;
  rotation?: [number, number, number];
}

export interface OrbitalPreset {
  id: string;
  name?: string;
  description?: string;
  geometry?: string;
  isHybrid?: boolean;
  n?: number;
  l?: number;
  m?: number;
  labelKey?: string;
  lobes: Lobe[];
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Face {
  indices: number[];
  phase: 1 | -1;
  normal: Point3D;
  center: Point3D;
}

export interface Mesh {
  vertices: Point3D[];
  faces: Face[];
}

export const ORBITALS: OrbitalPreset[] = [
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
;
