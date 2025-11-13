
/**
 * AnimationManager.js
 * Centralized animation manager to prevent multiple concurrent animations
 * Fixes Bug #1: Animation glitches caused by multiple animation loops
 */

export class AnimationManager {
    constructor() {
        this.currentAnimation = null;
    }

    /**
     * Start a new animation, stopping any existing one
     */
    start(animation) {
        this.stop();
        this.currentAnimation = animation;
        if (this.currentAnimation) {
            this.currentAnimation.play();
        }
    }

    /**
     * Stop the current animation
     */
    stop() {
        if (this.currentAnimation) {
            this.currentAnimation.pause();
            this.currentAnimation = null;
        }
    }

    /**
     * Pause the current animation
     */
    pause() {
        if (this.currentAnimation) {
            this.currentAnimation.pause();
        }
    }

    /**
     * Resume the current animation
     */
    resume() {
        if (this.currentAnimation) {
            this.currentAnimation.play();
        }
    }

    /**
     * Reset the current animation
     */
    reset() {
        if (this.currentAnimation) {
            this.currentAnimation.reset();
        }
    }

    /**
     * Step forward in current animation
     */
    stepForward(ms = 500) {
        if (this.currentAnimation) {
            this.currentAnimation.stepForward(ms);
        }
    }

    /**
     * Step backward in current animation
     */
    stepBackward(ms = 500) {
        if (this.currentAnimation) {
            this.currentAnimation.stepBackward(ms);
        }
    }

    /**
     * Set speed of current animation
     */
    setSpeed(speed) {
        if (this.currentAnimation) {
            this.currentAnimation.setSpeed(speed);
        }
    }

    /**
     * Check if an animation is currently playing
     */
    isPlaying() {
        return this.currentAnimation && !this.currentAnimation.isPaused;
    }
}
