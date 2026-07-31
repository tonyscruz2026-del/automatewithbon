import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

export function createCamera() {

    const camera = new THREE.PerspectiveCamera(

        45,

        window.innerWidth / window.innerHeight,

        0.1,

        200

    );

    camera.position.set(

        0,

        1.5,

        9

    );

    return camera;

}
