import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170/build/three.module.js";

export function createBackground(scene) {

    const geometry = new THREE.SphereGeometry(
        60,
        64,
        64
    );

    const material = new THREE.MeshBasicMaterial({

        color: 0x081223,
        side: THREE.BackSide

    });

    const dome = new THREE.Mesh(
        geometry,
        material
    );

    scene.add(dome);

    return dome;
}
