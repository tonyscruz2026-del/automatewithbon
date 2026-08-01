import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

// =========================================
// AI Core
//
// HOW THIS WORKS (matcap technique):
//
// Your actual reference art (assets/hero3d/ai-core.png) is used
// as a MatCap texture on a REAL THREE.SphereGeometry — not a flat
// billboard. A matcap shades a mesh by sampling the texture based
// on the surface's normal direction relative to the camera, the
// same way a photo of a chrome ball under studio lighting can be
// used to "re-light" any 3D object. That's what makes this look
// exactly like the source image while still being genuine 3D:
//
//   - It's a real THREE.Mesh with real geometry: it has depth,
//     casts/receives correctly in the scene, and sits properly
//     among the other 3D objects (nodes, beam, lights).
//   - Parallax, camera dolly, and orbiting nodes passing in front
//     of/behind it all work correctly, because it's positioned in
//     actual 3D space, not projected as a 2D screen-space sprite.
//   - The surface shading itself is pulled directly from your art,
//     so the glow/network/color read exactly like the reference —
//     no hand-guessed shader trying to reinvent the look.
//
// One real property of matcaps worth knowing: because the shading
// is camera-relative, spinning the sphere in place doesn't change
// its lit look much (same as how a mirrored ball looks the same
// no matter how it spins in a fixed room) — depth, glow pulse, and
// parallax movement all still read as fully 3D.
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
    // Atmosphere — soft outer glow halo,
    // matching the bloom/glow ring around the
    // sphere in the reference image.
    // =====================================

    const atmosphereGeometry = new THREE.SphereGeometry(
        CORE_RADIUS * 1.35,
        48,
        48
    );

    const atmosphereMaterial = new THREE.ShaderMaterial({

        uniforms: {
            glowColor: { value: new THREE.Color(0x5fc9ff) },
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
    // The sphere itself — real geometry, shaded
    // with your actual reference art as a matcap.
    // =====================================

    const matcapTexture = new THREE.TextureLoader().load(
        "assets/hero3d/ai-core.png"
    );
    matcapTexture.colorSpace = THREE.SRGBColorSpace;

    const sphereGeometry = new THREE.SphereGeometry(CORE_RADIUS, 96, 96);

    const sphereMaterial = new THREE.MeshMatcapMaterial({
        matcap: matcapTexture
    });

    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    group.add(sphere);

    // =====================================
    // Core light — real light living inside the
    // sphere so nearby project nodes and the
    // lattice/beam catch true illumination from it.
    // =====================================

    const coreLight = new THREE.PointLight(0x6fd6ff, 8, 7);
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
        sphere,
        coreLight

    };

    scene.add(group);

    return group;

}
