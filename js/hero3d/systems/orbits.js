export function updateOrbit(spheres, time) {

    spheres.forEach((sphere, index) => {

        if (index === 0) return;

        const radius = sphere.userData.radius;
        const speed = sphere.userData.speed;
        const offset = sphere.userData.offset;

        const angle = time * speed + offset;

        sphere.position.x = Math.cos(angle) * radius;

        sphere.position.z = Math.sin(angle) * radius;

        sphere.position.y =
            Math.sin(time * 2 + offset) * 0.25;

        sphere.lookAt(0, 0, 0);

    });

}
