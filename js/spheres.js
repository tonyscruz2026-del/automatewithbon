import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";
import { createGlassMaterial } from "./materials.js";

export function createSpheres(scene) {

    // ==========================
    // Geometry
    // ==========================

    const geometry = new THREE.SphereGeometry(
        0.55,
        64,
        64
    );

    // ==========================
    // Layout
    // ==========================

    const positions = [

        [0, 0, 0],          // AI Core

        [-2.2, 1.2, 0],

        [2.2, 1.2, 0],

        [-1.8, -1.5, 0],

        [1.8, -1.5, 0]

    ];

    // ==========================
    // Create Spheres
    // ==========================

    const spheres = [];

    positions.forEach((position, index) => {

        const sphere = new THREE.Mesh(

            geometry,

            createGlassMaterial()

        );

        sphere.position.set(

            position[0],

            position[1],

            position[2]

        );

        // Bigger center sphere

        if (index === 0) {

            sphere.scale.setScalar(1.5);

        }

        // Store original position

        sphere.userData.baseX = position[0];

        sphere.userData.baseY = position[1];

        sphere.userData.baseZ = position[2];

        sphere.userData.index = index;

        scene.add(sphere);

        spheres.push(sphere);

    });

    return spheres;

}
