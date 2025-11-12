# GNN Educational Interface: Animation Technical Specifications

**Document Version:** 1.0  
**Date:** 2025-11-12  
**Purpose:** Detailed technical specifications for implementing animations

---

## 1. Animation Framework Architecture

### Core Animation Engine

```javascript
/**
 * Timeline-based animation system that replaces the buggy requestAnimationFrame approach
 */
class AnimationTimeline {
    constructor(config) {
        this.duration = config.duration;           // Total animation duration in ms
        this.phases = config.phases;               // Array of animation phases
        this.currentTime = 0;                      // Current playback position
        this.isPaused = true;                      // Playback state
        this.speed = 1.0;                          // Playback speed multiplier
        this.loop = config.loop || false;          // Whether to loop
        this.onUpdate = config.onUpdate;           // Callback for each frame
        this.onComplete = config.onComplete;       // Callback when complete
        this.animationFrameId = null;              // RAF ID for cleanup
        this.lastTimestamp = null;                 // For delta time calculation
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
```

---

## 2. Message Passing Animation Implementation

### Configuration

```javascript
const messagePassingConfig = {
    duration: 9000, // 9 seconds total
    loop: false,
    phases: [
        {
            name: 'preparation',
            start: 0,
            end: 2000,
            description: 'Highlighting source nodes and showing initial features'
        },
        {
            name: 'sending',
            start: 2000,
            end: 5000,
            description: 'Messages traveling along edges'
        },
        {
            name: 'aggregation',
            start: 5000,
            end: 7000,
            description: 'Collecting and combining messages'
        },
        {
            name: 'update',
            start: 7000,
            end: 9000,
            description: 'Updating node features'
        }
    ],
    onUpdate: (phase, progress) => {
        renderMessagePassing(phase, progress);
    },
    onComplete: () => {
        showCompletionMessage();
    }
};

const messagePassingTimeline = new AnimationTimeline(messagePassingConfig);
```

### Rendering Function

