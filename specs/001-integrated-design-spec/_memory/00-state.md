# Specification Lifecycle State Machine

**Spec**: Epic: integrated-design-spec Plugin
**Current State**: `PLANNING`
**Updated**: 2025-12-14

---

## State Diagram

```
┌────────┐
│ DRAFT  │  Initial creation, validating structure
└────┬───┘
     │
     ▼
┌────────────┐
│ PLANNING   │  Accepting design feedback, answering arch questions
└────┬───────┘
     │
     ├─────────────────────────┐
     │                         │
     ▼                         ▼
┌──────────┐           ┌───────────────┐
│ APPROVED │           │ REVISION_REQ  │  Need major rework
└────┬─────┘           └───────────────┘
     │                         │
     │                    [iterate back to PLANNING]
     │
     ▼
┌──────────────────┐
│ FEATURE_PLANNING │  Feature 1 detailed planning underway
└────┬─────────────┘
     │
     ▼
┌───────────────────┐
│ FEATURES_DESIGNED │  All Features have design specs
└────┬──────────────┘
     │
     ▼
┌──────────────┐
│ DEVELOPMENT  │  Features 1-4 under active implementation
└────┬─────────┘
     │
     ├─────────────────────────┐
     │                         │
     ▼                         ▼
┌──────────┐           ┌──────────────┐
│ RELEASED │           │ DEPRECATED   │  Superseded by new epic
└──────────┘           └──────────────┘
```

---

## State Definitions

### 1. DRAFT
- **Entry**: Specification created with initial content
- **Activities**:
  - Structure validation (three-file pattern present)
  - Template completeness check
  - Initial stakeholder review
- **Exit Criteria**:
  - All required sections present
  - No blocking structural issues
  - Ready for architecture review
- **Date Entered**: 2025-12-13
- **Expected Exit**: 2025-12-14 (PLANNING)

### 2. PLANNING
- **Entry**: Draft spec approved for detailed review
- **Activities**:
  - Architectural questions answered
  - Design decisions documented
  - Cross-tier consistency validated
  - Feature breakdown reviewed
  - Agent and validator design feedback incorporated
- **Exit Criteria**:
  - All 6 architectural questions answered
  - No open design contradictions
  - Feature breakdown approved by stakeholders
  - Ready for Feature 1 planning (BLOCKER)
- **Date Entered**: 2025-12-13
- **Current Status**: ACTIVE - Answering architectural questions, refining Feature breakdown
- **Expected Exit**: 2025-12-21

### 3. APPROVED
- **Entry**: PLANNING complete, all feedback incorporated
- **Activities**:
  - Feature 1 detailed planning begins
  - Epic-level decisions locked (no changes without amendment)
  - Ready to authorize resource allocation for Feature development
- **Exit Criteria**:
  - Stakeholder sign-off on epic direction
  - Resource commitment for Feature 1
- **Expected Entry**: 2025-12-21
- **Expected Exit**: 2025-12-28 (when Feature 1 planning starts)

### 4. REVISION_REQ
- **Entry**: Major issues found during PLANNING that require epic-level rework
- **Activities**:
  - Address identified issues
  - Return to PLANNING for re-review
- **Conditions**: Not yet triggered

### 5. FEATURE_PLANNING
- **Entry**: Feature 1 (BLOCKER) detailed design underway
- **Activities**:
  - Feature 1 templates defined and validated
  - Feature 1 task breakdown created
  - Features 2-4 parallel planning preparation
- **Expected Entry**: 2025-12-28
- **Expected Exit**: 2026-01-11 (when Feature 1 design complete)

### 6. FEATURES_DESIGNED
- **Entry**: Features 1-4 design complete and approved
- **Activities**:
  - Development team onboarding
  - Detailed task creation for Feature 1-4
  - Infrastructure setup
- **Expected Entry**: 2026-01-11
- **Expected Exit**: 2026-01-25 (when development begins)

### 7. DEVELOPMENT
- **Entry**: Development of Features 1-4 begins
- **Activities**:
  - Implementation of slash commands, templates, validators
  - Integration testing
  - Ongoing spec amendments tracked in amendment log
- **Expected Entry**: 2026-01-25

### 8. RELEASED
- **Entry**: v1.0.0 shipped with Features 1-5 complete
- **Activities**:
  - Production support
  - v2.0 planning begins (Feature 6+ enhancements)

### 9. DEPRECATED
- **Entry**: Epic superseded by newer version or significantly changed direction
- **Activities**: Archive, maintain historical reference only

---

## Transitions & Conditions

| From State | To State | Trigger | Owner |
|-----------|----------|---------|-------|
| DRAFT | PLANNING | Structure validated | Architecture Review |
| PLANNING | APPROVED | All arch questions answered, feedback incorporated | Product Lead |
| PLANNING | REVISION_REQ | Major issues requiring epic rework | Architecture Review |
| REVISION_REQ | PLANNING | Issues addressed | Dev Lead |
| APPROVED | FEATURE_PLANNING | Feature 1 planning authorized | Product Lead |
| FEATURE_PLANNING | FEATURES_DESIGNED | Features 1-4 design complete | Architecture Review |
| FEATURES_DESIGNED | DEVELOPMENT | Development resources allocated | Engineering Lead |
| DEVELOPMENT | RELEASED | v1.0.0 shipped | Release Manager |
| DEVELOPMENT | DEPRECATED | Epic redirected / superseded | Product Lead |

---

## Current Context (Dec 14, 2025)

**Current State**: `PLANNING`
**Days in Current State**: 1
**Next Milestone**: Answer 6 architectural questions
**Blocker Count**: 0 critical
**Risk Level**: LOW (design phase, no resource commitment yet)
**Next State Target**: APPROVED (2025-12-21)

---

## Amendment Log Entry Format

When transitioning states or making major changes, add entry below:

```markdown
### [Date] - [Description of change]
- **Previous State**: [State]
- **New State**: [State]
- **Reason**: [Why the change]
- **Approver**: [Who approved]
```

---

**Version**: 1.0.0 | **Type**: State Machine | **Status**: Active | **Last Updated**: 2025-12-14
