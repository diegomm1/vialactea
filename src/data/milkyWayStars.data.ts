import type { MilkyWayStar } from '../types/astronomy.types';

export const milkyWayStars: MilkyWayStar[] = [
  {
    id: 'stephenson-2-18',
    name: 'STEPHENSON 2-18',
    side: 'right',
    overviewYPercent: 18,
    galaxyCoords: { x: 2.1, y: 0.08, z: 1.4 },
    color: '#ff4d2a',
    radiusSolar: '~2,150 R☉',
    distanceLy: '18,900 años luz',
    spectralType: 'Hipergigante Roja (M6)',
    description: 'La estrella más grande conocida en la Vía Láctea. Ubicada en el cúmulo abierto Stephenson 2 en la constelación de Scutum, su volumen es 10,000 millones de veces superior al del Sol; si estuviera en el centro de nuestro Sistema Solar, su fotosfera engulliría la órbita de Saturno.'
  },
  {
    id: 'uy-scuti',
    name: 'UY SCUTI',
    side: 'left',
    overviewYPercent: 26,
    galaxyCoords: { x: -2.4, y: -0.06, z: 1.1 },
    color: '#ff6b35',
    radiusSolar: '~1,708 R☉',
    distanceLy: '5,219 años luz',
    spectralType: 'Supergigante Roja (M4Ia)',
    description: 'Colosal supergigante roja pulsante situada en la constelación del Escudo. Es una estrella variable semirregular cuyo brillo oscila cada 740 días mientras expulsa enormes cantidades de gas y polvo estelar hacia el medio interestelar.'
  },
  {
    id: 'vy-canis-majoris',
    name: 'VY CANIS MAJORIS',
    side: 'right',
    overviewYPercent: 50,
    galaxyCoords: { x: 1.6, y: 0.12, z: -2.3 },
    color: '#ff3b1f',
    radiusSolar: '~1,420 R☉',
    distanceLy: '3,820 años luz',
    spectralType: 'Hipergigante Roja (M3-M4.5)',
    description: 'Una de las hipergigantes rojas más luminosas y masivas conocidas. Rodeada por una densa nebulosa asimétrica formada por sus propias eyecciones violentas de materia, se encuentra en la fase final de su vida antes de estallar como hipernova.'
  },
  {
    id: 'nml-cygni',
    name: 'NML CYGNI',
    side: 'left',
    overviewYPercent: 74,
    galaxyCoords: { x: -1.8, y: 0.09, z: -2.1 },
    color: '#ff7b47',
    radiusSolar: '~1,640 R☉',
    distanceLy: '5,300 años luz',
    spectralType: 'Hipergigante Roja (M6III)',
    description: 'Gigantesca estrella extrema en la constelación del Cisne asociada a la región de formación estelar Cygnus OB2. Está envuelta en una gruesa capa de polvo circumestelar rica en vapor de agua y máseres de OH que distorsionan su luz visible.'
  },
  {
    id: 'westerlund-1-26',
    name: 'WESTERLUND 1-26',
    side: 'right',
    overviewYPercent: 82,
    galaxyCoords: { x: 2.8, y: -0.09, z: -0.5 },
    color: '#ff5722',
    radiusSolar: '~1,530 R☉',
    distanceLy: '11,500 años luz',
    spectralType: 'Hipergigante Roja (M2-M5Ia)',
    description: 'Residente del supercúmulo estelar masivo Westerlund 1 en la constelación de Ara. Es famosa por ser una intensa fuente de ondas de radio y por estar rodeada de una nebulosa ionizada que brilla debido a la radiación de las estrellas azules vecinas.'
  }
];
