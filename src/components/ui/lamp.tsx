"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const SURFACE = "bg-light-100 dark:bg-dark-600";

const LAMP_ANIMATION = {
  delay: 0.2,
  duration: 0.8,
  ease: "easeInOut" as const,
};

const BEAM_SIZE =
  "h-20 w-[10rem] sm:h-24 sm:w-[14rem] md:h-28 md:w-[20rem] lg:h-32 lg:w-[26rem] xl:h-36 xl:w-[32rem]";

const EFFECT_HEIGHT =
  "h-20 sm:h-24 md:h-28 lg:h-32 xl:h-36";

const CONTENT_OVERLAP =
  "-translate-y-[4.25rem] sm:-translate-y-[5.25rem] md:-translate-y-[6.25rem] lg:-translate-y-[7.25rem] xl:-translate-y-[8.25rem]";

const CONTENT_COLLAPSE =
  "-mb-[4.25rem] sm:-mb-[5.25rem] md:-mb-[6.25rem] lg:-mb-[7.25rem] xl:-mb-[8.25rem]";

type BeamSide = "left" | "right";

interface LampContainerProps {
  children: React.ReactNode;
  className?: string;
}

function BeamMask({ side }: { side: BeamSide }) {
  const edgeMask =
    side === "left"
      ? "left-0 [mask-image:linear-gradient(to_right,white,transparent)]"
      : "right-0 [mask-image:linear-gradient(to_left,white,transparent)]";

  return (
    <>
      <div
        className={cn(
          "absolute bottom-0 left-0 z-[2] h-full w-full",
          SURFACE,
          "[mask-image:linear-gradient(to_top,white,transparent)]"
        )}
      />
      <div
        className={cn(
          "absolute bottom-0 z-[2] h-full w-12 sm:w-16 md:w-20 lg:w-28",
          SURFACE,
          edgeMask
        )}
      />
    </>
  );
}

function LampBeam({ side }: { side: BeamSide }) {
  const isLeft = side === "left";

  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={LAMP_ANIMATION}
      className={cn(
        "absolute top-0 overflow-hidden",
        "bg-[conic-gradient(var(--conic-position),var(--tw-gradient-stops))]",
        BEAM_SIZE,
        isLeft
          ? "right-1/2 from-cyan-500 via-transparent to-light-100 dark:to-dark-600 [--conic-position:from_40deg_at_center_top]"
          : "left-1/2 from-transparent via-transparent to-cyan-500 [--conic-position:from_320deg_at_center_top]"
      )}
    >
      <BeamMask side={side} />
    </motion.div>
  );
}

function LampFade() {
  return (
    <div className="absolute inset-x-0 bottom-0 z-[1] h-10 bg-gradient-to-b from-transparent to-light-100 dark:to-dark-600 sm:h-12 md:h-14 lg:h-16" />
  );
}

function LampEffect() {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-3xl overflow-hidden",
        EFFECT_HEIGHT
      )}
      aria-hidden="true"
    >
      <LampBeam side="left" />
      <LampBeam side="right" />
      <LampFade />
    </div>
  );
}

export function LampContainer({ children, className }: LampContainerProps) {
  return (
    <div className={cn("relative flex w-full flex-col items-center", className)}>
      <div className="relative isolate flex w-full flex-col items-center">
        <LampEffect />

        <div
          className={cn(
            "relative z-10 flex w-full flex-col items-center text-center",
            CONTENT_OVERLAP,
            CONTENT_COLLAPSE
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
