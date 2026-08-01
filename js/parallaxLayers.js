// =========================================================
// 3-LAYER SCROLL PARALLAX
//
// Deliberately BIG per-layer speed differences so the effect
// reads clearly even to someone glancing at the page for a
// second. Tune the numbers in LAYERS below — nothing else in
// this file needs to change to adjust the feel.
//
// How the math works:
//   - progress goes 0 -> 1 as you scroll through .parallax-section
//     (0 = section just entered the bottom of the screen,
//      1 = section has fully scrolled past)
//   - each layer moves (progress * its own "distance" px value),
//     so a layer with distance:1200 visibly races past a layer
//     with distance:150 even though they're scrolling together.
// =========================================================

const LAYERS = [

    {
        selector: ".parallax-layer--back",
        distance: 150,   // px of vertical travel — smallest = feels furthest away
        scaleFrom: 1.05,
        scaleTo: 1.15
    },

    {
        selector: ".parallax-layer--mid",
        distance: 550,
        scaleFrom: 1.0,
        scaleTo: 1.08
    },

    {
        selector: ".parallax-layer--front",
        distance: 1100,  // biggest jump — this is what sells "huge movement"
        scaleFrom: 1.0,
        scaleTo: 1.0
    }

];

export function initParallaxLayers(sectionSelector) {

    const section = document.querySelector(sectionSelector);

    if (!section) return;

    const layers = LAYERS

        .map((config) => {

            const el = section.querySelector(config.selector);

            return el ? { ...config, el } : null;

        })

        .filter(Boolean);

    const caption = section.querySelector(".parallax-caption");

    let ticking = false;

    function getProgress() {

        const rect = section.getBoundingClientRect();

        const total = rect.height - window.innerHeight;

        if (total <= 0) return 0;

        // 0 at the top of the section, 1 once it's fully scrolled past
        const raw = -rect.top / total;

        return Math.min(Math.max(raw, 0), 1);

    }

    function apply() {

        ticking = false;

        const progress = getProgress();

        for (let i = 0; i < layers.length; i++) {

            const layer = layers[i];

            const y = -progress * layer.distance;

            const scale =
                layer.scaleFrom +
                (layer.scaleTo - layer.scaleFrom) * progress;

            layer.el.style.transform =
                "translate3d(0, " + y + "px, 0) scale(" + scale + ")";

        }

        if (caption) {

            // Caption fades in over the first third of the scroll,
            // holds, then fades out over the last third — swap this
            // for whatever timing suits your real content.
            const fadeIn = Math.min(progress / 0.25, 1);
            const fadeOut = Math.min(Math.max((progress - 0.7) / 0.3, 0), 1);

            caption.style.opacity = fadeIn - fadeOut;
            caption.style.transform =
                "translateY(" + (1 - fadeIn) * 40 + "px)";

        }

    }

    function onScroll() {

        if (ticking) return;

        ticking = true;

        requestAnimationFrame(apply);

    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    apply();

}
