// =========================================
// Big-movement image parallax layer for the
// hero. Same pattern as atmosphere.js (driven
// by the shared scroll/mouse state from
// interaction/parallax.js), but with much
// larger drift values so the depth separation
// between the 3 images is obvious while
// scrolling, not subtle.
// =========================================

const LAYERS = [

    {
        selector: ".img-par-back",
        driftY: 260,     // slowest — furthest away
        driftX: 40,
        mouseFactor: 15
    },

    {
        selector: ".img-par-mid",
        driftY: 520,
        driftX: -70,
        mouseFactor: 30
    },

    {
        selector: ".img-par-front",
        driftY: 900,     // fastest — nearest, biggest jump
        driftX: 100,
        mouseFactor: 50
    }

];

export function createImageParallax() {

    const layers = LAYERS

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

            layer.el.style.transform =
                "translate(" + x + "px, " + y + "px)";

        }

    }

    return { update };

}
