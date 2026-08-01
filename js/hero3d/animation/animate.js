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
        // AI Core (real 3D geometry)
        // group.scale/rotation now genuinely affect the sphere —
        // it's a glass shell + lattice + inner glow, not a flat
        // image, so the pulse/rotation below actually deform and
        // spin real geometry rather than nudging a CSS transform.
        //----------------------------------

        const coreState = getCoreState(t);

        if (aiCore) {

            const parts = aiCore.userData || {};

            const pulse = 1 + Math.sin(t * 3) * 0.04 * coreState.emissive;
            aiCore.scale.setScalar(pulse);

            if (parts.shell) {

                parts.shell.material.emissiveIntensity =
                    0.25 + coreState.emissive * 0.25;

                parts.shell.rotation.y = t * 0.05;

            }

            if (parts.atmosphere) {

                parts.atmosphere.material.uniforms.intensity.value =
                    0.55 + coreState.glow * 0.5;

            }

            if (parts.coreLight) {

                parts.coreLight.intensity =
                    7 + coreState.emissive * 9;

            }

            if (parts.inner) {

                const innerPulse = 1 + Math.sin(t * 4) * 0.15 * coreState.emissive;
                parts.inner.scale.setScalar(innerPulse);

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
