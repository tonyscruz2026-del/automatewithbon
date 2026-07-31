import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

export function createParticles(scene) {

    // =====================================
    // Settings
    // =====================================

    const particleCount = 3500;

    const positions = new Float32Array(
        particleCount * 3
    );

    // =====================================
    // Generate Positions
    // =====================================

    for (let i = 0; i < particleCount; i++) {

        const i3 = i * 3;

        positions[i3] = (Math.random() - 0.5) * 80;
        positions[i3 + 1] = (Math.random() - 0.5) * 60;
        positions[i3 + 2] = (Math.random() - 0.5) * 80;

    }

    // =====================================
    // Geometry
    // =====================================

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(

        "position",

        new THREE.BufferAttribute(

            positions,

            3

        )

    );

    // =====================================
    // Material
    // =====================================

    const material = new THREE.PointsMaterial({

        color: 0x66ccff,

        size: 0.05,

        transparent: true,

        opacity: 0.85,

        depthWrite: false,

        blending: THREE.AdditiveBlending,

        sizeAttenuation: true

    });

    // =====================================
    // Particle System
    // =====================================

    const particles = new THREE.Points(

        geometry,

        material

    );

    particles.rotation.order = "YXZ";

    scene.add(particles);

    return particles;

}
