export function setupResize(

    camera,

    renderer,

    composer,

    labelRenderer

){

    window.addEventListener("resize",()=>{

        camera.aspect=

            window.innerWidth/

            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(

            window.innerWidth,

            window.innerHeight

        );

        if (composer) {

            composer.setSize(

                window.innerWidth,

                window.innerHeight

            );

        }

        if (labelRenderer) {

            labelRenderer.setSize(

                window.innerWidth,

                window.innerHeight

            );

        }

    });

}
