// =========================================
// Central AI Core — Dynamic States
//
// Ambient auto-cycle through 5 named states,
// each scaling pulse intensity, glow, rotation
// speed, and inner-network activity. Focus Mode
// additionally drives the vertical light beam.
//
// No external trigger — this loops on its own
// on a timer, purely for visual life.
// =========================================

const STATES = [

    { name: "idle",         duration: 4.5, emissive: 1.0, glow: 1.0, rotation: 1.0, network: 1.0, beam: 0 },
    { name: "active",       duration: 3.0, emissive: 1.4, glow: 1.3, rotation: 1.4, network: 1.5, beam: 0 },
    { name: "processing",   duration: 3.0, emissive: 1.6, glow: 1.4, rotation: 2.2, network: 2.2, beam: 0 },
    { name: "highActivity", duration: 2.5, emissive: 2.2, glow: 1.8, rotation: 1.6, network: 2.6, beam: 0 },
    { name: "focus",        duration: 2.5, emissive: 2.8, glow: 2.2, rotation: 0.6, network: 1.2, beam: 1 }

];

const CYCLE_LENGTH = STATES.reduce((sum, s) => sum + s.duration, 0);

// Fraction of a state's own duration, at the end of it, spent
// blending into the next state rather than holding steady.
const BLEND_START = 0.6;

function easeInOutQuad(x) {

    return x < 0.5
        ? 2 * x * x
        : 1 - Math.pow(-2 * x + 2, 2) / 2;

}

function lerp(a, b, t) {

    return a + (b - a) * t;

}

// Returns the current blended state parameters for elapsed time t.
// t is expected to be the same continuously-running clock already
// used elsewhere in the animate loop (THREE.Clock's elapsed time),
// so this needs no clock of its own.
export function getCoreState(t) {

    const cycleT = t % CYCLE_LENGTH;

    let elapsed = 0;

    for (let i = 0; i < STATES.length; i++) {

        const state = STATES[i];
        const next = STATES[(i + 1) % STATES.length];

        if (cycleT < elapsed + state.duration) {

            const localT = (cycleT - elapsed) / state.duration;

            if (localT < BLEND_START) {

                return {
                    name: state.name,
                    emissive: state.emissive,
                    glow: state.glow,
                    rotation: state.rotation,
                    network: state.network,
                    beam: state.beam
                };

            }

            const blendT = easeInOutQuad(
                (localT - BLEND_START) / (1 - BLEND_START)
            );

            return {
                name: state.name,
                emissive: lerp(state.emissive, next.emissive, blendT),
                glow: lerp(state.glow, next.glow, blendT),
                rotation: lerp(state.rotation, next.rotation, blendT),
                network: lerp(state.network, next.network, blendT),
                beam: lerp(state.beam, next.beam, blendT)
            };

        }

        elapsed += state.duration;

    }

    // Unreachable in practice (cycleT is always < CYCLE_LENGTH by
    // construction), kept only as a safe fallback.
    return { name: "idle", emissive: 1, glow: 1, rotation: 1, network: 1, beam: 0 };

}
