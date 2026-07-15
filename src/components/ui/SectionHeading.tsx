import { cn } from "@/lib/utils";
import { BlurReveal } from "./BlurReveal";
import { TextReveal } from "./TextReveal";
import { ScrambleText } from "./ScrambleText";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <BlurReveal>
        <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
          <span className="h-px w-6 bg-foreground/30" aria-hidden />
          <ScrambleText text={eyebrow} />
        </span>
      </BlurReveal>
      <div data-cursor="invert">
        <TextReveal
          as="h2"
          text={title}
          className="max-w-3xl text-fluid-h2 font-semibold leading-[1.05] tracking-tight text-foreground"
        />
      </div>
      {description && (
        <BlurReveal delay={0.1}>
          <p
            className={cn(
              "max-w-2xl text-fluid-lead leading-relaxed text-muted-foreground",
              align === "center" && "mx-auto"
            )}
          >
            {description}
          </p>
        </BlurReveal>
      )}
    </div>
  );
}
