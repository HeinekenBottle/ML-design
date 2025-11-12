# GNN Educational Interface: Visual Design Mockups

**Document Version:** 1.0  
**Date:** 2025-11-12  
**Purpose:** Visual design specifications and mockups for the redesigned interface

---

## 1. Overall Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    Interactive GNN Learning Platform                     │
│                         [Progress: ████░░░░░░ 40%]                      │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  LESSON SELECTOR                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │ Graph    │ │ Message  │ │   GNN    │ │Aggreg.   │ │Financial │     │
│  │ Basics   │ │ Passing  │ │  Arch.   │ │Functions │ │  Apps    │     │
│  │   ✓      │ │   ◄──    │ │          │ │          │ │          │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  LEARNING MODE SELECTOR                                                  │
│  ○ Guided Tutorial    ● Sandbox Mode    ○ Challenge Mode               │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┬──────────────────────────────────────────┐
│                              │                                          │
│   VISUALIZATION CANVAS       │   EXPLANATION PANEL                      │
│                              │                                          │
│   [Interactive Graph]        │   📖 Message Passing in GNNs            │
│                              │                                          │
│                              │   Message passing is the core mechanism  │
│                              │   in Graph Neural Networks:              │
│                              │                                          │
│                              │   1. Send messages: Each node sends...   │
│                              │   2. Aggregate: Each node collects...    │
│                              │   3. Update: Each node updates...        │
│                              │                                          │
│                              │   ┌────────────────────────────────┐    │
│                              │   │ 💡 Key Insight                 │    │
│                              │   │ The aggregation function       │    │
│                              │   │ determines how information     │    │
│                              │   │ from neighbors is combined     │    │
│                              │   └────────────────────────────────┘    │
│                              │                                          │
├──────────────────────────────┴──────────────────────────────────────────┤
│  ANIMATION CONTROLS                                                      │
│  [◄◄] [▶ Play] [↺ Reset] [►►]     Speed: [0.5x] [1x] [2x]            │
│                                                                          │
│  Timeline: ├─────●──────────────────────────────────┤                  │
│            0s   2s   Sending   Aggregation   Update  9s                 │
│                                                                          │
│  Current Phase: Sending Messages (Progress: 45%)                        │
│  ▓▓▓▓▓▓▓▓▓░░░░░░░░░░                                                   │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  STATISTICS & METRICS                                                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                  │
│  │Messages  │ │Aggreg.   │ │  Steps   │ │Neighbors │                  │
│  │  Sent    │ │  Type    │ │Completed │ │          │                  │
│  │    3     │ │   Mean   │ │   1/3    │ │    5     │                  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘                  │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  INTERACTIVE CONTROLS                                                    │
│  Graph Type: [Random ▼]    Nodes: [●────────] 8                        │
│  Aggregation: [Mean ▼]     Layers: [●────────] 2                       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Canvas Visualization States

### State 1: Graph Basics - Initial View

```
     Node Features
         ↓
    ┌─────────┐
    │ [2.3]   │  ← Node with feature value
    │ [4.1]   │
    │ [1.8]   │
    └─────────┘
         ↓
    ╭─────────╮
    │    5    │  ← Node ID 5
    │  ●      │     Color: Cyan (#00d9ff)
    │  2.3    │  ← Current value
    ╰─────────╯
         │
         │ ← Edge (connection)
         ↓
    ╭─────────╮
    │    3    │
    │  ●      │
    │  4.7    │
    ╰─────────╯

Legend:
● Default node (cyan)
● Active node (pink)
● Source node (green)
● Target node (orange)
```

### State 2: Message Passing - Sending Phase

```
Source Nodes (Green)          Target Node (Orange)
     ╭───╮                         ╭───╮
     │ 1 │ ─────→ ◆ ─────→        │ 0 │
     ╰───╯        ↑                ╰───╯
                  │                  ↑
     ╭───╮        │                  │
     │ 2 │ ───────┘      ◆ ─────────┘
     ╰───╯               ↑
                         │
     ╭───╮               │
     │ 3 │ ──────────────┘
     ╰───╯

◆ = Message particle (pink)
  Contains feature vector from source node
  Travels along edge toward target

Animation:
- Particles move smoothly from source to target
- Multiple particles can be in flight simultaneously
- Particle size indicates message importance
- Hover over particle shows message content
```

### State 3: Message Passing - Aggregation Phase

