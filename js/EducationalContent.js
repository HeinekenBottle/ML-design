/**
 * EducationalContent.js
 * Comprehensive educational content for all GNN lessons
 * Provides learning objectives, explanations, real-world examples, and quizzes
 */

export const EducationalContent = {
    /**
     * Lesson 1: Graph Basics
     */
    lesson1: {
        title: "Graph Theory Fundamentals",
        subtitle: "Understanding the building blocks of Graph Neural Networks",
        
        learningObjectives: [
            "Understand what graphs are and why they're important",
            "Identify nodes (vertices) and edges (connections) in a graph",
            "Recognize different graph structures (ring, star, complete, random)",
            "Understand how graphs represent real-world relationships"
        ],
        
        introduction: `
            <h3>What Are Graphs?</h3>
            <p>Graphs are mathematical structures used to model relationships between objects. They consist of:</p>
            <ul>
                <li><strong>Nodes (Vertices):</strong> Individual entities or objects</li>
                <li><strong>Edges (Connections):</strong> Relationships or links between nodes</li>
            </ul>
            <p><strong>Why Graphs Matter:</strong> Many real-world systems are naturally represented as graphs:</p>
            <ul>
                <li>🌐 <strong>Social Networks:</strong> People (nodes) connected by friendships (edges)</li>
                <li>💰 <strong>Financial Networks:</strong> Accounts (nodes) linked by transactions (edges)</li>
                <li>🧬 <strong>Molecular Structures:</strong> Atoms (nodes) bonded together (edges)</li>
                <li>🚗 <strong>Transportation:</strong> Cities (nodes) connected by roads (edges)</li>
            </ul>
        `,
        
        phases: {
            nodes: {
                title: "Phase 1: Nodes (Vertices)",
                whatYouSee: "Individual circles pulsing with a glow effect. Each node represents an entity in the graph.",
                whyItMatters: `
                    Nodes are the fundamental units of a graph. In a social network, each node might represent a person. 
                    In a financial fraud detection system, each node could represent a bank account or transaction.
                `,
                keyPoints: [
                    "Nodes can have <strong>features</strong> (properties like age, balance, or activity level)",
                    "The number of nodes determines the graph's size",
                    "Each node has a unique identifier"
                ],
                realWorldExample: "In LinkedIn, each person is a node with features like job title, location, and skills."
            },
            
            edges: {
                title: "Phase 2: Edges (Connections)",
                whatYouSee: "Lines connecting nodes, showing relationships between them.",
                whyItMatters: `
                    Edges define the structure of the graph. They tell us which nodes are related to each other. 
                    In fraud detection, an edge might represent a money transfer between two accounts.
                `,
                keyPoints: [
                    "Edges can be <strong>directed</strong> (one-way) or <strong>undirected</strong> (two-way)",
                    "Edges can have <strong>weights</strong> (e.g., transaction amount, friendship strength)",
                    "The pattern of edges determines the graph's structure"
                ],
                realWorldExample: "In a payment network, an edge from Account A to Account B represents 'A sent money to B'."
            },
            
            features: {
                title: "Phase 3: Node Features",
                whatYouSee: "Colored bars next to each node showing numerical feature values.",
                whyItMatters: `
                    Node features are the data associated with each node. This is what Graph Neural Networks learn from!
                    Features could be anything: account balance, user age, transaction frequency, etc.
                `,
                keyPoints: [
                    "Features are represented as <strong>vectors</strong> (lists of numbers)",
                    "GNNs learn to transform and combine these features",
                    "Features can be raw data or learned representations"
                ],
                formula: "h<sub>v</sub> = [f<sub>1</sub>, f<sub>2</sub>, ..., f<sub>d</sub>]",
                formulaExplanation: "Node v's features are a d-dimensional vector",
                realWorldExample: "A user node might have features: [age: 25, posts: 150, followers: 500, verified: 1]"
            },
            
            structure: {
                title: "Phase 4: Graph Structure",
                whatYouSee: "The complete graph with highlighted structural patterns.",
                whyItMatters: `
                    Different graph structures have different properties. Understanding structure helps us choose 
                    the right GNN architecture and predict how information will flow through the network.
                `,
                keyPoints: [
                    "<strong>Ring:</strong> Each node connects to its neighbors in a circle",
                    "<strong>Star:</strong> One central hub connected to all other nodes",
                    "<strong>Complete:</strong> Every node connects to every other node",
                    "<strong>Random:</strong> Connections are randomly distributed"
                ],
                realWorldExample: "Social networks often have 'small-world' structure with clusters and hubs, like Twitter influencers."
            },
            
            overview: {
                title: "Phase 5: Putting It All Together",
                whatYouSee: "The complete graph with all elements visible.",
                whyItMatters: `
                    Graphs combine structure (edges) with data (node features) to represent complex systems. 
                    This is what makes them so powerful for machine learning!
                `,
                keyPoints: [
                    "Graphs capture both <strong>individual properties</strong> (node features) and <strong>relationships</strong> (edges)",
                    "GNNs learn patterns by looking at both structure and features",
                    "The same graph structure can represent many different real-world systems"
                ]
            }
        },
        
        quiz: [
            {
                question: "What are the two main components of a graph?",
                options: ["Nodes and Edges", "Vertices and Lines", "Points and Connections", "Data and Structure"],
                correct: 0,
                explanation: "Graphs consist of nodes (vertices) representing entities and edges representing relationships between them."
            },
            {
                question: "In a social network graph, what would an edge typically represent?",
                options: ["A person's age", "A friendship or connection", "A user's profile", "The number of posts"],
                correct: 1,
                explanation: "Edges represent relationships. In a social network, an edge between two nodes means those people are connected (friends, followers, etc.)."
            },
            {
                question: "What is a node feature?",
                options: [
                    "The number of connections a node has",
                    "Data or properties associated with a node",
                    "The position of a node in the graph",
                    "The color used to draw the node"
                ],
                correct: 1,
                explanation: "Node features are the data associated with each node, like age, balance, or activity level. GNNs learn from these features."
            }
        ],
        
        summary: `
            <h3>Key Takeaways</h3>
            <ul>
                <li>✅ Graphs model relationships using <strong>nodes</strong> (entities) and <strong>edges</strong> (connections)</li>
                <li>✅ Nodes have <strong>features</strong> (data) that GNNs learn from</li>
                <li>✅ Graph <strong>structure</strong> (how nodes connect) affects how information flows</li>
                <li>✅ Real-world systems like social networks, financial networks, and molecules are naturally represented as graphs</li>
            </ul>
            <p><strong>Next:</strong> Learn how Graph Neural Networks use message passing to learn from graph structure!</p>
        `
    },

    /**
     * Lesson 2: Message Passing
     */
    lesson2: {
        title: "Message Passing in Graph Neural Networks",
        subtitle: "The core mechanism that makes GNNs work",
        
        learningObjectives: [
            "Understand the three steps of message passing: send, aggregate, update",
            "See how nodes share information with their neighbors",
            "Learn how aggregation functions combine neighbor information",
            "Understand why message passing enables learning from graph structure"
        ],
        
        introduction: `
            <h3>What Is Message Passing?</h3>
            <p>Message passing is the fundamental operation in Graph Neural Networks. It's how nodes learn from their neighbors!</p>
            <p><strong>The Big Idea:</strong> Each node's representation is updated based on information from its neighbors. 
            This allows the network to learn patterns that depend on graph structure.</p>
            
            <h4>The Three Steps:</h4>
            <ol>
                <li><strong>Send:</strong> Each node sends its features to its neighbors</li>
                <li><strong>Aggregate:</strong> Each node collects and combines messages from neighbors</li>
                <li><strong>Update:</strong> Each node updates its own features based on aggregated information</li>
            </ol>
            
            <p><strong>Real-World Analogy:</strong> Think of it like spreading information through a social network. 
            You share your opinion (send), listen to your friends' opinions (aggregate), and form a new opinion based on what you heard (update).</p>
        `,
        
        phases: {
            preparation: {
                title: "Phase 1: Preparation",
                whatYouSee: "Source nodes (green) pulsing, showing their initial feature values. The target node (orange) is ready to receive messages.",
                whyItMatters: `
                    Before message passing begins, each node has its current feature representation. 
                    These features might be raw input data (like account balance) or learned representations from previous GNN layers.
                `,
                keyPoints: [
                    "Each node starts with a feature vector h<sub>v</sub>",
                    "Source nodes (neighbors) will send their features",
                    "Target node will receive and process these messages"
                ],
                formula: "h<sub>v</sub><sup>(0)</sup> = initial features",
                formulaExplanation: "Superscript (0) means this is the initial layer",
                realWorldExample: "In fraud detection, initial features might be: [account_age, transaction_count, average_amount, is_verified]"
            },
            
            sending: {
                title: "Phase 2: Sending Messages",
                whatYouSee: "Pink particles flowing along edges from source nodes to the target node. Each particle carries the source node's feature information.",
                whyItMatters: `
                    This is where graph structure matters! Only connected nodes can send messages to each other. 
                    The pattern of connections determines which information flows where.
                `,
                keyPoints: [
                    "Messages travel along edges only",
                    "Each message contains the sender's features",
                    "Multiple messages can arrive at the same node",
                    "Message content can be transformed (weighted) before sending"
                ],
                formula: "m<sub>uv</sub> = W · h<sub>u</sub>",
                formulaExplanation: "Message from node u to v = Weight matrix × u's features",
                realWorldExample: "In a payment network, if Account A sent money to Account B, A's transaction patterns influence B's fraud score."
            },
            
            aggregation: {
                title: "Phase 3: Aggregating Messages",
                whatYouSee: "Messages spiraling into the target node. The aggregation function combines all incoming messages into a single representation.",
                whyItMatters: `
                    Aggregation is crucial! It determines how neighbor information is combined. Different aggregation functions 
                    have different properties and work better for different tasks.
                `,
                keyPoints: [
                    "<strong>Mean:</strong> Average of neighbor features (normalizes by degree)",
                    "<strong>Sum:</strong> Total of neighbor features (preserves magnitude)",
                    "<strong>Max:</strong> Takes maximum value across neighbors (finds most important feature)"
                ],
                formula: "h̃<sub>v</sub> = AGG({m<sub>uv</sub> : u ∈ N(v)})",
                formulaExplanation: "Aggregated features = Aggregation function applied to all messages from neighbors N(v)",
                realWorldExample: "To detect fraud, we might use MEAN aggregation to find accounts whose neighbors have unusual average transaction amounts.",
                
                aggregationComparison: {
                    mean: "Best when all neighbors are equally important. Prevents high-degree nodes from dominating.",
                    sum: "Best when total neighborhood information matters. Larger neighborhoods have more influence.",
                    max: "Best when looking for the most extreme/important neighbor feature."
                }
            },
            
            update: {
                title: "Phase 4: Updating Node Features",
                whatYouSee: "The target node's color changes and its feature values update. The node now has a new representation that incorporates neighbor information.",
                whyItMatters: `
                    This is where learning happens! The node combines its own features with aggregated neighbor information 
                    to create a new, more informed representation.
                `,
                keyPoints: [
                    "Combines node's own features with neighbor information",
                    "Often uses a neural network (like a feedforward layer)",
                    "Can include non-linear activation (ReLU, etc.)",
                    "Output becomes input for the next GNN layer"
                ],
                formula: "h<sub>v</sub><sup>(k+1)</sup> = σ(W<sub>self</sub> · h<sub>v</sub><sup>(k)</sup> + W<sub>neigh</sub> · h̃<sub>v</sub>)",
                formulaExplanation: "New features = Activation(Own features + Neighbor features), where σ is activation function like ReLU",
                realWorldExample: "A suspicious account becomes even more suspicious if its neighbors are also flagged as suspicious.",
                
                beforeAfter: {
                    before: "Node only knows its own features",
                    after: "Node knows its features + information from its neighborhood"
                }
            }
        },
        
        quiz: [
            {
                question: "What are the three main steps of message passing?",
                options: [
                    "Input, Process, Output",
                    "Send, Aggregate, Update",
                    "Forward, Backward, Update",
                    "Encode, Decode, Transform"
                ],
                correct: 1,
                explanation: "Message passing consists of: (1) Send messages to neighbors, (2) Aggregate received messages, (3) Update node features."
            },
            {
                question: "Why does graph structure matter in message passing?",
                options: [
                    "It determines which nodes can send messages to each other",
                    "It affects the color of the nodes",
                    "It changes the number of features",
                    "It doesn't matter"
                ],
                correct: 0,
                explanation: "Messages only travel along edges. The graph structure determines which nodes are connected and can exchange information."
            },
            {
                question: "What does the aggregation function do?",
                options: [
                    "Sends messages to neighbors",
                    "Combines multiple messages into one representation",
                    "Updates the graph structure",
                    "Initializes node features"
                ],
                correct: 1,
                explanation: "The aggregation function (like mean, sum, or max) combines all messages from neighbors into a single representation."
            },
            {
                question: "In fraud detection, why is message passing useful?",
                options: [
                    "It makes the graph look prettier",
                    "It allows accounts to learn from their neighbors' behavior patterns",
                    "It reduces the number of nodes",
                    "It removes suspicious edges"
                ],
                correct: 1,
                explanation: "Message passing lets each account incorporate information from connected accounts. If your neighbors are suspicious, you might be too!"
            }
        ],
        
        summary: `
            <h3>Key Takeaways</h3>
            <ul>
                <li>✅ Message passing has 3 steps: <strong>Send</strong> → <strong>Aggregate</strong> → <strong>Update</strong></li>
                <li>✅ Nodes share information only with their <strong>neighbors</strong> (connected nodes)</li>
                <li>✅ <strong>Aggregation functions</strong> (mean, sum, max) combine neighbor information differently</li>
                <li>✅ After message passing, nodes have <strong>richer representations</strong> that include neighborhood context</li>
                <li>✅ Multiple message passing layers let information flow across the entire graph</li>
            </ul>
            
            <h4>Real-World Impact:</h4>
            <p>💰 <strong>Fraud Detection:</strong> Suspicious accounts cluster together. Message passing helps identify entire fraud rings.</p>
            <p>💊 <strong>Drug Discovery:</strong> Molecular properties depend on atomic neighborhoods. GNNs predict drug effectiveness.</p>
            <p>🎬 <strong>Recommendations:</strong> Users with similar friends have similar interests. Message passing improves recommendations.</p>
            
            <p><strong>Next:</strong> Learn about different GNN architectures (GCN, GraphSAGE, GAT) and when to use each!</p>
        `
    },

    /**
     * Lesson 3: GNN Architectures
     */
    lesson3: {
        title: "GNN Architectures: GCN, GraphSAGE, and GAT",
        subtitle: "Understanding different approaches to graph neural networks",

        learningObjectives: [
            "Understand the key differences between GCN, GraphSAGE, and GAT",
            "Learn when to use each architecture",
            "Understand trade-offs: complexity vs. performance",
            "See how attention mechanisms improve GNNs"
        ],

        introduction: `
            <h3>Why Different GNN Architectures?</h3>
            <p>Just like CNNs have different architectures (ResNet, VGG, etc.), GNNs have evolved with different designs.
            Each architecture makes different choices about how to aggregate neighbor information.</p>

            <h4>The Three Major Architectures:</h4>
            <ul>
                <li><strong>GCN (Graph Convolutional Network):</strong> The foundation - simple and effective</li>
                <li><strong>GraphSAGE:</strong> Scalable sampling-based approach</li>
                <li><strong>GAT (Graph Attention Network):</strong> Learns which neighbors are most important</li>
            </ul>
        `,

        architectures: {
            GCN: {
                title: "GCN: Graph Convolutional Network",
                whatItIs: "The foundational GNN architecture that applies spectral graph theory to neural networks.",
                howItWorks: `
                    <p>GCN uses <strong>symmetric normalization</strong> to aggregate neighbor features:</p>
                    <ol>
                        <li>Add self-loops to the graph (each node connects to itself)</li>
                        <li>Normalize by node degrees (prevents high-degree nodes from dominating)</li>
                        <li>Apply weight matrix and activation function</li>
                    </ol>
                `,
                formula: "H⁽ˡ⁺¹⁾ = σ(D̃⁻½ÃD̃⁻½H⁽ˡ⁾W⁽ˡ⁾)",
                formulaExplanation: `
                    <ul>
                        <li>Ã = A + I (adjacency matrix with self-loops)</li>
                        <li>D̃ = degree matrix</li>
                        <li>D̃⁻½ÃD̃⁻½ = symmetric normalization</li>
                        <li>W⁽ˡ⁾ = learnable weight matrix</li>
                        <li>σ = activation function (ReLU)</li>
                    </ul>
                `,
                pros: [
                    "✅ Simple and efficient",
                    "✅ Strong theoretical foundation",
                    "✅ Works well for many tasks",
                    "✅ Fast training"
                ],
                cons: [
                    "❌ Treats all neighbors equally",
                    "❌ Requires the full graph during training",
                    "❌ Can't easily handle new nodes (transductive)"
                ],
                whenToUse: "Use GCN when you have a fixed graph and want a simple, fast baseline. Great for citation networks, social networks.",
                realWorldExample: "📚 <strong>Paper Classification:</strong> GCN excels at classifying research papers based on citation networks."
            },

            GraphSAGE: {
                title: "GraphSAGE: Graph Sample and Aggregate",
                whatItIs: "An inductive GNN that learns by sampling and aggregating from node neighborhoods.",
                howItWorks: `
                    <p>GraphSAGE <strong>samples</strong> a fixed number of neighbors instead of using all of them:</p>
                    <ol>
                        <li>Sample a fixed number of neighbors (e.g., 10 neighbors)</li>
                        <li>Aggregate their features using mean, LSTM, or pooling</li>
                        <li>Concatenate with node's own features</li>
                        <li>Apply transformation and activation</li>
                    </ol>
                `,
                formula: "h_v⁽ˡ⁺¹⁾ = σ(W·CONCAT(h_v⁽ˡ⁾, AGG({h_u⁽ˡ⁾ : u ∈ N(v)})))",
                formulaExplanation: `
                    <ul>
                        <li>N(v) = sampled neighbors of v</li>
                        <li>AGG = aggregation function (mean, max, LSTM)</li>
                        <li>CONCAT = concatenate own features with aggregated</li>
                        <li>W = learnable weight matrix</li>
                    </ul>
                `,
                pros: [
                    "✅ Inductive - can handle new nodes",
                    "✅ Scalable to large graphs",
                    "✅ Flexible aggregation functions",
                    "✅ Doesn't need full graph"
                ],
                cons: [
                    "❌ Sampling adds randomness",
                    "❌ More hyperparameters to tune",
                    "❌ Slightly more complex than GCN"
                ],
                whenToUse: "Use GraphSAGE for large, evolving graphs where new nodes appear. Perfect for recommendation systems, social networks.",
                realWorldExample: "🛒 <strong>Product Recommendations:</strong> GraphSAGE can recommend products to new users by sampling similar users' preferences."
            },

            GAT: {
                title: "GAT: Graph Attention Network",
                whatItIs: "A GNN that learns to pay more attention to important neighbors using attention mechanisms.",
                howItWorks: `
                    <p>GAT uses <strong>attention</strong> to weight neighbor contributions:</p>
                    <ol>
                        <li>Compute attention scores between node pairs</li>
                        <li>Normalize scores with softmax</li>
                        <li>Weight neighbor features by attention scores</li>
                        <li>Aggregate weighted features</li>
                    </ol>
                `,
                formula: "h_v⁽ˡ⁺¹⁾ = σ(Σ_{u∈N(v)} α_{uv} W h_u⁽ˡ⁾)",
                formulaExplanation: `
                    <ul>
                        <li>α_{uv} = attention weight from u to v</li>
                        <li>α_{uv} = softmax(LeakyReLU(a^T[Wh_u || Wh_v]))</li>
                        <li>|| = concatenation</li>
                        <li>a = learnable attention vector</li>
                    </ul>
                `,
                pros: [
                    "✅ Learns which neighbors are important",
                    "✅ Interpretable (can visualize attention)",
                    "✅ Often better performance",
                    "✅ Handles varying neighbor importance"
                ],
                cons: [
                    "❌ More parameters to learn",
                    "❌ Slower training",
                    "❌ More memory intensive",
                    "❌ Can overfit on small graphs"
                ],
                whenToUse: "Use GAT when neighbor importance varies. Excellent for heterogeneous graphs, knowledge graphs.",
                realWorldExample: "🔍 <strong>Fraud Detection:</strong> GAT learns that transactions to known fraudsters should get high attention weights."
            }
        },

        comparison: {
            title: "Architecture Comparison",
            table: `
                <table>
                    <tr>
                        <th>Feature</th>
                        <th>GCN</th>
                        <th>GraphSAGE</th>
                        <th>GAT</th>
                    </tr>
                    <tr>
                        <td>Neighbor Weighting</td>
                        <td>Equal (degree-normalized)</td>
                        <td>Equal within sample</td>
                        <td>Learned (attention)</td>
                    </tr>
                    <tr>
                        <td>Inductive</td>
                        <td>❌ No</td>
                        <td>✅ Yes</td>
                        <td>✅ Yes</td>
                    </tr>
                    <tr>
                        <td>Scalability</td>
                        <td>Medium</td>
                        <td>High</td>
                        <td>Medium</td>
                    </tr>
                    <tr>
                        <td>Complexity</td>
                        <td>Low</td>
                        <td>Medium</td>
                        <td>High</td>
                    </tr>
                    <tr>
                        <td>Best For</td>
                        <td>Fixed graphs</td>
                        <td>Large/evolving graphs</td>
                        <td>Heterogeneous graphs</td>
                    </tr>
                </table>
            `
        },

        quiz: [
            {
                question: "What is the main advantage of GAT over GCN?",
                options: [
                    "It's faster to train",
                    "It learns which neighbors are more important",
                    "It uses less memory",
                    "It requires less data"
                ],
                correct: 1,
                explanation: "GAT uses attention mechanisms to learn importance weights for each neighbor, rather than treating all neighbors equally."
            },
            {
                question: "Which architecture is best for handling new nodes that weren't in the training graph?",
                options: ["GCN", "GraphSAGE", "GAT", "All are equally good"],
                correct: 1,
                explanation: "GraphSAGE is inductive - it learns to aggregate from sampled neighborhoods, so it can handle new nodes without retraining."
            },
            {
                question: "Why does GCN use symmetric normalization (D̃⁻½ÃD̃⁻½)?",
                options: [
                    "To make the graph look symmetric",
                    "To prevent high-degree nodes from dominating",
                    "To reduce memory usage",
                    "To speed up training"
                ],
                correct: 1,
                explanation: "Symmetric normalization prevents nodes with many neighbors from having disproportionately large influence on their neighbors."
            }
        ],

        summary: `
            <h3>Key Takeaways</h3>
            <ul>
                <li>✅ <strong>GCN:</strong> Simple, fast, great baseline - treats all neighbors equally</li>
                <li>✅ <strong>GraphSAGE:</strong> Scalable, inductive - samples neighbors for efficiency</li>
                <li>✅ <strong>GAT:</strong> Learns attention - identifies important neighbors</li>
                <li>✅ Choose based on your needs: fixed vs. evolving graph, interpretability, scale</li>
            </ul>

            <h4>Decision Guide:</h4>
            <p>📊 <strong>Small fixed graph?</strong> → Start with GCN</p>
            <p>🚀 <strong>Large or evolving graph?</strong> → Use GraphSAGE</p>
            <p>🎯 <strong>Need interpretability or varying importance?</strong> → Try GAT</p>

            <p><strong>Next:</strong> Learn how different aggregation functions affect GNN performance!</p>
        `
    },

    /**
     * Lesson 4: Aggregation Functions
     */
    lesson4: {
        title: "Aggregation Functions: Mean, Sum, and Max",
        subtitle: "Understanding how different aggregation functions affect GNN behavior",

        learningObjectives: [
            "Understand the three main aggregation functions: mean, sum, max",
            "Learn when to use each aggregation function",
            "See how aggregation affects node representations",
            "Understand trade-offs between different aggregation approaches"
        ],

        introduction: `
            <h3>Why Aggregation Matters</h3>
            <p>Aggregation is the heart of message passing! It determines how a node combines information from its neighbors.
            The choice of aggregation function significantly impacts what patterns the GNN can learn.</p>

            <h4>The Three Main Functions:</h4>
            <ul>
                <li><strong>MEAN:</strong> Average of neighbor features</li>
                <li><strong>SUM:</strong> Total of neighbor features</li>
                <li><strong>MAX:</strong> Maximum value across neighbors</li>
            </ul>

            <p><strong>Key Question:</strong> Should all neighbors contribute equally? Should larger neighborhoods have more influence?
            Should we focus on the most extreme neighbor? The aggregation function answers these questions!</p>
        `,

        functions: {
            mean: {
                title: "MEAN Aggregation",
                formula: "h̃_v = (1/|N(v)|) Σ_{u∈N(v)} h_u",
                formulaExplanation: "Average of all neighbor features, normalized by neighborhood size |N(v)|",

                howItWorks: `
                    <p>MEAN aggregation computes the <strong>average</strong> of neighbor features:</p>
                    <ol>
                        <li>Sum all neighbor feature vectors</li>
                        <li>Divide by the number of neighbors</li>
                        <li>Result: normalized representation</li>
                    </ol>
                `,

                pros: [
                    "✅ <strong>Degree-invariant:</strong> Nodes with many neighbors aren't overweighted",
                    "✅ <strong>Stable:</strong> Less sensitive to outliers",
                    "✅ <strong>Interpretable:</strong> Easy to understand as 'average neighborhood'",
                    "✅ <strong>Works well in practice:</strong> Default choice for many GNNs"
                ],

                cons: [
                    "❌ <strong>Loses magnitude information:</strong> Can't distinguish 1 neighbor vs. 100 neighbors",
                    "❌ <strong>Treats all neighbors equally:</strong> Can't emphasize important neighbors",
                    "❌ <strong>Smooths out extremes:</strong> May miss important outlier signals"
                ],

                whenToUse: `
                    <p><strong>Use MEAN when:</strong></p>
                    <ul>
                        <li>Nodes have varying degrees (some have many neighbors, some have few)</li>
                        <li>You want stable, normalized representations</li>
                        <li>All neighbors should contribute equally</li>
                        <li>You're starting with GCN or GraphSAGE</li>
                    </ul>
                `,

                realWorldExample: `
                    <p>📱 <strong>Social Network Analysis:</strong></p>
                    <p>Predicting user interests based on friends' interests. MEAN aggregation ensures that users with 1000 friends
                    aren't overwhelmed by their neighborhood, while users with 10 friends still get meaningful signals.</p>
                    <p><em>Example:</em> If your friends' average age is 25, your predicted age might be around 25,
                    regardless of whether you have 5 friends or 500 friends.</p>
                `
            },

            sum: {
                title: "SUM Aggregation",
                formula: "h̃_v = Σ_{u∈N(v)} h_u",
                formulaExplanation: "Sum of all neighbor features (no normalization)",

                howItWorks: `
                    <p>SUM aggregation simply <strong>adds up</strong> all neighbor features:</p>
                    <ol>
                        <li>Sum all neighbor feature vectors</li>
                        <li>No normalization or division</li>
                        <li>Result: magnitude reflects neighborhood size</li>
                    </ol>
                `,

                pros: [
                    "✅ <strong>Preserves magnitude:</strong> Larger neighborhoods have more influence",
                    "✅ <strong>Captures total information:</strong> Doesn't lose signal strength",
                    "✅ <strong>Useful for counting:</strong> Can learn patterns like 'number of neighbors with property X'",
                    "✅ <strong>Theoretically powerful:</strong> Can distinguish graphs that MEAN cannot"
                ],

                cons: [
                    "❌ <strong>Degree-dependent:</strong> High-degree nodes dominate",
                    "❌ <strong>Scale issues:</strong> Features can grow very large",
                    "❌ <strong>Requires careful normalization:</strong> May need batch norm or layer norm",
                    "❌ <strong>Less stable:</strong> More sensitive to graph structure"
                ],

                whenToUse: `
                    <p><strong>Use SUM when:</strong></p>
                    <ul>
                        <li>Neighborhood size is informative (e.g., popularity matters)</li>
                        <li>You need to preserve total information</li>
                        <li>You're doing graph-level tasks (graph classification)</li>
                        <li>You want maximum expressiveness</li>
                    </ul>
                `,

                realWorldExample: `
                    <p>💰 <strong>Financial Fraud Detection:</strong></p>
                    <p>Detecting money laundering rings. SUM aggregation helps identify accounts that receive many small transactions
                    (which might be suspicious). The total amount matters, not just the average!</p>
                    <p><em>Example:</em> An account receiving 100 transactions of $10 each (total $1000) should be flagged differently
                    than an account receiving 1 transaction of $10 (total $10), even though the average is the same.</p>
                `
            },

            max: {
                title: "MAX Aggregation",
                formula: "h̃_v = max_{u∈N(v)} h_u",
                formulaExplanation: "Element-wise maximum across all neighbor features",

                howItWorks: `
                    <p>MAX aggregation takes the <strong>maximum value</strong> for each feature dimension:</p>
                    <ol>
                        <li>For each feature dimension, look at all neighbors</li>
                        <li>Take the maximum value in that dimension</li>
                        <li>Result: captures most extreme/important signals</li>
                    </ol>
                `,

                pros: [
                    "✅ <strong>Finds important signals:</strong> Identifies most extreme neighbor",
                    "✅ <strong>Robust to noise:</strong> Ignores less important neighbors",
                    "✅ <strong>Degree-invariant:</strong> Doesn't depend on neighborhood size",
                    "✅ <strong>Good for detection:</strong> Finds anomalies or important features"
                ],

                cons: [
                    "❌ <strong>Loses information:</strong> Ignores all but the maximum",
                    "❌ <strong>Not differentiable everywhere:</strong> Can cause training issues",
                    "❌ <strong>Sensitive to outliers:</strong> One extreme neighbor dominates",
                    "❌ <strong>Less commonly used:</strong> Fewer proven applications"
                ],

                whenToUse: `
                    <p><strong>Use MAX when:</strong></p>
                    <ul>
                        <li>You're looking for the most important/extreme signal</li>
                        <li>Outliers are informative (not noise)</li>
                        <li>You want to detect anomalies or rare events</li>
                        <li>You're doing pooling in graph classification</li>
                    </ul>
                `,

                realWorldExample: `
                    <p>🔒 <strong>Cybersecurity - Intrusion Detection:</strong></p>
                    <p>Detecting compromised accounts in a network. MAX aggregation helps identify if ANY neighbor shows suspicious behavior.
                    If even one connected account is compromised, that's a red flag!</p>
                    <p><em>Example:</em> If your account connects to 99 normal accounts and 1 hacked account, MAX aggregation will
                    catch the suspicious signal from that 1 hacked account, while MEAN might dilute it.</p>
                `
            }
        },

        comparison: {
            title: "Side-by-Side Comparison",
            example: `
                <h4>Example Scenario:</h4>
                <p>A node has 3 neighbors with feature values: [2.0, 5.0, 8.0]</p>

                <table style="width:100%; margin-top:15px;">
                    <tr>
                        <th>Function</th>
                        <th>Calculation</th>
                        <th>Result</th>
                    </tr>
                    <tr>
                        <td><strong>MEAN</strong></td>
                        <td>(2.0 + 5.0 + 8.0) / 3</td>
                        <td>5.0</td>
                    </tr>
                    <tr>
                        <td><strong>SUM</strong></td>
                        <td>2.0 + 5.0 + 8.0</td>
                        <td>15.0</td>
                    </tr>
                    <tr>
                        <td><strong>MAX</strong></td>
                        <td>max(2.0, 5.0, 8.0)</td>
                        <td>8.0</td>
                    </tr>
                </table>

                <p style="margin-top:15px;"><strong>Notice:</strong> Each function captures different aspects of the neighborhood!</p>
            `,

            decisionGuide: `
                <h4>Decision Guide:</h4>
                <ul>
                    <li>🎯 <strong>Default choice?</strong> → Start with MEAN (most stable)</li>
                    <li>📊 <strong>Size matters?</strong> → Use SUM (preserves magnitude)</li>
                    <li>🔍 <strong>Looking for extremes?</strong> → Try MAX (finds outliers)</li>
                    <li>🧪 <strong>Not sure?</strong> → Experiment with all three!</li>
                </ul>
            `
        },

        quiz: [
            {
                question: "Which aggregation function is degree-invariant (doesn't depend on neighborhood size)?",
                options: ["Only MEAN", "Only SUM", "MEAN and MAX", "All three"],
                correct: 2,
                explanation: "MEAN and MAX are degree-invariant because they normalize (MEAN) or select (MAX). SUM grows with neighborhood size."
            },
            {
                question: "In fraud detection, why might SUM aggregation be better than MEAN?",
                options: [
                    "It's faster to compute",
                    "It preserves the total transaction amount",
                    "It's more accurate",
                    "It uses less memory"
                ],
                correct: 1,
                explanation: "SUM preserves magnitude - 100 small transactions totaling $1000 is different from 1 transaction of $10, even if the mean is similar."
            },
            {
                question: "When would MAX aggregation be most useful?",
                options: [
                    "When you want stable, normalized features",
                    "When you need to detect if ANY neighbor has a suspicious property",
                    "When you want to count neighbors",
                    "When all neighbors are equally important"
                ],
                correct: 1,
                explanation: "MAX is great for detection tasks where even one suspicious neighbor is a red flag. It finds the most extreme signal."
            }
        ],

        summary: `
            <h3>Key Takeaways</h3>
            <ul>
                <li>✅ <strong>MEAN:</strong> Stable, normalized, degree-invariant - best default choice</li>
                <li>✅ <strong>SUM:</strong> Preserves magnitude, captures total information - use when size matters</li>
                <li>✅ <strong>MAX:</strong> Finds extremes, robust to noise - use for detection tasks</li>
                <li>✅ Choice of aggregation function significantly impacts what patterns GNN can learn</li>
            </ul>

            <h4>Practical Advice:</h4>
            <p>💡 <strong>Start with MEAN</strong> - it works well for most tasks</p>
            <p>🔬 <strong>Experiment</strong> - try different functions and see what works best</p>
            <p>🎯 <strong>Task-specific</strong> - consider what information matters for your problem</p>
            <p>🚀 <strong>Combine</strong> - some GNNs use multiple aggregation functions together!</p>

            <p><strong>Congratulations!</strong> You now understand the core concepts of Graph Neural Networks!
            You're ready to apply GNNs to real-world problems like fraud detection, recommendation systems, and drug discovery.</p>
        `
    }
};

