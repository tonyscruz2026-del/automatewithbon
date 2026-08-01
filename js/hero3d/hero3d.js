import { createScene } from "./core/scene.js";
import { createCamera } from "./core/camera.js";
import { createRenderer } from "./core/renderer.js";
import { setupResize } from "./core/resize.js";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";

import { createLights } from "./world/lights.js";

import { createAiCore } from "./objects/aiCore.js";
import { createProjectNodes } from "./objects/projectNode.js";

import { createControls } from "./interaction/controls.js";
import { createRaycaster } from "./interaction/raycaster.js";

import { createInfoPanel } from "./ui/infoPanel.js";
import { createNodeLabels } from "./ui/nodeLabels.js";

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

    const labelLayer = document.getElementById("labelLayer");
    let labelRenderer = null;

    if (labelLayer) {

        labelRenderer = new CSS2DRenderer();

        labelRenderer.setSize(window.innerWidth, window.innerHeight);

        labelRenderer.domElement.style.position = "absolute";
        labelRenderer.domElement.style.top = "0";
        labelRenderer.domElement.style.left = "0";
        labelRenderer.domElement.style.pointerEvents = "none";

        labelLayer.appendChild(labelRenderer.domElement);

        createNodeLabels(projectNodes);

    }

    const controls = createControls(

        camera,

        renderer

    );

    const infoPanel = createInfoPanel(

        document.getElementById("projectPanel")

    );

    const tooltip = document.getElementById("nodeTooltip");

    function positionTooltip(event) {

        if (!tooltip) return;

        tooltip.style.transform =
            "translate(" + (event.clientX + 18) + "px, " + (event.clientY - 12) + "px)";

    }

    createRaycaster(

        camera,

        renderer,

        projectNodes,

        {

            onSelect: (data) => infoPanel.show(data),

            onHover: (data, event) => {

                if (!tooltip) return;

                if (data) {

                    tooltip.textContent = data.title;
                    tooltip.classList.add("is-visible");
                    if (event) positionTooltip(event);

                } else {

                    tooltip.classList.remove("is-visible");

                }

            }

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

        composer,

        labelRenderer

    );

    animate({

        renderer,

        composer,

        scene,

        camera,

        controls,

        aiCore,

        projectNodes,

        labelRenderer

    });

}

init();