```javascript
/**
 * Render message passing animation based on current phase and progress
 */
function renderMessagePassing(phase, progress) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply scaling for retina displays
    ctx.save();
    ctx.scale(2, 2);

    switch (phase.name) {
        case 'preparation':
            renderPreparationPhase(ctx, progress);
            break;
        case 'sending':
            renderSendingPhase(ctx, progress);
            break;
        case 'aggregation':
            renderAggregationPhase(ctx, progress);
            break;
        case 'update':
            renderUpdatePhase(ctx, progress);
            break;
    }

    ctx.restore();

    // Update UI elements
    updatePhaseIndicator(phase.name, progress);
    updateStepDescription(phase.description);
}

/**
 * Phase 1: Preparation - Highlight source nodes
 */
function renderPreparationPhase(ctx, progress) {
    // Draw all edges (static)
    graphEdges.forEach(edge => {
        drawEdge(ctx, edge, { opacity: 0.3, color: '#00d9ff' });
    });

    // Draw nodes with highlighting animation
    graphNodes.forEach((node, index) => {
        const isSource = index !== 0; // All nodes except center are sources
        
        if (isSource) {
            // Pulsing highlight for source nodes
            const pulseIntensity = 0.5 + 0.5 * Math.sin(progress * Math.PI * 2);
            drawNode(ctx, node, {
                color: '#00ff88',
                glowIntensity: pulseIntensity,
                showFeatures: true
            });
        } else {
            // Target node (center) - static
            drawNode(ctx, node, {
                color: '#ff8800',
                glowIntensity: 0,
                showFeatures: true
            });
        }
    });

    // Show feature vectors
    graphNodes.forEach((node, index) => {
        if (index !== 0) {
            drawFeatureVector(ctx, node, progress);
        }
    });
}

/**
 * Phase 2: Sending - Messages traveling along edges
 */
function renderSendingPhase(ctx, progress) {
    // Draw all edges
    graphEdges.forEach(edge => {
        const isActive = edge.to === 0; // Edges going to center node
        drawEdge(ctx, edge, {
            opacity: isActive ? 0.8 : 0.2,
            color: isActive ? '#ff66d9' : '#00d9ff',
            animated: isActive
        });
    });

    // Draw nodes
    graphNodes.forEach((node, index) => {
        drawNode(ctx, node, {
            color: index === 0 ? '#ff8800' : '#00ff88',
            glowIntensity: 0,
            showFeatures: false
        });
    });

    // Draw message particles
    graphEdges.forEach(edge => {
        if (edge.to === 0) {
            const fromNode = graphNodes[edge.from];
            const toNode = graphNodes[edge.to];
            
            // Calculate particle position along edge
            const x = fromNode.x + (toNode.x - fromNode.x) * progress;
            const y = fromNode.y + (toNode.y - fromNode.y) * progress;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#ff66d9';
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw message content label
            if (progress > 0.3 && progress < 0.7) {
                ctx.fillStyle = '#fff';
                ctx.font = '12px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(`h${edge.from}`, x, y - 15);
            }
        }
    });

    // Update statistics
    const messagesSent = Math.floor(progress * graphEdges.filter(e => e.to === 0).length);
    updateStats({
        "Messages Sent": messagesSent,
        "Progress": `${Math.floor(progress * 100)}%`
    });
}

/**
 * Phase 3: Aggregation - Collecting messages at target node
 */
function renderAggregationPhase(ctx, progress) {
    // Draw edges (fading)
    graphEdges.forEach(edge => {
        drawEdge(ctx, edge, {
            opacity: 0.3 * (1 - progress),
            color: '#00d9ff'
        });
    });

    // Draw source nodes (fading)
    graphNodes.forEach((node, index) => {
        if (index !== 0) {
            drawNode(ctx, node, {
                color: '#00ff88',
                opacity: 0.5 * (1 - progress),
                showFeatures: false
            });
        }
    });

    // Draw target node with collection animation
    const targetNode = graphNodes[0];
    const neighbors = graphEdges.filter(e => e.to === 0);
    
    // Spiral animation for incoming messages
    neighbors.forEach((edge, i) => {
        const angle = (i / neighbors.length) * Math.PI * 2 + progress * Math.PI * 4;
        const radius = 50 * (1 - progress);
        const x = targetNode.x + Math.cos(angle) * radius;
        const y = targetNode.y + Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.arc(x, y, 6 * (1 - progress), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 102, 217, ${1 - progress})`;
        ctx.fill();
    });

    // Draw target node with growing glow
    drawNode(ctx, targetNode, {
        color: '#ff8800',
        glowIntensity: progress,
        scale: 1 + progress * 0.3,
        showFeatures: false
    });

    // Show aggregation formula
    if (progress > 0.5) {
        const opacity = (progress - 0.5) * 2;
        drawAggregationFormula(ctx, targetNode, opacity);
    }
}

/**
 * Phase 4: Update - Node features updated
 */
function renderUpdatePhase(ctx, progress) {
    // Draw all edges (static)
    graphEdges.forEach(edge => {
        drawEdge(ctx, edge, { opacity: 0.3, color: '#00d9ff' });
    });

    // Draw all nodes
    graphNodes.forEach((node, index) => {
        const isTarget = index === 0;
        drawNode(ctx, node, {
            color: isTarget ? '#b366ff' : '#00d9ff',
            glowIntensity: isTarget ? (1 - progress) : 0,
            showFeatures: true
        });
    });

    // Animate feature value change on target node
    const targetNode = graphNodes[0];
    const oldValue = targetNode.oldValue || targetNode.value;
    const newValue = calculateAggregatedValue(targetNode);
    const currentValue = oldValue + (newValue - oldValue) * progress;
    
    // Draw value with animation
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(currentValue.toFixed(1), targetNode.x, targetNode.y);

    // Show before/after comparison
    if (progress > 0.7) {
        const opacity = (progress - 0.7) / 0.3;
        drawBeforeAfterComparison(ctx, oldValue, newValue, opacity);
    }
}
```

---

## 3. Helper Drawing Functions

```javascript
/**
 * Draw a node with various visual options
 */
