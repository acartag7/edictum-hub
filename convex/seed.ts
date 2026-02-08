import { mutation } from './_generated/server'

const OFFICIAL_CONTRACTS = [
  {
    name: 'File Agent',
    slug: 'file-agent',
    description:
      'Contracts for file-handling agents. Blocks sensitive reads and destructive bash.',
    category: 'file-safety' as const,
    tags: ['secrets', 'dlp', 'destructive', 'safety', 'write-scope'],
    yaml: `apiVersion: edictum/v1
kind: ContractBundle

metadata:
  name: file-agent
  description: "Contracts for file-handling agents. Blocks sensitive reads and destructive bash."

defaults:
  mode: enforce

contracts:
  - id: block-sensitive-reads
    type: pre
    tool: read_file
    when:
      args.path:
        contains_any: [".env", ".secret", "kubeconfig", "credentials", ".pem", "id_rsa"]
    then:
      effect: deny
      message: "Sensitive file '{args.path}' blocked."
      tags: [secrets, dlp]

  - id: block-destructive-bash
    type: pre
    tool: bash
    when:
      any:
        - args.command: { matches: '\\\\brm\\\\s+(-rf?|--recursive)\\\\b' }
        - args.command: { matches: '\\\\bmkfs\\\\b' }
        - args.command: { contains: '> /dev/' }
    then:
      effect: deny
      message: "Destructive command blocked: '{args.command}'."
      tags: [destructive, safety]

  - id: block-write-outside-target
    type: pre
    tool: write_file
    when:
      args.path:
        starts_with: /
    then:
      effect: deny
      message: "Write to absolute path '{args.path}' blocked. Use relative paths."
      tags: [write-scope]`,
  },
  {
    name: 'Research Agent',
    slug: 'research-agent',
    description: 'Contracts for research agents. Rate limits and output caps.',
    category: 'rate-limiting' as const,
    tags: ['secrets', 'pii', 'compliance', 'rate-limit'],
    yaml: `apiVersion: edictum/v1
kind: ContractBundle

metadata:
  name: research-agent
  description: "Contracts for research agents. Rate limits and output caps."

defaults:
  mode: enforce

contracts:
  - id: block-sensitive-reads
    type: pre
    tool: read_file
    when:
      args.path:
        contains_any: [".env", ".secret", "credentials"]
    then:
      effect: deny
      message: "Sensitive file '{args.path}' blocked."
      tags: [secrets]

  - id: pii-in-output
    type: post
    tool: "*"
    when:
      output.text:
        matches_any:
          - '\\\\b\\\\d{3}-\\\\d{2}-\\\\d{4}\\\\b'
    then:
      effect: warn
      message: "PII pattern detected in output. Redact before using."
      tags: [pii, compliance]

  - id: session-limits
    type: session
    limits:
      max_tool_calls: 50
      max_attempts: 100
    then:
      effect: deny
      message: "Session limit reached. Summarize progress and stop."
      tags: [rate-limit]`,
  },
  {
    name: 'DevOps Agent',
    slug: 'devops-agent',
    description:
      'Contracts for DevOps agents. Prod gates, ticket requirements, PII detection.',
    category: 'access-control' as const,
    tags: [
      'secrets',
      'dlp',
      'destructive',
      'safety',
      'change-control',
      'production',
      'compliance',
      'pii',
      'rate-limit',
    ],
    yaml: `apiVersion: edictum/v1
kind: ContractBundle

metadata:
  name: devops-agent
  description: "Contracts for DevOps agents. Prod gates, ticket requirements, PII detection."

defaults:
  mode: enforce

contracts:
  - id: block-sensitive-reads
    type: pre
    tool: read_file
    when:
      args.path:
        contains_any: [".env", ".secret", "kubeconfig", "credentials", ".pem", "id_rsa"]
    then:
      effect: deny
      message: "Sensitive file '{args.path}' blocked."
      tags: [secrets, dlp]

  - id: block-destructive-bash
    type: pre
    tool: bash
    when:
      any:
        - args.command: { matches: '\\\\brm\\\\s+(-rf?|--recursive)\\\\b' }
        - args.command: { matches: '\\\\bmkfs\\\\b' }
        - args.command: { contains: '> /dev/' }
    then:
      effect: deny
      message: "Destructive command blocked: '{args.command}'."
      tags: [destructive, safety]

  - id: prod-deploy-requires-senior
    type: pre
    tool: deploy_service
    when:
      all:
        - environment: { equals: production }
        - principal.role: { not_in: [senior_engineer, sre, admin] }
    then:
      effect: deny
      message: "Production deploys require senior role (sre/admin)."
      tags: [change-control, production]

  - id: prod-requires-ticket
    type: pre
    tool: deploy_service
    when:
      all:
        - environment: { equals: production }
        - principal.ticket_ref: { exists: false }
    then:
      effect: deny
      message: "Production changes require a ticket reference."
      tags: [change-control, compliance]

  - id: pii-in-output
    type: post
    tool: "*"
    when:
      output.text:
        matches_any:
          - '\\\\b\\\\d{3}-\\\\d{2}-\\\\d{4}\\\\b'
    then:
      effect: warn
      message: "PII pattern detected in output. Redact before using."
      tags: [pii, compliance]

  - id: session-limits
    type: session
    limits:
      max_tool_calls: 20
      max_attempts: 50
    then:
      effect: deny
      message: "Session limit reached. Summarize progress and stop."
      tags: [rate-limit]`,
  },
  {
    name: 'Pharma Clinical Agent',
    slug: 'pharma-clinical-agent',
    description:
      'Governance contracts for a pharmacovigilance AI agent that assists with clinical trial data analysis and regulatory reporting.',
    category: 'compliance' as const,
    tags: [
      'access-control',
      'phi',
      '21cfr11',
      'blinding',
      'gcp',
      'ich-e6',
      'change-control',
      'gxp',
      'capa',
      'gdpr',
      'hipaa',
    ],
    yaml: `apiVersion: edictum/v1
kind: ContractBundle

metadata:
  name: pharma-clinical-agent
  description: >
    Governance contracts for a pharmacovigilance AI agent that assists
    with clinical trial data analysis and regulatory reporting.

defaults:
  mode: enforce

contracts:
  - id: restrict-patient-data
    type: pre
    tool: query_clinical_data
    when:
      all:
        - args.dataset: { in: [patient_records, adverse_events_detailed, lab_results] }
        - principal.role: { not_in: [pharmacovigilance, clinical_data_manager, medical_monitor] }
    then:
      effect: deny
      message: "Access to {args.dataset} requires pharmacovigilance or clinical data manager role."
      tags: [access-control, phi, 21cfr11]

  - id: no-unblinding
    type: pre
    tool: query_clinical_data
    when:
      args.query:
        contains_any: [treatment_arm, randomization_code, unblind, placebo_assignment]
    then:
      effect: deny
      message: "Unblinding queries are prohibited during active trial phase."
      tags: [blinding, gcp, ich-e6]

  - id: case-report-requires-ticket
    type: pre
    tool: update_case_report
    when:
      principal.ticket_ref: { exists: false }
    then:
      effect: deny
      message: "Case report modifications require a tracking ticket (CAPA/deviation number)."
      tags: [change-control, gxp, capa]

  - id: case-report-authorized-roles
    type: pre
    tool: update_case_report
    when:
      principal.role: { not_in: [pharmacovigilance, clinical_data_manager] }
    then:
      effect: deny
      message: "Only pharmacovigilance and clinical data managers can modify case reports."
      tags: [access-control, gxp, separation-of-duties]

  - id: pii-in-any-output
    type: post
    tool: "*"
    when:
      output.text:
        matches_any:
          - '\\\\b\\\\d{3}-\\\\d{2}-\\\\d{4}\\\\b'
          - '\\\\bPAT-\\\\d{4,8}\\\\b'
          - '\\\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\\\.[A-Z|a-z]{2,}\\\\b'
    then:
      effect: warn
      message: "Potential PII/patient identifier detected in output."
      tags: [phi, gdpr, hipaa, redaction]

  - id: session-limits
    type: session
    limits:
      max_tool_calls: 20
      max_calls_per_tool:
        update_case_report: 3
        export_regulatory_document: 2
    then:
      effect: deny
      message: "Session limit reached. Summarize findings and stop."
      tags: [rate-limit, operational-safety]`,
  },
  {
    name: 'Fintech Trading Agent',
    slug: 'fintech-trading-agent',
    description:
      'Governance contracts for a trading compliance AI agent that assists with account queries, trade execution, and regulatory reporting.',
    category: 'compliance' as const,
    tags: [
      'trade-control',
      'risk-management',
      'sox',
      'access-control',
      'pii',
      'sec-investigation',
      'aml',
      'mifid-ii',
    ],
    yaml: `apiVersion: edictum/v1
kind: ContractBundle

metadata:
  name: fintech-trading-agent
  description: >
    Governance contracts for a trading compliance AI agent that assists
    with account queries, trade execution, and regulatory reporting.

defaults:
  mode: enforce

contracts:
  - id: trade-size-limit
    type: pre
    tool: execute_trade
    when:
      all:
        - args.quantity: { gt: 1000 }
        - principal.claims.trade_approval: { not_equals: true }
    then:
      effect: deny
      message: "Trades over 1,000 shares require manager approval."
      tags: [trade-control, risk-management, sox]

  - id: account-access-control
    type: pre
    tool: query_account_data
    when:
      all:
        - args.dataset: { in: [full_profile, transaction_history, risk_assessment] }
        - principal.role: { not_in: [compliance_officer, senior_trader, risk_manager] }
    then:
      effect: deny
      message: "Full account access requires compliance officer or senior trader role."
      tags: [access-control, pii, sox]

  - id: no-restricted-accounts
    type: pre
    tool: query_account_data
    when:
      args.account_id:
        contains_any: [RESTRICTED, FROZEN]
    then:
      effect: deny
      message: "Access to restricted/frozen accounts is blocked pending investigation."
      tags: [access-control, sec-investigation, aml]

  - id: compliance-report-requires-ticket
    type: pre
    tool: generate_compliance_report
    when:
      principal.ticket_ref: { exists: false }
    then:
      effect: deny
      message: "Compliance reports require an audit ticket reference."
      tags: [change-control, sox, audit-trail]

  - id: pii-in-output
    type: post
    tool: "*"
    when:
      output.text:
        matches_any:
          - '\\\\b\\\\d{3}-\\\\d{2}-\\\\d{4}\\\\b'
          - '\\\\bACC-\\\\d{6,10}\\\\b'
          - '\\\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\\\.[A-Z|a-z]{2,}\\\\b'
    then:
      effect: warn
      message: "Potential PII detected in output. Review and redact before use."
      tags: [pii, sox, mifid-ii]

  - id: session-limits
    type: session
    limits:
      max_tool_calls: 15
      max_calls_per_tool:
        execute_trade: 5
        generate_compliance_report: 2
    then:
      effect: deny
      message: "Session limit reached. Summarize findings and stop."
      tags: [rate-limit, operational-safety]`,
  },
  {
    name: 'Customer Support Agent',
    slug: 'customer-support-agent',
    description:
      'Governance contracts for a customer support AI agent that handles ticket management, billing inquiries, refunds, and escalations.',
    category: 'data-protection' as const,
    tags: [
      'access-control',
      'billing',
      'pci-dss',
      'financial',
      'escalation',
      'pii',
      'gdpr',
    ],
    yaml: `apiVersion: edictum/v1
kind: ContractBundle

metadata:
  name: customer-support-agent
  description: >
    Governance contracts for a customer support AI agent that handles
    ticket management, billing inquiries, refunds, and escalations.

defaults:
  mode: enforce

contracts:
  - id: billing-access-control
    type: pre
    tool: lookup_customer
    when:
      all:
        - args.include_billing: { equals: true }
        - principal.role: { not_in: [senior_agent, billing_specialist, supervisor] }
    then:
      effect: deny
      message: "Billing data access requires senior agent or billing specialist role."
      tags: [access-control, billing, pci-dss]

  - id: refund-limit
    type: pre
    tool: process_refund
    when:
      all:
        - args.amount: { gt: 500 }
        - principal.role: { not_in: [supervisor, billing_specialist] }
    then:
      effect: deny
      message: "Refunds over $500 require supervisor approval."
      tags: [access-control, financial, approval-required]

  - id: escalation-requires-reason
    type: pre
    tool: escalate_ticket
    when:
      any:
        - args.reason: { exists: false }
        - args.reason: { equals: "" }
    then:
      effect: deny
      message: "Escalation requires a documented reason."
      tags: [process, escalation, documentation]

  - id: pii-in-output
    type: post
    tool: "*"
    when:
      output.text:
        matches_any:
          - '\\\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\\\.[A-Z|a-z]{2,}\\\\b'
          - '\\\\b(\\\\+1[\\\\s.-]?)?\\\\(?\\\\d{3}\\\\)?[\\\\s.-]?\\\\d{3}[\\\\s.-]?\\\\d{4}\\\\b'
    then:
      effect: warn
      message: "Potential PII detected in output. Review and redact before use."
      tags: [pii, gdpr, data-minimization]

  - id: session-limits
    type: session
    limits:
      max_tool_calls: 20
      max_calls_per_tool:
        lookup_customer: 5
        process_refund: 3
        escalate_ticket: 2
    then:
      effect: deny
      message: "Session limit reached. Summarize findings and stop."
      tags: [rate-limit, operational-safety]`,
  },
]

