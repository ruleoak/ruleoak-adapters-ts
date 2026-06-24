export type RuleOakDecision = "allow" | "deny" | "needs_approval" | "dry_run_only";
export interface RuleOakActionEnvelope { schemaVersion: string; toolName: string; operation: string; input: Record<string, unknown>; target?: unknown; risk: string; metadata: Record<string, unknown>; }
export declare function createActionEnvelope(input?: Partial<RuleOakActionEnvelope>): RuleOakActionEnvelope;
export declare function createGenericToolWrapper(options?: Record<string, unknown>): Function;
export declare function createMcpClientWrapper(options?: Record<string, unknown>): Function;
export declare function createMcpServerWrapper(options?: Record<string, unknown>): Function;
export declare function createVercelAiSdkToolWrapper(options?: Record<string, unknown>): Function;
export declare function createOpenAIAgentsJsToolWrapper(options?: Record<string, unknown>): Function;
export declare function createLangChainJsToolWrapper(options?: Record<string, unknown>): Function;
export declare function createCodingAgentCommandWrapper(options?: Record<string, unknown>): Function;
export declare function createJsonlEvidenceSink(path: string): {write(event: unknown): unknown; path: string};
export declare function createMemoryEvidenceSink(): {write(event: unknown): unknown; list(): unknown[]};
