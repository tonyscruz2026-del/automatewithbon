import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

import {

createGlassMaterial,

createCoreMaterial

} from "./materials.js";

export function createSpheres(scene){

const geometry=new THREE.SphereGeometry(

0.55,

64,

64

);

const positions=[

[0,0,0],

[-2.2,1.2,0],

[2.2,1.2,0],

[-1.8,-1.5,0],

[1.8,-1.5,0]

];

const spheres=[];

positions.forEach((position,index)=>{

const material=

index===0

?createCoreMaterial()

:createGlassMaterial();

const sphere=new THREE.Mesh(

geometry,

material

);

sphere.position.set(

...position

);

if(index===0){

sphere.scale.setScalar(1.7);

}else{

sphere.scale.setScalar(1);

}

sphere.userData.baseX=position[0];

sphere.userData.baseY=position[1];

sphere.userData.baseZ=position[2];

sphere.userData.index=index;

scene.add(sphere);

spheres.push(sphere);

});

return spheres;

}
