import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

import { RGBELoader } from "https://unpkg.com/three@0.170.0/examples/jsm/loaders/RGBELoader.js";

export async function loadEnvironment(scene) {

    const loader = new RGBELoader();

    const texture = await loader.loadAsync(
        "./assets/hdr/studio.hdr"
    );

    texture.mapping = THREE.EquirectangularReflectionMapping;

    scene.environment = texture;

}
