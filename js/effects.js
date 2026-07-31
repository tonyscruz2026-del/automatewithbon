import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

import { EffectComposer } from "https://unpkg.com/three@0.170.0/examples/jsm/postprocessing/EffectComposer.js";

import { RenderPass } from "https://unpkg.com/three@0.170.0/examples/jsm/postprocessing/RenderPass.js";

import { UnrealBloomPass } from "https://unpkg.com/three@0.170.0/examples/jsm/postprocessing/UnrealBloomPass.js";

export function createEffects(renderer, scene, camera) {

    // ======================================
    // Composer
    // ======================================

    const composer = new EffectComposer(renderer);

    // ======================================
    // Main Render Pass
    // ======================================

    const renderPass = new RenderPass(
        scene,
        camera
    );

    composer.addPass(renderPass);

    // ======================================
    // Bloom Pass
    // ======================================

    const bloomPass = new UnrealBloomPass(

        new THREE.Vector2(

            window.innerWidth,

            window.innerHeight

        ),

        1.6,    // Strength

        0.45,   // Radius

        0.12    // Threshold

    );

    composer.addPass(bloomPass);

    // ======================================
    // Store for Future Updates
    // ======================================

    composer.userData = {

        bloomPass

    };

    return composer;

}
