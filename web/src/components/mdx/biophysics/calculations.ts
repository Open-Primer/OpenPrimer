export interface IonConcentrations {
  temp: number; // Celsius
  kOut: number;
  kIn: number;
  currentPK: number;
  naOut: number;
  naIn: number;
  currentPNa: number;
  clOut: number;
  clIn: number;
  pCl: number;
}

export interface BiophysicsResults {
  eK: number;
  eNa: number;
  eCl: number;
  vGhk: number;
}

export const computeBiophysics = (params: IonConcentrations): BiophysicsResults => {
  const { temp, kOut, kIn, currentPK, naOut, naIn, currentPNa, clOut, clIn, pCl } = params;
  const R = 8.314462618; // Gas constant (J / (mol K))
  const F = 96485.33212; // Faraday constant (C / mol)
  const T_kelvin = temp + 273.15;

  const nernstFactor = (R * T_kelvin / F) * Math.LN10 * 1000;

  const eK = nernstFactor * Math.log10(kOut / kIn);
  const eNa = nernstFactor * Math.log10(naOut / naIn);
  const eCl = -nernstFactor * Math.log10(clOut / clIn); // Cl- has charge -1

  const num = (currentPK * kOut) + (currentPNa * naOut) + (pCl * clIn);
  const den = (currentPK * kIn) + (currentPNa * naIn) + (pCl * clOut);
  const vGhk = nernstFactor * Math.log10(num / den);

  return { eK, eNa, eCl, vGhk };
};
