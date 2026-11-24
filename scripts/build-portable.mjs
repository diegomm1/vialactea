import { rm, rename, readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const targetDirectory = resolve(root, 'PORTABLE_USB_VIA_LACTEA');
const viteCli = resolve(root, 'node_modules', 'vite', 'bin', 'vite.js');

await rm(targetDirectory, { recursive: true, force: true });

const build = spawnSync(process.execPath, [viteCli, 'build', '--config', 'vite.portable.config.ts'], {
  cwd: root,
  stdio: 'inherit'
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

const indexPath = resolve(targetDirectory, 'index.html');
const portablePath = resolve(targetDirectory, 'ViaLactea3D.html');

let html = await readFile(indexPath, 'utf8');
html = html
  .replace(/\s+type=["']module["']/gi, '')
  .replace(/\s+crossorigin(?:=["'][^"']*["'])?/gi, '');
await writeFile(indexPath, html, 'utf8');
await rename(indexPath, portablePath);

let cleanedHtml = await readFile(portablePath, 'utf8');
cleanedHtml = cleanedHtml
  .replace(/\s+type=["']module["']/gi, '')
  .replace(/\s+crossorigin(?:=["'][^"']*["'])?/gi, '');
await writeFile(portablePath, cleanedHtml, 'utf8');

await writeFile(
  resolve(targetDirectory, 'INSTRUCCIONES_USB.txt'),
  [
    'VÍA LÁCTEA - LOS 5 GIGANTES ESTELARES',
    '',
    'Copia toda esta carpeta PORTABLE_USB_VIA_LACTEA en tu pendrive USB.',
    'Haz doble clic en el archivo ViaLactea3D.html.',
    '',
    'No necesitas instalar Node.js, npm, Python, Vite ni ningún otro programa.',
    'No necesitas conexión a Internet.',
    'Compatible con Google Chrome, Microsoft Edge, Mozilla Firefox y navegadores modernos.',
    '',
    'Si el navegador solicita permiso para abrir el archivo local, acepta abrirlo desde el equipo.'
  ].join('\n'),
  'utf8'
);

console.log(`Bundle portable creado: ${portablePath}`);
