import { createScene } from "./core/scene.js";
import { createCamera } from "./core/camera.js";
import { createRenderer } from "./core/renderer.js";

import { createLights } from "./world/lights.js";

import { createControls } from "./interaction/controls.js";

const canvas =
document.querySelector("#heroCanvas");

const scene =
createScene();

const camera =
createCamera();

const renderer =
createRenderer(canvas);

createLights(scene);

const controls =
createControls(

    camera,

    renderer

);

function animate(){

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(

        scene,

        camera

    );

}

animate();
