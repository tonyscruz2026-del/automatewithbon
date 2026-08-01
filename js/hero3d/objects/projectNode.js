import * as THREE from "three";

export function createProjectNodes(scene, aiCore) {

    const spheres = [];

    const nodeMaterial = new THREE.MeshPhysicalMaterial({

        color: 0x182233,

        emissive: 0x2aa8ff,

        emissiveIntensity: 0.7,

        metalness: 0.2,

        roughness: 0.25,

        transmission: 0.15

    });

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
