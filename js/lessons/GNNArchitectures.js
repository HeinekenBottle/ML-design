/**
 * GNNArchitectures.js
 * Lesson 3: Comparing GNN Architectures (GCN, GraphSAGE, GAT)
 * Shows how different architectures process graphs differently
 */

import { AnimationTimeline } from '../AnimationTimeline.js';
import { DrawingUtils } from '../DrawingUtils.js';

export class GNNArchitectures {
    constructor(canvas, graphGenerator) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.graphGenerator = graphGenerator;
        this.graph = null;
        this.timeline = null;
        this.currentArchitecture = 'GCN'; // GCN, GraphSAGE, or GAT
        this.centerNodeId = 0;
    }

    /**
     * Initialize lesson with architecture type
     */
    init(architecture = 'GCN', nodeCount = 6) {
        this.currentArchitecture = architecture;
        this.graph = this.graphGenerator.generate('star', nodeCount);
        this.centerNodeId = 0;
        this.createTimeline();
        return this.timeline;
    }

    /**
     * Create animation timeline based on architecture
     */
    createTimeline() {
        const config = {
            duration: 8000,
            loop: false,
            phases: this.getArchitecturePhases(),
            onUpdate: (phase, progress) => this.render(phase, progress),
            onComplete: () => this.showComparison()
        };

        this.timeline = new AnimationTimeline(config);
    }

    /**
     * Get phases based on current architecture
     */
    getArchitecturePhases() {
        const basePhases = [
            {
                name: 'introduction',
                start: 0,
                end: 1500,
                description: `Introducing ${this.currentArchitecture} architecture`
            },
            {
                name: 'neighborhood',
                start: 1500,
                end: 3500,
                description: 'Identifying neighborhood'
            },
            {
                name: 'aggregation',
                start: 3500,
                end: 6000,
                description: 'Aggregating neighbor information'
            },
            {
                name: 'transformation',
                start: 6000,
                end: 8000,
                description: 'Transforming features'
            }
        ];

        return basePhases;
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
            case 'introduction':
                this.renderIntroduction(progress);
                break;
            case 'neighborhood':
                this.renderNeighborhood(progress);
                break;
            case 'aggregation':
                this.renderAggregation(progress);
                break;
            case 'transformation':
                this.renderTransformation(progress);
                break;
        }

        this.ctx.restore();
        this.updatePhaseIndicator(phase.name, progress);
    }

    /**
     * Phase 1: Introduction - Show architecture name and key features
     */
    renderIntroduction(progress) {
        const width = this.canvas.width / (window.devicePixelRatio || 1);
        const height = this.canvas.height / (window.devicePixelRatio || 1);

        // Draw all nodes and edges (static)
        this.drawGraphStructure(0.3);

        // Architecture title with fade-in
        const opacity = Math.min(progress * 2, 1);
        this.ctx.globalAlpha = opacity;
        
        this.ctx.fillStyle = '#00d9ff';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.currentArchitecture, width / 2, 50);

        // Architecture description
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = '#c0c0c0';
        const description = this.getArchitectureDescription();
        this.ctx.fillText(description, width / 2, 80);

        this.ctx.globalAlpha = 1;
    }

    /**
     * Phase 2: Neighborhood - Highlight how each architecture defines neighborhood
     */
    renderNeighborhood(progress) {
        this.drawGraphStructure(0.3);

        const centerNode = this.graph.nodes[this.centerNodeId];
        const neighbors = this.getNeighbors(this.centerNodeId);

        // Highlight center node
        DrawingUtils.drawNode(this.ctx, centerNode, {
            color: '#ff8800',
            glowIntensity: 0.8,
            scale: 1.2
        });

        // Highlight neighbors based on architecture
        neighbors.forEach((neighborId, index) => {
            const neighbor = this.graph.nodes[neighborId];
            const delay = index * 0.15;
            const nodeProgress = Math.max(0, Math.min((progress - delay) / (1 - delay), 1));

            if (this.currentArchitecture === 'GAT') {
                // GAT: Show attention weights
                const attention = this.calculateAttention(neighborId, progress);
                const intensity = attention * nodeProgress;
                
                DrawingUtils.drawNode(this.ctx, neighbor, {
                    color: '#00ff88',
                    glowIntensity: intensity,
                    scale: 1 + intensity * 0.3
                });

                // Draw attention score
                if (nodeProgress > 0.5) {
                    this.ctx.fillStyle = '#00ff88';
                    this.ctx.font = 'bold 14px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(`α=${attention.toFixed(2)}`, neighbor.x, neighbor.y - 35);
                }
            } else {
                // GCN and GraphSAGE: Equal highlighting
                DrawingUtils.drawNode(this.ctx, neighbor, {
                    color: '#00ff88',
                    glowIntensity: nodeProgress * 0.6,
                    scale: 1 + nodeProgress * 0.2
                });
            }
        });

        // Show formula
        this.showFormula(progress);
    }

    /**
     * Phase 3: Aggregation - Show how features are aggregated
     */
    renderAggregation(progress) {
        this.drawGraphStructure(0.2);

        const centerNode = this.graph.nodes[this.centerNodeId];
        const neighbors = this.getNeighbors(this.centerNodeId);

        // Draw particles flowing to center
        neighbors.forEach((neighborId, index) => {
            const neighbor = this.graph.nodes[neighborId];
            const particleProgress = Math.min(progress + index * 0.1, 1);

            // Particle position
            const x = neighbor.x + (centerNode.x - neighbor.x) * particleProgress;
            const y = neighbor.y + (centerNode.y - neighbor.y) * particleProgress;

            // Particle size based on architecture
            let size = 8;
            let color = '#ff66d9';
            
            if (this.currentArchitecture === 'GAT') {
                const attention = this.calculateAttention(neighborId, 1);
                size = 6 + attention * 8;
                color = `rgba(255, 102, 217, ${attention})`;
            }

            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fillStyle = color;
            this.ctx.fill();
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        });

        // Center node collecting messages
        const pulseIntensity = 0.5 + 0.5 * Math.sin(progress * Math.PI * 4);
        DrawingUtils.drawNode(this.ctx, centerNode, {
            color: '#ff8800',
            glowIntensity: pulseIntensity,
            scale: 1.2 + progress * 0.2
        });

        // Show aggregation formula
        this.showAggregationFormula(progress);
    }

    /**
     * Phase 4: Transformation - Show final feature transformation
     */
    renderTransformation(progress) {
        this.drawGraphStructure(0.3);

        const centerNode = this.graph.nodes[this.centerNodeId];

        // Show transformation with color change
        const transformProgress = progress;
        const startColor = { r: 255, g: 136, b: 0 };  // Orange
        const endColor = { r: 179, g: 102, b: 255 };  // Purple

        const r = Math.floor(startColor.r + (endColor.r - startColor.r) * transformProgress);
        const g = Math.floor(startColor.g + (endColor.g - startColor.g) * transformProgress);
        const b = Math.floor(startColor.b + (endColor.b - startColor.b) * transformProgress);

        DrawingUtils.drawNode(this.ctx, centerNode, {
            color: `rgb(${r}, ${g}, ${b})`,
            glowIntensity: 0.8,
            scale: 1.3
        });

        // Show before/after features
        this.showFeatureTransformation(progress);
    }

    /**
     * Helper: Draw graph structure
     */
    drawGraphStructure(opacity = 1) {
        // Draw edges
        this.graph.edges.forEach(edge => {
            const from = this.graph.nodes[edge.from];
            const to = this.graph.nodes[edge.to];
            
            this.ctx.beginPath();
            this.ctx.moveTo(from.x, from.y);
            this.ctx.lineTo(to.x, to.y);
            this.ctx.strokeStyle = `rgba(0, 217, 255, ${opacity * 0.3})`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        });

        // Draw nodes
        this.graph.nodes.forEach(node => {
            DrawingUtils.drawNode(this.ctx, node, {
                color: '#00d9ff',
                opacity: opacity
            });
        });
    }

    /**
     * Helper: Get neighbors of a node
     */
    getNeighbors(nodeId) {
        const neighbors = [];
        this.graph.edges.forEach(edge => {
            if (edge.from === nodeId) neighbors.push(edge.to);
            if (edge.to === nodeId) neighbors.push(edge.from);
        });
        return [...new Set(neighbors)]; // Remove duplicates
    }

    /**
     * Helper: Calculate attention weight (for GAT)
     */
    calculateAttention(neighborId, progress) {
        // Simulate attention scores (in real GAT, these are learned)
        const baseAttention = 0.3 + Math.random() * 0.4;
        return Math.min(baseAttention * progress, 1);
    }

    /**
     * Helper: Get architecture description
     */
    getArchitectureDescription() {
        const descriptions = {
            'GCN': 'Graph Convolutional Network - Spectral approach with symmetric normalization',
            'GraphSAGE': 'Graph Sample and Aggregate - Inductive learning with sampling',
            'GAT': 'Graph Attention Network - Learns importance of neighbors'
        };
        return descriptions[this.currentArchitecture] || '';
    }

    /**
     * Helper: Show formula for current architecture
     */
    showFormula(progress) {
        if (progress < 0.5) return;

        const width = this.canvas.width / (window.devicePixelRatio || 1);
        const height = this.canvas.height / (window.devicePixelRatio || 1);

        const formulas = {
            'GCN': 'H⁽ˡ⁺¹⁾ = σ(D̃⁻½ÃD̃⁻½H⁽ˡ⁾W⁽ˡ⁾)',
            'GraphSAGE': 'h_v⁽ˡ⁺¹⁾ = σ(W·CONCAT(h_v⁽ˡ⁾, AGG({h_u⁽ˡ⁾})))',
            'GAT': 'h_v⁽ˡ⁺¹⁾ = σ(Σ α_uv W h_u⁽ˡ⁾)'
        };

        const opacity = (progress - 0.5) * 2;
        this.ctx.globalAlpha = opacity;
        this.ctx.fillStyle = '#00d9ff';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(formulas[this.currentArchitecture], width / 2, height - 40);
        this.ctx.globalAlpha = 1;
    }

    /**
     * Helper: Show aggregation formula
     */
    showAggregationFormula(progress) {
        const width = this.canvas.width / (window.devicePixelRatio || 1);
        const height = this.canvas.height / (window.devicePixelRatio || 1);

        this.ctx.fillStyle = '#ff66d9';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Aggregating neighbor features...', width / 2, height - 60);
    }

    /**
     * Helper: Show feature transformation
     */
    showFeatureTransformation(progress) {
        const width = this.canvas.width / (window.devicePixelRatio || 1);
        
        this.ctx.fillStyle = '#b366ff';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Feature Transformation Complete!', width / 2, 120);
    }

    /**
     * Show comparison of architectures
     */
    showComparison() {
        console.log(`${this.currentArchitecture} animation complete`);
    }

    /**
     * Update phase indicator
     */
    updatePhaseIndicator(phaseName, progress) {
        const phaseElement = document.getElementById('currentPhase');
        if (phaseElement) {
            phaseElement.textContent = phaseName.charAt(0).toUpperCase() + phaseName.slice(1);
        }

        const progressElement = document.getElementById('phaseProgress');
        if (progressElement) {
            progressElement.style.width = `${progress * 100}%`;
        }
    }
}

