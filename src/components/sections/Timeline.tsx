"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TIMELINE } from "@/data/timeline";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ParallaxNumeral } from "@/components/ui/ParallaxNumeral";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

const statusStyles: Record<string, string> = {
  past: "border-border bg-muted text-muted-foreground",
  present: "border-foreground/30 bg-foreground text-background",
  future: "border-dashed border-foreground/30 bg-background text-foreground/70",
};

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    const line = lineRef.current;
    if (!el || !line || reduced) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 65%",
            end: "bottom 80%",
            scrub: 0.6,
          },
        }
      );

      // Nodes pop as the drawn line reaches them.
      gsap.utils.toArray<HTMLElement>(".tl-node").forEach((node) => {
        gsap.fromTo(
          node,
          { scale: 0 },
          {
            scale: 1,
            duration: 0.55,
            ease: "back.out(2.2)",
            scrollTrigger: { trigger: node, start: "top 72%" },
          }
        );
      });
    }, el);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="journey"
      className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32"
    >
      <ParallaxNumeral value="03" className="right-2 top-10" />
      <div className="container-px">
        <SectionHeading
          eyebrow="Journey"
          title="From fundamentals to building products"
          description="An education and trajectory built on shipping — and always moving toward what's next."
        />

        <div ref={containerRef} className="relative mt-16">
          {/* track — sits behind the nodes; left value matches each node's centre */}
          <div className="absolute bottom-10 left-[19px] top-5 w-px bg-border sm:left-[27px]" />
          <div
            ref={lineRef}
            className="absolute bottom-10 left-[19px] top-5 w-px origin-top bg-gradient-to-b from-foreground via-foreground/70 to-transparent sm:left-[27px]"
            style={{ transform: "scaleY(0)" }}
          />

          <div className="flex flex-col gap-12 sm:gap-16">
            {TIMELINE.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: 24, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: EASE_OUT, delay: i * 0.05 }}
                className="relative flex gap-6 pl-12 sm:pl-20"
              >
                {/* node */}
                <span
                  className={cn(
                    "tl-node absolute left-0 top-0 z-10 grid h-10 w-10 place-items-center rounded-full border font-mono text-[10px] sm:h-[3.4rem] sm:w-[3.4rem] sm:text-xs",
                    statusStyles[item.status]
                  )}
                >
                  {item.status === "present" ? (
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-background/80" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-background" />
                    </span>
                  ) : (
                    item.period.slice(0, 4)
                  )}
                </span>

                <div className="flex flex-col gap-1.5 pb-2">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {item.period}
                  </span>
                  <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="text-sm font-medium text-foreground/70">{item.subtitle}</p>
                  <p className="mt-1 max-w-xl leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
