import { RGBELoader } from "https://cdn.jsdelivr.net/npm/three@0.170/examples/jsm/loaders/RGBELoader.js";

export async function loadEnvironment(scene) {

    const loader = new RGBELoader();

    const texture = await loader.loadAsync(
        "./assets/hdr/studio.hdr"
    );

    texture.mapping = THREE.EquirectangularReflectionMapping;

    scene.environment = texture;

}
