import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

export function createGlassMaterial(){

    return new THREE.MeshPhysicalMaterial({

        color:0x88ccff,

        metalness:.2,

        roughness:.08,

        transmission:1,

        thickness:1.5,

        ior:1.45,

        clearcoat:1,

        clearcoatRoughness:0,

        reflectivity:1

    });

}
