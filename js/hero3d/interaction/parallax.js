// =========================================
// Tracks mouse position and scroll progress,
// smoothed with time-based exponential easing, so the render
// loop can drive multi-layer parallax without
// every layer reading raw/jittery input.
// =========================================

// Time constants (seconds) — how long it takes the eased value to
// close ~95% of the gap to its target. Using a time constant instead
// of a flat per-frame multiplier keeps this consistent across frame
// rates (60Hz, 120Hz, throttled tabs, etc).
const MOUSE_TAU = 0.12;
const SCROLL_TAU = 0.12;

// The hero-scroll-wrapper is taller than 100vh specifically to give
// scroll room for the parallax to play out while the hero stays
// pinned (position:sticky). But position:sticky releases the hero
// the instant raw scroll passes that height — immediately, with no
// easing — while the parallax values below are smoothed. On a fast
// scroll (trackpad flick, hard mouse-wheel flick) that mismatch is
// visible: sticky lets go before the eased values finish settling,
// and you land on the section below mid-animation.
//
// Fix has two parts:
// 1) Only use the first ANIMATION_PORTION of the scrollable range to
//    drive progress 0 -> 1. The remaining tail is a dead buffer where
//    progress just sits at 1 — real scroll distance for the eased
//    values to settle before the hero actually unpins.
// 2) Ease by elapsed time (SCROLL_TAU) rather than a fixed per-frame
//    factor, so the eased value reliably catches up within a fixed
//    real-world time budget no matter how fast the raw scroll moves.
const ANIMATION_PORTION = 0.55;

export function createParallax({ wrapperEl } = {}) {

    const state = {

        mouseX: 0,
        mouseY: 0,

        targetMouseX: 0,
        targetMouseY: 0,

        scroll: 0,
        targetScroll: 0

    };

    function onPointerMove(event) {

        state.targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;

        state.targetMouseY = (event.clientY / window.innerHeight) * 2 - 1;

    }

    function onScroll() {

        if (!wrapperEl) {

            state.targetScroll = 0;

            return;

        }

        const scrollable = wrapperEl.offsetHeight - window.innerHeight;

        if (scrollable <= 0) {

            state.targetScroll = 0;

            return;

        }

        const rect = wrapperEl.getBoundingClientRect();

        const rawProgress = -rect.top / scrollable;

        // Stretch so progress reaches 1 well before the wrapper's
        // scroll room actually runs out.
        const stretched = rawProgress / ANIMATION_PORTION;

        state.targetScroll = Math.min(Math.max(stretched, 0), 1);

    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    onScroll();

    // dt = seconds since last frame (pass clock.getDelta() in from the
    // render loop). Falls back to a 60fps assumption if omitted so this
    // still behaves sanely if called without an argument.
    function update(dt = 1 / 60) {

        const mouseFactor = 1 - Math.exp(-dt / MOUSE_TAU);
        const scrollFactor = 1 - Math.exp(-dt / SCROLL_TAU);

        state.mouseX += (state.targetMouseX - state.mouseX) * mouseFactor;
        state.mouseY += (state.targetMouseY - state.mouseY) * mouseFactor;

        state.scroll += (state.targetScroll - state.scroll) * scrollFactor;

        return state;

    }

    function dispose() {

        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);

    }

    return { update, dispose };

}
