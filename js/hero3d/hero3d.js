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
