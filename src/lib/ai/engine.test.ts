import { describe, expect, it } from "vitest";
import { matchIntent } from "@/lib/ai/engine";
import { FALLBACK_ANSWER } from "@/lib/ai/knowledge";
import { ACTION_TOKEN_RE, CHAT_ACTIONS, resolveActions } from "@/lib/ai/actions";

describe("matchIntent", () => {
  it("matches a skills question", () => {
    const result = matchIntent("What technologies does he specialize in?");
    expect(result.intent?.id).toBe("skills");
  });

  it("matches a contact question", () => {
    const result = matchIntent("How can I get in touch with him?");
    expect(result.intent?.id).toBe("contact");
  });

  it("matches a greeting", () => {
    const result = matchIntent("hello");
    expect(result.intent?.id).toBe("greeting");
  });

  it("falls back on unrelated queries", () => {
    const result = matchIntent("qwzx blorp");
    expect(result.intent).toBeNull();
    expect(result.answer).toBe(FALLBACK_ANSWER);
  });

  it("falls back on empty input", () => {
    const result = matchIntent("   ");
    expect(result.intent).toBeNull();
  });
});

describe("resolveActions", () => {
  it("resolves known keys and drops unknown ones", () => {
    const actions = resolveActions(["email", "does-not-exist"]);
    expect(actions).toEqual([CHAT_ACTIONS.email]);
  });

  it("returns empty for undefined", () => {
    expect(resolveActions(undefined)).toEqual([]);
  });

  it("caps at three actions", () => {
    const keys = Object.keys(CHAT_ACTIONS);
    expect(resolveActions(keys).length).toBeLessThanOrEqual(3);
  });
});

describe("ACTION_TOKEN_RE", () => {
  it("matches a well-formed action token", () => {
    const matches = [..."See [[View resume|/navdeep-bhanderi-resume.pdf]]".matchAll(ACTION_TOKEN_RE)];
    expect(matches).toHaveLength(1);
    expect(matches[0][1]).toBe("View resume");
    expect(matches[0][2]).toBe("/navdeep-bhanderi-resume.pdf");
  });

  it("does not match nested or malformed tokens", () => {
    expect([..."[[broken|]]".matchAll(ACTION_TOKEN_RE)]).toHaveLength(0);
    expect([..."[[|/x]]".matchAll(ACTION_TOKEN_RE)]).toHaveLength(0);
  });
});
