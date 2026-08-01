import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

// =========================================
// AI Core
//
// HOW THIS WORKS (image-sprite technique):
//
// Instead of building the glass/glow look with a
// WebGL shader, the reference design image itself
// is used as the sphere. It's placed in a real DOM
// <img>, wrapped in a CSS2DObject — the exact same
// billboard technique already used for the "AI"
// label and the holographic base rings. CSS2DObject
// projects a 3D position onto the screen and moves a
// real HTML element there every frame; it does NOT
// touch WebGL rendering at all, which is why this
// sidesteps every glass-shader problem from before.
//
// Two consequences worth knowing:
// 1. Size is controlled entirely by CSS pixels (see
//    .ai-core-sprite-wrap), NOT by 3D scale — a
//    THREE.Object3D's .scale has no effect on a
//    CSS2DObject's on-screen size, only its .position
//    matters. That's also why the old pulse animation
//    (aiCore.scale.setScalar) is gone below; the pulse
//    is now done in animate.js via CSS transform on
//    the <img> instead.
// 2. The image's near-black background disappears via
//    mix-blend-mode:screen in CSS (see hero3d.css) —
//    black contributes nothing under "screen" blending,
//    so it reads as transparent against the dark hero
//    background with no manual masking needed.
// =========================================

export function createAiCore(scene) {

    const group = new THREE.Group();

    // =====================================
    // Sphere Sprite
    // =====================================

    const wrap = document.createElement("div");
    wrap.className = "ai-core-sprite-wrap";

    const img = document.createElement("img");
    img.className = "ai-core-sprite";
    img.src = "assets/hero3d/ai-core.png";
    img.alt = "";

    wrap.appendChild(img);

    const sprite = new CSS2DObject(wrap);
    sprite.position.set(0, 0, 0);
    group.add(sprite);

    // =====================================
    // Focus Mode — vertical light beam
    // Unchanged from before: this is real WebGL
    // geometry (not part of the sphere image), still
    // driven every frame from animate.js via the
    // "beam" value from aiCoreStates.getCoreState().
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
    // Unchanged — same billboard technique as before.
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

    // spriteImg is what animate.js pulses on each frame — see the
    // "spriteImg" block in the AI Core section of animate.js.
    group.userData = {

        beam,
        spriteImg: img

    };

    scene.add(group);

    return group;

}
