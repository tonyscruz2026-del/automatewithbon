import { OrbitControls }
from "three/addons/controls/OrbitControls.js";

export function createControls(

    camera,

    renderer

){

    const controls =
        new OrbitControls(

            camera,

            renderer.domElement

        );

    controls.enableDamping = true;

    controls.enablePan = false;

    controls.enableZoom = true;

    controls.autoRotate = false;

    controls.minDistance = 4;

    controls.maxDistance = 12;

    controls.maxPolarAngle = Math.PI * 0.8;

    return controls;

}
