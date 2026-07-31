import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

import {
    createGlassMaterial,
    createCoreMaterial
} from "./materials.js";

export function createSpheres(scene) {

    // =====================================
    // Geometry
    // =====================================

    const geometry = new THREE.SphereGeometry(
        0.55,
        64,
        64
    );

    // =====================================
    // Sphere Positions
    // =====================================

    const positions = [

        // Center AI Core
        [0, 0, 0],

        // Top Left
        [-2.2, 1.2, 0],

        // Top Right
        [2.2, 1.2, 0],

        // Bottom Left
        [-1.8, -1.5, 0],

        // Bottom Right
        [1.8, -1.5, 0]

    ];

    const spheres = [];

    positions.forEach((position, index) => {

        // ============================
        // Choose Material
        // ============================

        const material = index === 0
            ? createCoreMaterial()
            : createGlassMaterial();

        // ============================
        // Create Sphere
        // ============================

        const sphere = new THREE.Mesh(
            geometry,
            material
        );

        sphere.position.set(
            position[0],
            position[1],
            position[2]
        );

        // ============================
        // Scale
        // ============================

        if (index === 0) {

            // Larger AI Core
            sphere.scale.setScalar(1.7);

        } else {

            sphere.scale.setScalar(1);

        }

        // ============================
        // Store Original Position
        // ============================

        sphere.userData = {

            index,

            baseX: position[0],

            baseY: position[1],

            baseZ: position[2]

        };

        // ============================
        // AI Core Glow
        // ============================

        if (index === 0) {

            const glowGeometry = new THREE.SphereGeometry(
                0.9,
                64,
                64
            );

            const glowMaterial = new THREE.MeshBasicMaterial({

                color: 0x00bfff,

                transparent: true,

                opacity: 0.12,

                side: THREE.DoubleSide

            });

            const glow = new THREE.Mesh(
                glowGeometry,
                glowMaterial
            );

            sphere.add(glow);

            sphere.userData.glow = glow;

        }

        // ============================
        // Add to Scene
        // ============================

        scene.add(sphere);

        spheres.push(sphere);

    });

    return spheres;

}
