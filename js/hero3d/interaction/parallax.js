// =========================================
// Tracks mouse position and scroll progress,
// smoothed with simple lerping, so the render
// loop can drive multi-layer parallax without
// every layer reading raw/jittery input.
// =========================================

const MOUSE_EASE = 0.06;
const SCROLL_EASE = 0.08;

// The hero-scroll-wrapper is taller than 100vh specifically to give
// scroll room for the parallax to play out while the hero stays
// pinned (position:sticky). But position:sticky releases the hero
// the instant raw scroll passes that height — immediately, with no
// easing — while the parallax values below are smoothed with lerp
// and take a few frames to catch up. On a fast scroll that mismatch
// is visible: the page starts moving before the clouds/images finish
// drifting.
//
// Fix: only use the first ANIMATION_PORTION of the scrollable range
// to drive progress 0 -> 1. The remaining tail is a dead buffer where
// progress just sits at 1 — plenty of real scroll distance for the
// eased values to fully settle before the hero actually unpins.
const ANIMATION_PORTION = 0.7;

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

    function update() {

        state.mouseX += (state.targetMouseX - state.mouseX) * MOUSE_EASE;
        state.mouseY += (state.targetMouseY - state.mouseY) * MOUSE_EASE;

        state.scroll += (state.targetScroll - state.scroll) * SCROLL_EASE;

        return state;

    }

    function dispose() {

        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);

    }

    return { update, dispose };

}
