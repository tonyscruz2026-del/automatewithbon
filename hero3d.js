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
import { createProjectNodes } from "./objects/projectNode.js";

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

    //----------------------------------
    // Canvas
    //----------------------------------

    const canvas = document.getElementById("heroCanvas");

    if (!canvas) {

        console.error("heroCanvas not found.");

        return;

    }

    //----------------------------------
    // Core
    //----------------------------------

    const scene = createScene();

    const camera = createCamera();

    const renderer = createRenderer(canvas);

    //----------------------------------
    // World
    //----------------------------------

    createLights(scene);

    //----------------------------------
    // Objects
    //----------------------------------

    const aiCore = createAiCore(scene);

    const projectNodes = createProjectNodes(

        scene,

        aiCore

    );

    //----------------------------------
    // Controls
    //----------------------------------

    const controls = createControls(

        camera,

        renderer

    );

    //----------------------------------
    // Post Processing
    //----------------------------------

    let composer = null;

    try {

        composer = createBloom(

            renderer,

            scene,

            camera

        );

    } catch (err) {

        console.warn("Bloom disabled.", err);

    }

    //----------------------------------
    // Resize
    //----------------------------------

    setupResize(

        camera,

        renderer,

        composer

    );

    //----------------------------------
    // Animation
    //----------------------------------

    animate({

        renderer,

        composer,

        scene,

        camera,

        controls,

        aiCore,

        projectNodes

    });

}

// ======================================
// START
// ======================================

init();
