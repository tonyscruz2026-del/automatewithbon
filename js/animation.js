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

        // ============================
        // Floating Spheres
        // ============================

        spheres.forEach((sphere, index) => {

            sphere.position.y +=
                Math.sin(t * 1.5 + index) * 0.0025;

            sphere.rotation.y += 0.003;
            sphere.rotation.x += 0.0015;

        });

        // ============================
        // Rotate Particle Field
        // ============================

        if (particles) {

            particles.rotation.y += 0.0004;
            particles.rotation.x += 0.0001;

        }

        // ============================
        // Update Controls
        // ============================

        controls.update();

        // ============================
        // Render
        // ============================

        if (composer) {

            composer.render();

        } else {

            renderer.render(scene, camera);

        }

    }

    loop();

}
