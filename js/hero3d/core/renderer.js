import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

export function createRenderer(canvas) {

    const renderer = new THREE.WebGLRenderer({

        canvas,

        antialias: true,

        alpha: true,

        powerPreference: "high-performance"

    });

    renderer.setSize(

        window.innerWidth,

        window.innerHeight

    );

    renderer.setPixelRatio(

        Math.min(window.devicePixelRatio, 2)

    );

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    renderer.physicallyCorrectLights = true;

    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure = 1;

    renderer.shadowMap.enabled = true;

    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    return renderer;

}
