import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { setTimeout } from 'node:timers/promises';

const root = fileURLToPath(new URL('../', import.meta.url));
const url = 'http://127.0.0.1:4173/asd-presentacion/';

async function ready() {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(1000) });
    return response.ok && (await response.text()).includes('id="play-all"');
  } catch {
    return false;
  }
}

try {
  if (!(await ready())) {
    const server = spawn(process.execPath, ['scripts/serve.mjs'], {
      cwd: root,
      detached: true,
      windowsHide: true,
      stdio: 'ignore',
      env: { ...process.env, PORT: '4173' },
    });
    await new Promise((resolve, reject) => {
      server.once('spawn', resolve);
      server.once('error', reject);
    });
    server.unref();
    for (let attempt = 0; attempt < 30 && !(await ready()); attempt++)
      await setTimeout(200);
    if (!(await ready()))
      throw new Error('No se pudo iniciar el servidor en el puerto 4173.');
  }
  console.log(`Presentación lista: ${url}`);
  if (!process.argv.includes('--no-open')) {
    const browser = spawn('explorer.exe', [url], {
      windowsHide: true,
      stdio: 'ignore',
    });
    browser.on('error', () =>
      console.log(`Abre esta dirección en tu navegador: ${url}`),
    );
    browser.unref();
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
