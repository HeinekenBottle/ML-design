
/**
 * GraphBasics.js
 * Lesson 1: Graph Theory Basics
 * Demonstrates fundamental graph concepts with step-by-step visualization
 */

import { AnimationTimeline } from '../AnimationTimeline.js';
import { DrawingUtils } from '../DrawingUtils.js';

export class GraphBasics {
    constructor(canvas, graphGenerator) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.graphGenerator = graphGenerator;
        this.currentStep = 0;
        this.maxSteps = 5;
        this.graph = null;
        this.timeline = null;
    }

    /**
     * Initialize lesson with graph type and node count
     */
    init(graphType = 'ring', nodeCount = 8) {
        this.graph = this.graphGenerator.generate(graphType, nodeCount);
        this.currentStep = 0;
        this.createTimeline();
        return this.timeline;
    }

    /**
     * Create animation timeline for graph basics
     */
    createTimeline() {
        const config = {
            duration: 5000,  // 5 seconds total
            loop: true,
            phases: [
                {
                    name: 'nodes',
                    start: 0,
                    end: 1000,
                    description: 'Highlighting nodes (vertices)'
                },
                {
                    name: 'edges',
                    start: 1000,
                    end: 2000,
                    description: 'Highlighting edges (connections)'
                },
                {
                    name: 'features',
                    start: 2000,
                    end: 3000,
                    description: 'Showing node features'
                },
                {
                    name: 'structure',
                    start: 3000,
                    end: 4000,
                    description: 'Analyzing graph structure'
                },
                {
                    name: 'overview',
                    start: 4000,
                    end: 5000,
                    description: 'Complete graph overview'
                }
            ],
            onUpdate: (phase, progress) => this.render(phase, progress),
            onComplete: () => console.log('Graph Basics animation complete')
        };

        this.timeline = new AnimationTimeline(config);
    }

    /**
     * Render current animation state
     */
    render(phase, progress) {
        DrawingUtils.clearCanvas(this.ctx, this.canvas);

        this.ctx.save();
        // Apply scaling for retina displays
        const dpr = window.devicePixelRatio || 1;
        this.ctx.scale(dpr, dpr);

        switch (phase.name) {
            case 'nodes':
                this.renderNodesPhase(progress);
                break;
            case 'edges':
                this.renderEdgesPhase(progress);
                break;
            case 'features':
                this.renderFeaturesPhase(progress);
                break;
            case 'structure':
                this.renderStructurePhase(progress);
                break;
            case 'overview':
                this.renderOverviewPhase(progress);
                break;
        }

        this.ctx.restore();

        // Update description
        this.updateDescription(phase.description, progress);
    }

    /**
     * Phase 1: Highlight nodes
     */
    renderNodesPhase(progress) {
        // Draw edges (dim)
        this.graph.edges.forEach(edge => {
            DrawingUtils.drawEdge(this.ctx, edge, this.graph.nodes, {
                opacity: 0.1,
                color: '#00d9ff'
            });
        });

        // Draw nodes with pulsing effect
        this.graph.nodes.forEach((node, index) => {
            const pulseDelay = (index / this.graph.nodes.length) * Math.PI * 2;
            const pulse = Math.sin(progress * Math.PI * 2 + pulseDelay);
            const glowIntensity = 0.5 + 0.5 * pulse;
            
            DrawingUtils.drawNode(this.ctx, node, {
                color: '#00ff88',
                glowIntensity: glowIntensity,
                showFeatures: false
            });
        });

        // Draw explanation
        const nodeCount = this.graph.nodes.length;
        DrawingUtils.drawStats(this.ctx, 20, 20, {
            'Nodes (Vertices)': nodeCount,
            'Each node': 'An entity',
            'In GNNs': 'Has features'
        });
    }

    /**
     * Phase 2: Highlight edges
     */
    renderEdgesPhase(progress) {
        // Draw all nodes (static)
        this.graph.nodes.forEach(node => {
            DrawingUtils.drawNode(this.ctx, node, {
                color: '#00d9ff',
                glowIntensity: 0,
                showFeatures: false
            });
        });

        // Draw edges with animated highlight
        this.graph.edges.forEach((edge, index) => {
            const edgeProgress = Math.max(0, Math.min(1, progress * this.graph.edges.length - index));
            const opacity = 0.2 + 0.6 * edgeProgress;
            const width = 2 + 2 * edgeProgress;
            
            DrawingUtils.drawEdge(this.ctx, edge, this.graph.nodes, {
                opacity: opacity,
                color: '#ff66d9',
                width: width,
                animated: edgeProgress > 0 && edgeProgress < 1
            });
        });

        // Draw explanation
        DrawingUtils.drawStats(this.ctx, 20, 20, {
            'Edges': this.graph.edges.length,
            'Connections': 'Between nodes',
            'In GNNs': 'Message paths'
        });
    }

    /**
     * Phase 3: Show features
     */
    renderFeaturesPhase(progress) {
        // Draw edges (dim)
        this.graph.edges.forEach(edge => {
            DrawingUtils.drawEdge(this.ctx, edge, this.graph.nodes, {
                opacity: 0.2,
                color: '#00d9ff'
            });
        });

        // Draw nodes with features appearing
        this.graph.nodes.forEach((node, index) => {
            const showFeatures = progress > (index / this.graph.nodes.length);
            
            DrawingUtils.drawNode(this.ctx, node, {
                color: '#b366ff',
                glowIntensity: showFeatures ? 0.3 : 0,
                showFeatures: showFeatures
            });
        });

        // Draw explanation
        DrawingUtils.drawStats(this.ctx, 20, 20, {
            'Node Features': 'Vector data',
            'Example': '[2.3, 5.1, 8.7]',
            'Dimension': this.graph.nodes[0].features.length
        });
    }

    /**
     * Phase 4: Analyze structure
     */
    renderStructurePhase(progress) {
        // Draw all elements
        this.graph.edges.forEach(edge => {
            DrawingUtils.drawEdge(this.ctx, edge, this.graph.nodes, {
                opacity: 0.4,
                color: '#00d9ff'
            });
        });

        this.graph.nodes.forEach(node => {
            // Calculate degree (number of connections)
            const degree = this.graph.edges.filter(e => 
                e.from === node.id || e.to === node.id
            ).length;
            
            // Highlight nodes by degree
            const scale = 1 + (degree / 10);
            
            DrawingUtils.drawNode(this.ctx, node, {
                color: `hsl(${degree * 30}, 70%, 60%)`,
                scale: scale,
                showFeatures: false
            });
        });

        // Draw stats
        const stats = this.graphGenerator.getStats();
        DrawingUtils.drawStats(this.ctx, 20, 20, {
            'Nodes': stats.nodeCount,
            'Edges': stats.edgeCount,
            'Avg Degree': stats.avgDegree,
            'Connected': stats.isConnected ? 'Yes' : 'No'
        });
    }

    /**
     * Phase 5: Complete overview
     */
    renderOverviewPhase(progress) {
        // Gentle pulsing of entire graph
        const pulse = Math.sin(progress * Math.PI * 2);
        const globalGlow = 0.2 + 0.1 * pulse;

        // Draw edges
        this.graph.edges.forEach(edge => {
            DrawingUtils.drawEdge(this.ctx, edge, this.graph.nodes, {
                opacity: 0.3 + 0.1 * pulse,
                color: '#00d9ff'
            });
        });

        // Draw nodes
        this.graph.nodes.forEach(node => {
            DrawingUtils.drawNode(this.ctx, node, {
                color: '#00d9ff',
                glowIntensity: globalGlow,
                showFeatures: false
            });
        });

        // Draw summary
        DrawingUtils.drawStats(this.ctx, 20, 20, {
            'Graph Type': 'Network structure',
            'Nodes': this.graph.nodes.length,
            'Edges': this.graph.edges.length,
            'Ready for': 'GNN training!'
        });
    }

    /**
     * Update description text
     */
    updateDescription(text, progress) {
        const descriptionEl = document.getElementById('animationDescription');
        if (descriptionEl) {
            descriptionEl.textContent = text;
        }
    }

    /**
     * Step to next phase
     */
    nextStep() {
        if (this.currentStep < this.maxSteps - 1) {
            this.currentStep++;
            const stepTime = (this.currentStep / this.maxSteps) * this.timeline.duration;
            this.timeline.seekTo(stepTime);
        }
    }

    /**
     * Step to previous phase
     */
    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            const stepTime = (this.currentStep / this.maxSteps) * this.timeline.duration;
            this.timeline.seekTo(stepTime);
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
