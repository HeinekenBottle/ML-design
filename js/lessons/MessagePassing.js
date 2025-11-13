/**
 * MessagePassing.js
 * Lesson 2: Message Passing Visualization
 * Demonstrates the message passing framework with 4-phase animation
 */

import { AnimationTimeline } from '../AnimationTimeline.js';
import { DrawingUtils } from '../DrawingUtils.js';

export class MessagePassing {
    constructor(canvas, graphGenerator) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.graphGenerator = graphGenerator;
        this.graph = null;
        this.timeline = null;
        this.centerNodeId = 0;
    }

    /**
     * Initialize lesson with a star graph (ideal for message passing demo)
     */
    init(nodeCount = 6) {
        this.graph = this.graphGenerator.generate('star', nodeCount);
        this.centerNodeId = 0;
        this.createTimeline();
        return this.timeline;
    }

    /**
     * Create animation timeline for message passing
     */
    createTimeline() {
        const config = {
            duration: 9000,  // 9 seconds total as per specs
            loop: false,
            phases: [
                {
                    name: 'preparation',
                    start: 0,
                    end: 2000,
                    description: 'Preparing to send messages...'
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
                    description: 'Aggregating neighbor messages'
                },
                {
                    name: 'update',
                    start: 7000,
                    end: 9000,
                    description: 'Updating node features'
                }
            ],
            onUpdate: (phase, progress) => this.render(phase, progress),
            onComplete: () => this.showCompletionMessage()
        };

        this.timeline = new AnimationTimeline(config);
    }

    /**
     * Render current animation state
     */
    render(phase, progress) {
        DrawingUtils.clearCanvas(this.ctx, this.canvas);

        this.ctx.save();
        const dpr = window.devicePixelRatio || 1;
        this.ctx.scale(dpr, dpr);

        switch (phase.name) {
            case 'preparation':
                this.renderPreparationPhase(progress);
                break;
            case 'sending':
                this.renderSendingPhase(progress);
                break;
            case 'aggregation':
                this.renderAggregationPhase(progress);
                break;
            case 'update':
                this.renderUpdatePhase(progress);
                break;
        }

        this.ctx.restore();
        this.updatePhaseIndicator(phase.name, progress);
    }

    /**
     * Phase 1: Preparation - Highlight source nodes and show initial features
     */
    renderPreparationPhase(progress) {
        // Draw all edges (static)
        this.graph.edges.forEach(edge => {
            DrawingUtils.drawEdge(this.ctx, edge, this.graph.nodes, {
                opacity: 0.3,
                color: '#00d9ff'
            });
        });

        // Draw nodes with highlighting animation
        this.graph.nodes.forEach((node, index) => {
            const isSource = node.id !== this.centerNodeId;
            const isTarget = node.id === this.centerNodeId;
            
            if (isSource) {
                // Pulsing highlight for source nodes
                const pulseIntensity = 0.5 + 0.5 * Math.sin(progress * Math.PI * 2);
                DrawingUtils.drawNode(this.ctx, node, {
                    color: '#00ff88',
                    glowIntensity: pulseIntensity,
                    showFeatures: true
                });
            } else if (isTarget) {
                // Target node (center) - static
                DrawingUtils.drawNode(this.ctx, node, {
                    color: '#ff8800',
                    glowIntensity: 0,
                    showFeatures: true
                });
            }
        });

        // Draw info panel
        const sourceCount = this.graph.nodes.length - 1;
        DrawingUtils.drawStats(this.ctx, 20, 20, {
            'Phase': '1: Preparation',
            'Source Nodes': sourceCount,
            'Target Node': '1 (center)',
            'Ready': 'Sending messages'
        });
    }

    /**
     * Phase 2: Sending - Messages traveling along edges
     */
    renderSendingPhase(progress) {
        // Draw all edges (highlight active ones)
        this.graph.edges.forEach(edge => {
            const isActive = edge.to === this.centerNodeId;
            DrawingUtils.drawEdge(this.ctx, edge, this.graph.nodes, {
                opacity: isActive ? 0.8 : 0.2,
                color: isActive ? '#ff66d9' : '#00d9ff',
                width: isActive ? 3 : 2,
                animated: isActive
            });
        });

        // Draw nodes
        this.graph.nodes.forEach(node => {
            const isTarget = node.id === this.centerNodeId;
            DrawingUtils.drawNode(this.ctx, node, {
                color: isTarget ? '#ff8800' : '#00ff88',
                glowIntensity: 0,
                showFeatures: false
            });
        });

        // Draw message particles
        const activeEdges = this.graph.edges.filter(e => e.to === this.centerNodeId);
        activeEdges.forEach((edge, index) => {
            const fromNode = this.graph.nodes[edge.from];
            const toNode = this.graph.nodes[edge.to];
            
            // Stagger particle starts slightly
            const stagger = (index / activeEdges.length) * 0.2;
            const particleProgress = Math.max(0, Math.min(1, (progress - stagger) / (1 - stagger)));
            
            if (particleProgress > 0 && particleProgress < 1) {
                DrawingUtils.drawMessageParticle(
                    this.ctx,
                    fromNode,
                    toNode,
                    particleProgress,
                    {
                        color: '#ff66d9',
                        size: 8,
                        label: `h${edge.from}`
                    }
                );
            }
        });

        // Update statistics
        const messagesSent = Math.floor(progress * activeEdges.length);
        DrawingUtils.drawStats(this.ctx, 20, 20, {
            'Phase': '2: Sending',
            'Messages Sent': `${messagesSent}/${activeEdges.length}`,
            'Progress': `${Math.floor(progress * 100)}%`,
            'Status': 'In transit'
        });
    }

    /**
     * Phase 3: Aggregation - Collecting messages at target node
     */
    renderAggregationPhase(progress) {
        // Draw edges (fading)
        this.graph.edges.forEach(edge => {
            DrawingUtils.drawEdge(this.ctx, edge, this.graph.nodes, {
                opacity: 0.3 * (1 - progress),
                color: '#00d9ff'
            });
        });

        // Draw source nodes (fading)
        this.graph.nodes.forEach(node => {
            if (node.id !== this.centerNodeId) {
                DrawingUtils.drawNode(this.ctx, node, {
                    color: '#00ff88',
                    opacity: 0.5 * (1 - progress),
                    showFeatures: false
                });
            }
        });

        // Draw target node with collection animation
        const targetNode = this.graph.nodes[this.centerNodeId];
        const neighbors = this.graph.edges.filter(e => e.to === this.centerNodeId);
        
        // Spiral animation for incoming messages
        neighbors.forEach((edge, i) => {
            const angle = (i / neighbors.length) * Math.PI * 2 + progress * Math.PI * 4;
            const radius = 50 * (1 - progress);
            const x = targetNode.x + Math.cos(angle) * radius;
            const y = targetNode.y + Math.sin(angle) * radius;
            
            const size = 6 * (1 - progress);
            if (size > 1) {
                this.ctx.beginPath();
                this.ctx.arc(x, y, size, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 102, 217, ${1 - progress})`;
                this.ctx.fill();
            }
        });

        // Draw target node with growing glow
        DrawingUtils.drawNode(this.ctx, targetNode, {
            color: '#ff8800',
            glowIntensity: progress,
            scale: 1 + progress * 0.3,
            showFeatures: false
        });

        // Show aggregation formula
        if (progress > 0.5) {
            const opacity = (progress - 0.5) * 2;
            const formula = `h'_v = AGG({h_u})\n= MEAN(neighbors)`;
            DrawingUtils.drawFormula(
                this.ctx,
                this.canvas.width / (2 * (window.devicePixelRatio || 1)),
                100,
                formula,
                opacity
            );
        }

        // Update statistics
        DrawingUtils.drawStats(this.ctx, 20, 20, {
            'Phase': '3: Aggregation',
            'Function': 'MEAN',
            'Neighbors': neighbors.length,
            'Progress': `${Math.floor(progress * 100)}%`
        });
    }

    /**
     * Phase 4: Update - Node features updated
     */
    renderUpdatePhase(progress) {
        // Draw all edges (static)
        this.graph.edges.forEach(edge => {
            DrawingUtils.drawEdge(this.ctx, edge, this.graph.nodes, {
                opacity: 0.3,
                color: '#00d9ff'
            });
        });

        // Draw all nodes
        this.graph.nodes.forEach(node => {
            const isTarget = node.id === this.centerNodeId;
            DrawingUtils.drawNode(this.ctx, node, {
                color: isTarget ? '#b366ff' : '#00d9ff',
                glowIntensity: isTarget ? (1 - progress) * 0.5 : 0,
                showFeatures: true
            });
        });

        // Animate value change on target node
        const targetNode = this.graph.nodes[this.centerNodeId];
        const oldValue = targetNode.value;
        
        // Calculate aggregated value (mean of neighbors)
        const neighbors = this.graph.edges
            .filter(e => e.to === this.centerNodeId)
            .map(e => this.graph.nodes[e.from].value);
        const newValue = neighbors.reduce((sum, val) => sum + val, 0) / neighbors.length;
        
        // Interpolate value
        const currentValue = oldValue + (newValue - oldValue) * progress;
        
        // Draw updated value
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 18px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(currentValue.toFixed(1), targetNode.x, targetNode.y);

        // Show before/after comparison
        if (progress > 0.7) {
            const opacity = (progress - 0.7) / 0.3;
            const comparisonText = `Old: ${oldValue.toFixed(1)}\nNew: ${newValue.toFixed(1)}\nChange: ${(newValue - oldValue).toFixed(1)}`;
            DrawingUtils.drawFormula(
                this.ctx,
                this.canvas.width / (2 * (window.devicePixelRatio || 1)),
                100,
                comparisonText,
                opacity
            );
        }

        // Update statistics
        DrawingUtils.drawStats(this.ctx, 20, 20, {
            'Phase': '4: Update',
            'Old Value': oldValue.toFixed(1),
            'New Value': newValue.toFixed(1),
            'Status': progress < 1 ? 'Updating...' : 'Complete!'
        });
    }

    /**
     * Update phase indicator in UI
     */
    updatePhaseIndicator(phaseName, progress) {
        const phaseEl = document.getElementById('currentPhase');
        const progressEl = document.getElementById('phaseProgress');
        const descEl = document.getElementById('animationDescription');
        
        if (phaseEl) {
            phaseEl.textContent = phaseName.charAt(0).toUpperCase() + phaseName.slice(1);
        }
        
        if (progressEl) {
            progressEl.style.width = `${progress * 100}%`;
        }
        
        if (descEl) {
            const phase = this.timeline.getCurrentPhase();
            descEl.textContent = phase.description;
        }
    }

    /**
     * Show completion message
     */
    showCompletionMessage() {
        console.log('Message passing animation complete!');
        const descEl = document.getElementById('animationDescription');
        if (descEl) {
            descEl.textContent = 'Message passing complete! Node features have been updated.';
        }
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.timeline) {
            this.timeline.destroy();
        }
    }
}