```
                    Incoming Messages
                    ╭───╮ ╭───╮ ╭───╮
                    │2.1│ │3.4│ │1.8│
                    ╰─┬─╯ ╰─┬─╯ ╰─┬─╯
                      │     │     │
                      └──┬──┴──┬──┘
                         │     │
                    ╭────▼─────▼────╮
                    │  Aggregation  │
                    │   Function    │
                    │   (Mean)      │
                    ╰───────┬───────╯
                            │
                      (2.1+3.4+1.8)/3
                            │
                          = 2.4
                            ↓
                       ╭─────────╮
                       │    0    │
                       │   ●     │ ← Glowing effect
                       │   2.4   │
                       ╰─────────╯

Visual Effects:
- Messages spiral into target node
- Aggregation formula displayed above node
- Node pulses during aggregation
- Result value animates from old to new
```

### State 4: Attention Mechanism (GAT)

```
         Attention Scores
              ↓
    Node 2 ──────── 0.35 ──────┐
              (thick edge)      │
                                ↓
    Node 3 ──────── 0.42 ──────● Node 0
              (thickest)        ↑
                                │
    Node 7 ──────── 0.23 ───────┘
              (thin edge)

Edge Thickness = Attention Weight
- Thicker edges = Higher attention
- Color intensity = Attention strength
- Hover shows exact attention score

Attention Score Calculation:
┌─────────────────────────────────┐
│ α(0,2) = softmax(e(0,2))       │
│        = exp(e(0,2))            │
│          ─────────────          │
│          Σ exp(e(0,k))          │
│                                 │
│ e(0,2) = LeakyReLU(a^T[Wh₀||Wh₂])│
└─────────────────────────────────┘
```

---

## 3. Color Palette and Visual Language

### Primary Colors

```
Cyan (#00d9ff)     ████  Default/Inactive state
Purple (#b366ff)   ████  Hidden layers/Intermediate
Pink (#ff66d9)     ████  Active/Highlighted state
Dark (#0a0e27)     ████  Background
Dark-Med (#1a1f3a) ████  Panels/Cards
```

### Semantic Colors

```
Green (#00ff88)    ████  Source nodes (sending)
Orange (#ff8800)   ████  Target nodes (receiving)
Yellow (#ffff00)   ████  User-selected elements
Red (#ff4444)      ████  Errors/Anomalies
Blue (#0088ff)     ████  Information/Hints
```

### Gradient Examples

```
Edge Gradient (Active):
├─ Cyan (#00d9ff) ─────────────── Purple (#b366ff) ─┤
   (source)                        (target)

Node Glow (Active):
Center: Pink (#ff66d9) at 100% opacity
Edge:   Pink (#ff66d9) at 0% opacity
Radius: 2x node radius
```

---

## 4. Interactive Element States

### Button States

```
Default State:
┌─────────────┐
│   ▶ Play    │  Border: Cyan, Background: Transparent
└─────────────┘  Text: Cyan

Hover State:
┌─────────────┐
│   ▶ Play    │  Border: Cyan, Background: Cyan
└─────────────┘  Text: Dark, Slight lift effect

Active/Pressed:
┌─────────────┐
│   ⏸ Pause   │  Border: Pink, Background: Pink
└─────────────┘  Text: Dark

Disabled:
┌─────────────┐
│   ▶ Play    │  Border: Gray, Background: Transparent
└─────────────┘  Text: Gray, Opacity: 50%, No hover effect
```

### Slider States

```
Default:
├────●──────────────┤  Track: Cyan (30% opacity)
                      Handle: Cyan (solid)
                      Fill: Cyan gradient

Active (Dragging):
├────●──────────────┤  Track: Cyan (50% opacity)
                      Handle: Pink (solid, larger)
                      Fill: Pink gradient
                      Show value tooltip above handle
```

### Node Interaction States

```
Default (No Interaction):
   ╭───╮
   │ 5 │  Border: White (2px)
   │ ● │  Fill: Cyan
   ╰───╯

Hover:
   ╭───╮
   │ 5 │  Border: White (3px)
   │ ● │  Fill: Cyan (brighter)
   ╰───╯  Glow effect
   ↑
   └─ Tooltip appears:
      ┌──────────────────┐
      │ Node 5           │
      │ Value: 2.3       │
      │ Degree: 3        │
      │ Features: [...]  │
      └──────────────────┘

Selected:
   ╭───╮
   │ 5 │  Border: Yellow (4px)
   │ ● │  Fill: Yellow
   ╰───╯  Strong glow
         Neighborhood highlighted

Dragging (Sandbox Mode):
   ╭───╮
   │ 5 │  Border: White (2px)
   │ ● │  Fill: Cyan (50% opacity)
   ╰───╯  Cursor: grabbing
         Ghost image at original position
```

---

## 5. Tooltip and Explanation Styles

### Inline Tooltip (Hover)

