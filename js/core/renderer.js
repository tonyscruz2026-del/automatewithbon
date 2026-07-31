import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

export function createRenderer(canvas){

    const renderer = new THREE.WebGLRenderer({

        canvas,
        antialias:true,
        alpha:true

    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio,2)
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.outputColorSpace =
        THREE.SRGBColorSpace;

    return renderer;

}
