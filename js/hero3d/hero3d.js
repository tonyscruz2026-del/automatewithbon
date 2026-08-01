import { createScene } from "./core/scene.js";
import { createCamera } from "./core/camera.js";
import { createRenderer } from "./core/renderer.js";
import { setupResize } from "./core/resize.js";

import { createLights } from "./world/lights.js";

import { createAiCore } from "./objects/aiCore.js";
import { createProjectNodes } from "./objects/projectNode.js";

import { createControls } from "./interaction/controls.js";
import { createRaycaster } from "./interaction/raycaster.js";

import { createInfoPanel } from "./ui/infoPanel.js";

import { createBloom } from "./effects/bloom.js";

import { animate } from "./animation/animate.js";

function init() {

    const canvas = document.getElementById("heroCanvas");

    if (!canvas) {

        console.error("heroCanvas not found.");

        return;

    }

    const scene = createScene();

    const camera = createCamera();

    const renderer = createRenderer(canvas);

    createLights(scene);

    const aiCore = createAiCore(scene);

    const projectNodes = createProjectNodes(

        scene,

        aiCore

    );

    const controls = createControls(

        camera,

        renderer

    );

    const infoPanel = createInfoPanel(

        document.getElementById("projectPanel")

    );

    createRaycaster(

        camera,

        renderer,

        projectNodes,

        {

            onSelect: (data) => infoPanel.show(data)

        }

    );

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

        projectNodes

    });

}

init();
