import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

const clock = new THREE.Clock();

export function animate(
    renderer,
    scene,
    camera,
    controls,
    spheres
){

    function loop(){

        requestAnimationFrame(loop);

        const t =
        clock.getElapsedTime();

        spheres.forEach((sphere,index)=>{

            sphere.position.y +=
                Math.sin(
                    t*1.5+index
                )*0.0025;

            sphere.rotation.y+=0.003;
            sphere.rotation.x+=0.0015;

        });

        controls.update();

        renderer.render(
            scene,
            camera
        );

    }

    loop();

}
