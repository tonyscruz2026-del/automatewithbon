import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

// =========================================
// One clean line-icon per project, centered
// inside the glass sphere.
// =========================================

const ICONS = {

    "Messenger AI":
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M4 12a8 8 0 1 1 3.2 6.4L4 20l1.3-3.6A7.96 7.96 0 0 1 4 12Z"/>' +
        '<circle cx="8.5" cy="12" r="0.7" fill="currentColor" stroke="none"/>' +
        '<circle cx="12" cy="12" r="0.7" fill="currentColor" stroke="none"/>' +
        '<circle cx="15.5" cy="12" r="0.7" fill="currentColor" stroke="none"/>' +
        '</svg>',

    "CRM Automation":
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
        '<circle cx="9" cy="8" r="3"/>' +
        '<path d="M3.5 20c0-3.3 2.5-6 5.5-6s5.5 2.7 5.5 6"/>' +
        '<circle cx="17.5" cy="7" r="2.1"/>' +
        '<path d="M21 15.2c0-2-1.6-3.4-3.3-3.6"/>' +
        '</svg>',

    "Review Manager":
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M4 11.5a8 8 0 1 1 3.2 6.4L4 19.5l1.3-3.4A7.9 7.9 0 0 1 4 11.5Z"/>' +
        '<path d="M12 8l1.1 2.2 2.4.3-1.75 1.7.4 2.4L12 13.4l-2.15 1.2.4-2.4L8.5 10.5l2.4-.3Z" fill="currentColor" stroke="none"/>' +
        '</svg>',

    "Voice AI":
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
        '<rect x="9" y="3" width="6" height="11" rx="3"/>' +
        '<path d="M5.5 11a6.5 6.5 0 0 0 13 0"/>' +
        '<path d="M12 17.5v3"/>' +
        '<path d="M8.3 20.5h7.4"/>' +
        '</svg>',

    "Workflow Builder":
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
        '<circle cx="12" cy="4.5" r="2"/>' +
        '<circle cx="5" cy="18.5" r="2"/>' +
        '<circle cx="19" cy="18.5" r="2"/>' +
        '<path d="M12 6.5v3.8M12 10.3 5.6 16.7M12 10.3l6.4 6.4"/>' +
        '</svg>'

};

export function createNodeLabels(projectNodes) {

    if (!projectNodes) return;

    projectNodes.forEach((sphere) => {

        const title = (sphere.userData && sphere.userData.title) || "";

        // Icon only — centered inside the glass sphere. No floating
        // text label; the icon alone is enough to read at this size.

        const iconEl = document.createElement("div");

        iconEl.className = "node-icon";
        iconEl.innerHTML = ICONS[title] || "";

        const iconObject = new CSS2DObject(iconEl);

        iconObject.position.set(0, 0, 0);

        sphere.add(iconObject);

    });

}
