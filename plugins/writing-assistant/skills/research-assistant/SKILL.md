---
name: research-assistant
description: Research topics for world-building, fact-checking, and story authenticity. Gathers information on science, history, technology, culture, and other factual elements to support fiction writing. Use when the user needs to research anything for their story.
---

# Research Assistant Skill

## Purpose
Gather accurate, relevant information to support world-building, ensure story authenticity, and provide the factual foundation for fictional elements.

## When to Use This Skill

Activate when the user asks to:
- Research a topic for their story
- Fact-check technical details
- Understand how something works
- Gather historical or cultural information
- Find inspiration from real-world science/technology
- Verify accuracy of story elements

## Research Process

### Step 1: Understand the Research Query

Ask clarifying questions:
- **What information is needed?** (specific facts, general overview, technical details)
- **How will it be used?** (background knowledge, plot element, world-building)
- **Accuracy level needed?** (Hard SF requiring precision, soft SF needing plausibility, fantasy needing inspiration)
- **Time period?** (historical accuracy vs. future speculation)

### Step 2: Conduct the Research

Use appropriate research methods:

#### For Current Facts & Science
```
Use web_search to find:
- Scientific principles and current understanding
- Technical specifications and how things work
- Expert opinions and authoritative sources
- Recent developments and discoveries
```

#### For Historical Information
```
Search for:
- Primary sources when available
- Academic sources (universities, museums)
- Historical records and documentation
- Expert historical analyses
```

#### For Cultural/Social Information
```
Research:
- Cultural practices and norms
- Social structures and hierarchies
- Religious/spiritual beliefs
- Daily life and customs
```

#### For Speculative/Future Topics
```
Find:
- Current trends and trajectory
- Expert predictions and speculation
- Existing prototypes or research
- Theoretical foundations
```

### Step 3: Evaluate Sources

Prioritize credible sources:

**Excellent Sources:**
- Peer-reviewed journals
- University websites
- Government agencies (NASA, NIH, etc.)
- Museums and cultural institutions
- Expert interviews and books
- Industry publications

**Good Sources:**
- Reputable news outlets
- Educational websites
- Professional organizations
- Well-cited Wikipedia articles (as starting point)

**Use Cautiously:**
- Blog posts (unless by recognized experts)
- Forums and Q&A sites
- Social media
- Dated information (especially for science/tech)

**Cross-Reference:**
- Verify facts across multiple sources
- Note when sources disagree
- Flag controversial or disputed information

### Step 4: Synthesize for Creative Use

Transform research into story-useful information:

#### Extract Key Facts
- What are the core truths?
- What terminology should be used?
- What constraints exist?

#### Identify Story Opportunities
- What's interesting or surprising?
- What creates natural conflict?
- What details would enrich the world?
- What misconceptions could drive plot?

#### Note Complications
- What could go wrong?
- What are the limitations?
- What are the consequences?
- What ethical issues arise?

#### Find the Human Element
- How does this affect people?
- What would characters experience?
- What emotions does this evoke?
- What sensory details matter?

### Step 5: Document Findings

Create a research report:

```markdown
## Research: [Topic]
**Date:** [current date]
**For:** [Story element/scene/character]
**Requested by:** [User's question]

### Quick Summary
[2-3 sentence overview of key findings]

### Key Facts
- [Fact 1: Explanation]
  - Source: [URL or citation]
  - Relevance: [How this matters for the story]

- [Fact 2: Explanation]
  - Source: [URL or citation]
  - Relevance: [How this matters for the story]

### Technical Details
[More in-depth explanation if needed]

### Story Implications
- **Plot Opportunities**: [What this enables story-wise]
- **Potential Conflicts**: [Problems this could create]
- **World-Building**: [How this enriches the setting]
- **Character Impact**: [How this affects characters]

### Interesting Details
[Surprising or vivid details that could enrich the narrative]

### Things to Watch Out For
[Common misconceptions, limitations, things to avoid]

### For Further Research
[Topics that came up that might need deeper investigation]

### Sources
1. [Citation/URL] - [Brief description]
2. [Citation/URL] - [Brief description]
```

