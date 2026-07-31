import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

export function createGlassMaterial(color = 0x88ccff) {

    return new THREE.MeshPhysicalMaterial({

        color,

        metalness:0.15,

        roughness:0.03,

        transmission:1,

        thickness:2,

        ior:1.45,

        clearcoat:1,

        clearcoatRoughness:0,

        reflectivity:1,

        transparent:true,

        opacity:1

    });

}

export function createCoreMaterial(){

    return new THREE.MeshPhysicalMaterial({

        color:0x00bfff,

        emissive:0x00bfff,

        emissiveIntensity:2,

        transmission:0.8,

        thickness:3,

        roughness:0,

        metalness:0.1,

        clearcoat:1,

        clearcoatRoughness:0

    });

}
