import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// =========================================
// AI Core
//
// VISUAL CHANGE: the core's visible geometry is now a loaded GLB
// model (assets/hero3d/ai_sphere.glb) instead of the fused
// baseSphere + frontPanel construction. Everything else — coreLight,
// the Focus Mode beam, and the holographic base rings — is
// untouched, and group.userData keeps the exact same shape
// (beam, baseSphere, frontPanel, coreLight) so animate.js does not
// need to change.
//
// Why a proxy `.material` object below:
// animate.js does `parts.baseSphere.material.emissiveIntensity = ...`
// every frame. A loaded GLB's root (`gltf.scene`) is a THREE.Group,
// not a Mesh — it has no `.material`. Rather than touch animate.js,
// we attach a small object to `gltf.scene.material` that forwards
// `emissiveIntensity` to every emissive-capable material found inside
// the model. From animate.js's point of view, nothing changed.
//
// Loading is asynchronous, but the group is created and returned
// synchronously as before (so hero3d.js's call to createProjectNodes
// still gets a valid group immediately) — the model just fades in as
// a child once it finishes loading. animate.js already guards with
// `if (parts.baseSphere)`, so there's no error in the gap before the
// model arrives; it simply doesn't rotate/pulse until it's ready.
// =========================================

const CORE_RADIUS = 1.0;

// If the loaded model looks too big/small relative to the project
// node spheres, tune this — it scales the whole GLB uniformly.
const GLB_SCALE = 1.0;

const GLB_PATH = "assets/hero3d/ai_sphere.glb";

function attachEmissiveProxy(root) {

    const emissiveMaterials = [];

    root.traverse((child) => {

        if (!child.isMesh || !child.material) return;

        const mats = Array.isArray(child.material)
            ? child.material
            : [child.material];

        mats.forEach((m) => {

            if (m && "emissiveIntensity" in m) {
                emissiveMaterials.push(m);
            }

        });

    });

    // If the model has no emissive materials at all, this proxy is
    // harmless — the setter just has nothing to forward to.
    root.material = {

        get emissiveIntensity() {

            return emissiveMaterials[0]
                ? emissiveMaterials[0].emissiveIntensity
                : 0;

        },

        set emissiveIntensity(value) {

            emissiveMaterials.forEach((m) => {
                m.emissiveIntensity = value;
            });

        }

    };

}

function loadCoreModel(group) {

    const loader = new GLTFLoader();

    loader.load(

        GLB_PATH,

        (gltf) => {

            const model = gltf.scene;

            model.scale.setScalar(GLB_SCALE);

            attachEmissiveProxy(model);

            group.add(model);

            // Same slot animate.js already reads every frame —
            // rotation.y and material.emissiveIntensity both work
            // on `model` (Object3D rotation + the proxy above).
            group.userData.baseSphere = model;

            // No separate front panel with a single fused GLB model —
            // animate.js already guards with `if (parts.frontPanel)`,
            // so leaving this unset is safe.
            group.userData.frontPanel = null;

        },

        undefined,

        (err) => {

            console.warn(
                "AI core GLB failed to load, falling back to placeholder sphere.",
                err
            );

            // Minimal visual fallback so the scene isn't just an empty
            // gap if the path is wrong or the file hasn't been
            // uploaded yet.
            const fallbackGeometry = new THREE.SphereGeometry(CORE_RADIUS, 32, 32);

            const fallbackMaterial = new THREE.MeshStandardMaterial({
                color: 0x11244a,
                emissive: 0x0c3d7a,
                emissiveIntensity: 0.6,
                roughness: 0.3
            });

            const fallbackSphere = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
            group.add(fallbackSphere);

            group.userData.baseSphere = fallbackSphere;
            group.userData.frontPanel = null;

        }

    );

}

export function createAiCore(scene) {

    const group = new THREE.Group();

    // =====================================
    // Core light — real light living inside the core.
    // Unchanged.
    // =====================================

    const coreLight = new THREE.PointLight(0x6fd6ff, 6, 7);
    coreLight.position.set(0, 0, 0);
    group.add(coreLight);

    // =====================================
    // Focus Mode — vertical light beam.
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

    // baseSphere/frontPanel start unset — animate.js's
    // `if (parts.baseSphere)` guard means nothing errors before the
    // GLB (or its fallback) finishes loading and fills these in.
    group.userData = {

        beam,
        baseSphere: null,
        frontPanel: null,
        coreLight

    };

    scene.add(group);

    loadCoreModel(group);

    return group;

}
