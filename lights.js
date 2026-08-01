import * as THREE from "three";

export function createLights(scene){

    const ambient = new THREE.AmbientLight(

        0xffffff,

        2

    );

    scene.add(ambient);

    const key = new THREE.DirectionalLight(

        0x7cc7ff,

        5

    );

    key.position.set(

        5,

        8,

        5

    );

    scene.add(key);

    const rim = new THREE.PointLight(

        0x00bfff,

        80,

        50

    );

    rim.position.set(

        -5,

        3,

        -5

    );

    scene.add(rim);

}