### Step 6: Save Research

Store research in appropriate location:

```bash
# Pattern 1: Obsidian-style Lexicon
Save to: [project]/Lexicon/World/research-[topic].md

# Pattern 2: Research notes file
Append to: [project]/notes/research.md

# Pattern 3: Custom location
Ask user: "Where should I save this research?"
```

## Research Categories

### Science & Technology

**Physics & Space:**
- How physics actually works
- Space travel realities
- Orbital mechanics
- Time dilation, relativity
- Radiation in space

**Biology & Medicine:**
- How the body works
- Medical procedures
- Diseases and symptoms
- Genetics and heredity
- Evolution and biology

**Technology:**
- How current tech works
- Engineering principles
- Computer science basics
- Communication systems
- Energy and power

**Speculative Science:**
- Current research directions
- Theoretical possibilities
- Expert predictions
- Existing prototypes

### Historical & Cultural

**Time Periods:**
- Daily life in specific eras
- Technology available
- Social norms and customs
- Political structures
- Economic systems

**Cultural Practices:**
- Religious and spiritual beliefs
- Social hierarchies
- Marriage and family structures
- Food and cuisine
- Clothing and fashion
- Arts and entertainment

**Historical Events:**
- Wars and conflicts
- Political changes
- Technological revolutions
- Social movements
- Natural disasters

### Professional & Technical

**Occupations:**
- Day-to-day responsibilities
- Required training/education
- Industry jargon
- Common challenges
- Career progression

**Legal & Procedural:**
- How investigations work
- Court procedures
- Police protocols
- Military structures
- Corporate hierarchies

**Specialized Knowledge:**
- Industry-specific details
- Expert terminology
- Best practices
- Common misconceptions

## Research Depth Levels

### Quick Research (5-10 minutes)
- Basic facts and overview
- Key terminology
- Main concepts
- 2-3 reliable sources

### Standard Research (15-30 minutes)
- Detailed understanding
- Multiple perspectives
- Cross-referenced facts
- Story implications analyzed
- 5-10 sources

### Deep Research (1+ hour)
- Comprehensive knowledge
- Expert-level details
- Nuanced understanding
- Multiple angles explored
- Historical context
- 10+ sources, including academic

## Example Workflows

### Example 1: Quick Science Check
```
User: "How do neural networks actually work? I need it for the AI subplot."

1. Search for neural network basics
2. Find accessible explanations
3. Extract key concepts (nodes, weights, training, etc.)
4. Note storytelling opportunities (AI learning, mistakes, biases)
5. Save brief overview to Lexicon/World/ai-technology.md
6. Provide: "Here's what you need to know for the story..."
```

### Example 2: Historical Deep Dive
```
User: "I need details about 1920s speakeasies for chapter 8."

1. Research speakeasy culture, operations, atmosphere
2. Find historical photos and descriptions
3. Gather details: password systems, jazz music, drinks served
4. Note social dynamics: who went, why, risks involved
5. Collect sensory details: sounds, smells, sights
6. Document in notes/research.md with sources
7. Provide: "Here's what speakeasies were really like..."
```

### Example 3: Technical Accuracy
```
User: "In chapter 12, Sarah performs CPR. Make sure I got it right."

1. Read the user's scene
2. Research current CPR procedures
3. Compare against what's written
4. Note any inaccuracies
5. Provide corrections with explanations
6. Suggest authentic details to add realism
```

### Example 4: Future Technology Speculation
```
User: "Research quantum computers for the cyberpunk plot."

1. Search current quantum computing state
2. Find expert predictions for 10-20 years out
3. Note theoretical capabilities vs. limitations
4. Identify plot opportunities (encryption breaking, simulations)
5. Document in Lexicon/World/quantum-computing.md
6. Suggest: "Here's what's plausible for your timeline..."
```

## Balancing Accuracy and Story