const GUIDES = [
  {
    title: 'Getting Started with Edictum',
    slug: 'getting-started',
    description:
      'Install Edictum and write your first safety contract in 5 minutes.',
    order: 1,
    category: 'getting-started' as const,
    content: `# Getting Started with Edictum

## Installation

\`\`\`bash
pip install edictum
\`\`\`

## Quick Start

Create a contract file \`contracts.yaml\`:

\`\`\`yaml
apiVersion: edictum/v1
kind: ContractBundle
metadata:
  name: my-first-contract
defaults:
  mode: enforce
contracts:
  - id: block-sensitive-reads
    type: pre
    tool: read_file
    when:
      args.path:
        contains_any: [".env", ".secret"]
    then:
      effect: deny
      message: "Sensitive file blocked."
      tags: [secrets]
\`\`\`

## Load and Enforce

\`\`\`python
from edictum import Edictum

edictum = Edictum.from_yaml("contracts.yaml")
result = edictum.enforce("read_file", {"path": ".env"})
print(result)  # ContractResult(allowed=False, ...)
\`\`\`

Edictum works at the decision-to-action seam — the moment an AI agent decides to call a tool, but before the call executes.`,
  },
  {
    title: 'Understanding Contracts',
    slug: 'understanding-contracts',
    description:
      'Learn the three types of contracts: preconditions, postconditions, and session limits.',
    order: 2,
    category: 'contracts' as const,
    content: `# Understanding Contracts

Edictum supports three contract types:

## Preconditions (type: pre)
Evaluated **before** a tool call executes. Use for access control, input validation, and safety gates.

## Postconditions (type: post)
Evaluated **after** a tool call returns. Use for output scanning (PII detection, content filtering).

## Session Limits (type: session)
Track cumulative usage across an entire agent session. Use for rate limiting and budget controls.

Each contract has a \`when\` block (conditions) and a \`then\` block (what happens when conditions match).

### Effects
- **deny** — Block the action entirely
- **warn** — Allow but flag for review

### Operators
Edictum supports: \`equals\`, \`not_equals\`, \`contains\`, \`not_contains\`, \`matches\`, \`not_matches\`, \`in\`, \`not_in\`, \`exists\`, \`not_exists\`, \`contains_any\`, \`matches_any\`, \`starts_with\`, \`gt\`, \`lt\``,
  },
  {
    title: 'Framework Integrations',
    slug: 'framework-integrations',
    description:
      'Integrate Edictum with LangChain, OpenAI Agents, CrewAI, and more.',
    order: 3,
    category: 'integrations' as const,
    content: `# Framework Integrations

Edictum provides adapters for six major AI agent frameworks:

| Framework | Adapter | Method |
|-----------|---------|--------|
| LangChain | \`LangChainAdapter\` | Tool wrapper |
| OpenAI Agents SDK | \`OpenAIAgentsAdapter\` | Guardrail |
| CrewAI | \`CrewAIAdapter\` | Tool wrapper |
| Agno | \`AgnoAdapter\` | Tool wrapper |
| Semantic Kernel | \`SemanticKernelAdapter\` | Filter |
| Claude (Anthropic) | \`ClaudeAdapter\` | Tool wrapper |

## Example: LangChain

\`\`\`python
from edictum.adapters.langchain import LangChainAdapter

adapter = LangChainAdapter.from_yaml("contracts.yaml")
safe_tools = adapter.wrap_tools(tools)
agent = create_react_agent(llm, safe_tools)
\`\`\`

All adapters follow the same pattern: load contracts, wrap tools, run your agent as normal. Edictum handles enforcement transparently.`,
  },
  {
    title: 'Writing Custom Contracts',
    slug: 'writing-custom-contracts',
    description:
      'Deep dive into YAML contract syntax, operators, and advanced patterns.',
    order: 4,
    category: 'advanced' as const,
    content: `# Writing Custom Contracts

## Contract Structure

Every contract needs: \`id\`, \`type\`, \`tool\`, \`when\`, and \`then\`.

\`\`\`yaml
contracts:
  - id: unique-identifier
    type: pre          # pre | post | session
    tool: tool_name    # or "*" for all tools
    when:
      # conditions
    then:
      effect: deny     # deny | warn
      message: "Human-readable explanation"
      tags: [category1, category2]
\`\`\`

## Condition Combinators

Use \`all\` (AND) and \`any\` (OR) to combine conditions:

\`\`\`yaml
when:
  all:
    - environment: { equals: production }
    - principal.role: { not_in: [admin, sre] }
\`\`\`

## Template Variables

Use \`{args.field}\` in messages to interpolate values:

\`\`\`yaml
message: "Blocked access to '{args.path}' by role '{principal.role}'"
\`\`\`

## Principals

Principals provide identity context. Set them when creating your Edictum instance:

\`\`\`python
edictum = Edictum.from_yaml(
    "contracts.yaml",
    principal={"role": "junior_dev", "ticket_ref": "JIRA-123"}
)
\`\`\``,
  },
]

export const seed = mutation({
  args: {},
  handler: async ctx => {
    // Check if already seeded
    const existing = await ctx.db
      .query('contracts')
      .withIndex('by_slug', q => q.eq('slug', 'file-agent'))
      .first()

    if (existing) {
      return 'Already seeded'
    }

    // Seed contracts
    for (const contract of OFFICIAL_CONTRACTS) {
      await ctx.db.insert('contracts', {
        ...contract,
        status: 'official',
        authorId: undefined,
        authorName: 'Edictum Team',
        downloads: Math.floor(Math.random() * 500) + 100,
        averageRating: Math.round((4 + Math.random()) * 10) / 10,
        ratingCount: Math.floor(Math.random() * 50) + 10,
        edictumVersion: '0.5.3',
      })
    }

    // Seed guides
    for (const guide of GUIDES) {
      await ctx.db.insert('guides', guide)
    }

    return 'Seeded successfully'
  },
})
