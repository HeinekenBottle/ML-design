/**
 * main.js
 * Main application controller
 * Fixes Bugs #2 (Reset), #3 (Next Step), #4 (Canvas), #6 (Play/Pause)
 */

import { AnimationManager } from './AnimationManager.js';
import { GraphGenerator } from './GraphGenerator.js';
import { GraphBasics } from './lessons/GraphBasics.js';
import { MessagePassing } from './lessons/MessagePassing.js';

class GNNEducationalApp {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.animationManager = new AnimationManager();
        this.graphGenerator = new GraphGenerator();
        this.currentLesson = null;
        this.currentLessonId = 1;
        this.lessons = {};
    }

    /**
     * Initialize the application
     */
    init() {
        this.setupCanvas();
        this.setupLessons();
        this.setupEventListeners();
        this.loadLesson(1); // Start with Lesson 1
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
        
        console.log('GNN Educational Interface initialized successfully!');
    }

    /**
     * Setup canvas with proper scaling (Fixes Bug #4)
     */
    setupCanvas() {
        this.canvas = document.getElementById('canvas');
        if (!this.canvas) {
            console.error('Canvas element not found!');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
    }

    /**
     * Resize canvas with proper DPR scaling
     */
    resizeCanvas() {
        if (!this.canvas) return;
        
        // Get device pixel ratio
        const dpr = window.devicePixelRatio || 1;
        
        // Get display size
        const rect = this.canvas.getBoundingClientRect();
        
        // Set actual size in memory (scaled for retina)
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        // Set display size (CSS pixels)
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        // Store logical size for drawing
        this.canvas.logicalWidth = rect.width;
        this.canvas.logicalHeight = rect.height;
        
        console.log(`Canvas resized: ${rect.width}x${rect.height} (DPR: ${dpr})`);
    }

    /**
     * Initialize lesson modules
     */
    setupLessons() {
        this.lessons = {
            1: new GraphBasics(this.canvas, this.graphGenerator),
            2: new MessagePassing(this.canvas, this.graphGenerator)
        };
    }

    /**
     * Load a specific lesson
     */
    loadLesson(lessonId) {
        // Stop current animation (Fixes Bug #1)
        this.animationManager.stop();
        
        // Destroy current lesson if exists
        if (this.currentLesson) {
            this.currentLesson.destroy();
        }
        
        this.currentLessonId = lessonId;
        this.currentLesson = this.lessons[lessonId];
        
        if (!this.currentLesson) {
            console.error(`Lesson ${lessonId} not found!`);
            return;
        }
        
        // Initialize lesson based on type
        let timeline;
        if (lessonId === 1) {
            // Graph Basics
            const graphType = document.getElementById('graphType')?.value || 'ring';
            const nodeCount = parseInt(document.getElementById('nodeCountSlider')?.value || 8);
            timeline = this.currentLesson.init(graphType, nodeCount);
        } else if (lessonId === 2) {
            // Message Passing
            const nodeCount = parseInt(document.getElementById('nodeCountSlider')?.value || 6);
            timeline = this.currentLesson.init(nodeCount);
        }
        
        // Register timeline with animation manager
        this.animationManager.start(timeline);
        
        // Update UI
        this.updateLessonUI(lessonId);
        this.updatePlayPauseButton(false);
        
        console.log(`Loaded Lesson ${lessonId}`);
    }

    /**
     * Update UI for current lesson
     */
    updateLessonUI(lessonId) {
        // Update lesson title
        const titles = {
            1: 'Lesson 1: Graph Basics',
            2: 'Lesson 2: Message Passing'
        };
        
        const titleEl = document.getElementById('lessonTitle');
        if (titleEl) {
            titleEl.textContent = titles[lessonId] || 'GNN Education';
        }
        
        // Update lesson buttons active state
        document.querySelectorAll('.lesson-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lesson == lessonId);
        });
    }

    /**
     * Setup event listeners for controls (Fixes Bugs #2, #3, #6)
     */
    setupEventListeners() {
        // Play/Pause button (Fixes Bug #6)
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => this.handlePlayPause());
        }
        
        // Reset button (Fixes Bug #2)
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.handleReset());
        }
        
        // Next Step button (Fixes Bug #3)
        const nextStepBtn = document.getElementById('nextStepBtn');
        if (nextStepBtn) {
            nextStepBtn.addEventListener('click', () => this.handleNextStep());
        }
        
        // Previous Step button
        const prevStepBtn = document.getElementById('prevStepBtn');
        if (prevStepBtn) {
            prevStepBtn.addEventListener('click', () => this.handlePrevStep());
        }
        
        // Speed controls
        document.querySelectorAll('.speed-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const speed = parseFloat(e.target.dataset.speed);
                this.handleSpeedChange(speed);
                
                // Update active state
                document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
        
        // Lesson selection buttons
        document.querySelectorAll('.lesson-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lessonId = parseInt(e.target.dataset.lesson);
                this.loadLesson(lessonId);
            });
        });
        
        // Graph type selector (Lesson 1 only)
        const graphTypeSelect = document.getElementById('graphType');
        if (graphTypeSelect) {
            graphTypeSelect.addEventListener('change', () => {
                if (this.currentLessonId === 1) {
                    this.loadLesson(1);
                }
            });
        }
        
        // Node count slider
        const nodeCountSlider = document.getElementById('nodeCountSlider');
        if (nodeCountSlider) {
            nodeCountSlider.addEventListener('change', () => {
                this.loadLesson(this.currentLessonId);
            });
            
            // Update slider value display
            nodeCountSlider.addEventListener('input', (e) => {
                const valueDisplay = document.getElementById('nodeCountValue');
                if (valueDisplay) {
                    valueDisplay.textContent = e.target.value;
                }
            });
        }
    }

    /**
     * Handle Play/Pause button (Fixes Bug #6)
     */
    handlePlayPause() {
        if (this.animationManager.isPlaying()) {
            this.animationManager.pause();
            this.updatePlayPauseButton(false);
        } else {
            this.animationManager.resume();
            this.updatePlayPauseButton(true);
        }
    }

    /**
     * Update Play/Pause button text
     */
    updatePlayPauseButton(isPlaying) {
        const btn = document.getElementById('playPauseBtn');
        if (btn) {
            btn.innerHTML = isPlaying 
                ? '<span class="icon">⏸</span> Pause' 
                : '<span class="icon">▶</span> Play';
        }
    }

    /**
     * Handle Reset button (Fixes Bug #2)
     */
    handleReset() {
        // Stop animation
        this.animationManager.stop();
        
        // Reload current lesson
        this.loadLesson(this.currentLessonId);
        
        console.log('Animation reset');
    }

    /**
     * Handle Next Step button (Fixes Bug #3)
     */
    handleNextStep() {
        // Pause animation
        this.animationManager.pause();
        this.updatePlayPauseButton(false);
        
        // Step forward 500ms
        this.animationManager.stepForward(500);
        
        console.log('Stepped forward');
    }

    /**
     * Handle Previous Step button
     */
    handlePrevStep() {
        // Pause animation
        this.animationManager.pause();
        this.updatePlayPauseButton(false);
        
        // Step backward 500ms
        this.animationManager.stepBackward(500);
        
        console.log('Stepped backward');
    }

    /**
     * Handle speed change
     */
    handleSpeedChange(speed) {
        this.animationManager.setSpeed(speed);
        console.log(`Speed set to ${speed}x`);
    }

    /**
     * Handle window resize
     */
    handleResize() {
        this.resizeCanvas();
        
        // Redraw current frame
        if (this.currentLesson && this.currentLesson.timeline) {
            const timeline = this.currentLesson.timeline;
            const phase = timeline.getCurrentPhase();
            const progress = timeline.getPhaseProgress();
            this.currentLesson.render(phase, progress);
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new GNNEducationalApp();
    app.init();
    
    // Expose to window for debugging
    window.gnnApp = app;
});
