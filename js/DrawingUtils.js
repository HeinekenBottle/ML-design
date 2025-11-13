
/**
 * DrawingUtils.js
 * Helper functions for drawing nodes, edges, and visualizations on canvas
 */

export class DrawingUtils {
    /**
     * Draw a node with various visual options
     */
    static drawNode(ctx, node, options = {}) {
        const {
            color = '#00d9ff',
            opacity = 1.0,
            glowIntensity = 0,
            scale = 1.0,
            showFeatures = false,
            showLabel = true
        } = options;

        const radius = 20 * scale;

        // Draw glow effect
        if (glowIntensity > 0) {
            const gradient = ctx.createRadialGradient(
                node.x, node.y, 0,
                node.x, node.y, radius * 2
            );
            const glowAlpha = Math.floor(glowIntensity * 128).toString(16).padStart(2, '0');
            gradient.addColorStop(0, `${color}${glowAlpha}`);
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
        if (showLabel && node.value !== undefined) {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 14px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.value.toFixed(1), node.x, node.y);
        }

        // Draw feature vector if requested
        if (showFeatures && node.features) {
            this.drawFeatureVector(ctx, node, 1.0);
        }
    }

    /**
     * Draw an edge with various visual options
     */
    static drawEdge(ctx, edge, nodes, options = {}) {
        const {
            color = '#00d9ff',
            opacity = 0.3,
            width = 2,
            animated = false,
            dashed = false
        } = options;

        const fromNode = nodes[edge.from];
        const toNode = nodes[edge.to];

        if (!fromNode || !toNode) return;

        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        
        // Convert hex color to rgba
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
        ctx.lineWidth = width;
        
        if (animated || dashed) {
            ctx.setLineDash([5, 5]);
            if (animated) {
                ctx.lineDashOffset = -Date.now() / 50;
            }
        } else {
            ctx.setLineDash([]);
        }
        
        ctx.stroke();
        ctx.setLineDash([]);
    }

    /**
     * Draw feature vector as colored bars
     */
    static drawFeatureVector(ctx, node, opacity = 1.0) {
        if (!node.features || node.features.length === 0) return;

        const barWidth = 8;
        const barSpacing = 2;
        const maxBarHeight = 30;
        const startX = node.x + 30;
        const startY = node.y - (node.features.length * (barWidth + barSpacing)) / 2;

        node.features.forEach((value, i) => {
            const normalizedValue = Math.max(0, Math.min(1, value / 10));
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

    /**
     * Draw a message particle along an edge
     */
    static drawMessageParticle(ctx, fromNode, toNode, progress, options = {}) {
        const {
            color = '#ff66d9',
            size = 8,
            label = ''
        } = options;

        // Calculate particle position
        const x = fromNode.x + (toNode.x - fromNode.x) * progress;
        const y = fromNode.y + (toNode.y - fromNode.y) * progress;

        // Draw particle
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw label if provided
        if (label && progress > 0.3 && progress < 0.7) {
            ctx.fillStyle = '#fff';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(label, x, y - 15);
        }
    }

    /**
     * Draw aggregation formula
     */
    static drawFormula(ctx, x, y, formula, opacity = 1.0) {
        ctx.globalAlpha = opacity;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(x - 100, y - 40, 200, 80);
        
        ctx.strokeStyle = '#00d9ff';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 100, y - 40, 200, 80);

        ctx.fillStyle = '#fff';
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw formula lines
        const lines = formula.split('\n');
        lines.forEach((line, i) => {
            ctx.fillText(line, x, y - 20 + i * 20);
        });
        
        ctx.globalAlpha = 1.0;
    }

    /**
     * Draw statistics panel
     */
    static drawStats(ctx, x, y, stats) {
        const panelWidth = 200;
        const panelHeight = Object.keys(stats).length * 25 + 20;

        // Draw panel background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(x, y, panelWidth, panelHeight);
        
        ctx.strokeStyle = '#00d9ff';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, panelWidth, panelHeight);

        // Draw stats
        ctx.fillStyle = '#fff';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'left';
        
        let offsetY = y + 25;
        Object.entries(stats).forEach(([key, value]) => {
            ctx.fillText(`${key}: ${value}`, x + 10, offsetY);
            offsetY += 25;
        });
    }

    /**
     * Clear canvas with proper scaling
     */
    static clearCanvas(ctx, canvas) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }
}
