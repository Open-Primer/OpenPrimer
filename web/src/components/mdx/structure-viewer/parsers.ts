import type { Atom, Bond } from './presets';

const ELEMENT_PROPS: Record<string, { color: string; radius: number }> = {
  'H': { color: '#f8fafc', radius: 10 },
  'C': { color: '#475569', radius: 15 },
  'O': { color: '#ef4444', radius: 18 },
  'N': { color: '#3b82f6', radius: 15 },
  'CL': { color: '#84cc16', radius: 19 },
  'NA': { color: '#10b981', radius: 10 },
  'S': { color: '#eab308', radius: 17 },
  'P': { color: '#f97316', radius: 17 },
  'F': { color: '#06b6d4', radius: 12 },
  'BR': { color: '#9a3412', radius: 19 },
  'I': { color: '#6b21a8', radius: 21 },
  'K': { color: '#8b5cf6', radius: 18 },
  'CA': { color: '#64748b', radius: 20 },
  'FE': { color: '#b45309', radius: 20 },
  'MG': { color: '#047857', radius: 17 }
};

export const decodeBase64 = (str: string): any => {
  try {
    if (typeof window !== 'undefined') {
      return JSON.parse(decodeURIComponent(window.atob(str).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
    } else {
      return JSON.parse(Buffer.from(str, 'base64').toString('utf-8'));
    }
  } catch (e) {
    console.error("Failed to decode base64:", e);
    return null;
  }
};

export const centerCoordinates = (atoms: Atom[]): Atom[] => {
  if (atoms.length === 0) return atoms;
  
  let sumX = 0, sumY = 0, sumZ = 0;
  atoms.forEach(a => {
    sumX += a.x;
    sumY += a.y;
    sumZ += a.z;
  });
  const avgX = sumX / atoms.length;
  const avgY = sumY / atoms.length;
  const avgZ = sumZ / atoms.length;
  
  let maxDist = 0;
  const shifted = atoms.map(a => {
    const x = a.x - avgX;
    const y = a.y - avgY;
    const z = a.z - avgZ;
    const dist = Math.sqrt(x*x + y*y + z*z);
    if (dist > maxDist) maxDist = dist;
    return { ...a, x, y, z };
  });
  
  if (maxDist === 0) return shifted;
  const targetScale = 1.35;
  const scaleFactor = targetScale / maxDist;
  
  return shifted.map(a => ({
    ...a,
    x: a.x * scaleFactor,
    y: a.y * scaleFactor,
    z: a.z * scaleFactor
  }));
};

export const parseSDF = (sdfString: string): { atoms: Atom[]; bonds: Bond[] } | null => {
  try {
    const lines = sdfString.split('\n');
    if (lines.length < 4) return null;
    
    const countsLine = lines[3];
    const numAtoms = parseInt(countsLine.substring(0, 3).trim(), 10);
    const numBonds = parseInt(countsLine.substring(3, 6).trim(), 10);
    
    if (isNaN(numAtoms) || numAtoms <= 0) return null;
    
    const atoms: Atom[] = [];
    const bonds: Bond[] = [];
    
    for (let i = 0; i < numAtoms; i++) {
      const line = lines[4 + i];
      if (!line) continue;
      
      const x = parseFloat(line.substring(0, 10).trim());
      const y = parseFloat(line.substring(10, 20).trim());
      const z = parseFloat(line.substring(20, 30).trim());
      const label = line.substring(31, 34).trim();
      
      if (isNaN(x) || isNaN(y) || isNaN(z) || !label) continue;
      
      const lookupLabel = label.toUpperCase();
      const props = ELEMENT_PROPS[lookupLabel] || { color: '#a855f7', radius: 14 };
      
      atoms.push({
        x,
        y,
        z,
        color: props.color,
        radius: props.radius,
        label
      });
    }
    
    for (let i = 0; i < numBonds; i++) {
      const line = lines[4 + numAtoms + i];
      if (!line) continue;
      
      const atomAIdx = parseInt(line.substring(0, 3).trim(), 10) - 1;
      const atomBIdx = parseInt(line.substring(3, 6).trim(), 10) - 1;
      const bondType = parseInt(line.substring(6, 9).trim(), 10);
      
      if (isNaN(atomAIdx) || isNaN(atomBIdx) || atomAIdx < 0 || atomBIdx < 0) continue;
      
      bonds.push({
        atomA: atomAIdx,
        atomB: atomBIdx,
        isDouble: bondType === 2
      });
    }
    
    if (bonds.length === 0) {
      for (let i = 0; i < atoms.length; i++) {
        for (let j = i + 1; j < atoms.length; j++) {
          const a1 = atoms[i];
          const a2 = atoms[j];
          const dist = Math.sqrt(
            (a1.x - a2.x) ** 2 + 
            (a1.y - a2.y) ** 2 + 
            (a1.z - a2.z) ** 2
          );
          
          if (dist > 0.4 && dist < 1.95) {
            bonds.push({ atomA: i, atomB: j });
          }
        }
      }
    }
    
    return { atoms, bonds };
  } catch (e) {
    console.error("Failed to parse SDF format:", e);
    return null;
  }
};

export const parseXYZ = (xyzString: string): { atoms: Atom[]; bonds: Bond[] } | null => {
  try {
    const lines = xyzString.trim().split('\n').map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length < 3) return null;
    
    const atoms: Atom[] = [];
    const bonds: Bond[] = [];

    for (let i = 2; i < lines.length; i++) {
      const parts = lines[i].split(/\s+/);
      if (parts.length < 4) continue;
      
      const label = parts[0];
      const x = parseFloat(parts[1]);
      const y = parseFloat(parts[2]);
      const z = parseFloat(parts[3]);
      
      if (isNaN(x) || isNaN(y) || isNaN(z)) continue;
      
      const lookupLabel = label.toUpperCase();
      const props = ELEMENT_PROPS[lookupLabel] || { color: '#a855f7', radius: 14 };
      
      atoms.push({
        x,
        y,
        z,
        color: props.color,
        radius: props.radius,
        label
      });
    }

    for (let i = 0; i < atoms.length; i++) {
      for (let j = i + 1; j < atoms.length; j++) {
        const a1 = atoms[i];
        const a2 = atoms[j];
        const dist = Math.sqrt(
          (a1.x - a2.x) ** 2 + 
          (a1.y - a2.y) ** 2 + 
          (a1.z - a2.z) ** 2
        );
        
        if (dist > 0.4 && dist < 1.95) {
          bonds.push({ atomA: i, atomB: j });
        }
      }
    }
    
    return { atoms, bonds };
  } catch (e) {
    console.error("Failed to parse XYZ format:", e);
    return null;
  }
};

export const darkenColor = (hex: string, percent: number) => {
  const num = parseInt(hex.replace("#",""), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) - amt,
        G = (num >> 8 & 0x00FF) - amt,
        B = (num & 0x0000FF) - amt;
  return "#" + (0x1000000 + (R<0?0:R>255?255:R)*0x10000 + (G<0?0:G>255?255:G)*0x100 + (B<0?0:B>255?255:B)).toString(16).slice(1);
};
