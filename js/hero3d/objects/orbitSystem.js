// ======================================
// ORBIT SYSTEM
// ======================================

export function updateOrbit(projectNodes, aiCore, time) {

    if (!projectNodes || projectNodes.length === 0) return;
    if (!aiCore) return;

    projectNodes.forEach((node, index) => {

        const radius = node.userData.radius ?? 3;

        const speed = node.userData.speed ?? 0.4;

        const offset = node.userData.offset ?? 0;

        const angle = time * speed + offset;

        node.position.x =
            aiCore.position.x +
            Math.cos(angle) * radius;

        node.position.z =
            aiCore.position.z +
            Math.sin(angle) * radius;

        node.position.y =
            aiCore.position.y +
            Math.sin(time * 2 + index) * 0.25;

    });

}
