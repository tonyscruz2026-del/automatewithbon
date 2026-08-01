export function updateOrbit(spheres, time) {

    if (!spheres || spheres.length < 2) return;

    for (let i = 1; i < spheres.length; i++) {

        const sphere = spheres[i];

        const radius = sphere.userData.radius ?? 3;
        const speed = sphere.userData.speed ?? 0.3;
        const offset = sphere.userData.offset ?? 0;

        const angle = time * speed + offset;

        sphere.position.x = Math.cos(angle) * radius;

        sphere.position.z = Math.sin(angle) * radius;

        sphere.position.y = Math.sin(time * 2 + offset) * 0.25;

        sphere.lookAt(0, 0, 0);

    }

}
