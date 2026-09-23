import * as THREE from 'three';

/** Escenografía propia, creada con geometrías ligeras y los modelos CC0 existentes. */
export function buildWorld(type, models, count = 4, audience = 0) {
  const root = new THREE.Group();
  const stations = [];
  const material = (color, extra = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness: 0.58, ...extra });
  const m = {
    dark: material('#183c2c'),
    stone: material('#b7c8b9'),
    paper: material('#f0f3df'),
    green: material('#1a7a2e'),
    glass: material('#508b82', { metalness: 0.4, roughness: 0.25 }),
    metal: material('#718d7d', { metalness: 0.7, roughness: 0.25 }),
    ink: material('#253f35'),
    glow: material('#2ad660', { emissive: '#2ad660', emissiveIntensity: 0.38 }),
  };
  const mesh = (geometry, mat, parent = root, position = [0, 0, 0]) => {
    const node = new THREE.Mesh(geometry, mat);
    node.position.set(...position);
    node.castShadow = true;
    node.receiveShadow = true;
    parent.add(node);
    return node;
  };
  const box = (parent, w, h, d, mat, x = 0, y = 0, z = 0) =>
    mesh(new THREE.BoxGeometry(w, h, d), mat, parent, [x, y, z]);
  const cylinder = (parent, r, h, mat, x = 0, y = 0, z = 0) =>
    mesh(new THREE.CylinderGeometry(r, r, h, 40), mat, parent, [x, y, z]);
  const ring = (parent, r, mat, x = 0, y = 0, z = 0) => {
    const n = mesh(new THREE.TorusGeometry(r, 0.035, 8, 64), mat, parent, [
      x,
      y,
      z,
    ]);
    n.rotation.x = -Math.PI / 2;
    return n;
  };
  const group = (parent = root, x = 0, y = 0, z = 0) => {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    parent.add(g);
    return g;
  };
  const line = (parent, points, mat = m.glow, r = 0.025) =>
    mesh(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))),
        40,
        r,
        6,
        false,
      ),
      mat,
      parent,
    );
  function model(source, parent, height, x, y, z) {
    const node = source.clone(true);
    const bounds = new THREE.Box3().setFromObject(node);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const scale = height / size.y;
    node.scale.setScalar(scale);
    node.position.set(
      x - center.x * scale,
      y - bounds.min.y * scale,
      z - center.z * scale,
    );
    node.traverse((n) => {
      if (n.isMesh) {
        n.castShadow = true;
        n.receiveShadow = true;
      }
    });
    parent.add(node);
    return node;
  }
  function document(parent, x = 0, y = 0, z = 0) {
    const g = group(parent, x, y, z);
    box(g, 1.2, 1.65, 0.12, m.paper, 0, 0.85, 0);
    for (let i = 0; i < 5; i++)
      for (const side of [-1, 1])
        box(
          g,
          i === 0 ? 0.75 : 0.9,
          0.045,
          0.025,
          i === 0 ? m.green : m.metal,
          -0.03,
          1.4 - i * 0.2,
          side * 0.075,
        );
    cylinder(g, 0.15, 0.06, m.glow, 0.32, 0.35, 0.11).rotation.x = Math.PI / 2;
    return g;
  }
  function book(parent, x = 0, y = 0, z = 0) {
    const g = group(parent, x, y, z);
    for (const sign of [-1, 1]) {
      const wing = group(g, sign * 0.54, 0.25, 0);
      wing.rotation.z = -sign * 0.17;
      box(wing, 1.1, 0.12, 1.65, m.green, 0, 0, 0);
      box(wing, 1.02, 0.14, 1.55, m.paper, 0, 0.11, 0);
      for (let j = 0; j < 5; j++)
        box(wing, 0.72, 0.01, 0.035, m.metal, 0, 0.19, -0.5 + j * 0.23);
    }
    box(g, 0.08, 0.3, 1.7, m.glow, 0, 0.18, 0);
    return g;
  }
  function laptop(parent, x = 0, y = 0, z = 0) {
    const g = group(parent, x, y, z);
    box(g, 1.9, 0.12, 1.25, m.metal, 0, 0.08, 0.18);
    const screen = group(g, 0, 0.1, -0.35);
    screen.rotation.x = -0.14;
    box(screen, 1.85, 1.2, 0.1, m.dark, 0, 0.6, 0);
    box(screen, 1.65, 0.99, 0.025, m.glass, 0, 0.61, 0.065);
    for (let i = 0; i < 3; i++)
      box(
        screen,
        1.1 - i * 0.2,
        0.055,
        0.02,
        m.glow,
        -0.12,
        0.88 - i * 0.22,
        0.09,
      );
    for (let i = 0; i < 4; i++)
      box(g, 1.4, 0.02, 0.08, m.ink, 0, 0.155, 0.05 + i * 0.16);
    return g;
  }
  function people(parent) {
    for (let i = 0; i < 3; i++) {
      const x = (i - 1) * 0.65;
      const h = i === 1 ? 1.25 : 1;
      mesh(
        new THREE.SphereGeometry(0.23, 16, 12),
        i === 1 ? m.paper : m.stone,
        parent,
        [x, h + 0.18, 0],
      );
      mesh(
        new THREE.CylinderGeometry(0.18, 0.32, h * 0.65, 16),
        i === 1 ? m.green : m.glass,
        parent,
        [x, h * 0.52, 0],
      );
    }
  }
  function clock(parent) {
    const g = group(parent, 0, 0.95, 0);
    const face = cylinder(g, 0.8, 0.14, m.paper);
    face.rotation.x = Math.PI / 2;
    const border = mesh(
      new THREE.TorusGeometry(0.82, 0.065, 8, 48),
      m.metal,
      g,
    );
    box(g, 0.055, 0.48, 0.055, m.green, 0, 0.22, 0.11);
    const hand = box(g, 0.4, 0.055, 0.055, m.ink, 0.18, 0, 0.11);
    hand.rotation.z = -0.2;
  }
  function shield(parent) {
    const shape = new THREE.Shape();
    shape.moveTo(-0.7, 1.55);
    shape.lineTo(0.7, 1.55);
    shape.lineTo(0.63, 0.65);
    shape.quadraticCurveTo(0.4, 0.2, 0, 0);
    shape.quadraticCurveTo(-0.4, 0.2, -0.63, 0.65);
    shape.closePath();
    mesh(
      new THREE.ExtrudeGeometry(shape, {
        depth: 0.15,
        bevelEnabled: true,
        bevelThickness: 0.04,
        bevelSize: 0.04,
        bevelSegments: 2,
        steps: 1,
      }),
      m.green,
      parent,
    );
    const a = box(parent, 0.12, 0.4, 0.08, m.paper, -0.2, 0.73, 0.22);
    a.rotation.z = 0.75;
    const b = box(parent, 0.12, 0.8, 0.08, m.paper, 0.14, 0.88, 0.22);
    b.rotation.z = -0.65;
  }
  function compass(parent) {
    cylinder(parent, 0.82, 0.13, m.metal, 0, 0.24, 0);
    cylinder(parent, 0.74, 0.05, m.paper, 0, 0.33, 0);
    ring(parent, 0.64, m.green, 0, 0.38, 0);
    const needle = mesh(
      new THREE.ConeGeometry(0.19, 1, 3),
      m.green,
      parent,
      [0, 0.44, -0.16],
    );
    needle.rotation.x = -Math.PI / 2;
    mesh(new THREE.SphereGeometry(0.11, 12, 8), m.glow, parent, [0, 0.48, 0]);
  }
  function network(parent) {
    const points = [
      [-0.8, 0.3, 0],
      [0.7, 0.3, 0.5],
      [0, 1.5, 0],
      [0.8, 0.3, -0.6],
    ];
    points.forEach((p) =>
      mesh(new THREE.SphereGeometry(0.2, 16, 12), m.glow, parent, p),
    );
    for (let i = 0; i < points.length; i++)
      for (let j = i + 1; j < points.length; j++)
        line(parent, [points[i], points[j]], m.metal, 0.035);
  }
  function station(x, y, z, r = 1.45) {
    const g = group(root, x, y, z);
    cylinder(g, r, 0.24, m.dark, 0, -0.16, 0);
    cylinder(g, r - 0.07, 0.08, m.stone, 0, 0, 0);
    const halo = ring(g, r - 0.03, m.glow, 0, 0.08, 0);
    const body = group(g, 0, 0.13, 0);
    stations.push({ body, halo, base: 0.13 });
    return body;
  }
  function campus(parent, x = 0, y = 0.1, z = 0, height = 2.7) {
    model(models.campus, parent, height, x, y, z);
    box(parent, 2.4, 0.18, 0.75, m.paper, x, y + 1.4, z + 1.4);
    for (const dx of [-0.9, -0.3, 0.3, 0.9])
      mesh(new THREE.CylinderGeometry(0.065, 0.09, 1.25, 10), m.paper, parent, [
        x + dx,
        y + 0.67,
        z + 1.65,
      ]);
  }
  const paletteIcons = [people, clock, book, network];
  if (type === 'hero') {
    for (const x of [-3.8, 3.8]) {
      box(root, 5.9, 0.55, 6, m.dark, x, -0.4, 0);
      box(root, 5.7, 0.16, 5.8, m.stone, x, -0.045, 0);
      box(root, 5.3, 0.06, 5.4, m.green, x, 0.06, 0);
      box(root, 4.3, 0.09, 3.3, m.paper, x, 0.11, -0.45);
      box(root, 0.9, 0.05, 2.6, m.paper, x, 0.15, 1.35);
    }
    box(root, 3.3, 0.18, 1.4, m.paper, 0, 0.03, 1.1);
    for (const z of [0.48, 1.72])
      box(root, 3.4, 0.04, 0.045, m.glow, 0, 0.14, z);
    campus(root, -3.8, 0.17, -0.55);
    model(models.firm, root, 4.65, 3.8, 0.17, -0.65);
    [
      [-6, -1.9],
      [-5.9, 1.9],
      [-1.8, -2],
      [1.6, -1.9],
      [5.9, 1.9],
      [6, -1.7],
    ].forEach(([x, z]) => model(models.palm, root, 1.65, x, 0.15, z));
    line(root, [
      [-3.8, 0.25, 0.3],
      [-3.8, 0.25, 1.1],
      [0, 0.25, 1.1],
      [3.8, 0.25, 1.1],
      [3.8, 0.25, 0.3],
    ]);
  } else if (type === 'ecosystem') {
    const a = station(-4, 0, 0, 2.65),
      b = station(4, 0, 0, 2.65);
    campus(a, 0, 0, 0, 2.5);
    model(models.firm, b, 3.8, 0, 0, 0);
    const core = station(0, 0.3, 1.8, 1.3);
    network(core);
    line(root, [
      [-4, 0.2, 2],
      [0, 0.4, 3.5],
      [4, 0.2, 2],
    ]);
    line(root, [
      [4, 0.2, -2],
      [0, 0.4, -3.5],
      [-4, 0.2, -2],
    ]);
    for (const sign of [-1, 1]) {
      const arrow = mesh(new THREE.ConeGeometry(0.18, 0.55, 3), m.glow, root, [
        sign * 0.9,
        0.42,
        sign * 3.25,
      ]);
      arrow.rotation.z = (-sign * Math.PI) / 2;
    }
    model(models.palm, root, 1.7, -6, 0.1, -2);
    model(models.palm, root, 1.7, 6, 0.1, -2);
  } else if (type === 'benefits') {
    box(root, 10.5, 0.4, 7.7, m.metal, 0, -0.55, 0);
    box(root, 10.3, 0.08, 7.5, m.dark, 0, -0.29, 0);
    const icons =
      audience === 0 ? paletteIcons : [document, book, shield, network];
    for (let i = 0; i < count; i++) {
      const x = i % 2 === 0 ? -2.6 : 2.6,
        z = Math.floor(i / 2) * 3.4 - 1.7;
      const body = station(x, 0, z);
      icons[i % icons.length](body);
    }
    line(root, [
      [-2.6, 0.1, -1.7],
      [0, 0.1, 0],
      [2.6, 0.1, 1.7],
    ]);
    line(root, [
      [2.6, 0.1, -1.7],
      [0, 0.1, 0],
      [-2.6, 0.1, 1.7],
    ]);
  } else if (type === 'timeline') {
    const points = [];
    for (let i = 0; i < count; i++) {
      const x = (i - (count - 1) / 2) * 3.4,
        y = i * 0.35,
        z = i % 2 === 0 ? 0.5 : -0.5;
      points.push([x, y + 0.05, z]);
      const body = station(x, y, z, 1.35);
      [document, book, laptop, shield][i % 4](body);
    }
    line(root, points, m.glow, 0.055);
  } else if (type === 'profile') {
    box(root, 10.8, 0.42, 6, m.dark, 0, -0.4, 0);
    box(root, 10.65, 0.13, 5.85, m.stone, 0, -0.13, 0);
    for (const x of [-4.6, 4.6])
      for (const z of [-2.2, 2.2]) box(root, 0.3, 1, 0.3, m.metal, x, -0.9, z);
    [document, compass, laptop, shield].forEach((icon, i) => {
      const body = station(i % 2 ? 2.65 : -2.65, 0, i < 2 ? -1.4 : 1.4, 1.15);
      icon(body);
    });
  } else {
    cylinder(root, 4.1, 0.28, m.dark, 0, 0.5, 0);
    cylinder(root, 4, 0.1, m.stone, 0, 0.68, 0);
    cylinder(root, 1, 0.8, m.dark, 0, 0, 0);
    ring(root, 3.85, m.glow, 0, 0.75, 0);
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 2 + i * ((Math.PI * 2) / count);
      const body = station(
        Math.cos(angle) * 2.2,
        0.78,
        Math.sin(angle) * 2.2,
        1,
      );
      document(body);
      body.rotation.y = -angle - Math.PI / 2;
    }
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const chair = group(
        root,
        Math.cos(angle) * 5.15,
        0.1,
        Math.sin(angle) * 5.15,
      );
      chair.rotation.y = -angle + Math.PI / 2;
      box(chair, 0.9, 0.12, 0.9, m.green, 0, 0.2, 0);
      box(chair, 0.9, 1, 0.14, m.dark, 0, 0.7, -0.42);
      for (const x of [-0.35, 0.35])
        for (const z of [-0.35, 0.35])
          box(chair, 0.06, 0.6, 0.06, m.metal, x, -0.1, z);
    }
    model(models.firm, root, 2.5, 4.7, 0, -3.5);
    model(models.palm, root, 1.8, -4.5, 0, -3.5);
  }
  return {
    root,
    update(progress) {
      stations.forEach(({ body, halo, base }, i) => {
        const distance = Math.abs(i - progress);
        const focus = Math.max(0, 1 - distance);
        body.position.y = base + focus * 0.32;
        halo.scale.setScalar(1 + focus * 0.045);
        halo.visible = focus > 0.05;
      });
    },
  };
}
