
/**
 * AnimationTimeline.js
 * Timeline-based animation system that replaces the buggy requestAnimationFrame approach
 * Fixes Bug #1: Animation glitches
 */

export class AnimationTimeline {
    constructor(config) {
        this.duration = config.duration || 9000;       // Total animation duration in ms
        this.phases = config.phases || [];             // Array of animation phases
        this.currentTime = 0;                          // Current playback position
        this.isPaused = true;                          // Playback state
        this.speed = 1.0;                              // Playback speed multiplier
        this.loop = config.loop || false;              // Whether to loop
        this.onUpdate = config.onUpdate;               // Callback for each frame
        this.onComplete = config.onComplete;           // Callback when complete
        this.animationFrameId = null;                  // RAF ID for cleanup
        this.lastTimestamp = null;                     // For delta time calculation
    }

    /**
     * Start or resume animation
     */
    play() {
        if (!this.isPaused) return;
        this.isPaused = false;
        this.lastTimestamp = performance.now();
        this._animate();
    }

    /**
     * Pause animation at current position
     */
    pause() {
        this.isPaused = true;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * Reset animation to beginning
     */
    reset() {
        this.pause();
        this.currentTime = 0;
        this.lastTimestamp = null;
        if (this.onUpdate) {
            this.onUpdate(this.getCurrentPhase(), 0);
        }
    }

    /**
     * Step forward by specified milliseconds
     */
    stepForward(ms = 500) {
        this.currentTime = Math.min(this.currentTime + ms, this.duration);
        if (this.onUpdate) {
            this.onUpdate(this.getCurrentPhase(), this.getPhaseProgress());
        }
    }

    /**
     * Step backward by specified milliseconds
     */
    stepBackward(ms = 500) {
        this.currentTime = Math.max(this.currentTime - ms, 0);
        if (this.onUpdate) {
            this.onUpdate(this.getCurrentPhase(), this.getPhaseProgress());
        }
    }

    /**
     * Set playback speed
     */
    setSpeed(speed) {
        this.speed = Math.max(0.1, Math.min(speed, 5.0)); // Clamp between 0.1x and 5x
    }

    /**
     * Jump to specific time
     */
    seekTo(time) {
        this.currentTime = Math.max(0, Math.min(time, this.duration));
        if (this.onUpdate) {
            this.onUpdate(this.getCurrentPhase(), this.getPhaseProgress());
        }
    }

    /**
     * Get current animation phase
     */
    getCurrentPhase() {
        for (let phase of this.phases) {
            if (this.currentTime >= phase.start && this.currentTime < phase.end) {
                return phase;
            }
        }
        return this.phases[this.phases.length - 1]; // Return last phase if at end
    }

    /**
     * Get progress within current phase (0 to 1)
     */
    getPhaseProgress() {
        const phase = this.getCurrentPhase();
        if (!phase) return 0;
        const phaseTime = this.currentTime - phase.start;
        const phaseDuration = phase.end - phase.start;
        return phaseDuration > 0 ? phaseTime / phaseDuration : 0;
    }

    /**
     * Internal animation loop
     */
    _animate() {
        if (this.isPaused) return;

        const now = performance.now();
        const deltaTime = this.lastTimestamp ? (now - this.lastTimestamp) * this.speed : 0;
        this.lastTimestamp = now;

        this.currentTime += deltaTime;

        // Check if animation is complete
        if (this.currentTime >= this.duration) {
            if (this.loop) {
                this.currentTime = 0;
            } else {
                this.currentTime = this.duration;
                this.pause();
                if (this.onComplete) {
                    this.onComplete();
                }
                return;
            }
        }

        // Update callback
        if (this.onUpdate) {
            this.onUpdate(this.getCurrentPhase(), this.getPhaseProgress());
        }

        // Continue animation
        this.animationFrameId = requestAnimationFrame(() => this._animate());
    }

    /**
     * Cleanup resources
     */
    destroy() {
        this.pause();
        this.onUpdate = null;
        this.onComplete = null;
    }
}
