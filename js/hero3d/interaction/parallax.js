// =========================================
// Tracks mouse position and scroll progress,
// smoothed with simple lerping, so the render
// loop can drive multi-layer parallax without
// every layer reading raw/jittery input.
// =========================================

const MOUSE_EASE = 0.06;
const SCROLL_EASE = 0.08;

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

        const progress = -rect.top / scrollable;

        state.targetScroll = Math.min(Math.max(progress, 0), 1);

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
