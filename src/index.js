import { appendFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { AgentFirewall, FlightRecorder } from "./local-runtime.js";

export const RULEOAK_ADAPTERS_TS_VERSION = "1.0.0";
export const DECISIONS = ["allow", "deny", "needs_approval", "dry_run_only"];
function keyOf(action = {}) { return `${action.toolName || "unknown"}.${action.operation || "unknown"}`; }
function riskFor(action = {}) { const k=keyOf(action); if(/delete|drop|truncate|rm\s+-rf|secret|token|install|send|mutate|write|shell/.test(k + JSON.stringify(action.input || {}))) return "high"; return action.risk || "low"; }
export function createActionEnvelope({ toolName="unknown", operation="unknown", input={}, target=null, risk, metadata={} } = {}) { return { schemaVersion:"ruleoak.action_envelope.v1", toolName, operation, input, target, risk:risk || riskFor({toolName,operation,input}), metadata:{adapter:"ruleoak-adapters-ts",...metadata} }; }
export function normalizeToolAction(action = {}) { return createActionEnvelope(action); }
export function createMemoryEvidenceSink(){ const events=[]; return { write(event){ events.push(event); return event; }, list(){ return [...events]; } }; }
export function createJsonlEvidenceSink(path){ mkdirSync(dirname(path),{recursive:true}); return { write(event){ appendFileSync(path, JSON.stringify(event)+"\n"); return event; }, path }; }
export function redactInput(input = {}, patterns = [/api[_-]?key/i,/token/i,/secret/i,/password/i,/authorization/i]){ if(Array.isArray(input)) return input.map(v=>redactInput(v,patterns)); if(input && typeof input === "object") return Object.fromEntries(Object.entries(input).map(([k,v])=>[k, patterns.some(p=>p.test(k)) ? "[REDACTED]" : redactInput(v,patterns)])); if(typeof input === "string" && /(sk-[A-Za-z0-9_-]+|Bearer\s+\S+)/.test(input)) return "[REDACTED]"; return input; }
export function loadRuleOakPolicy(pathOrPolicy = {}) { if(typeof pathOrPolicy === "string") return JSON.parse(readFileSync(pathOrPolicy,"utf8")); return pathOrPolicy || {}; }
export function evaluatePolicy(action = {}, policy = {}) { const key=keyOf(action); if((policy.blockedActions||[]).includes(key)) return { decision:"deny", action:key, reason:"blocked_by_policy" }; if((policy.approvalRequired||[]).includes(key)) return { decision:"needs_approval", action:key, reason:"approval_required" }; if((policy.allowedActions||[]).includes(key)) return { decision:"allow", action:key, reason:"allowed_by_policy" }; if(policy.defaultAction === "allow") return { decision:"allow", action:key, reason:"default_allow" }; if(policy.defaultAction === "approval") return { decision:"needs_approval", action:key, reason:"default_approval" }; if(action.risk === "low") return { decision:"allow", action:key, reason:"low_risk_default" }; return { decision:"deny", action:key, reason:"default_deny" }; }
export function createApprovalCallback(mode = "deny") { return async request => ({ decision: mode === "allow" ? "allow" : "deny", reason: `approval_callback_${mode}`, request }); }
export function createGenericToolWrapper({ policy = {}, actor = "ts-agent", recorder = new FlightRecorder({ actor }), evidenceSink = null, approvalCallback = null, redact = true } = {}) {
  return function wrap(toolName, operation, executor, defaults = {}) {
    return async function wrapped(input = {}) {
      const cleanInput = redact ? redactInput(input) : input;
      const action = createActionEnvelope({ toolName, operation, input: cleanInput, target: input.target || defaults.target, risk: defaults.risk || input.risk, metadata: defaults.metadata || {} });
      let decision = evaluatePolicy(action, policy);
      const requested = { type:"action_requested", actor, action };
      recorder.record(requested); evidenceSink?.write?.(requested);
      if(decision.decision === "needs_approval" && approvalCallback) { const approval = await approvalCallback({ action, decision }); decision = approval.decision === "allow" ? { ...decision, decision:"allow", approved:true } : { ...decision, decision:"deny", approved:false, reason:approval.reason || "approval_denied" }; }
      const decided = { type:"policy_decision", actor:"ruleoak", action, decision };
      recorder.record(decided); evidenceSink?.write?.(decided);
      if(decision.decision !== "allow") return { executed:false, decision, action };
      const result = await executor(input);
      const executed = { type:"action_executed", actor, action, result };
      recorder.record(executed); evidenceSink?.write?.(executed);
      return { executed:true, decision, action, result };
    };
  };
}
export function wrapGenericTool(options){ return createGenericToolWrapper(options); }
export function createMcpClientWrapper(options = {}) { return createGenericToolWrapper({ ...options, actor: options.actor || "mcp-client" }); }
export function createMcpServerWrapper(options = {}) { return createGenericToolWrapper({ ...options, actor: options.actor || "mcp-server" }); }
export function createVercelAiSdkToolWrapper(options = {}) { return createGenericToolWrapper({ ...options, actor: options.actor || "vercel-ai-sdk-style" }); }
export function createOpenAIAgentsJsToolWrapper(options = {}) { return createGenericToolWrapper({ ...options, actor: options.actor || "openai-agents-js-style" }); }
export function createLangChainJsToolWrapper(options = {}) { return createGenericToolWrapper({ ...options, actor: options.actor || "langchain-js-style" }); }
export function createOpenClawStyleWrapper(options = {}) { return createGenericToolWrapper({ ...options, actor: options.actor || "openclaw-style" }); }
export function createCodingAgentCommandWrapper(options = {}) { return createGenericToolWrapper({ ...options, actor: options.actor || "coding-agent" }); }
export const wrapMcpClientTool = createMcpClientWrapper;
export const wrapMcpServerTool = createMcpServerWrapper;
export const wrapVercelAiSdkTool = createVercelAiSdkToolWrapper;
export const wrapLangChainJsTool = createLangChainJsToolWrapper;
export const wrapOpenAIAgentsJsTool = createOpenAIAgentsJsToolWrapper;
export const wrapCodingAgentCommand = createCodingAgentCommandWrapper;
export const wrapOpenClawStyleAction = createOpenClawStyleWrapper;
export function adapterReadinessReport() { return { version:RULEOAK_ADAPTERS_TS_VERSION, adapters:["generic","mcp-client","mcp-server","vercel-ai-sdk-style","openai-agents-js-style","langchain-js-style","openclaw-style","coding-agent"], capabilities:["policy evaluation","approval callback","evidence sinks","redaction","framework-shaped offline examples"], optionalDependenciesRequiredForTests:false }; }
