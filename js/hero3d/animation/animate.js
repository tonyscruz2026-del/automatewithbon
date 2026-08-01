import * as THREE from "three";

import { updateOrbit } from "../objects/orbitSystem.js";

const clock = new THREE.Clock();

const BASE_FOV = 45;

export function animate({

    renderer,
    composer,
    scene,
    camera,
    controls,
    aiCore,
    projectNodes,
    labelRenderer,
    parallax,
    parallaxGroup,
    starsGroup,
    heroContentEl

}) {

    function loop() {

        requestAnimationFrame(loop);

        const t = clock.getElapsedTime();

        const p = parallax
            ? parallax.update()
            : { mouseX: 0, mouseY: 0, scroll: 0 };

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
        // Rotate spheres + per-node depth drift
        //----------------------------------

        if (projectNodes) {

            for (let i = 0; i < projectNodes.length; i++) {

                const sphere = projectNodes[i];

                sphere.rotation.y += 0.01;
                sphere.rotation.x += 0.005;

                const depth = sphere.userData.depth ?? 0.5;

                // Nudged on top of the fresh orbit position computed
                // above, so this never accumulates frame over frame.
                sphere.position.x += p.mouseX * depth;
                sphere.position.y += p.mouseY * depth * -0.5;

            }

        }

        //----------------------------------
        // Parallax layer: core + node cluster
        // (mouse drift + scroll drift/sink)
        //----------------------------------

        if (parallaxGroup) {

            parallaxGroup.position.x = p.mouseX * 0.6;

            parallaxGroup.position.y =
                p.mouseY * -0.3 -
                p.scroll * 3.2;

            parallaxGroup.rotation.y = p.mouseX * 0.06;
            parallaxGroup.rotation.x = p.mouseY * 0.03;

        }

        //----------------------------------
        // Parallax layer: background stars
        // (slowest layer — furthest back)
        //----------------------------------

        if (starsGroup) {

            starsGroup.rotation.y = t * 0.008 + p.mouseX * 0.02;

            starsGroup.position.x = p.mouseX * 0.15;

            starsGroup.position.y =
                p.mouseY * -0.08 -
                p.scroll * 0.8;

        }

        //----------------------------------
        // Parallax layer: hero text
        // (fastest layer — nearest, fades out)
        //----------------------------------

        if (heroContentEl) {

            const drift = p.scroll * 90;
            const fade = Math.max(0, 1 - p.scroll * 1.6);

            heroContentEl.style.transform =
                "translateY(-" + drift + "px)";

            heroContentEl.style.opacity = fade;

        }

        //----------------------------------
        // Subtle camera dolly on scroll
        //----------------------------------

        if (camera) {

            camera.fov = BASE_FOV + p.scroll * 6;

            camera.updateProjectionMatrix();

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

        //----------------------------------
        // Labels
        //----------------------------------

        if (labelRenderer) {

            labelRenderer.render(scene, camera);

        }

    }

    loop();

}
