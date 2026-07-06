import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  alternate?: boolean;
}

export default function Section({ id, children, className, alternate }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-24 md:py-32",
        alternate && "bg-light-200 dark:bg-dark-500",
        className
      )}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
