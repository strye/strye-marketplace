---
id: "012"
type: feature
title: "Solutions Architecture Guidance"
status: completed
created: 2026-02-01
updated: 2026-02-01
parent: epic_003-integrated-design-spec-plugin
children:
  # Specs to be created if needed
tags:
  - agent
  - architecture
  - solutions-architect
  - aws
  - design
---

# Feature: Solutions Architecture Guidance

**Parent Epic:** [Integrated Design Spec Plugin](../epics/epic_003-integrated-design-spec-plugin.md)

## Description

Solutions Architect agent transforms business requirements into detailed technical implementations. Provides multi-language implementation patterns (Java, JavaScript/Node.js, Python, Rust), AWS cloud architecture expertise, API design strategies, and performance optimization guidance. Auto-delegated for technical design tasks.

## User Stories

### Story 1: Requirements to Design Translation

**WHEN** creating technical design from requirements
**THE SYSTEM SHALL** invoke Solutions Architect for implementation guidance

**Acceptance Criteria:**
- [x] Agent analyzes requirements thoroughly
- [x] Suggests appropriate technical approaches
- [x] Considers multiple implementation options
- [x] Recommends specific technologies
- [x] Provides reasoning for decisions

### Story 2: Multi-Language Implementation Patterns

**WHERE** multiple programming languages are used
**THE SYSTEM SHALL** provide language-specific implementation guidance

**Acceptance Criteria:**
- [x] Java patterns for enterprise applications
- [x] JavaScript/Node.js for web services
- [x] Python for data processing and APIs
- [x] Rust for performance-critical systems
- [x] Language-appropriate best practices

### Story 3: AWS Cloud Architecture

**WHERE** AWS is the cloud platform
**THE SYSTEM SHALL** recommend appropriate AWS services and patterns

**Acceptance Criteria:**
- [x] Service selection guidance (Lambda, ECS, EC2, etc.)
- [x] Architecture patterns (serverless, microservices, event-driven)
- [x] Cost optimization considerations
- [x] Security best practices
- [x] Operational simplicity prioritized

## Functional Requirements

- REQ-F-001: Agent shall analyze business requirements
- REQ-F-002: Agent shall propose technical implementations
- REQ-F-003: Agent shall provide multi-language guidance
- REQ-F-004: Agent shall recommend AWS services and patterns
- REQ-F-005: Agent shall design APIs and integrations
- REQ-F-006: Agent shall address performance and scalability
- REQ-F-007: Agent shall consider cost and operational complexity
- REQ-F-008: Agent shall be auto-delegated for design tasks

## Non-Functional Requirements

- REQ-NF-001: Agent shall provide actionable technical guidance
- REQ-NF-002: Recommendations shall be specific and detailed
- REQ-NF-003: Agent shall consider trade-offs explicitly
- REQ-NF-004: Design shall balance innovation with practicality
- REQ-NF-005: Agent shall work in isolated context for focused analysis

## Implementation Details

**Component Type:** Agent

**Location:** `integrated-design-spec/agents/solutions-architect.md`

**Auto-Delegation Triggers:**
- Creating technical design
- Reviewing requirements for implementation
- Architecture decision discussions
- Technology selection decisions
- AWS service selection
- API design questions

**Expertise Areas:**

1. **Languages & Frameworks:**
   - Java (Spring Boot, enterprise patterns)
   - JavaScript/Node.js (Express, serverless)
   - Python (FastAPI, Django, data processing)
   - Rust (performance, systems programming)

2. **AWS Services:**
   - Compute: Lambda, ECS, Fargate, EC2
   - Storage: S3, DynamoDB, RDS, Aurora
   - Integration: API Gateway, SQS, SNS, EventBridge
   - Security: IAM, Cognito, Secrets Manager

3. **Architecture Patterns:**
   - Microservices
   - Serverless
   - Event-driven
   - RESTful APIs
   - GraphQL

4. **Design Considerations:**
   - Scalability and performance
   - Security and compliance
   - Cost optimization
   - Operational simplicity
   - Technical debt management

## Dependencies

- Claude Code agent system
- Auto-delegation mechanism
- Isolated context support

## Success Criteria

- [x] Agent provides clear technical guidance
- [x] Multi-language patterns appropriate and accurate
- [x] AWS recommendations aligned with best practices
- [x] Design balances requirements with constraints
- [x] Trade-offs explained clearly
- [x] Implementation details actionable
- [x] Auto-delegation works reliably

## Notes

### Usage Examples

**During Design Phase:**
```bash
/specid.design user-authentication
# Solutions Architect automatically invoked
# Reviews requirements
# Proposes technical implementation
# Considers AWS services, security, scalability
```

**Explicit Invocation:**
```
@solutions-architect
I need help designing an event processing system that handles 1000 events/sec.
Requirements are in docs/features/event-processing/requirements.md.
```

### Design Output Example

**Feature:** Real-time Event Processing

**Proposed Architecture:**
- **AWS Lambda** for event processing (auto-scales, pay-per-use)
- **Amazon SQS** for message queuing (decouples producers/consumers)
- **DynamoDB** for event storage (high throughput, low latency)
- **EventBridge** for event routing (managed event bus)

**Language Recommendation:** Python with boto3
- Fast development
- Excellent AWS SDK support
- Suitable for data processing workload
- Lambda supports Python runtime

**Scalability Approach:**
- SQS handles burst traffic
- Lambda concurrent executions scale automatically
- DynamoDB on-demand pricing scales with load
- EventBridge managed scalability

**Cost Considerations:**
- Lambda: ~$0.20 per 1M requests
- SQS: ~$0.40 per 1M requests
- DynamoDB: On-demand pricing, no idle cost
- Estimated: $50-100/month at 1000 events/sec

**Trade-offs:**
- Cold start latency (Lambda) vs. cost savings
- DynamoDB vs. RDS (chose DynamoDB for scale + simplicity)
- Managed services vs. EC2 (chose managed for operational simplicity)

### Integration with Workflow

1. Requirements created: `/specid.feature event-processing`
2. Design command invokes agent: `/specid.design event-processing`
3. Solutions Architect analyzes requirements
4. Proposes architecture with reasoning
5. Design documented in `design.md`
6. Tasks generated: `/specid.tasks event-processing`

## Version History

- **v0.0.1** (Current): Solutions Architect agent implemented and functional
