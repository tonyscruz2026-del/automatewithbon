import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

const NODE_RADIUS = 0.52;

// One reference-design node icon per project, in the same order as
// the projects array below. Swap these filenames for per-project
// custom art later; for now they're crops from the "Node Sphere
// Variants" reference image.
const NODE_IMAGES = [

    "assets/hero3d/node-lead.png",       // Messenger AI
    "assets/hero3d/node-growth.png",     // CRM Automation
    "assets/hero3d/node-review.png",     // Review Manager
    "assets/hero3d/node-marketing.png",  // Voice AI
    "assets/hero3d/node-booking.png"     // Workflow Builder

];

// =========================================
// Invisible hit-target
//
// raycaster.js does raycaster.intersectObjects(projectNodes) against
// real WebGL geometry — a CSS2DObject (a DOM element) can't be hit
// this way. So each node is still a real THREE.Mesh, just fully
// transparent (opacity 0, but visible: true so THREE.Raycaster
// doesn't skip it). The visible image sprite is attached to this
// mesh as a child, so it inherits the mesh's position automatically
// every frame from orbitSystem.js — no raycaster/orbit code needed
// to change at all.
// =========================================

function createHitTarget() {

    const geometry = new THREE.SphereGeometry(NODE_RADIUS, 24, 24);

    const material = new THREE.MeshBasicMaterial({

        transparent: true,
        opacity: 0,
        depthWrite: false

    });

    return new THREE.Mesh(geometry, material);

}

// =========================================
// Image sprite — same billboard technique as
// the AI core (see aiCore.js for the full
// explanation of how CSS2DObject + mix-blend-
// mode:screen works together).
// =========================================

function createSprite(imageSrc) {

    const wrap = document.createElement("div");
    wrap.className = "node-sprite-wrap";

    const img = document.createElement("img");
    img.className = "node-sprite";
    img.src = imageSrc;
    img.alt = "";

    wrap.appendChild(img);

    const sprite = new CSS2DObject(wrap);
    sprite.position.set(0, 0, 0);

    return sprite;

}

// =========================================
// Holographic base — unchanged from before.
// =========================================

function createHoloBase() {

    const baseEl = document.createElement("div");
    baseEl.className = "holo-base holo-base--node";
    baseEl.innerHTML =
        '<span class="holo-ring holo-ring-1"></span>' +
        '<span class="holo-ring holo-ring-2"></span>';

    const base = new CSS2DObject(baseEl);
    base.position.set(0, -NODE_RADIUS * 1.35, 0);

    return base;

}

export function createProjectNodes(scene, aiCore) {

    const spheres = [];

    const projects = [

        {
            title: "Messenger AI",
            description: "GPT powered Messenger automation",
            url: "projects/messenger.html"
        },

        {
            title: "CRM Automation",
            description: "AI powered customer management",
            url: "projects/crm.html"
        },

        {
            title: "Review Manager",
            description: "Google Review automation",
            url: "projects/reviews.html"
        },

        {
            title: "Voice AI",
            description: "AI phone assistant",
            url: "projects/voice.html"
        },

        {
            title: "Workflow Builder",
            description: "Business workflow automation",
            url: "projects/workflows.html"
        }

    ];

    projects.forEach((project, index) => {

        const node = createHitTarget();

        node.add(createSprite(NODE_IMAGES[index % NODE_IMAGES.length]));
        node.add(createHoloBase());

        node.userData = {

            ...project,

            radius: 3.2,

            speed: 0.25 + index * 0.03,

            offset: index * ((Math.PI * 2) / projects.length),

            isProject: true,

            // Used by the parallax layer to give each node a slightly
            // different amount of mouse-driven drift, so the cluster
            // reads as several depths instead of one flat plane.
            depth: 0.35 + index * 0.1

        };

        scene.add(node);

        spheres.push(node);

    });

    const centerX = aiCore ? aiCore.position.x : 0;
    const centerY = aiCore ? aiCore.position.y : 0;
    const centerZ = aiCore ? aiCore.position.z : 0;

    for (let i = 0; i < spheres.length; i++) {

        const s = spheres[i];

        const angle = s.userData.offset;

        s.position.set(

            centerX + Math.cos(angle) * s.userData.radius,

            centerY,

            centerZ + Math.sin(angle) * s.userData.radius

        );

    }

    return spheres;

}
