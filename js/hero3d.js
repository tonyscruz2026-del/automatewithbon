import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.170.0/examples/jsm/controls/OrbitControls.js";

/* ----------------------------------
   Canvas
----------------------------------- */

const canvas = document.querySelector("#heroCanvas");

/* ----------------------------------
   Scene
----------------------------------- */

const scene = new THREE.Scene();

scene.background = null;

/* ----------------------------------
   Camera
----------------------------------- */

const camera = new THREE.PerspectiveCamera(

45,

window.innerWidth / window.innerHeight,

0.1,

100

);

camera.position.set(0, 1.5, 8);

/* ----------------------------------
   Renderer
----------------------------------- */

const renderer = new THREE.WebGLRenderer({

canvas,

antialias: true,

alpha: true

});

renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

renderer.setSize(

window.innerWidth,

window.innerHeight

);

renderer.outputColorSpace = THREE.SRGBColorSpace;

/* ----------------------------------
   Controls
----------------------------------- */

const controls = new OrbitControls(

camera,

renderer.domElement

);

controls.enableDamping = true;

controls.enablePan = false;

controls.minDistance = 4;

controls.maxDistance = 14;

controls.autoRotate = false;

/* ----------------------------------
   Lights
----------------------------------- */

const ambient = new THREE.AmbientLight(

0xffffff,

1.8

);

scene.add(ambient);

const directional = new THREE.DirectionalLight(

0xffffff,

3

);

directional.position.set(5,8,5);

scene.add(directional);

const blueLight = new THREE.PointLight(

0x4da6ff,

25,

30

);

blueLight.position.set(-4,3,5);

scene.add(blueLight);

/* ----------------------------------
   Material
----------------------------------- */

const sphereMaterial = new THREE.MeshPhysicalMaterial({

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

/* ----------------------------------
   Geometry
----------------------------------- */

const geometry = new THREE.SphereGeometry(

0.55,

64,

64

);

/* ----------------------------------
   AI Spheres
----------------------------------- */

const spheres=[];

const positions=[

[0,0,0],

[-2.2,1.2,0],

[2.2,1.1,0],

[-1.8,-1.4,0],

[1.8,-1.4,0]

];

positions.forEach((pos,index)=>{

const mesh=new THREE.Mesh(

geometry,

sphereMaterial.clone()

);

mesh.position.set(

pos[0],

pos[1],

pos[2]

);

mesh.scale.setScalar(

index===0?1.5:1

);

scene.add(mesh);

spheres.push(mesh);

});

/* ----------------------------------
   Floating Animation
----------------------------------- */

const clock=new THREE.Clock();

function animate(){

requestAnimationFrame(animate);

const t=clock.getElapsedTime();

spheres.forEach((sphere,index)=>{

sphere.position.y +=

Math.sin(

t*1.5+index

)*0.0025;

sphere.rotation.y +=0.003;

sphere.rotation.x +=0.0015;

});

controls.update();

renderer.render(

scene,

camera

);

}

animate();

/* ----------------------------------
   Resize
----------------------------------- */

window.addEventListener(

"resize",

()=>{

camera.aspect=

window.innerWidth/

window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(

window.innerWidth,

window.innerHeight

);

}

);
