import * as THREE from "three";
import { CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";

// =========================================
// AI Core
//
// HOW THIS WORKS (fused front panel, not matcap):
//
// Earlier attempts got this wrong two different ways:
//   1. CSS2DObject billboard — a flat DOM image glued to the
//      camera. Never moved with the object at all.
//   2. MeshMatcapMaterial — real geometry, but matcap shades a
//      sphere by re-projecting the texture through the sphere's
//      own curvature based on view angle. Our source image already
//      has its own baked-in spherical shading, so matcap distorted
//      it a second time — the "melted glass" warp you saw.
//
// This version instead builds TWO real, fused pieces of geometry:
//
//   - baseSphere — a plain glass-like sphere with real depth,
//     giving genuine volume and correct occlusion from every angle
//     (this is what you see if you rotate all the way around).
//   - frontPanel — a curved cap (a literal slice of a sphere, same
//     radius) fused onto the front of it, with the reference art
//     projected onto it STRAIGHT (an orthographic "looking straight
//     at it" projection, not spherical wrap), so the art itself
//     isn't warped.
//
// Because frontPanel is real geometry parented to the same group as
// baseSphere — not a billboard, not view-space shading — dragging
// the camera around it genuinely rotates the art with the object:
// it foreshortens toward the rim and swings out of view around the
// back like any real 3D surface would.
// =========================================

const CORE_RADIUS = 1.0;
const CAP_ANGLE = Math.PI * 0.47; // slightly under a full hemisphere

function buildFrontPanelGeometry(radius, capAngle) {

    // A polar cap (built around the +Y axis, THREE's default pole)
    // sized just a hair larger than the base sphere so it sits flush
    // on the surface without z-fighting.
    const geometry = new THREE.SphereGeometry(

        radius * 1.003,

        96,

        48,

        0,
        Math.PI * 2,

        0,
        capAngle

    );

    // Re-project the UVs as a straight-on orthographic projection
    // (looking straight down the cap's own axis) instead of THREE's
    // default spherical wrap — this is what keeps the art undistorted
    // instead of getting smeared around the curve a second time.
    const posAttr = geometry.attributes.position;
    const uvAttr = geometry.attributes.uv;

    const rimRadius = radius * Math.sin(capAngle);

    for (let i = 0; i < posAttr.count; i++) {

        const x = posAttr.getX(i);
        const z = posAttr.getZ(i);

        const u = (x / rimRadius) * 0.5 + 0.5;
        const v = (-z / rimRadius) * 0.5 + 0.5;

        uvAttr.setXY(i, u, v);

    }

    uvAttr.needsUpdate = true;

    // Re-orient the cap from facing +Y (its default pole) to facing
    // +Z — toward the camera, which sits at z:8 looking at the origin
    // (see core/camera.js).
    geometry.rotateX(Math.PI / 2);

    return geometry;

}

export function createAiCore(scene) {

    const group = new THREE.Group();

    // =====================================
    // Base sphere — plain glass, real volume/occlusion
    // from every angle, including the back you only see
    // once you've dragged the camera around.
    // =====================================

    const baseGeometry = new THREE.SphereGeometry(CORE_RADIUS, 64, 64);

    const baseMaterial = new THREE.MeshPhysicalMaterial({

        color: 0x11244a,

        transmission: 0.55,
        thickness: 1.2,
        roughness: 0.2,
        ior: 1.3,

        emissive: 0x0c3d7a,
        emissiveIntensity: 0.6,

        transparent: true,
        opacity: 0.95

    });

    const baseSphere = new THREE.Mesh(baseGeometry, baseMaterial);
    group.add(baseSphere);

    // =====================================
    // Front panel — your actual reference art, fused onto
    // the sphere's front as real, undistorted geometry.
    // =====================================

    const panelTexture = new THREE.TextureLoader().load(
        "assets/hero3d/ai-core.png"
    );
    panelTexture.colorSpace = THREE.SRGBColorSpace;

    const panelGeometry = buildFrontPanelGeometry(CORE_RADIUS, CAP_ANGLE);

    const panelMaterial = new THREE.MeshBasicMaterial({

        map: panelTexture,

        transparent: true

    });

    const frontPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    group.add(frontPanel);

    // =====================================
    // Core light — real light living inside the sphere.
    // =====================================

    const coreLight = new THREE.PointLight(0x6fd6ff, 6, 7);
    coreLight.position.set(0, 0, 0);
    group.add(coreLight);

    // =====================================
    // Focus Mode — vertical light beam
    // Unchanged: real WebGL geometry, driven every frame from
    // animate.js via the "beam" value from aiCoreStates.getCoreState().
    // Hidden (scale 0) outside Focus Mode.
    // =====================================

    const beamGeometry = new THREE.CylinderGeometry(

        0.04,
        0.14,
        6,
        24,
        1,
        true

    );

    const beamMaterial = new THREE.MeshBasicMaterial({

        color: 0x9fe6ff,

        transparent: true,

        opacity: 0,

        side: THREE.DoubleSide,

        depthWrite: false

    });

    const beam = new THREE.Mesh(beamGeometry, beamMaterial);

    beam.position.y = 3;
    beam.scale.set(1, 0.0001, 1);

    group.add(beam);

    // =====================================
    // Holographic Base
    // Unchanged — camera-facing CSS billboard rings.
    // =====================================

    const baseEl = document.createElement("div");
    baseEl.className = "holo-base holo-base--core";
    baseEl.innerHTML =
        '<span class="holo-ring holo-ring-1"></span>' +
        '<span class="holo-ring holo-ring-2"></span>' +
        '<span class="holo-ring holo-ring-3"></span>';

    const base = new CSS2DObject(baseEl);
    base.position.set(0, -1.35, 0);
    group.add(base);

    group.userData = {

        beam,
        baseSphere,
        frontPanel,
        coreLight

    };

    scene.add(group);

    return group;

}
