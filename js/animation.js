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

        // =====================================
        // AI Sphere Animation
        // =====================================

        spheres.forEach((sphere, index) => {

            // Floating Animation
            sphere.position.y =
                sphere.userData.baseY +
                Math.sin(t * 1.5 + index) * 0.15;

            // Gentle Rotation
            sphere.rotation.y += 0.003;
            sphere.rotation.x += 0.0015;

            // ============================
            // AI Core Animation
            // ============================

            if (index === 0) {

                // Smooth pulse
                const pulse =
                    1 + Math.sin(t * 3) * 0.05;

                sphere.scale.setScalar(
                    1.7 * pulse
                );

                // Animate glow shell
                if (sphere.userData.glow) {

                    sphere.userData.glow.scale.setScalar(

                        1.05 +
                        Math.sin(t * 3) * 0.08

                    );

                    sphere.userData.glow.material.opacity =

                        0.08 +

                        Math.sin(t * 3) * 0.05;

                }

                // Animate emissive intensity
                if (sphere.material.emissiveIntensity !== undefined) {

                    sphere.material.emissiveIntensity =

                        2.2 +

                        Math.sin(t * 3) * 0.8;

                }

            }

        });

        // =====================================
        // Particle Animation
        // =====================================

        if (particles) {

            particles.rotation.y += 0.0005;

            particles.rotation.x += 0.00015;

        }

        // =====================================
        // Controls
        // =====================================

        controls.update();

        // =====================================
        // Render
        // =====================================

        if (composer) {

            composer.render();

        } else {

            renderer.render(
                scene,
                camera
            );

        }

    }

    loop();

}
