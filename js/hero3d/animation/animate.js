import * as THREE from "https://unpkg.com/three@0.170.0/build/three.module.js";

import { updateOrbit } from "../systems/orbit.js";

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
        // Center AI Core
        //----------------------------------

        const center = spheres[0];

        if (center) {

            const pulse = 1 + Math.sin(t * 3) * 0.05;

            center.scale.setScalar(1.7 * pulse);

            center.rotation.y += 0.003;
            center.rotation.x += 0.001;

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

        }

        //----------------------------------
        // Orbit System
        //----------------------------------

        updateOrbit(spheres, t);

        //----------------------------------
        // Rotate Project Spheres
        //----------------------------------

        for (let i = 1; i < spheres.length; i++) {

            const sphere = spheres[i];

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

        if (controls) {

            controls.update();

        }

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
