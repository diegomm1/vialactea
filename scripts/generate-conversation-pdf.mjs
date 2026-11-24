import PDFDocument from 'pdfkit';
import { createWriteStream, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const outputPath = resolve(root, 'Documentacion_Conversacion_ViaLactea3D.pdf');
const firstPromptPath = String.raw`C:\Users\diego\AppData\Roaming\Code\agentSessionData\da877f94-d1b5-4f06-b48e-553d7bd2f88f\attachments\215f0267-e340-4125-ac39-b1881dba5c15\Pasted text #1.txt`;
const secondPromptPath = String.raw`C:\Users\diego\AppData\Roaming\Code\agentSessionData\da877f94-d1b5-4f06-b48e-553d7bd2f88f\attachments\0544c2f4-ee8b-438a-8530-aa31b6be2213\Pasted text #1.txt`;

const firstPrompt = readFileSync(firstPromptPath, 'utf8');
const secondPrompt = readFileSync(secondPromptPath, 'utf8');
const portableHtmlPath = resolve(root, 'PORTABLE_USB_VIA_LACTEA', 'ViaLactea3D.html');
const instructionsPath = resolve(root, 'PORTABLE_USB_VIA_LACTEA', 'INSTRUCCIONES_USB.txt');

const regularFont = String.raw`C:\Windows\Fonts\segoeui.ttf`;
const boldFont = String.raw`C:\Windows\Fonts\segoeuib.ttf`;
const italicFont = String.raw`C:\Windows\Fonts\segoeuii.ttf`;
const monoFont = String.raw`C:\Windows\Fonts\consola.ttf`;

const document = new PDFDocument({
  size: 'A4',
  margins: { top: 54, bottom: 54, left: 48, right: 48 },
  info: {
    Title: 'Documentación completa de la conversación - Vía Láctea 3D',
    Author: 'Copilot SDK',
    Subject: 'Prompts, decisiones, implementación y validaciones'
  }
});

const stream = createWriteStream(outputPath);
document.pipe(stream);

document.registerFont('Regular', regularFont);
document.registerFont('Bold', boldFont);
document.registerFont('Italic', italicFont);
document.registerFont('Mono', monoFont);

let sectionNumber = 0;
function heading(title, level = 1) {
  sectionNumber += level === 1 ? 1 : 0;
  const sizes = { 1: 20, 2: 15, 3: 12 };
  document.addPage().font('Bold').fillColor('#172033').fontSize(sizes[level]).text(
    level === 1 ? `${sectionNumber}. ${title}` : title,
    { paragraphGap: 10 }
  );
  document.moveDown(0.2);
}

function paragraph(text, options = {}) {
  document.font('Regular').fillColor(options.color ?? '#20293A').fontSize(options.size ?? 10).text(text, {
    align: options.align ?? 'left',
    lineGap: 2,
    paragraphGap: 7
  });
}

function smallHeading(title) {
  document.moveDown(0.4);
  document.font('Bold').fillColor('#7C3AED').fontSize(12).text(title, { paragraphGap: 5 });
}

function label(labelText) {
  document.moveDown(0.25);
  document.font('Bold').fillColor('#334155').fontSize(9).text(labelText.toUpperCase());
}

function promptBlock(text) {
  document.moveDown(0.25);
  document.fillColor('#111827').font('Mono').fontSize(7.6);
  document.text(text, {
    lineGap: 2,
    paragraphGap: 8,
    width: 498
  });
  document.moveDown(0.5);
}

function bullet(text) {
  document.font('Regular').fillColor('#20293A').fontSize(10).text(`• ${text}`, {
    indent: 10,
    paragraphGap: 4,
    lineGap: 1
  });
}

function fileExists(path) {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

// Cover
document.rect(0, 0, document.page.width, document.page.height).fill('#F7F8FC');
document.fillColor('#111827');
document.font('Bold').fontSize(28).text('DOCUMENTACIÓN COMPLETA', 48, 120, {
  width: 498,
  align: 'center'
});
document.moveDown();
document.fillColor('#7C3AED').fontSize(22).text('Vía Láctea — Los 5 Gigantes Estelares', {
  width: 498,
  align: 'center'
});
document.moveDown(1.2);
document.font('Regular').fillColor('#475569').fontSize(12).text(
  'Registro integral de conversaciones, prompts, decisiones, implementación, optimizaciones, validaciones y entregables',
  { width: 498, align: 'center', lineGap: 4 }
);
document.moveDown(3);
document.font('Bold').fillColor('#334155').fontSize(11).text('Proyecto', { align: 'center' });
document.font('Regular').fontSize(10).text('C:\\Users\\diego\\Documents\\GitHub\\vialactea3d', {
  width: 498,
  align: 'center'
});
document.moveDown(1);
document.font('Italic').fillColor('#64748B').fontSize(9).text('Generado el 24 de noviembre de 2026', {
  width: 498,
  align: 'center'
});

// Table of contents
heading('Contenido');
[
  'Contexto y alcance',
  'Inventario completo de prompts',
  'Prompt original: arquitectura y desarrollo Web 3D',
  'Respuesta pública inicial y creación del proyecto',
  'Cómo abrir y ejecutar la aplicación',
  'Captura de la terminal y corrección de npm',
  'Prompt de optimización, portabilidad y GPU',
  'Implementación de mejoras y validaciones',
  'Estado final del proyecto',
  'Archivos y módulos creados',
  'Comandos de uso',
  'Entregable portable',
  'Notas finales'
].forEach((title) => paragraph(title, { size: 11 }));

heading('Contexto y alcance');
paragraph('Este documento conserva la conversación relativa a la creación de una experiencia web 3D interactiva llamada "VÍA LÁCTEA — LOS 5 GIGANTES ESTELARES". Incluye los prompts adjuntos completos, los resultados públicos de la implementación y el estado verificable de los archivos y compilaciones.');
paragraph('La transcripción prioriza los mensajes visibles del usuario y las respuestas públicas relevantes. No incluye razonamientos internos ni contenido técnico oculto del asistente.');

heading('Inventario completo de prompts');
smallHeading('1. Prompt inicial');
paragraph('Solicitó construir desde cero una aplicación completa con Vite, TypeScript, Three.js, GSAP, Lenis, Tailwind, cinco estrellas y coreografía completa de scroll.');
smallHeading('2. Consulta para ver la aplicación');
paragraph('Mensaje exacto:');
promptBlock('y como veo lo hecho?');
smallHeading('3. Evidencia adjunta de la terminal');
paragraph('El usuario adjuntó una captura de pantalla donde PowerShell indicaba que npm.ps1 no podía ejecutarse por la política de ejecución y proponía consultar about_Execution_Policies.');
smallHeading('4. Prompt de optimización y USB');
paragraph('Solicitó mejoras GPU/CPU, ajuste de brillo, menor sensibilidad, mayor recorrido de scroll y generación de un paquete portable único sin Node.js ni servidor.');
smallHeading('5. Prompt actual');
paragraph('Solicitó crear este documento PDF con toda la información de la conversación.');
promptBlock('crea un archivo de documentación con toda la informacion de la conversación. Incluye cada prompt que te he dado y todo. Quiero que el documento sea pdf');

heading('Prompt original: arquitectura y desarrollo Web 3D');
promptBlock(firstPrompt);

heading('Respuesta pública inicial y creación del proyecto');
paragraph('Se creó la experiencia completa en la raíz del proyecto con los módulos solicitados: escena Three.js, galaxia procedural, proyección 3D a 2D, líneas SVG, tarjetas, HUD, scroll suave y coreografía por fases.');
smallHeading('Resultado comunicado');
bullet('Aplicación WebGL con 65.000 partículas estelares.');
bullet('Cinco estrellas interactivas y coreografía completa de scroll.');
bullet('Líneas dinámicas, tarjetas en español y controles HUD.');
bullet('Arrastre, hover, reconfiguración estelar y scroll suave.');
bullet('Compilación verificada con npm run build.');

heading('Cómo abrir y ejecutar la aplicación');
smallHeading('Comando recomendado');
promptBlock('$env:PATH=\'C:\\Program Files\\nodejs;\' + $env:PATH\nnpm run dev');
paragraph('Dirección indicada al usuario: http://127.0.0.1:5173');
smallHeading('Alternativa ante bloqueo de PowerShell');
paragraph('Se indicó utilizar npm.cmd run dev o abrir una terminal de tipo cmd y ejecutar npm run dev.');

heading('Captura de la terminal y corrección de npm');
paragraph('La captura mostraba que npm.ps1 estaba bloqueado por la política de ejecución de PowerShell. Se confirmó que npm.cmd era compatible y que el servidor Vite podía iniciarse con el ejecutable de Windows.');
smallHeading('Comando aplicado');
promptBlock('& \'C:\\Program Files\\nodejs\\npm.cmd\' run dev -- --host 127.0.0.1');
paragraph('El servidor llegó a responder HTTP 200 en http://127.0.0.1:5173.');

heading('Prompt de optimización, portabilidad y GPU');
promptBlock(secondPrompt);

heading('Implementación de mejoras y validaciones');
smallHeading('Requerimiento 1: aceleración GPU y CPU');
bullet('Se configuró un WebGLRenderer de alto rendimiento con antialias desactivado y pixel ratio limitado a 1.5.');
bullet('Se implementó la pausa de renderizado al ocultar la pestaña.');
bullet('Las posiciones base quedaron como atributos estáticos y la transformación pesada pasó a uniforms y shaders.');
bullet('La mutación del cúmulo pasó a una transición GSAP del uniform uStarSeed.');
bullet('Las líneas SVG y tarjetas empezaron a usar cachés de nodos y actualizaciones condicionadas.');

smallHeading('Requerimiento 2: núcleo galáctico');
bullet('Se redujo la exposición ACES a 0.82.');
bullet('El bloom quedó en strength 0.32, radius 0.35 y threshold 0.82.');
bullet('Se aplicó distribución radial no lineal con centro respirable.');
bullet('Se atenuaron tamaños y opacidad interna en el núcleo.');
bullet('Los fragmentos quedaron con núcleo definido y halo tenue.');

smallHeading('Requerimiento 3: sensibilidad');
bullet('dragSensitivity quedó fijada en 0.00085 radianes por píxel.');
bullet('damping quedó en 0.045 y velocidad máxima angular en 0.018.');
bullet('La inclinación vertical quedó limitada a los valores -0.85 y 0.85.');
bullet('Lenis quedó con wheelMultiplier 0.32, touchMultiplier 0.55 y lerp 0.055.');
bullet('El scroll pasó de 850vh a 2100vh.');

smallHeading('Requerimiento 4: paquete portable');
bullet('Se añadió vite-plugin-singlefile.');
bullet('Se creó vite.portable.config.ts con salida IIFE y inlineDynamicImports.');
bullet('Se creó scripts/build-portable.mjs.');
bullet('El HTML se renombró como ViaLactea3D.html.');
bullet('Se eliminaron atributos type="module" y crossorigin.');
bullet('Se generó INSTRUCCIONES_USB.txt en español.');

heading('Estado final del proyecto');
smallHeading('Compilaciones');
bullet('npm install: completado.');
bullet('npm run build: completado y sin errores de TypeScript.');
bullet('npm run build:portable: completado y sin errores de TypeScript ni Vite.');
bullet('El servidor de desarrollo se comprobó con respuesta HTTP 200.');

smallHeading('Verificación portable');
bullet('El HTML contiene el JavaScript y el CSS embebidos.');
bullet('No quedan atributos type="module" ni crossorigin.');
bullet('El servidor estándar quedó configurado para ignorar la carpeta portable al vigilar cambios.');

heading('Archivos y módulos creados');
const projectFiles = [
  ['Configuración', 'package.json', 'tsconfig.json', 'vite.config.ts', 'vite.portable.config.ts', 'tailwind.config.js', 'postcss.config.js'],
  ['Entrada', 'index.html', 'src/main.ts', 'public/favicon.svg'],
  ['Datos', 'src/types/astronomy.types.ts', 'src/data/milkyWayStars.data.ts'],
  ['Shaders', 'galaxyVertex.glsl.ts', 'galaxyFragment.glsl.ts', 'beaconVertex.glsl.ts', 'beaconFragment.glsl.ts'],
  ['Core', 'SceneManager.ts', 'CameraController.ts', 'PostProcessing.ts'],
  ['Escena', 'MilkyWayGalaxy.ts', 'StarBeacons.ts', 'BackgroundStarfield.ts'],
  ['Interacción', 'MouseDragController.ts'],
  ['Scroll', 'SmoothScroll.ts', 'ScrollChoreographer.ts'],
  ['Interfaz', 'LeaderLineOverlay.ts', 'StarCardManager.ts', 'HudControls.ts'],
  ['Utilidades', 'math3DTo2D.ts'],
  ['Portable', 'scripts/build-portable.mjs', 'PORTABLE_USB_VIA_LACTEA/ViaLactea3D.html', 'PORTABLE_USB_VIA_LACTEA/INSTRUCCIONES_USB.txt']
];
projectFiles.forEach(([category, ...files]) => {
  smallHeading(category);
  files.forEach((file) => bullet(file));
});

heading('Comandos de uso');
smallHeading('Modo estándar');
promptBlock('npm.cmd run dev\nnpm.cmd run build');
smallHeading('Modo portable');
promptBlock('npm.cmd run build:portable');
smallHeading('Abrir el sitio');
paragraph('Desarrollo: http://127.0.0.1:5173');
paragraph('Portable: abrir PORTABLE_USB_VIA_LACTEA/ViaLactea3D.html con doble clic.');

heading('Entregable portable');
paragraph(`Archivo principal: ${portableHtmlPath}`, { size: 9 });
paragraph(`Instrucciones: ${instructionsPath}`, { size: 9 });
paragraph(`El archivo portable existe: ${fileExists(portableHtmlPath) ? 'Sí' : 'No'}.`);
if (fileExists(portableHtmlPath)) {
  paragraph(`Tamaño aproximado del bundle: ${(statSync(portableHtmlPath).size / 1024).toFixed(1)} KiB.`, { size: 9 });
}

heading('Datos astronómicos registrados');
const stars = [
  ['Stephenson 2-18', '~2.150 R☉', '18.900 años luz', 'Hipergigante Roja M6'],
  ['UY Scuti', '~1.708 R☉', '5.219 años luz', 'Supergigante Roja M4Ia'],
  ['VY Canis Majoris', '~1.420 R☉', '3.820 años luz', 'Hipergigante Roja M3-M4.5'],
  ['NML Cygni', '~1.640 R☉', '5.300 años luz', 'Hipergigante Roja M6III'],
  ['Westerlund 1-26', '~1.530 R☉', '11.500 años luz', 'Hipergigante Roja M2-M5Ia']
];
stars.forEach(([name, radius, distance, type]) => {
  smallHeading(name);
  bullet(`Radio solar: ${radius}`);
  bullet(`Distancia: ${distance}`);
  bullet(`Tipo espectral: ${type}`);
});

heading('Notas finales');
paragraph('Este PDF registra los requisitos expresamente solicitados y las implementaciones verificadas hasta el momento de su generación.');
paragraph('Cualquier cambio posterior realizado en el proyecto no quedará reflejado en este documento salvo que se vuelva a generar.');

// Footers
const pageRange = document.bufferedPageRange();
for (let page = 0; page < pageRange.count; page += 1) {
  document.switchToPage(page);
  document.font('Regular').fillColor('#94A3B8').fontSize(8);
  document.text(
    `Vía Láctea 3D — Documentación completa · ${page + 1}/${pageRange.count}`,
    48,
    document.page.height - 32,
    { align: 'center', width: 498 }
  );
}

document.end();

stream.on('finish', () => {
  console.log(outputPath);
});
