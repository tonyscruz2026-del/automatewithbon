import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

export function createLights(scene) {

    // =====================================
    // Ambient Light
    // =====================================

    const ambientLight = new THREE.AmbientLight(

        0xffffff,

        1.8

    );

    scene.add(ambientLight);

    // =====================================
    // Main Directional Light
    // =====================================

    const directionalLight = new THREE.DirectionalLight(

        0xffffff,

        3

    );

    directionalLight.position.set(

        5,

        8,

        5

    );

    directionalLight.castShadow = true;

    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;

    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;

    scene.add(directionalLight);

    // =====================================
    // Blue Rim Light
    // =====================================

    const blueLight = new THREE.PointLight(

        0x4da6ff,

        25,

        30

    );

    blueLight.position.set(

        -4,

        3,

        5

    );

    scene.add(blueLight);

    // =====================================
    // Cyan Fill Light
    // =====================================

    const cyanLight = new THREE.PointLight(

        0x00ffff,

        12,

        25

    );

    cyanLight.position.set(

        5,

        -2,

        3

    );

    scene.add(cyanLight);

    // =====================================
    // Purple Accent Light
    // =====================================

    const purpleLight = new THREE.PointLight(

        0x8b5cf6,

        10,

        25

    );

    purpleLight.position.set(

        0,

        4,

        -4

    );

    scene.add(purpleLight);

    // =====================================
    // Return References
    // =====================================

    return {

        ambientLight,

        directionalLight,

        blueLight,

        cyanLight,

        purpleLight

    };

}
