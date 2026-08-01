import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const NODE_RADIUS = 0.52;
const CAP_ANGLE = Math.PI * 0.47; // slightly under a full hemisphere — same technique as the icon panel below

const GLB_PATH = "assets/hero3d/ai_sphere.glb";

// aiCore.js authors its model at CORE_RADIUS (1.0) with its own
// GLB_SCALE (currently 1.15). This ratio just reproduces the same
// relative sizing for nodes. If the sphere itself looks too big/small
// once loaded, this is the number to tune.
const CORE_RADIUS_REFERENCE = 1.0;
const CORE_GLB_SCALE_REFERENCE = 1.15;
const NODE_GLB_SCALE =
    CORE_GLB_SCALE_REFERENCE * (NODE_RADIUS / CORE_RADIUS_REFERENCE);

const NODE_IMAGES = [

    "assets/hero3d/node-lead.png",       // Messenger AI
    "assets/hero3d/node-growth.png",     // CRM Automation
    "assets/hero3d/node-review.png",     // Review Manager
    "assets/hero3d/node-marketing.png",  // Voice AI
    "assets/hero3d/node-booking.png"     // Workflow Builder

];

let sharedGltfPromise = null;

function loadSharedCoreModel() {

    if (sharedGltfPromise) return sharedGltfPromise;

    const loader = new GLTFLoader();

    sharedGltfPromise = new Promise((resolve, reject) => {

        loader.load(GLB_PATH, resolve, undefined, reject);

    });

    return sharedGltfPromise;

}

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
// Icon panel — now takes the RADIUS as a parameter instead of always
// assuming NODE_RADIUS, so it can be sized to match whatever the
// model's actual measured bounding sphere turns out to be.
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

function createIconPanel(imageSrc, radius) {

    const panelTexture = new THREE.TextureLoader().load(imageSrc);
    panelTexture.colorSpace = THREE.SRGBColorSpace;

    const panelGeometry = buildFrontPanelGeometry(radius, CAP_ANGLE);

    const panelMaterial = new THREE.MeshBasicMaterial({

        map: panelTexture,

        transparent: true

    });

    return new THREE.Mesh(panelGeometry, panelMaterial);

}

// =========================================
// Model + icon, fused together correctly.
//
// THE FIX: previously the icon panel was built up front assuming the
// GLB model sits centered at the node's local origin with radius
// NODE_RADIUS — but a loaded model almost always has its own internal
// pivot/offset baked in from however it was exported (Blender, etc.),
// so that assumption was wrong, which is why the icon was floating
// beside the sphere instead of sitting flush on its face.
//
// Now: wait for the model to actually load, measure its REAL bounding
// sphere (new THREE.Box3().setFromObject(model).getBoundingSphere()),
// then build the icon panel to match that measured radius, and
// position it at that measured center. The panel is also parented
// directly to the model (not the outer node) so it automatically
// inherits whatever that internal offset is.
// =========================================

function attachModelAndIcon(node, imageSrc) {

    loadSharedCoreModel()
        .then((gltf) => {

            const model = gltf.scene.clone(true);
            model.scale.setScalar(NODE_GLB_SCALE);

            node.add(model);

            const box = new THREE.Box3().setFromObject(model);
            const boundingSphere = new THREE.Sphere();
            box.getBoundingSphere(boundingSphere);

            const panel = createIconPanel(imageSrc, boundingSphere.radius);
            panel.position.copy(boundingSphere.center);

            // Parented to the model itself, not the outer node — so
            // if the model has any internal rotation/offset, the icon
            // rides along with it automatically.
            model.add(panel);

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

            const fallbackSphere = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
            node.add(fallbackSphere);

            // The fallback IS the plain procedural sphere centered at
            // origin, so the original NODE_RADIUS assumption is
            // correct here.
            const panel = createIconPanel(imageSrc, NODE_RADIUS);
            fallbackSphere.add(panel);

        });

}

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

        attachModelAndIcon(node, NODE_IMAGES[index % NODE_IMAGES.length]);
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