### When Accuracy Matters
- Hard science fiction
- Historical fiction
- Technical thrillers
- Medical dramas
- Legal/police procedurals

### When Creative License is OK
- Soft science fiction
- Fantasy with real-world elements
- Alternative history
- Rule of cool over rule of physics

### The 80/20 Rule
- Get the core concepts 80% right
- Use creative license for the 20% that serves the story
- Ground speculation in real science
- Flag when you're departing from reality

## Handling Uncertainty

When information is unclear or disputed:

```markdown
**Note:** There's disagreement among experts about [topic].

- Position A: [Explanation] (Source: [X])
- Position B: [Explanation] (Source: [Y])

For story purposes, I recommend [suggestion] because [reasoning].
```

## Research Ethics

- Respect cultural sensitivity
- Note when portraying real people/events
- Flag potentially problematic stereotypes
- Suggest sensitivity readers when appropriate

## Integration with Writing

After research, offer to:
- Update relevant Lexicon files
- Suggest scene revisions based on findings
- Identify places to add authentic details
- Flag areas that need more research

## Quality Checks

Before delivering research:
- ✅ Verified across multiple sources
- ✅ Sources are credible and current
- ✅ Findings are story-relevant
- ✅ Implications for plot/character noted
- ✅ Potential problems flagged
- ✅ Saved for future reference

## Example Research Output

```markdown
## Research: Deep Sea Communication Technology
**Date:** 2026-01-03
**For:** Chapter 12 - Underwater research station

### Quick Summary
Deep sea communication is extremely challenging due to water's absorption of electromagnetic waves. Current systems use acoustic (sound-based) communication, with severe limitations on bandwidth and range.

### Key Facts
- **Electromagnetic waves don't work**: Radio waves are absorbed within meters underwater
  - Source: NOAA Ocean Explorer
  - Relevance: Your characters can't use traditional radios

- **Acoustic communication is standard**: Uses sound waves (sonar-like)
  - Range: Up to 20 km in ideal conditions
  - Speed: Extremely slow (~1.5 km/s in water vs. light speed in air)
  - Bandwidth: Very limited, think dial-up internet speeds
  - Source: Woods Hole Oceanographic Institution

- **Blue-green laser systems** (emerging): Experimental optical communication
  - Range: ~100 meters in clear water
  - Speed: Much faster than acoustic
  - Problem: Requires line-of-sight, affected by particles
  - Source: MIT research papers, 2024

### Story Implications
- **Plot Opportunities**: 
  - Communication delays create tension
  - Messages can be intercepted (acoustic travels far)
  - Breakdown of communication isolates characters
  - Need for visual signals (lights) in emergencies

- **Potential Conflicts**:
  - Delays mean characters can't warn station in time
  - Bandwidth limits mean they can't send detailed data
  - System failure strands them
  - Enemy could jam acoustic signals

- **World-Building**:
  - Stations need multiple backup systems
  - Protocols for communication failure
  - Specialized communication officers
  - Trade-off between speed (laser) and range (acoustic)

### Interesting Details
- Whales and dolphins navigate these same constraints
- Military submarines use very low frequency for long-range
- Water temperature and salinity affect signal propagation
- "Acoustic shadows" exist where sound can't reach

### Things to Watch Out For
- Don't have characters casually chatting across long distances underwater
- Communication isn't instant - factor in propagation delays
- Video transmission would be nearly impossible with current tech
- Weather and ocean conditions affect reliability

### For Further Research
- Submarine communication protocols
- Deep sea emergency procedures
- How research stations actually operate

### Sources
1. NOAA Ocean Explorer - "Deep Sea Communication Challenges"
2. Woods Hole Oceanographic Institution - "Acoustic Communication Systems"
3. MIT CSAIL - "Underwater Optical Communication Research" (2024)
4. Navy Research Laboratory - "Submarine Communications" (technical overview)
```

## Notes

- Research supports creativity, doesn't constrain it
- Accuracy adds authenticity and reader trust
- Know the rules before breaking them
- Save research for reference throughout the project
- Update research as story needs evolve