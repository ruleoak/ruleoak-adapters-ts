# policy

Developer guide for `policy` in @ruleoak/adapters-ts. Examples are local and deterministic. Contact: hello@ruleoak.com.

## Policy precedence

RuleOak TypeScript adapters use the RuleOak industry-quality policy model:

1. `blockedActions` always wins.
2. `allowedActions` and `approvalRequired` are compared by pattern specificity.
3. If allow and approval match with the same specificity, `needs_approval` wins.
4. `defaultAction` applies only when no explicit policy pattern matches.

Pattern specificity: exact action keys such as `filesystem.read` are more specific than namespace wildcards such as `filesystem.*`, and `*` is the least specific catch-all.
