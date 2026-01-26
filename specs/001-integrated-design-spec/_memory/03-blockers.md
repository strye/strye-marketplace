# Blockers & Open Questions

**Spec**: Epic: integrated-design-spec Plugin
**Status**: 0 Critical Blockers | 6 Open Architectural Questions
**Last Updated**: 2025-12-14

---

## Open Architectural Questions

These questions must be answered during Feature 1 planning before proceeding to development authorization. They are not blockers (spec is sound without answers) but represent architectural assumptions that need validation.

### AQ-1: Specification Storage & Repository Organization

**Category**: Repository Architecture
**Status**: ⏳ OPEN
**Impact**: HIGH (affects how teams structure specs across monorepos/polyrepos)
**Owner**: Product Lead (Decision needed: Feature 1 design phase)

#### Question
Where do specs live in relation to code? How do we organize specs for monorepos vs. polyrepos? What's the directory structure convention?

#### Context
- Epic design assumes specs/ directory at repo root (design.md § Data Architecture)
- No guidance yet for monorepo sub-services or polyrepo cross-repo scenarios
- Teams need clear guidance before authoring their first specs

#### Options Under Consideration
1. **Single specs/ at repo root** (current design)
   - Works well for single-service monorepos
   - Question: How do sub-services reference each other's specs in large monorepos?
   - Question: How are cross-repo specs linked in polyrepos?

2. **Specs per logical unit** (service/module-level specs/)
   - Works well for microservices architectures
   - Question: How does top-level architecture (Epic) organize across services?
   - Question: How do we prevent spec duplication?

3. **Hybrid approach** (architecture-level Epic specs at root, Feature specs at service level)
   - Potentially best for large organizations
   - Question: How are cross-service Feature specs organized?
   - Question: Clear separation between architecture and service-local specs?

#### Resolution Path
1. Document current assumption in design.md
2. During Feature 1 planning, gather use cases from target teams (monorepo, polyrepo, mixed)
3. Define spec discovery and linking mechanisms
4. Create examples for each repository pattern

#### Linked Blockers
- None (architectural question, not a blocker)

#### Target Resolution Date
2025-12-28 (Feature 1 design phase)

---

### AQ-2: Template Customization & Extension

**Category**: Configuration & Flexibility
**Status**: ⏳ OPEN
**Impact**: MEDIUM (affects template maintenance and consistency)
**Owner**: Architecture Lead (Decision needed: Feature 1 design phase)

#### Question
How much can teams customize tier-specific templates while maintaining consistency? Which sections are mandatory vs. optional? Can teams remove core sections?

#### Context
- Epic design assumes core sections (requirements.md, design.md, tasks.md) are mandatory
- No guidance on optional sections or custom extensions
- Teams need flexibility without chaos

#### Options Under Consideration
1. **Strict templates** (all sections mandatory, no customization)
   - ✅ Maximum consistency
   - ❌ Inflexible; loses team autonomy
   - ❌ Risk of template rejection if not perfectly matching team needs

2. **Core + Optional** (core sections mandatory, teams can add optional sections)
   - ✅ Consistency on fundamentals
   - ✅ Flexibility for specialized needs
   - ⚠️ Risk: Which sections are "core"?

3. **Framework-based** (three-file pattern required, section structure flexible)
   - ✅ High flexibility
   - ❌ Risks consistency/validation
   - ❌ Complex to validate cross-tier alignment

#### Resolution Path
1. Define core sections per tier (non-negotiable)
2. Identify optional sections (nice-to-have)
3. Document extension policy (how teams add custom sections)
4. Create examples showing flexibility within framework

#### Linked Blockers
- None (architectural question)

#### Target Resolution Date
2025-12-28 (Feature 1 design phase)

---

### AQ-3: Agent Capabilities & Custom Agent Framework

**Category**: Validation & Intelligence
**Status**: ⏳ OPEN
**Impact**: HIGH (affects Feature 3 complexity and extensibility)
**Owner**: Architecture Lead (Decision needed: Feature 3 design phase)

#### Question
Which agent types are required? Can teams create custom agents for domain-specific review (Security Architect, Data Privacy Officer, etc.)? What's the framework for custom agents?

#### Context
- Epic design specifies three agents (Enterprise Architect, Solutions Architect, QA Specialist)
- No guidance on custom agent creation, prompting standards, or integration
- Extensibility important for enterprise teams with specialized review needs

#### Options Under Consideration
1. **Fixed agent set** (only Enterprise/Solutions/QA agents)
   - ✅ Simple to implement
   - ❌ Inflexible for teams with specialized needs
   - ❌ Cannot address domain-specific concerns (security, privacy, compliance)

2. **Extensible framework** (provide base agents + custom agent creation mechanism)
   - ✅ Addresses specialized review needs
   - ✅ Teams can create domain-specific agents
   - ⚠️ Requires agent prompt standards and validation
   - ⚠️ Need performance/latency requirements

