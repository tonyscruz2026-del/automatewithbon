import * as THREE from "three";

const NODE_RADIUS = 0.52;

// =========================================
// Glass shell material — transparent + clearcoat
// gives a hollow orb look without the render
// cost of true transmission (kept cheap for
// low-power laptops running this locally).
// =========================================

function createShellMaterial() {

    return new THREE.MeshPhysicalMaterial({

        color: 0x0d1b30,

        transparent: true,

        opacity: 0.5,

        roughness: 0.15,

        metalness: 0.05,

        clearcoat: 1,

        clearcoatRoughness: 0.08,

        emissive: 0x1c7dff,

        emissiveIntensity: 0.35,

        side: THREE.DoubleSide

    });

}

// =========================================
// Soft outer rim glow (additive, back-facing)
// =========================================

function createGlow() {

    const geometry = new THREE.SphereGeometry(
        NODE_RADIUS * 1.22,
        32,
        32
    );

    const material = new THREE.MeshBasicMaterial({

        color: 0x5fd4ff,

        transparent: true,

        opacity: 0.16,

        side: THREE.BackSide,

        depthWrite: false

    });

    return new THREE.Mesh(geometry, material);

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

        const sphere = new THREE.Mesh(

            new THREE.SphereGeometry(NODE_RADIUS, 48, 48),

            createShellMaterial()

        );

        sphere.add(createGlow());

        sphere.userData = {

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

        scene.add(sphere);

        spheres.push(sphere);

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
