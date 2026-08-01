import * as THREE from "three";

export function createSpheres(scene) {

    const spheres = [];

    // =====================================
    // Materials
    // =====================================

    const coreMaterial = new THREE.MeshPhysicalMaterial({

        color: 0x3ab8ff,

        emissive: 0x19b5fe,

        emissiveIntensity: 2.5,

        metalness: 0,

        roughness: 0,

        transmission: 1,

        thickness: 1.5,

        transparent: true,

        opacity: 0.95

    });

    const nodeMaterial = new THREE.MeshPhysicalMaterial({

        color: 0x182233,

        emissive: 0x2aa8ff,

        emissiveIntensity: 0.7,

        metalness: 0.2,

        roughness: 0.25,

        transmission: 0.15

    });

    // =====================================
    // AI Core
    // =====================================

    const core = new THREE.Mesh(

        new THREE.SphereGeometry(1.15, 64, 64),

        coreMaterial

    );

    core.userData.isCore = true;

    scene.add(core);

    spheres.push(core);

    // =====================================
    // Glow Shell
    // =====================================

    const glow = new THREE.Mesh(

        new THREE.SphereGeometry(1.45, 64, 64),

        new THREE.MeshBasicMaterial({

            color: 0x19b5fe,

            transparent: true,

            opacity: 0.18,

            side: THREE.DoubleSide

        })

    );

    scene.add(glow);

    core.userData.glow = glow;

    // =====================================
    // Projects
    // =====================================

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

    // =====================================
    // Orbit Nodes
    // =====================================

    projects.forEach((project, index) => {

        const sphere = new THREE.Mesh(

            new THREE.SphereGeometry(0.45, 48, 48),

            nodeMaterial.clone()

        );

        sphere.userData = {

            ...project,

            radius: 3.2,

            speed: 0.25 + index * 0.03,

            offset: index * ((Math.PI * 2) / projects.length),

            isProject: true

        };

        scene.add(sphere);

        spheres.push(sphere);

    });

    // =====================================
    // Initial Orbit Placement
    // =====================================

    for (let i = 1; i < spheres.length; i++) {

        const s = spheres[i];

        const angle = s.userData.offset;

        s.position.set(

            Math.cos(angle) * s.userData.radius,

            0,

            Math.sin(angle) * s.userData.radius

        );

    }

    return spheres;

}
