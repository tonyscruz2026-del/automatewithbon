import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import { createAiCoreNetwork } from "./aiCoreNetwork.js";

// =========================================
// AI Core
//
// Real WebGL geometry, built in layers (same idea as the
// reference design, recreated as actual 3D objects instead
// of a flattened photo pasted on a billboard):
//
//   1. Atmosphere  — oversized backside sphere, fresnel rim
//                    glow, additive blending. Reads as the
//                    soft haze around the orb.
//   2. Glass shell — MeshPhysicalMaterial sphere with real
//                    transmission/iridescence, so it actually
//                    refracts scene light like glass.
//   3. Inner core  — small bright sphere at the center; this
//                    is what bloom picks up as the hot glow.
//   4. Lattice     — the geodesic wireframe network already
//                    built in aiCoreNetwork.js (was defined
//                    but never wired into the scene before).
//   5. Core light  — a real PointLight living inside the
//                    sphere so the shell/lattice/nearby nodes
//                    catch true light, not just emissive color.
//
// Because this is now genuine geometry, group.scale / rotation
// actually do something again — see animate.js.
// =========================================

const CORE_RADIUS = 1.0;

const ATMOSPHERE_VERTEX = `
    varying vec3 vNormal;
    void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const ATMOSPHERE_FRAGMENT = `
    uniform vec3 glowColor;
    uniform float intensity;
    varying vec3 vNormal;
    void main() {
        float rim = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.4);
        gl_FragColor = vec4(glowColor, clamp(rim, 0.0, 1.0) * intensity);
    }
`;

export function createAiCore(scene) {

    const group = new THREE.Group();

    // =====================================
    // Atmosphere — soft outer glow
    // =====================================

    const atmosphereGeometry = new THREE.SphereGeometry(
        CORE_RADIUS * 1.4,
        48,
        48
    );

    const atmosphereMaterial = new THREE.ShaderMaterial({

        uniforms: {
            glowColor: { value: new THREE.Color(0x4fc3ff) },
            intensity: { value: 1.0 }
        },

        vertexShader: ATMOSPHERE_VERTEX,
        fragmentShader: ATMOSPHERE_FRAGMENT,

        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false

    });

    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    group.add(atmosphere);

    // =====================================
    // Glass shell — real transmission, not a texture
    // =====================================

    const shellGeometry = new THREE.SphereGeometry(CORE_RADIUS, 96, 96);

    const shellMaterial = new THREE.MeshPhysicalMaterial({

        color: 0x1c3f78,

        transmission: 0.85,
        thickness: 1.4,
        roughness: 0.1,
        metalness: 0,
        ior: 1.35,

        clearcoat: 0.6,
        clearcoatRoughness: 0.2,

        iridescence: 0.5,
        iridescenceIOR: 1.3,

        emissive: 0x1a5fd6,
        emissiveIntensity: 0.35,

        transparent: true,
        opacity: 0.9

    });

    const shell = new THREE.Mesh(shellGeometry, shellMaterial);
    group.add(shell);

    // =====================================
    // Inner core — bright hot center, bloom's target
    // =====================================

    const innerGeometry = new THREE.SphereGeometry(CORE_RADIUS * 0.3, 32, 32);

    const innerMaterial = new THREE.MeshBasicMaterial({
        color: 0xdff6ff
    });

    const inner = new THREE.Mesh(innerGeometry, innerMaterial);
    group.add(inner);

    // =====================================
    // Neural lattice — real geodesic wireframe
    // (already built in aiCoreNetwork.js; just needed wiring)
    // =====================================

    const network = createAiCoreNetwork();
    group.add(network);

    // =====================================
    // Core light — lights the shell/lattice/nearby nodes for real
    // =====================================

    const coreLight = new THREE.PointLight(0x6fd6ff, 10, 7);
    coreLight.position.set(0, 0, 0);
    group.add(coreLight);

    // =====================================
    // Focus Mode — vertical light beam
    // Unchanged: real WebGL geometry, driven every frame from
    // animate.js via the "beam" value from aiCoreStates.getCoreState().
    // Hidden (scale 0) outside Focus Mode.
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

    beam.position.y = 3;
    beam.scale.set(1, 0.0001, 1);

    group.add(beam);

    // =====================================
    // Holographic Base
    // Unchanged — camera-facing CSS billboard rings.
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

        beam,
        atmosphere,
        shell,
        inner,
        network,
        coreLight

    };

    scene.add(group);

    return group;

}
