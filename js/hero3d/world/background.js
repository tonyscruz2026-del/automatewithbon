import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

export function createBackground(scene) {

    // =====================================
    // Sky Dome
    // =====================================

    const skyGeometry = new THREE.SphereGeometry(

        80,

        64,

        64

    );

    const skyMaterial = new THREE.MeshBasicMaterial({

        color: 0x07111f,

        side: THREE.BackSide

    });

    const sky = new THREE.Mesh(

        skyGeometry,

        skyMaterial

    );

    scene.add(sky);

    // =====================================
    // Large Background Glow
    // =====================================

    const glowGeometry = new THREE.SphereGeometry(

        20,

        64,

        64

    );

    const glowMaterial = new THREE.MeshBasicMaterial({

        color: 0x0b3d91,

        transparent: true,

        opacity: 0.06,

        side: THREE.DoubleSide

    });

    const glow = new THREE.Mesh(

        glowGeometry,

        glowMaterial

    );

    glow.position.set(

        0,

        0,

        -8

    );

    scene.add(glow);

    // =====================================
    // Top Accent Glow
    // =====================================

    const topGlowGeometry = new THREE.SphereGeometry(

        10,

        64,

        64

    );

    const topGlowMaterial = new THREE.MeshBasicMaterial({

        color: 0x00bfff,

        transparent: true,

        opacity: 0.05,

        side: THREE.DoubleSide

    });

    const topGlow = new THREE.Mesh(

        topGlowGeometry,

        topGlowMaterial

    );

    topGlow.position.set(

        0,

        6,

        -10

    );

    scene.add(topGlow);

    // =====================================
    // Bottom Accent Glow
    // =====================================

    const bottomGlowGeometry = new THREE.SphereGeometry(

        12,

        64,

        64

    );

    const bottomGlowMaterial = new THREE.MeshBasicMaterial({

        color: 0x1d4ed8,

        transparent: true,

        opacity: 0.04,

        side: THREE.DoubleSide

    });

    const bottomGlow = new THREE.Mesh(

        bottomGlowGeometry,

        bottomGlowMaterial

    );

    bottomGlow.position.set(

        0,

        -6,

        -12

    );

    scene.add(bottomGlow);

    // =====================================
    // Return References
    // =====================================

    return {

        sky,

        glow,

        topGlow,

        bottomGlow

    };

}
