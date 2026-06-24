# @ruleoak/adapters-ts

TypeScript/JavaScript adapter utilities for adding RuleOak-style permission, approval, evidence, and replay behavior to tool-calling apps.

The package includes framework-shaped offline adapters for generic tools, MCP-style tools, Vercel AI SDK-style tools, LangChain.js-style tools, OpenAI Agents JS-style tools, coding-agent commands, and OpenClaw-style actions.

## Install

```bash
npm install @ruleoak/adapters-ts
```

## Quick example

```js
import { createGenericToolWrapper } from "@ruleoak/adapters-ts";

const wrap = createGenericToolWrapper({
  policy: { blockedActions: ["filesystem.delete"] }
});

const deleteTool = wrap("filesystem", "delete", async () => ({ deleted: true }));
console.log(await deleteTool({ target: "protected-folder" }));
```

## Demos

```bash
npm run demo:file-delete
npm run demo:mcp
npm run examples:all
```

## Capabilities

- policy evaluation
- approval callbacks
- JSONL and memory evidence sinks
- input redaction
- framework-shaped examples without external services

Apache-2.0. Contact: hello@ruleoak.com. SafeDesk remains private/commercial.

## Policy precedence

RuleOak TypeScript adapters use the RuleOak industry-quality policy model:

1. `blockedActions` always wins.
2. `allowedActions` and `approvalRequired` are compared by pattern specificity.
3. If allow and approval match with the same specificity, `needs_approval` wins.
4. `defaultAction` applies only when no explicit policy pattern matches.

Pattern specificity: exact action keys such as `filesystem.read` are more specific than namespace wildcards such as `filesystem.*`, and `*` is the least specific catch-all.
