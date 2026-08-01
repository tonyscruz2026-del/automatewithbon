import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const NODE_RADIUS = 0.52;
const CAP_ANGLE = Math.PI * 0.47; // slightly under a full hemisphere — same technique as the icon panel below

const GLB_PATH = "assets/hero3d/ai_sphere.glb";

// aiCore.js authors its model at CORE_RADIUS (1.0) with its own
// GLB_SCALE (currently 1.15). We don't import that file's internals
// here, so this ratio just reproduces the same relative sizing: the
// model scaled down proportionally to NODE_RADIUS instead of the
// core's full size. If it looks off once loaded, this is the number
// to tune (independently of aiCore.js's own GLB_SCALE).
const CORE_RADIUS_REFERENCE = 1.0;
const CORE_GLB_SCALE_REFERENCE = 1.15;
const NODE_GLB_SCALE =
    CORE_GLB_SCALE_REFERENCE * (NODE_RADIUS / CORE_RADIUS_REFERENCE);

// One reference-design node icon per project, in the same order as
// the projects array below.
const NODE_IMAGES = [

    "assets/hero3d/node-lead.png",       // Messenger AI
    "assets/hero3d/node-growth.png",     // CRM Automation
    "assets/hero3d/node-review.png",     // Review Manager
    "assets/hero3d/node-marketing.png",  // Voice AI
    "assets/hero3d/node-booking.png"     // Workflow Builder

];

// =========================================
// Shared GLB load — loaded once, then cloned per node, instead of
// re-fetching the same file five times.
// =========================================

let sharedGltfPromise = null;

function loadSharedCoreModel() {

    if (sharedGltfPromise) return sharedGltfPromise;

    const loader = new GLTFLoader();

    sharedGltfPromise = new Promise((resolve, reject) => {

        loader.load(GLB_PATH, resolve, undefined, reject);

    });

    return sharedGltfPromise;

}

// =========================================
// Invisible hit-target — kept as a real Mesh (not a Group) so
// raycaster.js's intersectObjects(projectNodes) keeps working exactly
// as before, regardless of whether it's called with the recursive
// flag or not. The GLB clone and icon panel are added as children on
// top of this for the visible/clickable-looking part.
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
// Cloned AI-core model, scaled down to node size. Async — if it
// hasn't finished loading yet, the node is still fully clickable
// (the invisible hit-target above already exists), it just doesn't
// have its glass-sphere visual until this resolves.
// =========================================

function attachClonedCoreModel(node) {

    loadSharedCoreModel()
        .then((gltf) => {

            const model = gltf.scene.clone(true);
            model.scale.setScalar(NODE_GLB_SCALE);

            node.add(model);

        })
        .catch((err) => {

            console.warn(
                "Node GLB failed to load, falling back to a plain glass sphere.",
                err
            );

            const fallbackGeometry = new THREE.SphereGeometry(NODE_RADIUS, 32, 32);

            const fallbackMaterial = new THREE.MeshPhysicalMaterial({
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

            node.add(new THREE.Mesh(fallbackGeometry, fallbackMaterial));

        });

}

// =========================================
// Icon panel — the same fused, undistorted-projection cap technique
// as before, giving each node its own project icon regardless of
// which model the glass sphere itself is using underneath.
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

    geometry.rotateX(Math.PI / 2);

    return geometry;

}

function createIconPanel(imageSrc) {

    const panelTexture = new THREE.TextureLoader().load(imageSrc);
    panelTexture.colorSpace = THREE.SRGBColorSpace;

    const panelGeometry = buildFrontPanelGeometry(NODE_RADIUS, CAP_ANGLE);

    const panelMaterial = new THREE.MeshBasicMaterial({

        map: panelTexture,

        transparent: true

    });

    return new THREE.Mesh(panelGeometry, panelMaterial);

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

        attachClonedCoreModel(node);
        node.add(createIconPanel(NODE_IMAGES[index % NODE_IMAGES.length]));
        node.add(createHoloBase());

        node.userData = {

            ...project,

            radius: 3.2,

            speed: 0.25 + index * 0.03,

            offset: index * ((Math.PI * 2) / projects.length),

            isProject: true,

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