function drawNode(ctx, node, options = {}) {
    const {
        color = '#00d9ff',
        opacity = 1.0,
        glowIntensity = 0,
        scale = 1.0,
        showFeatures = false
    } = options;

    const radius = 20 * scale;

    // Draw glow effect
    if (glowIntensity > 0) {
        const gradient = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, radius * 2
        );
        gradient.addColorStop(0, `${color}${Math.floor(glowIntensity * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    }

    // Draw node circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.globalAlpha = opacity;
    ctx.fill();
    ctx.globalAlpha = 1.0;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw node label
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.value.toFixed(1), node.x, node.y);

    // Draw feature vector if requested
    if (showFeatures && node.features) {
        drawFeatureVector(ctx, node, 1.0);
    }
}

/**
 * Draw an edge with various visual options
 */
function drawEdge(ctx, edge, options = {}) {
    const {
        color = '#00d9ff',
        opacity = 0.3,
        width = 2,
        animated = false
    } = options;

    const fromNode = graphNodes[edge.from];
    const toNode = graphNodes[edge.to];

    ctx.beginPath();
    ctx.moveTo(fromNode.x, fromNode.y);
    ctx.lineTo(toNode.x, toNode.y);
    ctx.strokeStyle = `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
    ctx.lineWidth = width;
    
    if (animated) {
        ctx.setLineDash([5, 5]);
        ctx.lineDashOffset = -Date.now() / 50;
    } else {
        ctx.setLineDash([]);
    }
    
    ctx.stroke();
    ctx.setLineDash([]);
}

/**
 * Draw feature vector as colored bars
 */
function drawFeatureVector(ctx, node, opacity = 1.0) {
    if (!node.features || node.features.length === 0) return;

    const barWidth = 8;
    const barSpacing = 2;
    const maxBarHeight = 30;
    const startX = node.x + 30;
    const startY = node.y - (node.features.length * (barWidth + barSpacing)) / 2;

    node.features.forEach((value, i) => {
        const normalizedValue = Math.max(0, Math.min(1, value / 10)); // Normalize to 0-1
        const barHeight = normalizedValue * maxBarHeight;
        const y = startY + i * (barWidth + barSpacing);

        // Draw bar
        ctx.fillStyle = `hsl(${value * 36}, 70%, 60%)`;
        ctx.globalAlpha = opacity;
        ctx.fillRect(startX, y, barHeight, barWidth);
        ctx.globalAlpha = 1.0;

        // Draw value label
        ctx.fillStyle = '#fff';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(value.toFixed(1), startX + barHeight + 3, y + barWidth / 2 + 3);
    });
}
```

---

## 4. UI Control Components

### Animation Control Panel

```javascript
/**
 * Create animation control panel HTML
 */
function createAnimationControls() {
    return `
        <div class="animation-controls">
            <div class="control-row">
                <button id="playPauseBtn" class="btn btn-primary">
                    <span class="icon">▶</span> Play
                </button>
                <button id="resetBtn" class="btn">
                    <span class="icon">↺</span> Reset
                </button>
                <button id="stepBackBtn" class="btn">
                    <span class="icon">⏮</span> Step Back
                </button>
                <button id="stepForwardBtn" class="btn">
                    <span class="icon">⏭</span> Step Forward
                </button>
            </div>
            
            <div class="control-row">
                <label>Speed:</label>
                <button class="btn btn-small" onclick="setAnimationSpeed(0.5)">0.5x</button>
                <button class="btn btn-small active" onclick="setAnimationSpeed(1.0)">1x</button>
                <button class="btn btn-small" onclick="setAnimationSpeed(2.0)">2x</button>
            </div>
            
            <div class="timeline-container">
                <div class="timeline-track">
                    <div class="timeline-progress" id="timelineProgress"></div>
                    <div class="timeline-handle" id="timelineHandle"></div>
                </div>
                <div class="timeline-labels">
                    <span>0s</span>
                    <span>Preparation</span>
                    <span>Sending</span>
                    <span>Aggregation</span>
                    <span>Update</span>
                    <span>9s</span>
                </div>
            </div>
            
            <div class="phase-indicator" id="phaseIndicator">
                <strong>Current Phase:</strong> <span id="currentPhase">Preparation</span>
                <div class="phase-progress-bar">
                    <div class="phase-progress-fill" id="phaseProgress"></div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Attach event listeners to animation controls
 */
function setupAnimationControls(timeline) {
    const playPauseBtn = document.getElementById('playPauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const stepBackBtn = document.getElementById('stepBackBtn');
    const stepForwardBtn = document.getElementById('stepForwardBtn');
    const timelineHandle = document.getElementById('timelineHandle');

    playPauseBtn.addEventListener('click', () => {
        if (timeline.isPaused) {
            timeline.play();
            playPauseBtn.innerHTML = '<span class="icon">⏸</span> Pause';
        } else {
            timeline.pause();
            playPauseBtn.innerHTML = '<span class="icon">▶</span> Play';
        }
    });

    resetBtn.addEventListener('click', () => {
        timeline.reset();
        playPauseBtn.innerHTML = '<span class="icon">▶</span> Play';
    });

    stepBackBtn.addEventListener('click', () => {
        timeline.stepBackward(500);
    });

    stepForwardBtn.addEventListener('click', () => {
        timeline.stepForward(500);
    });

    // Timeline scrubbing
    const timelineTrack = document.querySelector('.timeline-track');
    let isDragging = false;

    timelineHandle.addEventListener('mousedown', () => {
        isDragging = true;
        timeline.pause();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const rect = timelineTrack.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const progress = x / rect.width;
        timeline.seekTo(progress * timeline.duration);
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

/**
 * Update UI to reflect current animation state
 */
function updatePhaseIndicator(phaseName, progress) {
    document.getElementById('currentPhase').textContent = 
        phaseName.charAt(0).toUpperCase() + phaseName.slice(1);
    document.getElementById('phaseProgress').style.width = `${progress * 100}%`;
    
    const timelineProgress = document.getElementById('timelineProgress');
    const timelineHandle = document.getElementById('timelineHandle');
    const totalProgress = (messagePassingTimeline.currentTime / messagePassingTimeline.duration) * 100;
    
    timelineProgress.style.width = `${totalProgress}%`;
    timelineHandle.style.left = `${totalProgress}%`;
}
```

---

## 5. Performance Optimization

### Canvas Rendering Optimization

```javascript
/**
 * Use off-screen canvas for static elements
 */
class LayeredCanvas {
    constructor(mainCanvas) {
        this.mainCanvas = mainCanvas;
        this.mainCtx = mainCanvas.getContext('2d');
        
        // Create off-screen canvas for static background
        this.bgCanvas = document.createElement('canvas');
        this.bgCanvas.width = mainCanvas.width;
        this.bgCanvas.height = mainCanvas.height;
        this.bgCtx = this.bgCanvas.getContext('2d');
        
        // Create off-screen canvas for animated elements
        this.fgCanvas = document.createElement('canvas');
        this.fgCanvas.width = mainCanvas.width;
        this.fgCanvas.height = mainCanvas.height;
        this.fgCtx = this.fgCanvas.getContext('2d');
    }

    /**
     * Render static background (edges, static nodes)
     */
    renderBackground() {
        this.bgCtx.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
        this.bgCtx.save();
        this.bgCtx.scale(2, 2);
        
        // Draw edges
        graphEdges.forEach(edge => {
            drawEdge(this.bgCtx, edge, { opacity: 0.3 });
        });
        
        this.bgCtx.restore();
    }

    /**
     * Render animated foreground
     */
    renderForeground(renderFunc) {
        this.fgCtx.clearRect(0, 0, this.fgCanvas.width, this.fgCanvas.height);
        this.fgCtx.save();
        this.fgCtx.scale(2, 2);
        
        renderFunc(this.fgCtx);
        
        this.fgCtx.restore();
    }

    /**
     * Composite layers onto main canvas
     */
    composite() {
        this.mainCtx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
        this.mainCtx.drawImage(this.bgCanvas, 0, 0);
        this.mainCtx.drawImage(this.fgCanvas, 0, 0);
    }
}
```

---

## 6. Testing Checklist

### Animation Control Tests
- [ ] Play button starts animation from current position
- [ ] Pause button stops animation at current frame
- [ ] Reset button returns to beginning and pauses
- [ ] Step Forward advances exactly 500ms
- [ ] Step Backward rewinds exactly 500ms
- [ ] Speed controls (0.5x, 1x, 2x) work correctly
- [ ] Timeline scrubbing updates animation position
- [ ] Animation completes and stops at end
- [ ] Loop mode restarts animation correctly

### Rendering Tests
- [ ] Canvas renders correctly on standard displays
- [ ] Canvas renders correctly on retina displays
- [ ] Window resize doesn't break rendering
- [ ] No visual glitches during animation
- [ ] All phases render correctly
- [ ] Transitions between phases are smooth
- [ ] Performance is acceptable (>30 FPS)

### State Management Tests
- [ ] Switching lessons cancels previous animation
- [ ] Multiple rapid clicks don't create multiple animations
- [ ] Reset clears all animation state
- [ ] Browser tab switching doesn't break animation
- [ ] Animation state persists across pause/play cycles

---

**End of Technical Specifications**

