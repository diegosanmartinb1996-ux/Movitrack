import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export default function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1440px] px-6 md:px-12", className)}>
      {children}
    </div>
  );
}
