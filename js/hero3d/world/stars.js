import * as THREE from "three";

// =========================================
// Background layer: a soft particle field plus
// a static constellation mesh (nearest-neighbour
// lines), echoing the network look behind the
// spheres in the reference design. Everything
// here is built once — no per-frame geometry
// work — so it stays cheap on lower-end GPUs.
// =========================================

const PARTICLE_COUNT = 900;
const FIELD_RADIUS = 26;
const LINK_SAMPLE = 220;
const LINK_MAX_DIST = 4.2;
const LINKS_PER_POINT = 2;

export function createStars(scene) {

    const group = new THREE.Group();

    const positions = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {

        const r = FIELD_RADIUS * (0.35 + Math.random() * 0.65);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.cos(phi) * 0.5;
        positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 6;

    }

    // -------- Particles --------

    const particleGeometry = new THREE.BufferGeometry();

    particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({

        color: 0x8fd6ff,

        size: 0.045,

        transparent: true,

        opacity: 0.75,

        depthWrite: false,

        blending: THREE.AdditiveBlending

    });

    group.add(new THREE.Points(particleGeometry, particleMaterial));

    // -------- Constellation lines (static) --------

    const linePositions = [];

    for (let i = 0; i < LINK_SAMPLE; i++) {

        const ax = positions[i * 3];
        const ay = positions[i * 3 + 1];
        const az = positions[i * 3 + 2];

        let links = 0;

        for (let j = i + 1; j < LINK_SAMPLE && links < LINKS_PER_POINT; j++) {

            const bx = positions[j * 3];
            const by = positions[j * 3 + 1];
            const bz = positions[j * 3 + 2];

            const dx = ax - bx;
            const dy = ay - by;
            const dz = az - bz;

            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < LINK_MAX_DIST) {

                linePositions.push(ax, ay, az, bx, by, bz);

                links++;

            }

        }

    }

    const lineGeometry = new THREE.BufferGeometry();

    lineGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(linePositions, 3)
    );

    const lineMaterial = new THREE.LineBasicMaterial({

        color: 0x2aa8ff,

        transparent: true,

        opacity: 0.16,

        depthWrite: false

    });

    group.add(new THREE.LineSegments(lineGeometry, lineMaterial));

    scene.add(group);

    return group;

}