3. **Plugin-based agents** (teams install agent plugins similar to how plugin marketplace works)
   - ✅ Maximum flexibility
   - ❌ Complex implementation
   - ❌ Risk of agent quality variance

#### Resolution Path
1. Define agent interface and prompt standards (Feature 3 design)
2. Create 3-5 sample custom agents (Security, Privacy, Performance, Compliance, etc.)
3. Document custom agent creation process
4. Define performance/latency SLAs for agents
5. Implement in Feature 3 with extensibility support

#### Linked Blockers
- Impacts Feature 3 (Validation Agents) complexity estimation
- Impacts Feature 3 (Validation Agents) acceptance criteria

#### Target Resolution Date
2026-01-15 (Feature 3 design phase)

---

### AQ-4: Rollback & Versioning Strategy

**Category**: Evolution & Safety
**Status**: ⏳ OPEN
**Impact**: MEDIUM (affects governance and spec evolution safety)
**Owner**: Product Lead (Decision needed: Feature 5 design phase)

#### Question
How do we handle spec revisions? Can old specs be rolled back? How do we manage breaking changes? What triggers major version bumps?

#### Context
- Epic design mentions Git history for versioning and rollback
- No specifics on amendment logs, deprecation processes, or breaking change detection
- Teams need clear procedures for evolving specs without losing history

#### Options Under Consideration
1. **Git-based versioning only** (rely on Git history, branches for major changes)
   - ✅ Leverages existing Git workflows
   - ✅ No special tooling needed
   - ❌ Lacks explicit amendment log
   - ❌ Difficult to detect breaking changes automatically

2. **Amendment log + Git versioning** (formal amendment log + semantic versioning)
   - ✅ Explicit change tracking
   - ✅ Clear breaking change documentation
   - ✅ Audit trail for compliance
   - ⚠️ Additional maintenance burden

3. **Semantic versioning + feature flags** (version specs like code, use feature flags for gradual rollout)
   - ✅ Explicit version management
   - ✅ Gradual adoption of spec changes
   - ❌ Complex for team coordination
   - ❌ Overkill for most use cases

#### Resolution Path
1. Design amendment log format (Feature 5 planning)
2. Define breaking change detection rules
3. Create deprecation process for impacted tasks/specs
4. Establish semantic versioning policy for specs
5. Document rollback procedures

#### Linked Blockers
- Impacts Feature 5 (Governance) deliverables

#### Target Resolution Date
2026-01-30 (Feature 5 design phase)

---

### AQ-5: Multi-Team Coordination & Shared Specs

**Category**: Collaboration & Governance
**Status**: ⏳ OPEN
**Impact**: HIGH (affects large org adoption)
**Owner**: Product Lead (Decision needed: Feature 5 design phase)

#### Question
For large initiatives spanning multiple teams, how do we coordinate specs? Who owns Epic specs? How are cross-team dependencies documented and enforced?

#### Context
- Epic design assumes Epic specs are authored by product/architecture team
- Feature and User Story specs owned by individual teams
- No mechanism yet for cross-team dependency tracking or contract enforcement

#### Options Under Consideration
1. **Centralized Epic ownership** (architecture team owns all Epics)
   - ✅ Ensures consistency
   - ✅ Clear governance
   - ❌ Bottleneck for large organizations
   - ❌ Limits team autonomy

2. **Decentralized with consistency rules** (teams author Epics, validation ensures alignment)
   - ✅ Scales to large organizations
   - ✅ Team autonomy
   - ⚠️ Requires strong consistency validation

3. **Shared ownership** (Epic authored collaboratively by stakeholder teams)
   - ✅ Buy-in from all teams
   - ❌ Complex governance
   - ❌ Harder to maintain consistency

#### Resolution Path
1. Define Epic ownership model during Feature 5 planning
2. Design cross-team dependency documentation format
3. Create integration contract specification format
4. Implement consistency validation for cross-team specs (Feature 3)
5. Document approval workflows for shared specs

#### Linked Blockers
- Impacts Feature 3 (Validation) consistency checking
- Impacts Feature 5 (Governance) approval workflows

#### Target Resolution Date
2026-01-30 (Feature 5 design phase)

---

### AQ-6: Compliance & Audit Trail Integration

**Category**: Governance & Regulation
**Status**: ⏳ OPEN
**Impact**: MEDIUM (affects regulated industries)
**Owner**: Product Lead (Decision needed: Feature 5 design phase)

#### Question
For regulated industries, how do we ensure spec amendments are auditable and compliant? What compliance metadata must be captured? How do we integrate with approval workflows?

#### Context
- Epic design mentions optional compliance sections in design.md
- No specifics on approval workflows, sign-offs, or audit logging
- Regulated teams (financial, healthcare, etc.) need clear compliance support

