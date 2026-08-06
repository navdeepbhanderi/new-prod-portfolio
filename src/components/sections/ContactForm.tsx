"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/lib/motion";

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;
type Status = "idle" | "submitting" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clientValidate(values: { name: string; email: string; message: string }): FieldErrors {
  const errors: FieldErrors = {};
  if (values.name.trim().length < 2) errors.name = "Please tell me your name.";
  if (!EMAIL_RE.test(values.email.trim()))
    errors.email = "That email address doesn't look right.";
  if (values.message.trim().length < 10)
    errors.message = "Give me a little more to go on — at least 10 characters.";
  return errors;
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
      >
        {label}
      </label>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            role="alert"
            className="overflow-hidden text-xs text-red-400/90"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputClasses = (invalid: boolean) =>
  cn(
    // text-base below sm: fonts under 16px make iOS Safari zoom in on focus.
    "w-full rounded-2xl border bg-background/50 px-4 text-base text-foreground outline-none transition-colors sm:text-[15px]",
    "placeholder:text-muted-foreground/70",
    invalid
      ? "border-red-400/40 focus:border-red-400/70"
      : "border-border hover:border-foreground/20 focus:border-foreground/40"
  );

export function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");

  const set =
    (field: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
      // Clear a field's error as soon as the user starts fixing it.
      setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
    };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fieldErrors = clientValidate(values);
    setErrors(fieldErrors);
    if (Object.values(fieldErrors).some(Boolean)) return;

    setStatus("submitting");
    setServerError("");
    try {
      const formData = new FormData(e.currentTarget);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          message: values.message,
          company: (formData.get("company") as string) ?? "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("success");
        return;
      }
      if (data.errors) setErrors(data.errors);
      setServerError(
        data.error ??
          "Something went wrong sending your message — please try again."
      );
      setStatus("error");
    } catch {
      setServerError("Network error — please check your connection and try again.");
      setStatus("error");
    }
  };

  return (
    <div className="glass rounded-[1.75rem] p-5 sm:p-7">
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="flex min-h-[22rem] flex-col items-center justify-center gap-5 text-center"
            role="status"
          >
            <span className="grid h-14 w-14 place-items-center rounded-full border border-foreground/20 bg-foreground text-background">
              <Check className="h-6 w-6" />
            </span>
            <div>
              <h3 className="text-xl font-semibold tracking-tight">
                Message sent
              </h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                Thanks, {values.name.trim().split(/\s+/)[0]} — it&rsquo;s in my
                inbox. A confirmation is on its way to you, and I&rsquo;ll reply
                within 24 hours.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setValues({ name: "", email: "", message: "" });
                setStatus("idle");
              }}
              className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
            >
              Send another
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            onSubmit={onSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
            <div className="mb-2 flex items-center justify-between gap-4">
              <span className="shrink-0 whitespace-nowrap text-lg font-medium tracking-tight">
                Send a message
              </span>
              <span className="inline-flex items-center gap-2 text-right font-mono text-[9.5px] uppercase tracking-[0.2em] text-muted-foreground">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                Replies within 24h
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" htmlFor="cf-name" error={errors.name}>
                <input
                  id="cf-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  maxLength={80}
                  value={values.name}
                  onChange={set("name")}
                  aria-invalid={Boolean(errors.name)}
                  placeholder="Jane Founder"
                  className={cn(inputClasses(Boolean(errors.name)), "h-[52px]")}
                />
              </Field>

              <Field label="Email" htmlFor="cf-email" error={errors.email}>
                <input
                  id="cf-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  value={values.email}
                  onChange={set("email")}
                  aria-invalid={Boolean(errors.email)}
                  placeholder="jane@company.com"
                  className={cn(inputClasses(Boolean(errors.email)), "h-[52px]")}
                />
              </Field>
            </div>

            <Field label="Message" htmlFor="cf-message" error={errors.message}>
              <textarea
                id="cf-message"
                name="message"
                rows={5}
                maxLength={3000}
                value={values.message}
                onChange={set("message")}
                aria-invalid={Boolean(errors.message)}
                placeholder="A project, a role, or an idea worth building…"
                className={cn(inputClasses(Boolean(errors.message)), "resize-none py-3.5 leading-relaxed")}
              />
            </Field>

            {/* Honeypot field. */}
            <div aria-hidden className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
              <label htmlFor="cf-company">Company</label>
              <input id="cf-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <AnimatePresence initial={false}>
              {serverError && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  role="alert"
                  className="overflow-hidden rounded-xl border border-red-400/25 bg-red-400/5 px-4 py-3 text-xs leading-relaxed text-red-300/90"
                >
                  {serverError}
                </motion.p>
              )}
            </AnimatePresence>

            {/* On phones the hint has no room next to the button — drop it and
                let the button span the row. */}
            <div className="mt-2 flex items-center justify-between gap-5 border-t border-border pt-5">
              <span className="hidden max-w-[15rem] text-xs leading-relaxed text-muted-foreground sm:block">
                Roughly what you&rsquo;re building and the timeline is plenty to
                start.
              </span>
              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-auto"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send message
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                  </>
                )}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
