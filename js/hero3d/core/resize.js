export function setupResize({

    camera,

    renderer,

    composer

}) {

    function resize() {

        const width = window.innerWidth;
        const height = window.innerHeight;

        // -----------------------------
        // Camera
        // -----------------------------

        camera.aspect = width / height;

        camera.updateProjectionMatrix();

        // -----------------------------
        // Renderer
        // -----------------------------

        renderer.setSize(

            width,

            height

        );

        renderer.setPixelRatio(

            Math.min(window.devicePixelRatio, 2)

        );

        // -----------------------------
        // Post Processing
        // -----------------------------

        if (composer) {

            composer.setSize(

                width,

                height

            );

        }

    }

    window.addEventListener(

        "resize",

        resize

    );

}
