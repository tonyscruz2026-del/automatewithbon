import * as THREE from "three";

import { updateOrbit } from "../objects/orbitSystem.js";

const clock = new THREE.Clock();

export function animate({

    renderer,
    composer,
    scene,
    camera,
    controls,
    aiCore,
    projectNodes

}) {

    function loop() {

        requestAnimationFrame(loop);

        const t = clock.getElapsedTime();

        //----------------------------------
        // AI Core (shell / inner / glow)
        //----------------------------------

        if (aiCore) {

            const pulse = 1 + Math.sin(t * 3) * 0.05;

            aiCore.scale.setScalar(pulse);

            aiCore.rotation.y += 0.003;
            aiCore.rotation.x += 0.001;

            const parts = aiCore.userData || {};

            if (parts.glow) {

                parts.glow.scale.setScalar(

                    1.05 + Math.sin(t * 3) * 0.08

                );

                parts.glow.material.opacity =

                    0.12 +

                    Math.sin(t * 3) * 0.05;

            }

            if (parts.inner && parts.inner.material.emissiveIntensity !== undefined) {

                parts.inner.material.emissiveIntensity =

                    5 +

                    Math.sin(t * 3) * 1.2;

            }

        }

        //----------------------------------
        // Orbit System
        //----------------------------------

        updateOrbit(projectNodes, aiCore, t);

        //----------------------------------
        // Rotate Project Spheres
        //----------------------------------

        if (projectNodes) {

            for (let i = 0; i < projectNodes.length; i++) {

                const sphere = projectNodes[i];

                sphere.rotation.y += 0.01;
                sphere.rotation.x += 0.005;

            }

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
