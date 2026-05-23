import * as THREE from 'three';

/**
 * Procedural Realistic Texture Generators for Astronomical and Quantum Bodies
 * Made fully client-side using HTML5 Canvas rendering for lightning-fast, zero-network load.
 */

export function createProceduralEarthTexture(step: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  if (step === 1) {
    // Early Earth: Molten lava ocean, volcanic plume eruptions and fractured crust islands
    ctx.fillStyle = '#150604';
    ctx.fillRect(0, 0, 1024, 512);

    // Glowing magma fractures
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#f97316';
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 3;
    for (let i = 0; i < 45; i++) {
      ctx.beginPath();
      let x = Math.random() * 1024;
      let y = Math.random() * 512;
      ctx.moveTo(x, y);
      for (let j = 0; j < 8; j++) {
        x += (Math.random() - 0.5) * 80;
        y += (Math.random() - 0.5) * 80;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    // Lava hot-spots
    ctx.fillStyle = '#ef4444';
    for (let i = 0; i < 15; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 1024, Math.random() * 512, 10 + Math.random() * 45, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0; // reset
  } else if (step === 5) {
    // Scorched Future: Dried, waterless, highly eroded brown-grey waste
    ctx.fillStyle = '#4c3f35';
    ctx.fillRect(0, 0, 1024, 512);

    ctx.fillStyle = '#3a2e25';
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 1024, Math.random() * 512, 20 + Math.random() * 100, 0, Math.PI * 2);
      ctx.fill();
    }

    // Impact blast marks on desolate Earth
    ctx.strokeStyle = '#291f19';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 1024, Math.random() * 512, Math.random() * 80, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else {
    // Present/Stable: Accurate ocean-blue map with realistic continent formations,
    // vegetation gradients, barren deserts, polar ice caps, and atmospheric cloud overlays.
    ctx.fillStyle = '#081c3c'; // Deep ocean blue
    ctx.fillRect(0, 0, 1024, 512);

    // Continent Base: Deep forest green
    ctx.fillStyle = '#1c3d19';

    // Polar Ice Caps (Symmetrical)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 480, 1024, 32);
    ctx.fillRect(0, 0, 1024, 25);

    // North America
    ctx.fillStyle = '#265421';
    ctx.beginPath();
    ctx.moveTo(150, 80);
    ctx.lineTo(320, 85);
    ctx.lineTo(310, 180);
    ctx.lineTo(240, 220);
    ctx.lineTo(190, 170);
    ctx.lineTo(120, 110);
    ctx.closePath();
    ctx.fill();

    // South America
    ctx.fillStyle = '#1e481c';
    ctx.beginPath();
    ctx.moveTo(250, 220);
    ctx.lineTo(330, 230);
    ctx.lineTo(290, 320);
    ctx.lineTo(250, 420);
    ctx.lineTo(230, 320);
    ctx.closePath();
    ctx.fill();

    // Eurasia
    ctx.fillStyle = '#2d5f27';
    ctx.beginPath();
    ctx.moveTo(460, 60);
    ctx.lineTo(840, 70);
    ctx.lineTo(880, 200);
    ctx.lineTo(760, 240);
    ctx.lineTo(600, 200);
    ctx.lineTo(540, 120);
    ctx.closePath();
    ctx.fill();

    // Africa
    ctx.fillStyle = '#7a6026'; // sandy savanna base
    ctx.beginPath();
    ctx.moveTo(460, 180);
    ctx.lineTo(580, 185);
    ctx.lineTo(620, 250);
    ctx.lineTo(540, 360);
    ctx.lineTo(490, 370);
    ctx.lineTo(460, 240);
    ctx.closePath();
    ctx.fill();

    // Australia
    ctx.fillStyle = '#8f6522';
    ctx.beginPath();
    ctx.ellipse(820, 330, 70, 45, Math.PI / 8, 0, Math.PI * 2);
    ctx.fill();

    // Add Desert sands (Sahara, Arabian, Gobi, Australian Outback)
    ctx.fillStyle = '#dfaa3d';
    // Sahara
    ctx.fillRect(470, 195, 95, 45);
    // Arab Peninsula
    ctx.fillRect(590, 180, 40, 32);
    // Gobi Desert
    ctx.fillRect(680, 110, 80, 25);
    // Outback
    ctx.beginPath();
    ctx.arc(820, 330, 35, 0, Math.PI * 2);
    ctx.fill();

    // Swirling realistic vapor clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    for (let i = 0; i < 15; i++) {
      ctx.beginPath();
      ctx.ellipse(
        Math.random() * 1024,
        Math.random() * 512,
        60 + Math.random() * 120,
        15 + Math.random() * 30,
        Math.random() * 0.4,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function createProceduralMoonTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Moon base: Slate grey
  ctx.fillStyle = '#828489';
  ctx.fillRect(0, 0, 512, 256);

  // Volcanic basaltic lunar Maria (darker basalt regions)
  ctx.fillStyle = '#595b60';
  const maria = [
    { x: 100, y: 80, rx: 50, ry: 35 },
    { x: 140, y: 130, rx: 70, ry: 40 },
    { x: 220, y: 110, rx: 45, ry: 30 },
    { x: 380, y: 90, rx: 60, ry: 35 },
    { x: 340, y: 160, rx: 50, ry: 40 },
    { x: 240, y: 40, rx: 35, ry: 20 },
  ];
  maria.forEach((m) => {
    ctx.beginPath();
    ctx.ellipse(m.x, m.y, m.rx, m.ry, Math.random() * 0.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Highlighted crater basins & ejected ray structures (Copernicus, Tycho-style rays)
  ctx.strokeStyle = '#d0d1d6';
  ctx.lineWidth = 0.5;
  const majorCraters = [
    { x: 130, y: 110, size: 8, rays: true },
    { x: 260, y: 180, size: 6, rays: true },
    { x: 400, y: 120, size: 7, rays: false },
    { x: 70, y: 160, size: 5, rays: false },
  ];

  majorCraters.forEach((c) => {
    // Draw lighter ring outer boundary
    ctx.fillStyle = '#b6b8bd';
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
    ctx.fill();

    // Outer ray splatters
    if (c.rays) {
      for (let j = 0; j < 16; j++) {
        const theta = (j / 16) * Math.PI * 2 + Math.random() * 0.1;
        ctx.beginPath();
        ctx.moveTo(c.x + Math.cos(theta) * c.size, c.y + Math.sin(theta) * c.size);
        ctx.lineTo(
          c.x + Math.cos(theta) * (c.size + 40 + Math.random() * 50),
          c.y + Math.sin(theta) * (c.size + 40 + Math.random() * 50)
        );
        ctx.stroke();
      }
    }

    // Shadowed center
    ctx.fillStyle = '#444549';
    ctx.beginPath();
    ctx.arc(c.x - c.size * 0.15, c.y - c.size * 0.15, c.size * 0.6, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function createProceduralSunTexture(step: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Color parameters matching steps (Stable, Red Giant, White Dwarf)
  let baseColor = '#f59e0b'; // G-type main star orange-yellow
  let flareColor = '#ef4444';
  let speckleColor = '#fef08a';

  if (step === 4) {
    // Red Giant: Intense deep red-orange convective plumes
    baseColor = '#b91c1c';
    flareColor = '#ea580c';
    speckleColor = '#f97316';
  } else if (step === 5) {
    // White Dwarf: Dense piercing cyan-white energy
    baseColor = '#1e293b';
    flareColor = '#06b6d4';
    speckleColor = '#e2f8ff';
  }

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 512, 256);

  // Convective solar granules (procedural spot structures)
  ctx.fillStyle = flareColor;
  for (let i = 0; i < 180; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 512, Math.random() * 256, 1 + Math.random() * 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // Brilliant hotspot grains
  ctx.fillStyle = speckleColor;
  for (let i = 0; i < 120; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 512, Math.random() * 256, 1 + Math.random() * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw sunspot clusters (magnetic loops cooling areas)
  if (step !== 5) {
    ctx.fillStyle = '#450a0a';
    for (let i = 0; i < 6; i++) {
       const x = Math.random() * 512;
       const y = 80 + Math.random() * 96;
       ctx.beginPath();
       ctx.arc(x, y, 4, 0, Math.PI * 2);
       ctx.fill();
       ctx.beginPath();
       ctx.arc(x + 4, y + 2, 2, 0, Math.PI * 2);
       ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function createProceduralJupiterTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Jupiter has highly recognized, layered horizontal gas bands with rich orange-brown-cream tones
  const bands = [
    { y: 0, h: 25, col: '#7c5d41' },
    { y: 25, h: 20, col: '#b8997a' },
    { y: 45, h: 30, col: '#dfcebb' },
    { y: 75, h: 25, col: '#9a6b46' },
    { y: 100, h: 15, col: '#cda886' },
    { y: 115, h: 35, col: '#784824' }, // darker equatorial zone
    { y: 150, h: 20, col: '#dfcebb' },
    { y: 170, h: 30, col: '#a37d5c' },
    { y: 200, h: 25, col: '#b8997a' },
    { y: 225, h: 31, col: '#5a422f' },
  ];

  bands.forEach((b) => {
    ctx.fillStyle = b.col;
    ctx.fillRect(0, b.y, 512, b.h);
  });

  // Turbulence wavy bands boundaries
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    ctx.strokeStyle = i % 2 === 0 ? '#dfcebb' : '#784824';
    ctx.beginPath();
    const yVal = 30 + i * 25;
    ctx.moveTo(0, yVal);
    for (let x = 0; x <= 512; x += 16) {
      ctx.lineTo(x, yVal + Math.sin(x * 0.1) * 3);
    }
    ctx.stroke();
  }

  // The Great Red Spot (anti-cyclonic gas storm at ~22 degrees South)
  ctx.fillStyle = '#b12d1b';
  ctx.shadowBlur = 6;
  ctx.shadowColor = '#4f0900';
  ctx.beginPath();
  ctx.ellipse(320, 165, 26, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0; // reset

  // White storm spot droplets
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(100 + i * 90, 120 + Math.sin(i) * 30, 3 + Math.random() * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function createProceduralMarsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Mars base: Rust-red iron oxide desert
  ctx.fillStyle = '#c0392b';
  ctx.fillRect(0, 0, 512, 256);

  // Darker volcanic basaltic canyons (Valles Marineris visual representation)
  ctx.fillStyle = '#8e1b1b';
  ctx.beginPath();
  ctx.moveTo(120, 120);
  ctx.lineTo(340, 130);
  ctx.lineTo(320, 150);
  ctx.lineTo(200, 140);
  ctx.closePath();
  ctx.fill();

  // Dark highland shadows (Syrtis Major)
  ctx.beginPath();
  ctx.ellipse(400, 100, 50, 40, -Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();

  // Highlighted pale orange sandy dry lakes
  ctx.fillStyle = '#d35400';
  for (let i = 0; i < 15; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 512, Math.random() * 256, 12 + Math.random() * 25, 0, Math.PI * 2);
    ctx.fill();
  }

  // Brilliant white frozen CO2/water polar ice caps (North & South poles)
  ctx.fillStyle = '#fefefe';
  ctx.fillRect(0, 246, 512, 10);
  ctx.fillRect(0, 0, 512, 8);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function createProceduralVenusTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Sulfuric acid clouds: Opaque yellow-amber swirls
  ctx.fillStyle = '#d4ac0d';
  ctx.fillRect(0, 0, 512, 256);

  ctx.fillStyle = '#f4d03f';
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 512, Math.random() * 256, 25 + Math.random() * 50, 0, Math.PI * 2);
    ctx.fill();
  }

  // Swirling gas currents
  ctx.strokeStyle = '#9a7d0a';
  ctx.lineWidth = 3;
  for (let i = 0; i < 12; i++) {
    ctx.beginPath();
    const yVal = 40 + i * 20;
    ctx.moveTo(0, yVal);
    ctx.bezierCurveTo(128, yVal + 30, 384, yVal - 30, 512, yVal + 10);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function createProceduralMercuryTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Mercury: Airless cratered dark grey ball
  ctx.fillStyle = '#4c4e52';
  ctx.fillRect(0, 0, 256, 128);

  ctx.fillStyle = '#34363a';
  for (let i = 0; i < 15; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 256, Math.random() * 128, 8 + Math.random() * 16, 0, Math.PI * 2);
    ctx.fill();
  }

  // Small pale white ring craters
  ctx.strokeStyle = '#7c7e82';
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * 256, Math.random() * 128, 1 + Math.random() * 3, 0, Math.PI * 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function createProceduralSaturnTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Saturn: Muted horizontal bands of golden sand, pale tan, and light yellow
  const layers = [
    { y: 0, h: 40, col: '#7d6f55' },
    { y: 40, h: 50, col: '#bfae8a' },
    { y: 90, h: 30, col: '#dfd2b0' },
    { y: 120, h: 60, col: '#a39571' },
    { y: 180, h: 40, col: '#bfae8a' },
    { y: 220, h: 36, col: '#61563f' },
  ];

  layers.forEach((l) => {
    ctx.fillStyle = l.col;
    ctx.fillRect(0, l.y, 512, l.h);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function createProceduralUranusTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Uranus: Pale turquoise, highly uniform gas globe with vertical tinting due to unique sideways spin tilt!
  ctx.fillStyle = '#aed6f1';
  ctx.fillRect(0, 0, 256, 128);

  ctx.fillStyle = '#d6eaf8';
  ctx.fillRect(0, 40, 256, 30);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function createProceduralNeptuneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Neptune: Deep azure/royal cobalt blue with bright white high-altitude methane cloud strips
  ctx.fillStyle = '#1b4f72';
  ctx.fillRect(0, 0, 256, 128);

  // Dark great spot storm circle
  ctx.fillStyle = '#0e2b3e';
  ctx.beginPath();
  ctx.ellipse(190, 80, 24, 15, -Math.PI / 6, 0, Math.PI * 2);
  ctx.fill();

  // White dynamic cirrus wind storms
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    const y = 30 + i * 20;
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(64, y + 10, 192, y - 10, 256, y + 5);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}
