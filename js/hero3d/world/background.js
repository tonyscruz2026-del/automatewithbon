import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

export function createBackground(scene) {

    // Sky
    const sky = new THREE.Mesh(

        new THREE.SphereGeometry(80, 64, 64),

        new THREE.MeshBasicMaterial({

            color: 0x05070d,
            side: THREE.BackSide

        })

    );

    scene.add(sky);

    return {
        sky
    };

}