```
┌─────────────────────────────────┐
│ Aggregation Function            │
│ ─────────────────────────────── │
│ Combines messages from          │
│ neighboring nodes into a        │
│ single representation.          │
│                                 │
│ Current: Mean                   │
│ Result: (2.1 + 3.4 + 1.8) / 3  │
│       = 2.43                    │
└─────────────────────────────────┘
  ↑
  └─ Appears near cursor
     Fades in over 200ms
     Max width: 300px
     Background: Dark with 90% opacity
     Border: Cyan (1px)
```

### Contextual Help Panel

```
┌─────────────────────────────────────────┐
│ 💡 Key Insight                          │
├─────────────────────────────────────────┤
│                                         │
│ The aggregation function determines     │
│ how information from neighbors is       │
│ combined. Different functions have      │
│ different properties:                   │
│                                         │
│ • Mean: Normalizes by degree           │
│ • Sum: Preserves total information     │
│ • Max: Selects most important feature  │
│                                         │
│ [Try different functions →]             │
└─────────────────────────────────────────┘

Background: Dark-Medium (#1a1f3a)
Border-Left: Cyan (4px)
Icon: 💡 (or custom SVG)
Padding: 1.5rem
Margin: 1rem 0
```

### Step Description

```
┌─────────────────────────────────────────┐
│ Step 2 of 4: Sending Messages           │
├─────────────────────────────────────────┤
│                                         │
│ Each source node (green) is sending     │
│ its feature vector to the target node   │
│ (orange). Watch the pink particles      │
│ travel along the edges.                 │
│                                         │
│ ▓▓▓▓▓▓▓▓▓░░░░░░░░░░ 45%               │
└─────────────────────────────────────────┘

Position: Below animation controls
Updates: Real-time as animation progresses
Progress bar: Matches current step progress
```

---

## 6. Learning Mode Specific Designs

### Guided Tutorial Mode

```
┌─────────────────────────────────────────────────────────┐
│ 🎓 Guided Tutorial: Message Passing                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Step 1 of 5: Identifying Source Nodes                  │
│                                                         │
│ ┌─────────────────────────────────────────────────┐   │
│ │                                                 │   │
│ │   [Graph with highlighted nodes]               │   │
│ │                                                 │   │
│ │   ← Click on a source node (green)             │   │
│ │                                                 │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ 📝 Task: Click on all source nodes                     │
│ Progress: ●●●○○ (3 of 5 found)                         │
│                                                         │
│ [💡 Need a hint?]                    [Next Step →]     │
│                                      (disabled)         │
└─────────────────────────────────────────────────────────┘

Features:
- Clear task description
- Visual highlighting of relevant elements
- Progress indicator
- Hint system
- Next button only enabled when task complete
```

### Sandbox Mode

```
┌─────────────────────────────────────────────────────────┐
│ 🔬 Sandbox: Build Your Own Graph                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Tools:  [+ Node] [+ Edge] [✏️ Edit] [🗑️ Delete]        │
│                                                         │
│ ┌─────────────────────────────────────────────────┐   │
│ │                                                 │   │
│ │   [Empty canvas or user-created graph]         │   │
│ │                                                 │   │
│ │   Click to add nodes                           │   │
│ │   Drag between nodes to add edges              │   │
│ │                                                 │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ Graph Properties:                                       │
│ • Nodes: 8                                             │
│ • Edges: 12                                            │
│ • Density: 0.43                                        │
│ • Connected: Yes ✓                                     │
│                                                         │
│ [Run Message Passing] [Save Graph] [Load Example]      │
└─────────────────────────────────────────────────────────┘

Features:
- Tool palette for graph manipulation
- Real-time graph statistics
- Ability to run algorithms on custom graphs
- Save/load functionality
```

### Challenge Mode

```
┌─────────────────────────────────────────────────────────┐
│ 🏆 Challenge: Fraud Detection                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Scenario: Find the fraudulent transaction in this      │
│ financial network. Look for unusual patterns.          │
│                                                         │
│ Time Remaining: 1:45  ⏱️                                │
│ Hints Used: 0/3       💡                                │
│                                                         │
│ ┌─────────────────────────────────────────────────┐   │
│ │                                                 │   │
│ │   [Transaction network graph]                  │   │
│ │                                                 │   │
│ │   Click on suspicious nodes                    │   │
│ │                                                 │   │
│ └─────────────────────────────────────────────────┘   │
│                                                         │
│ Selected Nodes: [5, 12]                                │
│                                                         │
│ [💡 Get Hint]                      [Submit Answer]     │
└─────────────────────────────────────────────────────────┘

Features:
- Clear challenge objective
- Timer display
- Hint system with limited uses
- Node selection interface
- Submit button for answer checking
```

