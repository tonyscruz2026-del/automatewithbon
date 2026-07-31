import { EffectComposer } from "https://cdn.jsdelivr.net/npm/three@0.170/examples/jsm/postprocessing/EffectComposer.js";

import { RenderPass } from "https://cdn.jsdelivr.net/npm/three@0.170/examples/jsm/postprocessing/RenderPass.js";

import { UnrealBloomPass } from "https://cdn.jsdelivr.net/npm/three@0.170/examples/jsm/postprocessing/UnrealBloomPass.js";

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170/build/three.module.js";

export function createEffects(renderer, scene, camera) {

    const composer = new EffectComposer(renderer);

    composer.addPass(
        new RenderPass(scene, camera)
    );

    const bloom = new UnrealBloomPass(
        new THREE.Vector2(
            window.innerWidth,
            window.innerHeight
        ),
        0.6,
        0.4,
        0.85
    );

    composer.addPass(bloom);

    return composer;
}
