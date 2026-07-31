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
// CANVAS
// ======================================

const canvas = document.querySelector("#heroCanvas");

if (!canvas) {
    throw new Error("Canvas #heroCanvas not found.");
}

// ======================================
// SCENE
// ======================================

const scene = createScene();

// ======================================
// CAMERA
// ======================================

const camera = createCamera();

// ======================================
// RENDERER
// ======================================

const renderer = createRenderer(canvas);

// ======================================
// LIGHTS
// ======================================

createLights(scene);

// ======================================
// BACKGROUND
// ======================================

createBackground(scene);

// ======================================
// PARTICLES
// ======================================

const particles = createParticles(scene);

// ======================================
// SPHERES
// ======================================

const spheres = createSpheres(scene);

// ======================================
// CONTROLS
// ======================================

const controls = createControls(
    camera,
    renderer
);

// ======================================
// POST PROCESSING
// ======================================

const composer = createEffects(
    renderer,
    scene,
    camera
);

// ======================================
// HDR ENVIRONMENT
// ======================================

loadEnvironment(scene)
    .then(() => {
        console.log("HDR loaded.");
    })
    .catch((err) => {
        console.warn("HDR failed to load:", err);
    });

// ======================================
// WINDOW RESIZE
// ======================================

setupResize(
    camera,
    renderer,
    composer
);

// ======================================
// START ANIMATION
// ======================================

animate({

    renderer,

    composer,

    scene,

    camera,

    controls,

    spheres,

    particles

});
