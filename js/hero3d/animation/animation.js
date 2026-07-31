import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

const clock = new THREE.Clock();

export function animate({

    renderer,
    composer,
    scene,
    camera,
    controls,
    spheres,
    particles

}) {

    function loop() {

        requestAnimationFrame(loop);

        const t = clock.getElapsedTime();

        //----------------------------------
        // Center AI Sphere
        //----------------------------------

        const center = spheres[0];

        const pulse = 1 + Math.sin(t * 3) * 0.05;

        center.scale.setScalar(1.7 * pulse);

        center.rotation.y += 0.003;

        if (center.userData.glow) {

            center.userData.glow.scale.setScalar(

                1.05 + Math.sin(t * 3) * 0.08

            );

            center.userData.glow.material.opacity =

                0.08 +

                Math.sin(t * 3) * 0.05;

        }

        if (center.material.emissiveIntensity !== undefined) {

            center.material.emissiveIntensity =

                2.2 +

                Math.sin(t * 3) * 0.8;

        }

        //----------------------------------
        // Orbiting Spheres
        //----------------------------------

        const radius = 3;

        for (let i = 1; i < spheres.length; i++) {

            const sphere = spheres[i];

            const angle =

                t * 0.45 +

                (Math.PI * 2 / (spheres.length - 1)) * (i - 1);

            sphere.position.x =

                center.position.x +

                Math.cos(angle) * radius;

            sphere.position.z =

                center.position.z +

                Math.sin(angle) * radius;

            sphere.position.y =

                center.position.y +

                Math.sin(t * 2 + i) * 0.25;

            sphere.rotation.y += 0.01;

            sphere.rotation.x += 0.005;

        }

        //----------------------------------
        // Particles
        //----------------------------------

        if (particles) {

            particles.rotation.y += 0.00035;
            particles.rotation.x += 0.00008;
            particles.rotation.z += 0.00012;

        }

        //----------------------------------
        // Controls
        //----------------------------------

        controls.update();

        //----------------------------------
        // Render
        //----------------------------------

        if (composer) {

            composer.render();

        } else {

            renderer.render(scene, camera);

        }

    }

    loop();

}
