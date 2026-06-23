export class FlightRecorder {
  constructor({ actor = "agent" } = {}) { this.actor = actor; this.records = []; }
  record(event = {}) { const rec = { ts: new Date(0).toISOString(), actor: this.actor, ...event }; this.records.push(rec); return rec; }
  list() { return [...this.records]; }
}

function actionKey(action = {}) { return `${action.toolName || "unknown"}.${action.operation || "unknown"}`; }

export class AgentFirewall {
  constructor({ policy = {}, recorder = new FlightRecorder(), actor = "agent" } = {}) {
    this.policy = policy; this.recorder = recorder; this.actor = actor;
  }
  evaluateAction(action = {}) {
    const key = actionKey(action);
    let decision = "deny";
    if ((this.policy.blockedActions || []).includes(key)) decision = "deny";
    else if ((this.policy.approvalRequired || []).includes(key)) decision = "needs_approval";
    else if ((this.policy.allowedActions || []).includes(key)) decision = "allow";
    else if (action.risk === "low") decision = "allow";
    return { decision, action: key, reason: decision === "deny" ? "blocked_or_not_allowed" : decision };
  }
  async guardAction(action = {}, executor = async () => ({ ok: true })) {
    const decision = this.evaluateAction(action);
    this.recorder.record({ type: "ruleoak.agentic.evidence.v1", action, decision });
    if (decision.decision !== "allow") return { executed: false, decision };
    const result = await executor();
    this.recorder.record({ type: "ruleoak.agentic.evidence.v1", action, result, decision: { decision: "executed" } });
    return { executed: true, decision, result };
  }
}
