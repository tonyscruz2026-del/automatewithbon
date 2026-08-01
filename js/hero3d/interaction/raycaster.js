import * as THREE from "three";

const DRAG_THRESHOLD_PX = 6;

export function createRaycaster(camera, renderer, projectNodes, callbacks = {}) {

    const raycaster = new THREE.Raycaster();

    const pointer = new THREE.Vector2();

    let hovered = null;

    let downPos = null;

    function updatePointer(event) {

        const rect = renderer.domElement.getBoundingClientRect();

        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;

        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    }

    function getIntersectedNode() {

        if (!projectNodes || projectNodes.length === 0) return null;

        raycaster.setFromCamera(pointer, camera);

        const hits = raycaster.intersectObjects(projectNodes, false);

        return hits.length ? hits[0].object : null;

    }

    function onPointerMove(event) {

        updatePointer(event);

        const hit = getIntersectedNode();

        if (hit !== hovered) {

            hovered = hit;

            renderer.domElement.style.cursor = hovered ? "pointer" : "";

            if (callbacks.onHover) {

                callbacks.onHover(hovered ? hovered.userData : null);

            }

        }

    }

    function onPointerDown(event) {

        downPos = { x: event.clientX, y: event.clientY };

    }

    function onPointerUp(event) {

        if (!downPos) return;

        const dx = event.clientX - downPos.x;

        const dy = event.clientY - downPos.y;

        const dragDistance = Math.sqrt(dx * dx + dy * dy);

        downPos = null;

        if (dragDistance > DRAG_THRESHOLD_PX) return;

        updatePointer(event);

        const hit = getIntersectedNode();

        if (hit && callbacks.onSelect) {

            callbacks.onSelect(hit.userData);

        }

    }

    const el = renderer.domElement;

    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointerleave", () => {

        hovered = null;

        el.style.cursor = "";

    });

    return {

        dispose() {

            el.removeEventListener("pointermove", onPointerMove);
            el.removeEventListener("pointerdown", onPointerDown);
            el.removeEventListener("pointerup", onPointerUp);

        }

    };

}
