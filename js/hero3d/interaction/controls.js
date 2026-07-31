import { OrbitControls } from "https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js";

export function createControls(camera, renderer) {

    const controls = new OrbitControls(
        camera,
        renderer.domElement
    );

    // Smooth movement
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Allow rotation
    controls.enableRotate = true;

    // Allow zoom
    controls.enableZoom = true;

    // Disable panning
    controls.enablePan = false;

    // Zoom limits
    controls.minDistance = 4;
    controls.maxDistance = 14;

    // Rotate around the center sphere
    controls.target.set(0, 0, 0);

    // Optional limits
    controls.minPolarAngle = Math.PI * 0.2;
    controls.maxPolarAngle = Math.PI * 0.8;

    controls.update();

    return controls;
}
