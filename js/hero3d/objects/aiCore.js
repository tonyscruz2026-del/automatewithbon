import * as THREE from "three";

export function createAiCore(scene) {

    const group = new THREE.Group();

    // =====================================
    // Core Geometry
    // =====================================

    const geometry = new THREE.SphereGeometry(
        1.2,
        128,
        128
    );

    // =====================================
    // Glass Shell
    // =====================================

    const shellMaterial = new THREE.MeshPhysicalMaterial({

        color: 0x39b8ff,

        transparent: true,

        opacity: 0.25,

        roughness: 0,

        metalness: 0,

        transmission: 1,

        thickness: 1.5,

        ior: 1.5,

        clearcoat: 1,

        clearcoatRoughness: 0

    });

    const shell = new THREE.Mesh(
        geometry,
        shellMaterial
    );

    group.add(shell);

    // =====================================
    // Bright Inner Core
    // =====================================

    const innerGeometry = new THREE.SphereGeometry(
        0.65,
        128,
        128
    );

    const innerMaterial = new THREE.MeshStandardMaterial({

        color: 0xffffff,

        emissive: 0x66ddff,

        emissiveIntensity: 5,

        roughness: 0,

        metalness: 0.2

    });

    const inner = new THREE.Mesh(
        innerGeometry,
        innerMaterial
    );

    group.add(inner);

    // =====================================
    // Glow Sphere
    // =====================================

    const glowGeometry = new THREE.SphereGeometry(
        1.35,
        64,
        64
    );

    const glowMaterial = new THREE.MeshBasicMaterial({

        color: 0x29bfff,

        transparent: true,

        opacity: 0.12,

        side: THREE.DoubleSide

    });

    const glow = new THREE.Mesh(
        glowGeometry,
        glowMaterial
    );

    group.add(glow);

    // =====================================

    group.userData = {

        shell,

        inner,

        glow

    };

    scene.add(group);

    return group;

}
