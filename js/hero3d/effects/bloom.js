import * as THREE from "three";

import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";

import { RenderPass } from "three/addons/postprocessing/RenderPass.js";

import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

export function createBloom(renderer, scene, camera) {

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
