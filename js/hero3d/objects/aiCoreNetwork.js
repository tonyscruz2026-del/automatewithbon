import * as THREE from "three";

// =========================================
// AI Core — inner neural network
//
// A sparse cloud of points inside the core's
// inner sphere volume, connected to nearby
// neighbors by faint lines. Kept small (18
// points) since this sits behind bloom and
// inside a glass shell — detail beyond this
// count isn't visible and isn't worth the
// per-frame distance-check cost.
// =========================================

const POINT_COUNT = 18;
const INNER_RADIUS = 0.6;
const LINK_DISTANCE = 0.55;

export function createAiCoreNetwork() {

    const group = new THREE.Group();

    const positions = new Float32Array(POINT_COUNT * 3);

    for (let i = 0; i < POINT_COUNT; i++) {

        // Random point inside a sphere volume (not just the
        // surface) via rejection sampling — simple, and 18
        // points converges in a handful of tries at worst.
        let x, y, z, lenSq;

        do {

            x = (Math.random() * 2 - 1);
            y = (Math.random() * 2 - 1);
            z = (Math.random() * 2 - 1);

            lenSq = x * x + y * y + z * z;

        } while (lenSq > 1 || lenSq === 0);

        positions[i * 3] = x * INNER_RADIUS;
        positions[i * 3 + 1] = y * INNER_RADIUS;
        positions[i * 3 + 2] = z * INNER_RADIUS;

    }

    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
    );

    const pointsMaterial = new THREE.PointsMaterial({

        color: 0xbfeaff,
        size: 0.045,
        transparent: true,
        opacity: 0.9,
        depthWrite: false

    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    group.add(points);

    // Pre-compute which pairs are within LINK_DISTANCE once, since
    // the points themselves don't move relative to each other —
    // only the whole group rotates. No need to recheck every frame.
    const linePositions = [];

    for (let a = 0; a < POINT_COUNT; a++) {

        for (let b = a + 1; b < POINT_COUNT; b++) {

            const dx = positions[a * 3] - positions[b * 3];
            const dy = positions[a * 3 + 1] - positions[b * 3 + 1];
            const dz = positions[a * 3 + 2] - positions[b * 3 + 2];

            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < LINK_DISTANCE) {

                linePositions.push(
                    positions[a * 3], positions[a * 3 + 1], positions[a * 3 + 2],
                    positions[b * 3], positions[b * 3 + 1], positions[b * 3 + 2]
                );

            }

        }

    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(linePositions), 3)
    );

    const lineMaterial = new THREE.LineBasicMaterial({

        color: 0x5fc9ff,
        transparent: true,
        opacity: 0.35,
        depthWrite: false

    });

    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    group.add(lines);

    group.userData = { points, lines };

    return group;

}

// activity is the state-driven multiplier (from aiCoreStates.js —
// "network" field) so the whole cluster spins faster and glows
// brighter during Processing / High Activity than at Idle.
export function updateAiCoreNetwork(network, t, activity) {

    if (!network) return;

    network.rotation.y = t * 0.25 * activity;
    network.rotation.x = Math.sin(t * 0.15) * 0.2;

    const parts = network.userData || {};

    if (parts.points) {

        parts.points.material.opacity = Math.min(
            1,
            0.6 + activity * 0.15
        );

    }

    if (parts.lines) {

        parts.lines.material.opacity = Math.min(
            0.6,
            0.2 + activity * 0.08
        );

    }

}
