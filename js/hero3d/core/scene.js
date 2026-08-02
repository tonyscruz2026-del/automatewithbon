import * as THREE from "three";

export function createScene() {

    const scene = new THREE.Scene();

    // No solid scene.background here on purpose — the renderer
    // already has alpha:true, and leaving this unset lets the canvas
    // render transparently so the DOM layers sitting behind it (the
    // image-parallax-layer, and ultimately the body's own #05070d
    // background) show through instead of being covered by an opaque
    // fill every frame.
    scene.background = null;

    return scene;

}
