"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-light-100 dark:bg-dark-600 w-full rounded-md z-0 pt-44",
        className
      )}
    >
      <div className="relative flex w-full flex-1 items-center justify-center isolate z-0 2xl:scale-y-150 xl:scale-y-125 lg:scale-y-110 sm:scale-y-100 scale-y-90">
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-cyan-500 via-transparent to-bg-light-100 text-white [--conic-position:from_40deg_at_center_top]"
        >
          <div className="absolute  w-[100%] left-0 bg-light-100 dark:bg-dark-600 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute  w-40 h-[100%] left-0 bg-light-100 dark:bg-dark-600  bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-cyan-500 text-white [--conic-position:from_320deg_at_center_top]"
        >
          <div className="absolute  w-40 h-[100%] right-0 bg-light-100 dark:bg-dark-600  bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute  w-[100%] right-0 bg-light-100 dark:bg-dark-600 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>


        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-cyan-400 "
        ></motion.div>

        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-light-100 dark:bg-dark-600 "></div>
      </div>

      <div className="relative z-50 flex flex-col items-center 2xl:-translate-y-[9rem] xl:-translate-y-[6rem] lg:-translate-y-[5rem] sm:-translate-y-[12rem] -translate-y-[15rem]">
        {/* Lamp content goes here */}
        {children}
      </div>
    </div>
  );
};
