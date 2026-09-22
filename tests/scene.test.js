import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access, stat } from 'node:fs/promises';
import { sceneContent } from '../data/scene.js';

const root = new URL('../', import.meta.url);
test('los modelos y sus texturas externas se pueden publicar sin rutas absolutas', async () => {
  let bytes = 0;
  for (const path of Object.values(sceneContent.models)) {
    assert.ok(path.startsWith('assets/models/') && !path.includes('..'));
    const url = new URL(path, root);
    const file = await readFile(url);
    bytes += file.length;
    assert.equal(file.toString('utf8', 0, 4), 'glTF');
    assert.equal(file.readUInt32LE(4), 2);
    assert.equal(file.readUInt32LE(8), file.length);
    const json = JSON.parse(file.toString('utf8', 20, 20 + file.readUInt32LE(12)));
    for (const dependency of [...(json.images || []), ...(json.buffers || [])]) {
      if (!dependency.uri || dependency.uri.startsWith('data:')) continue;
      assert.ok(!dependency.uri.includes('://') && !dependency.uri.startsWith('/'));
      await access(new URL(dependency.uri, url));
    }
  }
  assert.ok(bytes < 500_000, `Modelos: ${bytes} bytes; revisar antes de superar 500 KB`);
});

test('las cámaras tienen posiciones utilizables y contenido independiente del WebGL', () => {
  assert.ok(sceneContent.stops.length >= 2);
  for (const stop of sceneContent.stops) {
    assert.ok(stop.label && stop.title && stop.body);
    assert.equal(stop.camera.length, 3);
    assert.equal(stop.target.length, 3);
    assert.ok([...stop.camera, ...stop.target, stop.span].every(Number.isFinite));
    assert.ok(stop.span > 0);
    assert.notDeepEqual(stop.camera, stop.target);
  }
});

test('las dependencias locales de Three.js y sus licencias están completas', async () => {
  const files = ['vendor/three/build/three.module.js', 'vendor/three/build/three.core.js', 'vendor/three/addons/loaders/GLTFLoader.js', 'vendor/three/addons/utils/BufferGeometryUtils.js', 'vendor/three/addons/utils/SkeletonUtils.js'];
  for (const file of files) {
    const source = await readFile(new URL(file, root), 'utf8');
    for (const [, dependency] of source.matchAll(/from\s*['"]([^'"]+)['"]/g)) {
      if (dependency === 'three' || !dependency.startsWith('.')) continue;
      await access(new URL(dependency, new URL(file, root)));
    }
  }
  for (const path of ['vendor/three/LICENSE', 'vendor/gsap/NOTICE.md', 'assets/licenses/kenney-city.txt', 'assets/licenses/kenney-nature.txt']) assert.ok((await stat(new URL(path, root))).size > 0);
});
