import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

export function createScene() {

    const scene = new THREE.Scene();

    scene.background = new THREE.Color(0x050816);

    scene.fog = new THREE.FogExp2(
        0x050816,
        0.03
    );

    return scene;

}
