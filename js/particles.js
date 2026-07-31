import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170/build/three.module.js";

export function createParticles(scene) {

    const geometry = new THREE.BufferGeometry();

    const count = 1500;

    const positions = [];

    for (let i = 0; i < count; i++) {

        positions.push(
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 40,
            (Math.random() - 0.5) * 40
        );

    }

    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
            positions,
            3
        )
    );

    const material = new THREE.PointsMaterial({

        color: 0x66ccff,
        size: 0.05

    });

    const stars = new THREE.Points(
        geometry,
        material
    );

    scene.add(stars);

    return stars;
}
