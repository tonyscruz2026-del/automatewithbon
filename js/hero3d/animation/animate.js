import * as THREE from "three";

import { updateOrbit } from "../objects/orbitSystem.js";
import { getCoreState } from "../objects/aiCoreStates.js";
import { updateAiCoreNetwork } from "../objects/aiCoreNetwork.js";

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
    heroContentEl,
    atmosphere

}) {

    function loop() {

        requestAnimationFrame(loop);

        const t = clock.getElapsedTime();

        const p = parallax
            ? parallax.update()
            : { mouseX: 0, mouseY: 0, scroll: 0 };

        //----------------------------------
        // AI Core (shell / inner / glow)
        // Base pulse/rotation is the original
        // ambient motion; the dynamic-state
        // multipliers from aiCoreStates.js
        // scale on top of it, so Idle still
        // looks like the original calm core
        // and the other states build up from
        // there rather than replacing it.
        //----------------------------------

        const coreState = getCoreState(t);

        if (aiCore) {

            const pulse = 1 + Math.sin(t * 3) * 0.05 * coreState.emissive;

            aiCore.scale.setScalar(pulse);

            aiCore.rotation.y += 0.003 * coreState.rotation;
            aiCore.rotation.x += 0.001 * coreState.rotation;

            const parts = aiCore.userData || {};

            if (parts.glow) {

                parts.glow.scale.setScalar(
                    1.05 + Math.sin(t * 3) * 0.08 * coreState.glow
                );

                parts.glow.material.opacity =
                    (0.12 +
                    Math.sin(t * 3) * 0.05) * coreState.glow;

            }

            if (parts.inner && parts.inner.material.emissiveIntensity !== undefined) {

                parts.inner.material.emissiveIntensity =
                    (5 +
                    Math.sin(t * 3) * 1.2) * coreState.emissive;

            }

            if (parts.network) {

                updateAiCoreNetwork(parts.network, t, coreState.network);

            }

            if (parts.beam) {

                // Vertical scale grows with the beam value; opacity
                // fades in alongside it so it never pops in at full
                // strength. Kept at a floor of 0.0001 rather than 0
                // since a zero Y-scale on a cylinder can produce
                // degenerate geometry warnings in some browsers.
                const beamScale = Math.max(0.0001, coreState.beam);

                parts.beam.scale.y = beamScale;
                parts.beam.material.opacity = coreState.beam * 0.5;

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
        // Parallax layer: space-cloud atmosphere
        // (moves out of frame as you scroll)
        //----------------------------------

        if (atmosphere) {

            atmosphere.update(p);

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
