"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { OPEN_CHAT_EVENT } from "@/lib/events";

const ChatWidget = dynamic(
  () => import("./ChatWidget").then((m) => ({ default: m.ChatWidget })),
  { ssr: false }
);

/**
 * Defers the chat widget (UI + logic) out of the critical bundle: it loads
 * on browser idle, or instantly if the user asks for it first — in which
 * case the open event is re-dispatched once the widget has mounted.
 */
export function ChatWidgetLazy() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const onOpenRequest = (e: Event) => {
      setReady(true);
      // The widget wasn't mounted to hear this event — replay it (with any
      // handed-over question in `detail`) once it is.
      const detail = (e as CustomEvent).detail;
      window.setTimeout(
        () => window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT, { detail })),
        350
      );
    };
    window.addEventListener(OPEN_CHAT_EVENT, onOpenRequest, { once: true });

    const load = () => setReady(true);
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(load, { timeout: 2500 });
    } else {
      timeoutId = window.setTimeout(load, 1500);
    }

    return () => {
      window.removeEventListener(OPEN_CHAT_EVENT, onOpenRequest);
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  return ready ? <ChatWidget /> : null;
}
