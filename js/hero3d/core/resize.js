export function setupResize(camera, renderer, composer) {

    window.addEventListener("resize", () => {

        // ============================
        // Camera
        // ============================

        camera.aspect =
            window.innerWidth / window.innerHeight;

        camera.updateProjectionMatrix();

        // ============================
        // Renderer
        // ============================

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );

        // ============================
        // Composer
        // ============================

        if (composer) {

            composer.setSize(
                window.innerWidth,
                window.innerHeight
            );

        }

    });

}
