/**
 * main.js
 * Main application controller
 * Fixes Bugs #2 (Reset), #3 (Next Step), #4 (Canvas), #6 (Play/Pause)
 */

import { AnimationManager } from './AnimationManager.js';
import { GraphGenerator } from './GraphGenerator.js';
import { GraphBasics } from './lessons/GraphBasics.js';
import { MessagePassing } from './lessons/MessagePassing.js';
import { GNNArchitectures } from './lessons/GNNArchitectures.js';
import { AggregationFunctions } from './lessons/AggregationFunctions.js';
import { EducationalContent } from './EducationalContent.js';

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
            2: new MessagePassing(this.canvas, this.graphGenerator),
            3: new GNNArchitectures(this.canvas, this.graphGenerator),
            4: new AggregationFunctions(this.canvas, this.graphGenerator)
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
        } else if (lessonId === 3) {
            // GNN Architectures
            const architecture = document.querySelector('.architecture-btn.active')?.dataset.arch || 'GCN';
            const nodeCount = 6;
            timeline = this.currentLesson.init(architecture, nodeCount);
        } else if (lessonId === 4) {
            // Aggregation Functions
            const aggregation = document.querySelector('.aggregation-btn.active')?.dataset.agg || 'mean';
            const nodeCount = 6;
            timeline = this.currentLesson.init(aggregation, nodeCount);
        }

        // Register timeline with animation manager
        this.animationManager.start(timeline);

        // Update UI
        this.updateLessonUI(lessonId);
        this.updatePlayPauseButton(false);
        this.updateEducationalContent(lessonId);
        this.updateControlVisibility(lessonId);

        console.log(`Loaded Lesson ${lessonId}`);
    }

    /**
     * Update UI for current lesson
     */
    updateLessonUI(lessonId) {
        // Update lesson title and subtitle
        const lessonData = {
            1: { title: EducationalContent.lesson1.title, subtitle: EducationalContent.lesson1.subtitle },
            2: { title: EducationalContent.lesson2.title, subtitle: EducationalContent.lesson2.subtitle },
            3: { title: EducationalContent.lesson3.title, subtitle: EducationalContent.lesson3.subtitle },
            4: { title: EducationalContent.lesson4.title, subtitle: EducationalContent.lesson4.subtitle }
        };

        const titleEl = document.getElementById('lessonTitle');
        const subtitleEl = document.getElementById('lessonSubtitle');

        if (titleEl && lessonData[lessonId]) {
            titleEl.textContent = lessonData[lessonId].title;
        }

        if (subtitleEl && lessonData[lessonId]) {
            subtitleEl.textContent = lessonData[lessonId].subtitle;
        }
        
        // Update lesson buttons active state
        document.querySelectorAll('.lesson-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lesson == lessonId);
        });
    }

    /**
     * Update educational content display
     */
    updateEducationalContent(lessonId) {
        const lessonKey = `lesson${lessonId}`;
        const content = EducationalContent[lessonKey];

        if (!content) return;

        // Update learning objectives
        this.displayLearningObjectives(content);

        // Update introduction/explanation
        this.displayIntroduction(content);

        // Update quiz
        this.displayQuiz(content);

        // Update summary
        this.displaySummary(content);
    }

    /**
     * Display learning objectives
     */
    displayLearningObjectives(content) {
        const container = document.getElementById('learningObjectives');
        if (!container) return;

        let html = '<div class="learning-objectives">';
        html += '<h4>🎯 Learning Objectives</h4>';
        html += '<ul>';
        content.learningObjectives.forEach(obj => {
            html += `<li>${obj}</li>`;
        });
        html += '</ul>';
        html += '</div>';
        html += content.introduction;

        container.innerHTML = html;
    }

    /**
     * Display introduction/explanation
     */
    displayIntroduction(content) {
        const container = document.getElementById('phaseExplanation');
        if (!container) return;

        container.innerHTML = content.introduction;
    }

    /**
     * Display quiz
     */
    displayQuiz(content) {
        const container = document.getElementById('quizContent');
        if (!container || !content.quiz) return;

        let html = '<div class="quiz-section">';
        html += '<h3>Test Your Understanding</h3>';

        content.quiz.forEach((q, index) => {
            html += `<div class="quiz-question">`;
            html += `<p><strong>Question ${index + 1}:</strong> ${q.question}</p>`;
            html += `<ul class="quiz-options">`;
            q.options.forEach((option, optIndex) => {
                html += `<li class="quiz-option" data-question="${index}" data-option="${optIndex}">${option}</li>`;
            });
            html += `</ul>`;
            html += `<div class="quiz-explanation" id="explanation-${index}" style="display:none; margin-top:10px; padding:10px; background:rgba(0,217,255,0.1); border-radius:5px;"></div>`;
            html += `</div>`;
        });

        html += '</div>';
        container.innerHTML = html;

        // Add click handlers for quiz options
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const questionIndex = parseInt(e.target.dataset.question);
                const optionIndex = parseInt(e.target.dataset.option);
                const question = content.quiz[questionIndex];

                // Remove previous selections
                document.querySelectorAll(`[data-question="${questionIndex}"]`).forEach(opt => {
                    opt.classList.remove('correct', 'incorrect');
                });

                // Mark correct/incorrect
                if (optionIndex === question.correct) {
                    e.target.classList.add('correct');
                } else {
                    e.target.classList.add('incorrect');
                }

                // Show explanation
                const explanationEl = document.getElementById(`explanation-${questionIndex}`);
                if (explanationEl) {
                    explanationEl.style.display = 'block';
                    explanationEl.innerHTML = `<strong>Explanation:</strong> ${question.explanation}`;
                }
            });
        });
    }

    /**
     * Display summary
     */
    displaySummary(content) {
        const container = document.getElementById('summaryContent');
        if (!container) return;

        container.innerHTML = `<div class="summary-box">${content.summary}</div>`;
    }

    /**
     * Update control visibility based on lesson
     */
    updateControlVisibility(lessonId) {
        const graphControls = document.getElementById('graphControls');
        const architectureControls = document.getElementById('architectureControls');
        const aggregationControls = document.getElementById('aggregationControls');

        // Hide all first
        if (graphControls) graphControls.style.display = 'none';
        if (architectureControls) architectureControls.style.display = 'none';
        if (aggregationControls) aggregationControls.style.display = 'none';

        // Show relevant controls
        if (lessonId === 1 || lessonId === 2) {
            if (graphControls) graphControls.style.display = 'block';
        } else if (lessonId === 3) {
            if (architectureControls) architectureControls.style.display = 'block';
        } else if (lessonId === 4) {
            if (aggregationControls) aggregationControls.style.display = 'block';
        }
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

        // Architecture selector buttons (Lesson 3)
        document.querySelectorAll('.architecture-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.architecture-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                if (this.currentLessonId === 3) {
                    this.loadLesson(3);
                }
            });
        });

        // Aggregation selector buttons (Lesson 4)
        document.querySelectorAll('.aggregation-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.aggregation-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                if (this.currentLessonId === 4) {
                    this.loadLesson(4);
                }
            });
        });

        // Content tabs
        document.querySelectorAll('.content-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;

                // Update active tab
                document.querySelectorAll('.content-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');

                // Show corresponding content
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });

                const contentId = tabName + 'Tab';
                const contentEl = document.getElementById(contentId);
                if (contentEl) {
                    contentEl.classList.add('active');
                }
            });
        });
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
