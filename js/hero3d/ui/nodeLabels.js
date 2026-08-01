import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

export function createNodeLabels(projectNodes) {

    if (!projectNodes) return;

    projectNodes.forEach((sphere) => {

        const el = document.createElement("div");

        el.className = "node-label";
        el.textContent = sphere.userData && sphere.userData.title
            ? sphere.userData.title
            : "";

        const label = new CSS2DObject(el);

        // Sits just above the sphere's own local center. Since this is
        // added as a child of the sphere mesh, it inherits the sphere's
        // position every frame (orbit + self-rotation) automatically —
        // no manual per-frame syncing needed.
        label.position.set(0, 0.75, 0);

        sphere.add(label);

    });

}
