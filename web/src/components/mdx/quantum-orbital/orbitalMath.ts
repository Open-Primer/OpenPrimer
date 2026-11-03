import { Point3D, Face, Mesh, ORBITALS } from './orbitalPresets';

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
export const generateMeshForPreset = (presetId: string): Mesh[] => {
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
export const generateCustomMesh = (n: number, l: number, m: number): Mesh[] => {
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


