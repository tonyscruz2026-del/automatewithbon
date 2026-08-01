import * as THREE from "three";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";

// =========================================
// AI Core — inner neural network
//
// A geodesic wireframe wrapped around the core's
// inner volume, matching the reference design's
// "lattice across the whole globe" look — not a
// loose cloud of floating points. Built from an
// icosahedron's own edges and vertices, so lines
// and nodes always line up exactly (no distance
// threshold, no rejection sampling).
// =========================================

const NETWORK_RADIUS = 0.95;
const DETAIL = 2; // subdivision level — 2 gives a dense but readable lattice

export function createAiCoreNetwork() {

    const group = new THREE.Group();

    // Base geometry: an icosphere. PolyhedronGeometry (which
    // IcosahedronGeometry extends) duplicates vertices per-face, so
    // merge them first — otherwise the point cloud below would draw
    // several overlapping points at every shared vertex.
    const icoGeometry = mergeVertices(
        new THREE.IcosahedronGeometry(NETWORK_RADIUS, DETAIL)
    );

    // =====================================
    // Lattice lines — the sphere's own edges
    // =====================================

    const edgesGeometry = new THREE.EdgesGeometry(icoGeometry);

    const lineMaterial = new THREE.LineBasicMaterial({

        color: 0x5fc9ff,
        transparent: true,
        opacity: 0.45,
        depthWrite: false

    });

    const lines = new THREE.LineSegments(edgesGeometry, lineMaterial);
    group.add(lines);

    // =====================================
    // Node points — sit exactly at lattice
    // intersections, since they reuse the
    // same vertex positions as the edges.
    // =====================================

    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute(
        "position",
        icoGeometry.getAttribute("position").clone()
    );

    const pointsMaterial = new THREE.PointsMaterial({

        color: 0xbfeaff,
        size: 0.045,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        sizeAttenuation: true

    });

    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    group.add(points);

    group.userData = { points, lines };

    return group;

}

// activity is the state-driven multiplier (from aiCoreStates.js —
// "network" field) so the whole lattice spins faster and glows
// brighter during Processing / High Activity than at Idle.
export function updateAiCoreNetwork(network, t, activity) {

    if (!network) return;

    // Slower base rotation than the old point-cloud version — a full
    // geodesic lattice reads as spinning structure even at low speed,
    // where the old sparse cloud needed faster motion to register.
    network.rotation.y = t * 0.12 * activity;
    network.rotation.x = Math.sin(t * 0.1) * 0.15;

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
            0.3 + activity * 0.08
        );

    }

}
