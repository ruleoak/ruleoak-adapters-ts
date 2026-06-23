import { AgentFirewall, FlightRecorder } from "./local-runtime.js";

export const RULEOAK_ADAPTERS_TS_VERSION = "1.0.0";

export function createGenericToolWrapper({ policy = {}, actor = "ts-agent", recorder = new FlightRecorder({ actor }) } = {}) {
  const firewall = new AgentFirewall({ policy, recorder, actor });
  return function wrap(toolName, operation, executor, defaults = {}) {
    return async function wrapped(input = {}) {
      return firewall.guardAction({ toolName, operation, input, target: input.target || defaults.target, risk: defaults.risk || input.risk }, () => executor(input));
    };
  };
}

export function normalizeToolAction({ toolName = "unknown", operation = "unknown", input = {}, target = null, risk = "unknown" } = {}) {
  return { toolName, operation, input, target, risk, metadata: { adapter: "ruleoak-adapters-ts" } };
}

export function createMcpClientWrapper(options = {}) { return createGenericToolWrapper({ ...options, actor: options.actor || "mcp-client" }); }
export function createMcpServerWrapper(options = {}) { return createGenericToolWrapper({ ...options, actor: options.actor || "mcp-server" }); }
export function createVercelAiSdkToolWrapper(options = {}) { return createGenericToolWrapper({ ...options, actor: options.actor || "vercel-ai-sdk-style" }); }
export function createOpenAIAgentsJsToolWrapper(options = {}) { return createGenericToolWrapper({ ...options, actor: options.actor || "openai-agents-js-style" }); }
export function createLangChainJsToolWrapper(options = {}) { return createGenericToolWrapper({ ...options, actor: options.actor || "langchain-js-style" }); }
export function createOpenClawStyleWrapper(options = {}) { return createGenericToolWrapper({ ...options, actor: options.actor || "openclaw-style" }); }
export function createCodingAgentCommandWrapper(options = {}) { return createGenericToolWrapper({ ...options, actor: options.actor || "coding-agent" }); }

export function adapterReadinessReport() {
  return {
    version: RULEOAK_ADAPTERS_TS_VERSION,
    adapters: ["generic", "mcp-client", "mcp-server", "vercel-ai-sdk-style", "openai-agents-js-style", "langchain-js-style", "openclaw-style", "coding-agent"],
    optionalDependenciesRequiredForTests: false
  };
}
