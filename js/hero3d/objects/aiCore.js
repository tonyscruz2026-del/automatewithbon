import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

import { createAiCoreNetwork } from "./aiCoreNetwork.js";

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
    // Soft Inner Glow
    // Small, dim, and semi-transparent —
    // a "deep inner glow with volume" per the
    // reference, not a solid bright lightbulb.
    // Kept small so it sits behind the network
    // lattice instead of overpowering it.
    // =====================================

    const innerGeometry = new THREE.SphereGeometry(
        0.4,
        64,
        64
    );

    const innerMaterial = new THREE.MeshStandardMaterial({

        color: 0x1a4d7a,

        emissive: 0x4fc3ff,

        emissiveIntensity: 1.2,

        roughness: 0.3,

        metalness: 0,

        transparent: true,

        opacity: 0.55

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
    // Inner Neural Network
    // (Dynamic Neural Network Core)
    // =====================================

    const network = createAiCoreNetwork();
    group.add(network);

    // =====================================
    // "AI" Label
    // Flat, camera-facing, centered — same
    // CSS2DObject technique as the project
    // node icons, so it always reads crisp
    // regardless of shell refraction.
    // =====================================

    const labelEl = document.createElement("div");
    labelEl.className = "ai-core-label";
    labelEl.textContent = "AI";

    const label = new CSS2DObject(labelEl);
    label.position.set(0, 0, 0);
    group.add(label);

    // =====================================
    // Focus Mode — vertical light beam
    // Hidden (scale 0) outside Focus Mode.
    // Driven every frame from animate.js via
    // the "beam" value returned by
    // aiCoreStates.getCoreState().
    // =====================================

    const beamGeometry = new THREE.CylinderGeometry(
        0.04,
        0.14,
        6,
        24,
        1,
        true
    );

    const beamMaterial = new THREE.MeshBasicMaterial({

        color: 0x9fe6ff,

        transparent: true,

        opacity: 0,

        side: THREE.DoubleSide,

        depthWrite: false

    });

    const beam = new THREE.Mesh(beamGeometry, beamMaterial);

    // Cylinder is built centered on its own origin; lift it so its
    // base sits at the core's center and it extends upward.
    beam.position.y = 3;
    beam.scale.set(1, 0.0001, 1);

    group.add(beam);

    // =====================================
    // Holographic Base
    // Flat ripple ring beneath the core,
    // same billboard technique as the label.
    // =====================================

    const baseEl = document.createElement("div");
    baseEl.className = "holo-base holo-base--core";
    baseEl.innerHTML =
        '<span class="holo-ring holo-ring-1"></span>' +
        '<span class="holo-ring holo-ring-2"></span>' +
        '<span class="holo-ring holo-ring-3"></span>';

    const base = new CSS2DObject(baseEl);
    base.position.set(0, -1.35, 0);
    group.add(base);

    group.userData = {

        shell,
        inner,
        glow,
        network,
        beam

    };

    scene.add(group);

    return group;

}
