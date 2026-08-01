// ======================================
// CORE
// ======================================

import { createScene } from "./core/scene.js";
import { createCamera } from "./core/camera.js";
import { createRenderer } from "./core/renderer.js";
import { setupResize } from "./core/resize.js";

// ======================================
// WORLD
// ======================================

import { createLights } from "./world/lights.js";

// ======================================
// OBJECTS
// ======================================

import { createAiCore } from "./objects/aiCore.js";
import { createSpheres } from "./objects/projectNode.js";

// ======================================
// INTERACTION
// ======================================

import { createControls } from "./interaction/controls.js";

// ======================================
// EFFECTS
// ======================================

import { createBloom } from "./effects/bloom.js";

// ======================================
// ANIMATION
// ======================================

import { animate } from "./animation/animate.js";

// ======================================
// INIT
// ======================================

function init() {

    const canvas = document.getElementById("heroCanvas");

    const scene = createScene();

    const camera = createCamera();

    const renderer = createRenderer(canvas);

    createLights(scene);

    const aiCore = createAiCore(scene);

    const spheres = createSpheres(scene);

    const controls = createControls(
        camera,
        renderer
    );

    const composer = createBloom(
        renderer,
        scene,
        camera
    );

    setupResize(
        camera,
        renderer,
        composer
    );

    animate({

        renderer,
        composer,

        scene,
        camera,

        controls,

        aiCore,

        spheres

    });

}

init();
