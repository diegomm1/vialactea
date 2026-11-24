export type StarSide = 'left' | 'right';

export interface GalaxyCoordinates {
  x: number;
  y: number;
  z: number;
}

export interface MilkyWayStar {
  id: string;
  name: string;
  side: StarSide;
  overviewYPercent: number;
  galaxyCoords: GalaxyCoordinates;
  color: string;
  radiusSolar: string;
  distanceLy: string;
  spectralType: string;
  description: string;
}
