import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

export function createLights(scene){

    const ambient =
    new THREE.AmbientLight(
        0xffffff,
        1.8
    );

    scene.add(ambient);

    const directional =
    new THREE.DirectionalLight(
        0xffffff,
        3
    );

    directional.position.set(
        5,
        8,
        5
    );

    scene.add(directional);

    const blue =
    new THREE.PointLight(
        0x4da6ff,
        25,
        30
    );

    blue.position.set(
        -4,
        3,
        5
    );

    scene.add(blue);

}
