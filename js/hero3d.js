import { createScene } from "./scene.js";
import { createCamera } from "./camera.js";
import { createRenderer } from "./renderer.js";
import { createLights } from "./lights.js";
import { createControls } from "./controls.js";
import { createSpheres } from "./spheres.js";
import { animate } from "./animation.js";
import { setupResize } from "./resize.js";

const canvas = document.querySelector("#heroCanvas");

const scene = createScene();
const camera = createCamera();
const renderer = createRenderer(canvas);

createLights(scene);

const controls = createControls(camera, renderer);

const spheres = createSpheres(scene);

animate(
    renderer,
    scene,
    camera,
    controls,
    spheres
);

setupResize(
    camera,
    renderer
);
