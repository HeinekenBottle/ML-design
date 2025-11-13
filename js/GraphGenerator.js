
/**
 * GraphGenerator.js
 * Creates and validates graph structures
 * Fixes Bug #5: Graph loading failures with disconnected graphs
 */

export class GraphGenerator {
    constructor() {
        this.nodes = [];
        this.edges = [];
    }

    /**
     * Generate a graph with specified type and node count
     * @param {string} type - Graph type: 'ring', 'star', 'complete', 'random'
     * @param {number} nodeCount - Number of nodes (3-20)
     * @returns {Object} - Graph with nodes and edges
     */
    generate(type, nodeCount = 8) {
        // Validate input
        nodeCount = Math.max(3, Math.min(20, nodeCount));
        
        this.nodes = [];
        this.edges = [];
        
        // Create nodes
        this.createNodes(type, nodeCount);
        
        // Create edges based on type
        this.createEdges(type, nodeCount);
        
        // Validate and fix connectivity
        if (!this.isConnected()) {
            console.warn('Generated disconnected graph, adding edges...');
            this.ensureConnectivity();
        }
        
        return {
            nodes: this.nodes,
            edges: this.edges
        };
    }

    /**
     * Create nodes with positions based on graph type
     */
    createNodes(type, nodeCount) {
        const centerX = 400;
        const centerY = 300;
        const radius = 120;
        
        for (let i = 0; i < nodeCount; i++) {
            let x, y;
            
            if (type === 'star' && i === 0) {
                // Center node for star graph
                x = centerX;
                y = centerY;
            } else {
                // Arrange in circle
                const angle = (i / nodeCount) * Math.PI * 2;
                x = centerX + Math.cos(angle) * radius;
                y = centerY + Math.sin(angle) * radius;
            }
            
            this.nodes.push({
                id: i,
                x: x,
                y: y,
                value: Math.random() * 10,
                features: [Math.random() * 10, Math.random() * 10, Math.random() * 10]
            });
        }
    }

    /**
     * Create edges based on graph type
     */
    createEdges(type, nodeCount) {
        switch (type) {
            case 'ring':
                // Connect each node to next (circular)
                for (let i = 0; i < nodeCount; i++) {
                    this.edges.push({
                        from: i,
                        to: (i + 1) % nodeCount
                    });
                }
                break;
                
            case 'star':
                // Connect all nodes to center (node 0)
                for (let i = 1; i < nodeCount; i++) {
                    this.edges.push({ from: 0, to: i });
                    this.edges.push({ from: i, to: 0 });
                }
                break;
                
            case 'complete':
                // Connect every node to every other node
                for (let i = 0; i < nodeCount; i++) {
                    for (let j = i + 1; j < nodeCount; j++) {
                        this.edges.push({ from: i, to: j });
                        this.edges.push({ from: j, to: i });
                    }
                }
                break;
                
            case 'random':
            default:
                // Create random edges (ensuring minimum connectivity)
                const edgeCount = Math.min(nodeCount * 2, nodeCount * (nodeCount - 1) / 2);
                const edgeSet = new Set();
                
                for (let i = 0; i < edgeCount; i++) {
                    let from, to;
                    let attempts = 0;
                    
                    do {
                        from = Math.floor(Math.random() * nodeCount);
                        to = Math.floor(Math.random() * nodeCount);
                        attempts++;
                    } while ((from === to || edgeSet.has(`${from}-${to}`)) && attempts < 100);
                    
                    if (from !== to && !edgeSet.has(`${from}-${to}`)) {
                        this.edges.push({ from, to });
                        edgeSet.add(`${from}-${to}`);
                    }
                }
                break;
        }
    }

    /**
     * Check if graph is connected using BFS
     */
    isConnected() {
        if (this.nodes.length === 0) return true;
        
        const visited = new Set();
        const queue = [0];
        visited.add(0);
        
        while (queue.length > 0) {
            const current = queue.shift();
            
            // Find neighbors
            this.edges.forEach(edge => {
                if (edge.from === current && !visited.has(edge.to)) {
                    visited.add(edge.to);
                    queue.push(edge.to);
                }
                if (edge.to === current && !visited.has(edge.from)) {
                    visited.add(edge.from);
                    queue.push(edge.from);
                }
            });
        }
        
        return visited.size === this.nodes.length;
    }

    /**
     * Ensure graph connectivity by connecting components
     */
    ensureConnectivity() {
        const components = this.findComponents();
        
        // Connect components
        for (let i = 1; i < components.length; i++) {
            const node1 = components[i-1][0];
            const node2 = components[i][0];
            
            this.edges.push({ from: node1, to: node2 });
            this.edges.push({ from: node2, to: node1 });
        }
    }

    /**
     * Find connected components using BFS
     */
    findComponents() {
        const visited = new Set();
        const components = [];
        
        for (let i = 0; i < this.nodes.length; i++) {
            if (!visited.has(i)) {
                const component = [];
                const queue = [i];
                visited.add(i);
                
                while (queue.length > 0) {
                    const current = queue.shift();
                    component.push(current);
                    
                    this.edges.forEach(edge => {
                        if (edge.from === current && !visited.has(edge.to)) {
                            visited.add(edge.to);
                            queue.push(edge.to);
                        }
                        if (edge.to === current && !visited.has(edge.from)) {
                            visited.add(edge.from);
                            queue.push(edge.from);
                        }
                    });
                }
                
                components.push(component);
            }
        }
        
        return components;
    }

    /**
     * Get graph statistics
     */
    getStats() {
        return {
            nodeCount: this.nodes.length,
            edgeCount: this.edges.length,
            avgDegree: this.nodes.length > 0 ? (this.edges.length * 2 / this.nodes.length).toFixed(2) : 0,
            isConnected: this.isConnected()
        };
    }
}
