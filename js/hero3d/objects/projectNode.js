import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

const NODE_RADIUS = 0.52;
const CAP_ANGLE = Math.PI * 0.47; // slightly under a full hemisphere — same technique as aiCore's original fused panel

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
// Front panel geometry — a curved cap (a literal slice of a
// sphere, same radius as the base) with the icon projected onto
// it STRAIGHT (an orthographic "looking straight at it" projection),
// so the icon itself isn't warped the way a spherical UV wrap or a
// matcap material would distort it.
//
// This is the same technique used for the AI core's original visual
// (see the note in aiCore.js's git history) — reproduced here as a
// self-contained helper since aiCore.js no longer needs it after
// switching to a GLB model.
// =========================================

function buildFrontPanelGeometry(radius, capAngle) {

    const geometry = new THREE.SphereGeometry(

        radius * 1.003,

        64,

        32,

        0,
        Math.PI * 2,

        0,
        capAngle

    );

    const posAttr = geometry.attributes.position;
    const uvAttr = geometry.attributes.uv;

    const rimRadius = radius * Math.sin(capAngle);

    for (let i = 0; i < posAttr.count; i++) {

        const x = posAttr.getX(i);
        const z = posAttr.getZ(i);

        const u = (x / rimRadius) * 0.5 + 0.5;
        const v = (-z / rimRadius) * 0.5 + 0.5;

        uvAttr.setXY(i, u, v);

    }

    uvAttr.needsUpdate = true;

    // Re-orient from facing +Y (the cap's default pole) to facing +Z,
    // toward the camera.
    geometry.rotateX(Math.PI / 2);

    return geometry;

}

// =========================================
// Real glass sphere + fused icon panel.
//
// The panel is added as a CHILD of the base sphere (not a sibling,
// unlike the AI core's original setup) specifically so it inherits
// rotation automatically. animate.js already does
// `sphere.rotation.y += 0.01` / `sphere.rotation.x += 0.005` on each
// project node — since frontPanel is now a child of that same sphere,
// it turns with it for free, no extra sync code needed anywhere.
//
// This mesh is also the actual raycast target (see notes below on
// why the old separate invisible hit-target mesh is gone).
// =========================================

function createProjectSphere(imageSrc) {

    const baseGeometry = new THREE.SphereGeometry(NODE_RADIUS, 48, 48);

    const baseMaterial = new THREE.MeshPhysicalMaterial({

        color: 0x11244a,

        transmission: 0.5,
        thickness: 0.8,
        roughness: 0.22,
        ior: 1.3,

        emissive: 0x0c3d7a,
        emissiveIntensity: 0.55,

        transparent: true,
        opacity: 0.95

    });

    const baseSphere = new THREE.Mesh(baseGeometry, baseMaterial);

    const panelTexture = new THREE.TextureLoader().load(imageSrc);
    panelTexture.colorSpace = THREE.SRGBColorSpace;

    const panelGeometry = buildFrontPanelGeometry(NODE_RADIUS, CAP_ANGLE);

    const panelMaterial = new THREE.MeshBasicMaterial({

        map: panelTexture,

        transparent: true

    });

    const frontPanel = new THREE.Mesh(panelGeometry, panelMaterial);

    baseSphere.add(frontPanel);

    return baseSphere;

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

        // The sphere itself is now the real, visible geometry AND the
        // raycast target (raycaster.js calls
        // intersectObjects(projectNodes) non-recursively, so it only
        // ever needed the top-level object in this array to be real
        // geometry — which it now is, instead of the old invisible
        // placeholder mesh with a flat image floating in front of it).
        const node = createProjectSphere(NODE_IMAGES[index % NODE_IMAGES.length]);

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
