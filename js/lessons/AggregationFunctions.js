/**
 * AggregationFunctions.js
 * Lesson 4: Comparing Aggregation Functions (Mean, Sum, Max)
 * Visual comparison of how different aggregation functions work
 */

import { AnimationTimeline } from '../AnimationTimeline.js';
import { DrawingUtils } from '../DrawingUtils.js';

export class AggregationFunctions {
    constructor(canvas, graphGenerator) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.graphGenerator = graphGenerator;
        this.graph = null;
        this.timeline = null;
        this.currentFunction = 'mean'; // mean, sum, or max
        this.centerNodeId = 0;
        this.neighborValues = [];
    }

    /**
     * Initialize lesson with aggregation function type
     */
    init(aggregationFunction = 'mean', nodeCount = 6) {
        this.currentFunction = aggregationFunction;
        this.graph = this.graphGenerator.generate('star', nodeCount);
        this.centerNodeId = 0;
        
        // Generate random feature values for neighbors
        this.neighborValues = this.getNeighbors(this.centerNodeId).map(() => 
            Math.random() * 8 + 2 // Values between 2 and 10
        );
        
        this.createTimeline();
        return this.timeline;
    }

    /**
     * Create animation timeline
     */
    createTimeline() {
        const config = {
            duration: 7000,
            loop: false,
            phases: [
                {
                    name: 'introduction',
                    start: 0,
                    end: 1500,
                    description: `Introducing ${this.currentFunction.toUpperCase()} aggregation`
                },
                {
                    name: 'showValues',
                    start: 1500,
                    end: 3000,
                    description: 'Showing neighbor values'
                },
                {
                    name: 'aggregate',
                    start: 3000,
                    end: 5500,
                    description: 'Computing aggregation'
                },
                {
                    name: 'result',
                    start: 5500,
                    end: 7000,
                    description: 'Final result'
                }
            ],
            onUpdate: (phase, progress) => this.render(phase, progress),
            onComplete: () => this.showComparison()
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
            case 'introduction':
                this.renderIntroduction(progress);
                break;
            case 'showValues':
                this.renderShowValues(progress);
                break;
            case 'aggregate':
                this.renderAggregate(progress);
                break;
            case 'result':
                this.renderResult(progress);
                break;
        }

        this.ctx.restore();
        this.updatePhaseIndicator(phase.name, progress);
    }

    /**
     * Phase 1: Introduction
     */
    renderIntroduction(progress) {
        const width = this.canvas.width / (window.devicePixelRatio || 1);
        const height = this.canvas.height / (window.devicePixelRatio || 1);

        this.drawGraphStructure(0.3);

        const opacity = Math.min(progress * 2, 1);
        this.ctx.globalAlpha = opacity;
        
        this.ctx.fillStyle = '#00d9ff';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.currentFunction.toUpperCase() + ' Aggregation', width / 2, 50);

        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = '#c0c0c0';
        const description = this.getAggregationDescription();
        this.wrapText(description, width / 2, 80, width - 100, 22);

        this.ctx.globalAlpha = 1;
    }

    /**
     * Phase 2: Show neighbor values
     */
    renderShowValues(progress) {
        this.drawGraphStructure(0.3);

        const centerNode = this.graph.nodes[this.centerNodeId];
        const neighbors = this.getNeighbors(this.centerNodeId);

        // Highlight center node
        DrawingUtils.drawNode(this.ctx, centerNode, {
            color: '#ff8800',
            glowIntensity: 0.6,
            scale: 1.2
        });

        // Show neighbor values with animation
        neighbors.forEach((neighborId, index) => {
            const neighbor = this.graph.nodes[neighborId];
            const value = this.neighborValues[index];
            const delay = index * 0.15;
            const nodeProgress = Math.max(0, Math.min((progress - delay) / (1 - delay), 1));

            // Highlight neighbor
            DrawingUtils.drawNode(this.ctx, neighbor, {
                color: '#00ff88',
                glowIntensity: nodeProgress * 0.6,
                scale: 1 + nodeProgress * 0.2
            });

            // Show value
            if (nodeProgress > 0.3) {
                const valueOpacity = (nodeProgress - 0.3) / 0.7;
                this.ctx.globalAlpha = valueOpacity;
                this.ctx.fillStyle = '#00ff88';
                this.ctx.font = 'bold 18px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(value.toFixed(1), neighbor.x, neighbor.y - 35);
                this.ctx.globalAlpha = 1;
            }
        });

        // Show formula
        if (progress > 0.5) {
            this.showFormula(progress);
        }
    }

    /**
     * Phase 3: Aggregate values
     */
    renderAggregate(progress) {
        this.drawGraphStructure(0.2);

        const centerNode = this.graph.nodes[this.centerNodeId];
        const neighbors = this.getNeighbors(this.centerNodeId);
        const result = this.calculateAggregation();

        // Show calculation in center
        const width = this.canvas.width / (window.devicePixelRatio || 1);
        const height = this.canvas.height / (window.devicePixelRatio || 1);

        // Draw calculation box
        const boxWidth = 300;
        const boxHeight = 150;
        const boxX = width / 2 - boxWidth / 2;
        const boxY = height / 2 - boxHeight / 2;

        this.ctx.fillStyle = 'rgba(10, 14, 39, 0.9)';
        this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        this.ctx.strokeStyle = '#00d9ff';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // Show calculation steps
        this.ctx.fillStyle = '#00d9ff';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Calculation:', width / 2, boxY + 30);

        this.ctx.font = '14px Arial';
        this.ctx.fillStyle = '#c0c0c0';
        
        const calculationText = this.getCalculationText();
        let yOffset = boxY + 55;
        calculationText.forEach(line => {
            this.ctx.fillText(line, width / 2, yOffset);
            yOffset += 20;
        });

        // Animate result
        if (progress > 0.6) {
            const resultProgress = (progress - 0.6) / 0.4;
            this.ctx.globalAlpha = resultProgress;
            this.ctx.fillStyle = '#ff66d9';
            this.ctx.font = 'bold 20px Arial';
            this.ctx.fillText(`Result: ${result.toFixed(2)}`, width / 2, boxY + boxHeight - 20);
            this.ctx.globalAlpha = 1;
        }

        // Pulsing center node
        const pulseIntensity = 0.5 + 0.5 * Math.sin(progress * Math.PI * 4);
        DrawingUtils.drawNode(this.ctx, centerNode, {
            color: '#ff8800',
            glowIntensity: pulseIntensity,
            scale: 1.2
        });
    }

    /**
     * Phase 4: Show final result
     */
    renderResult(progress) {
        this.drawGraphStructure(0.3);

        const centerNode = this.graph.nodes[this.centerNodeId];
        const result = this.calculateAggregation();

        // Center node with result
        DrawingUtils.drawNode(this.ctx, centerNode, {
            color: '#b366ff',
            glowIntensity: 0.8,
            scale: 1.3
        });

        // Show result value
        this.ctx.fillStyle = '#b366ff';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(result.toFixed(2), centerNode.x, centerNode.y + 5);

        // Show comparison with other functions
        if (progress > 0.5) {
            this.showComparisonTable(progress);
        }
    }

    /**
     * Helper: Draw graph structure
     */
    drawGraphStructure(opacity = 1) {
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

        this.graph.nodes.forEach(node => {
            DrawingUtils.drawNode(this.ctx, node, {
                color: '#00d9ff',
                opacity: opacity
            });
        });
    }

    /**
     * Helper: Get neighbors
     */
    getNeighbors(nodeId) {
        const neighbors = [];
        this.graph.edges.forEach(edge => {
            if (edge.from === nodeId) neighbors.push(edge.to);
            if (edge.to === nodeId) neighbors.push(edge.from);
        });
        return [...new Set(neighbors)];
    }

    /**
     * Helper: Calculate aggregation result
     */
    calculateAggregation() {
        switch (this.currentFunction) {
            case 'mean':
                return this.neighborValues.reduce((a, b) => a + b, 0) / this.neighborValues.length;
            case 'sum':
                return this.neighborValues.reduce((a, b) => a + b, 0);
            case 'max':
                return Math.max(...this.neighborValues);
            default:
                return 0;
        }
    }

    /**
     * Helper: Get aggregation description
     */
    getAggregationDescription() {
        const descriptions = {
            'mean': 'Averages neighbor features - normalizes by neighborhood size',
            'sum': 'Sums neighbor features - larger neighborhoods have more influence',
            'max': 'Takes maximum neighbor feature - finds most important signal'
        };
        return descriptions[this.currentFunction] || '';
    }

    /**
     * Helper: Get calculation text
     */
    getCalculationText() {
        const values = this.neighborValues.map(v => v.toFixed(1)).join(', ');
        
        switch (this.currentFunction) {
            case 'mean':
                return [
                    `Values: [${values}]`,
                    `Mean = (${this.neighborValues.map(v => v.toFixed(1)).join(' + ')})`,
                    `      / ${this.neighborValues.length}`
                ];
            case 'sum':
                return [
                    `Values: [${values}]`,
                    `Sum = ${this.neighborValues.map(v => v.toFixed(1)).join(' + ')}`
                ];
            case 'max':
                return [
                    `Values: [${values}]`,
                    `Max = maximum of all values`
                ];
            default:
                return [];
        }
    }

    /**
     * Helper: Show formula
     */
    showFormula(progress) {
        const width = this.canvas.width / (window.devicePixelRatio || 1);
        const height = this.canvas.height / (window.devicePixelRatio || 1);

        const formulas = {
            'mean': 'AGG = (1/|N(v)|) Σ h_u',
            'sum': 'AGG = Σ h_u',
            'max': 'AGG = max(h_u)'
        };

        const opacity = (progress - 0.5) * 2;
        this.ctx.globalAlpha = opacity;
        this.ctx.fillStyle = '#00d9ff';
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(formulas[this.currentFunction], width / 2, height - 40);
        this.ctx.globalAlpha = 1;
    }

    /**
     * Helper: Show comparison table
     */
    showComparisonTable(progress) {
        // Calculate all three aggregations for comparison
        const meanResult = this.neighborValues.reduce((a, b) => a + b, 0) / this.neighborValues.length;
        const sumResult = this.neighborValues.reduce((a, b) => a + b, 0);
        const maxResult = Math.max(...this.neighborValues);

        const width = this.canvas.width / (window.devicePixelRatio || 1);
        const height = this.canvas.height / (window.devicePixelRatio || 1);

        const opacity = (progress - 0.5) * 2;
        this.ctx.globalAlpha = opacity;

        this.ctx.fillStyle = '#c0c0c0';
        this.ctx.font = '14px Arial';
        this.ctx.textAlign = 'left';
        
        const startX = 20;
        const startY = height - 100;
        
        this.ctx.fillText(`Mean: ${meanResult.toFixed(2)}`, startX, startY);
        this.ctx.fillText(`Sum: ${sumResult.toFixed(2)}`, startX, startY + 25);
        this.ctx.fillText(`Max: ${maxResult.toFixed(2)}`, startX, startY + 50);

        this.ctx.globalAlpha = 1;
    }

    /**
     * Helper: Wrap text
     */
    wrapText(text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let currentY = y;

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = this.ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                this.ctx.fillText(line, x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        this.ctx.fillText(line, x, currentY);
    }

    /**
     * Show comparison
     */
    showComparison() {
        console.log(`${this.currentFunction} aggregation complete`);
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