---

## 7. Responsive Design Breakpoints

### Desktop (> 1200px)
- Side-by-side canvas and explanation panel
- Full control panel with all buttons visible
- 4-column statistics grid

### Tablet (768px - 1200px)
- Stacked canvas and explanation panel
- Compact control panel with icon-only buttons
- 2-column statistics grid

### Mobile (< 768px)
- Full-width canvas
- Collapsible explanation panel
- Vertical button layout
- 1-column statistics grid
- Swipe gestures for lesson navigation

---

## 8. Animation Transition Effects

### Lesson Transition

```
Current Lesson (Fading Out):
Opacity: 100% → 0%
Transform: scale(1) → scale(0.95)
Duration: 300ms
Easing: ease-out

New Lesson (Fading In):
Opacity: 0% → 100%
Transform: scale(1.05) → scale(1)
Duration: 300ms
Delay: 200ms (after fade out starts)
Easing: ease-in
```

### Control Button Feedback

```
Button Click:
1. Scale down: scale(1) → scale(0.95) (100ms)
2. Scale up: scale(0.95) → scale(1) (100ms)
3. Ripple effect from click point
4. Color change if state changes
```

### Node Selection

```
Selection Animation:
1. Border expands: 2px → 4px (150ms)
2. Glow appears: opacity 0% → 100% (200ms)
3. Color shifts: Cyan → Yellow (200ms)
4. Neighborhood highlights with delay (100ms per hop)
```

---

## 9. Accessibility Considerations

### Color Blindness Support

```
Alternative Color Schemes:

Protanopia (Red-Blind):
- Source: Blue (#0088ff) instead of Green
- Target: Orange (#ff8800) - unchanged
- Active: Purple (#b366ff) instead of Pink

Deuteranopia (Green-Blind):
- Source: Blue (#0088ff) instead of Green
- Target: Orange (#ff8800) - unchanged
- Active: Purple (#b366ff) instead of Pink

Tritanopia (Blue-Blind):
- Source: Green (#00ff88) - unchanged
- Target: Red (#ff4444) instead of Orange
- Active: Pink (#ff66d9) - unchanged
```

### Keyboard Navigation

```
Tab Order:
1. Lesson selector cards (left to right)
2. Mode selector buttons (left to right)
3. Animation controls (left to right)
4. Interactive controls (top to bottom)
5. Canvas (for node selection with arrow keys)

Keyboard Shortcuts:
Space:     Play/Pause
R:         Reset
→:         Step Forward
←:         Step Backward
1-3:       Speed control (1=0.5x, 2=1x, 3=2x)
Tab:       Next interactive element
Shift+Tab: Previous interactive element
Enter:     Activate selected element
Esc:       Deselect/Cancel
```

### Screen Reader Support

```
ARIA Labels:
- Canvas: "Graph visualization showing [current lesson]"
- Nodes: "Node [id], value [value], degree [degree]"
- Edges: "Edge from node [from] to node [to]"
- Controls: Descriptive labels for all buttons
- Progress: "Animation progress: [percentage]%"

Live Regions:
- Phase changes announced
- Step descriptions read aloud
- Statistics updates announced
- Error messages announced immediately
```

---

## 10. Performance Indicators

### Loading States

```
Initial Load:
┌─────────────────────────────────┐
│                                 │
│     ⟳  Loading GNN Interface    │
│                                 │
│     ▓▓▓▓▓▓▓░░░░░░░░░░ 35%     │
│                                 │
└─────────────────────────────────┘

Graph Generation:
┌─────────────────────────────────┐
│  Generating graph...            │
│  ⟳ Creating nodes and edges     │
└─────────────────────────────────┘

Animation Processing:
┌─────────────────────────────────┐
│  Computing message passing...   │
│  ⟳ Step 2 of 4                  │
└─────────────────────────────────┘
```

### Error States

```
Graph Generation Error:
┌─────────────────────────────────┐
│  ⚠️ Error                        │
│                                 │
│  Could not generate graph with  │
│  the specified parameters.      │
│                                 │
│  [Try Again] [Use Default]      │
└─────────────────────────────────┘

Animation Error:
┌─────────────────────────────────┐
│  ⚠️ Animation Error              │
│                                 │
│  The animation encountered an   │
│  error. Resetting to beginning. │
│                                 │
│  [OK]                           │
└─────────────────────────────────┘
```

---

**End of Visual Design Mockups**

These mockups provide a comprehensive visual guide for implementing the redesigned GNN educational interface. All measurements, colors, and interactions are specified to ensure consistent implementation across the platform.

