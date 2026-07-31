// ================================
// IMPORTS
// ================================

import { createScene } from "./scene.js";
import { createCamera } from "./camera.js";
import { createRenderer } from "./renderer.js";
import { createLights } from "./lights.js";
import { createControls } from "./controls.js";
import { createSpheres } from "./spheres.js";
import { createBackground } from "./background.js";
import { createParticles } from "./particles.js";
import { createEffects } from "./effects.js";
import { loadEnvironment } from "./loaders.js";
import { animate } from "./animation.js";
import { setupResize } from "./resize.js";

// ================================
// CANVAS
// ================================

const canvas = document.querySelector("#heroCanvas");

// ================================
// SCENE
// ================================

const scene = createScene();

// ================================
// CAMERA
// ================================

const camera = createCamera();

// ================================
// RENDERER
// ================================

const renderer = createRenderer(canvas);

// ================================
// LIGHTS
// ================================

createLights(scene);

// ================================
// BACKGROUND
// ================================

createBackground(scene);

// ================================
// PARTICLES
// ================================

const particles = createParticles(scene);

// ================================
// SPHERES
// ================================

const spheres = createSpheres(scene);

// ================================
// CONTROLS
// ================================

const controls = createControls(
    camera,
    renderer
);

// ================================
// POST PROCESSING
// ================================

const composer = createEffects(
    renderer,
    scene,
    camera
);

// ================================
// HDR ENVIRONMENT
// ================================

try {

    await loadEnvironment(scene);

} catch (error) {

    console.warn("HDR not loaded yet.");

}

// ================================
// RESIZE
// ================================

setupResize(
    camera,
    renderer,
    composer
);

// ================================
// START ANIMATION
// ================================

animate({

    renderer,

    composer,

    scene,

    camera,

    controls,

    spheres,

    particles

});
