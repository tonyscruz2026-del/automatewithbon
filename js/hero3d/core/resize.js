export function setupResize(

    camera,

    renderer,

    composer

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

        composer.setSize(

            window.innerWidth,

            window.innerHeight

        );

    });

}
