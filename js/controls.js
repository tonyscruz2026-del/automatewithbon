import { OrbitControls }
from "https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js";

export function createControls(camera,renderer){

    const controls =
    new OrbitControls(
        camera,
        renderer.domElement
    );

    controls.enableDamping=true;
    controls.enablePan=false;

    controls.minDistance=4;
    controls.maxDistance=14;

    return controls;

}