#### Options Under Consideration
1. **Audit log in amendment file** (compliance metadata in amendment section)
   - ✅ Simple, integrated with existing amendment structure
   - ✅ Git provides natural audit trail
   - ❌ Limited compliance metadata
   - ❌ Difficult to enforce approvals

2. **Separate compliance ledger** (dedicated compliance.md per spec)
   - ✅ Explicit compliance tracking
   - ✅ Can embed approval workflows
   - ⚠️ Additional file to maintain
   - ⚠️ Risk of falling out of sync with actual changes

3. **External compliance integration** (integrate with external audit/compliance systems)
   - ✅ Meets enterprise requirements
   - ✅ Centralized compliance management
   - ❌ Complex integration
   - ❌ Requires external tooling

#### Resolution Path
1. During Feature 5 planning, gather requirements from regulated teams
2. Design optional compliance sections (sign-off, approval chain, audit metadata)
3. Create compliance ledger template if needed
4. Document integration points with external compliance systems
5. Create examples for regulated industries

#### Linked Blockers
- Impacts Feature 5 (Governance) compliance section design

#### Target Resolution Date
2026-01-30 (Feature 5 design phase)

---

## Critical Issues

**Status**: ✅ NONE

No critical issues identified. The epic specification is sound and ready for Feature planning. All open items are architectural questions to be resolved during Feature design phases, not blocking the current PLANNING state.

---

## Previously Resolved Issues

### Issue 1: Plugin Rename (Resolved 2025-12-13)
- **Original Issue**: Plugin named `spec-claude` conflicts with other spec tools
- **Resolution**: Renamed to `integrated-design-spec` for clarity
- **Status**: ✅ RESOLVED
- **Implementation**: Updated plugin.json, marketplace.json, all spec references

### Issue 2: Command Namespace Ambiguity (Resolved 2025-12-14)
- **Original Issue**: Command naming unclear (too generic `spec.*`)
- **Resolution**: Adopted `specid.` as distinct namespace prefix
- **Status**: ✅ RESOLVED
- **Implementation**: Renamed 9 command files, documented design decision

### Issue 3: Specification Structure Clarity (Resolved 2025-12-13)
- **Original Issue**: Unclear what belongs in requirements.md vs. design.md vs. tasks.md
- **Resolution**: Defined three-file pattern with clear purpose per file
- **Status**: ✅ RESOLVED
- **Implementation**: SPEC_STRUCTURE.md provides detailed guidance per tier

---

## Dependency Map

```
AQ-1 (Storage)
  └─ Affects: Feature 1 (Framework design)
  └─ Impacts: Team onboarding, directory structure standards

AQ-2 (Templates)
  └─ Affects: Feature 1 (Framework design)
  └─ Impacts: Template flexibility vs. consistency

AQ-3 (Custom Agents)
  └─ Affects: Feature 3 (Validation agents)
  └─ Impacts: Agent framework extensibility

AQ-4 (Versioning)
  ├─ Affects: Feature 5 (Governance)
  └─ Impacts: Spec evolution safety

AQ-5 (Multi-Team Coordination)
  ├─ Affects: Feature 3 (Consistency validation)
  ├─ Affects: Feature 5 (Governance)
  └─ Impacts: Large org adoption

AQ-6 (Compliance)
  └─ Affects: Feature 5 (Governance)
  └─ Impacts: Regulated industry adoption
```

---

## Resolution Timeline

| Question | Decision Phase | Target Date | Owner |
|----------|-----------------|-------------|-------|
| AQ-1 (Storage) | Feature 1 Design | 2025-12-28 | Product Lead |
| AQ-2 (Templates) | Feature 1 Design | 2025-12-28 | Architecture |
| AQ-3 (Agents) | Feature 3 Design | 2026-01-15 | Architecture |
| AQ-4 (Versioning) | Feature 5 Design | 2026-01-30 | Product Lead |
| AQ-5 (Multi-Team) | Feature 5 Design | 2026-01-30 | Product Lead |
| AQ-6 (Compliance) | Feature 5 Design | 2026-01-30 | Product Lead |

---

## Next Steps

1. **Feature 1 Planning** (Starting: 2025-12-21)
   - Answer AQ-1 and AQ-2
   - Define Epic/Feature/User Story templates in detail
   - Document core vs. optional template sections
   - Resolve storage strategy

2. **Feature 3 Planning** (Starting: 2026-01-05, after Feature 1 complete)
   - Answer AQ-3
   - Design custom agent framework
   - Define agent prompt standards and validation rules

3. **Feature 5 Planning** (Starting: 2026-01-20, in parallel with Feature 3-4)
   - Answer AQ-4, AQ-5, AQ-6
   - Design amendment log structure
   - Define governance workflows and approvals

---

**Version**: 1.0.0 | **Type**: Blockers & Questions | **Status**: Active | **Last Updated**: 2025-12-14
