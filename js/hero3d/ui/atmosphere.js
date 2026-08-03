// =========================================
// Space-cloud / nebula layer sitting on each
// side of the hero. Two depths — a big slow
// "far" pair and a smaller "near" pair — so
// scrolling reads as the clouds drifting out
// of frame at different speeds, not one flat
// background sliding away. Driven each frame
// by the same smoothed mouse/scroll state the
// 3D scene uses (see interaction/parallax.js).
//
// This is one example of an atmosphere layer —
// more shapes/elements can be added to CLOUDS
// below without touching the update logic.
//
// NOTE: baseOpacity values raised (were 0.55/
// 0.5/0.45/0.4) to match the positions/blur fix
// in hero3d.css — at the old low values combined
// with the clouds sitting mostly off-canvas, they
// were essentially invisible against the hero
// background even at full CSS opacity.
// =========================================
const CLOUDS = [
    {
        selector: ".cloud-left-far",
        driftX: -90,
        driftY: -60,
        mouseFactor: 12,
        baseOpacity: 0.85
    },
    {
        selector: ".cloud-right-far",
        driftX: 100,
        driftY: 70,
        mouseFactor: 12,
        baseOpacity: 0.8
    },
    {
        selector: ".cloud-left-near",
        driftX: -170,
        driftY: -30,
        mouseFactor: 26,
        baseOpacity: 0.7
    },
    {
        selector: ".cloud-right-near",
        driftX: 180,
        driftY: 40,
        mouseFactor: 26,
        baseOpacity: 0.65
    }
];
export function createAtmosphere() {
    const layers = CLOUDS
        .map((config) => {
            const el = document.querySelector(config.selector);
            return el ? { ...config, el } : null;
        })
        .filter(Boolean);
    function update(p) {
        for (let i = 0; i < layers.length; i++) {
            const layer = layers[i];
            const x = p.scroll * layer.driftX + p.mouseX * layer.mouseFactor;
            const y = p.scroll * layer.driftY + p.mouseY * layer.mouseFactor;
            const fade = Math.max(0, 1 - p.scroll * 1.3);
            layer.el.style.transform =
                "translate(" + x + "px, " + y + "px)";
            layer.el.style.opacity = layer.baseOpacity * fade;
        }
    }
    return { update };
}
