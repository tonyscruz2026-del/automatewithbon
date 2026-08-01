import * as THREE from "three";

import { createScene } from "./core/scene.js";
import { createCamera } from "./core/camera.js";
import { createRenderer } from "./core/renderer.js";
import { setupResize } from "./core/resize.js";
import { CSS2DRenderer } from "three/addons/renderers/CSS2DRenderer.js";

import { createLights } from "./world/lights.js";
import { createStars } from "./world/stars.js";

import { createAiCore } from "./objects/aiCore.js";
import { createProjectNodes } from "./objects/projectNode.js";

import { createControls } from "./interaction/controls.js";
import { createRaycaster } from "./interaction/raycaster.js";
import { createParallax } from "./interaction/parallax.js";

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

    const starsGroup = createStars(scene);

    const aiCore = createAiCore(scene);

    const projectNodes = createProjectNodes(

        scene,

        aiCore

    );

    // Group the core + orbiting nodes so the parallax layer can move
    // the whole cluster together, independently from the background
    // stars layer and the hero text layer. Re-adding an object with
    // .add() moves it out of its old parent (the scene) and into this
    // group; since the group starts at the origin with no rotation,
    // everyone's world position is unchanged.
    const parallaxGroup = new THREE.Group();

    parallaxGroup.add(aiCore);

    projectNodes.forEach((node) => parallaxGroup.add(node));

    scene.add(parallaxGroup);

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

    const parallax = createParallax({

        wrapperEl: document.querySelector(".hero-scroll-wrapper")

    });

    const heroContentEl = document.querySelector(".hero-content");

    animate({

        renderer,

        composer,

        scene,

        camera,

        controls,

        aiCore,

        projectNodes,

        labelRenderer,

        parallax,

        parallaxGroup,

        starsGroup,

        heroContentEl

    });

}

init();
