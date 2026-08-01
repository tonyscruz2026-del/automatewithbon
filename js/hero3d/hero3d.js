// ======================================
// IMPORTS
// ======================================

import { createScene } from "./core/scene.js";
import { createCamera } from "./core/camera.js";
import { createRenderer } from "./core/renderer.js";
import { setupResize } from "./core/resize.js";

import { createLights } from "./world/lights.js";
import { createBackground } from "./world/background.js";
import { createParticles } from "./world/particles.js";
import { loadEnvironment } from "./world/loaders.js";

import { createSpheres } from "./objects/spheres.js";

import { createControls } from "./controls/controls.js";

import { createEffects } from "./effects/effects.js";

import { animate } from "./animation/animation.js";

// ======================================
// MAIN
// ======================================

async function init() {

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

    createBackground(scene);

    const particles = createParticles(scene);

    //----------------------------------
    // HDR Environment
    //----------------------------------

    try {

        await loadEnvironment(scene);

    } catch (err) {

        console.warn("HDR skipped:", err);

    }

    //----------------------------------
    // AI Core + Project Nodes
    //----------------------------------

    const spheres = createSpheres(scene);

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

        composer = createEffects(

            renderer,

            scene,

            camera

        );

    } catch (err) {

        console.warn("Post-processing disabled.");

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

        spheres,

        particles

    });

}

// ======================================
// START
// ======================================

init();
