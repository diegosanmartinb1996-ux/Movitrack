import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BaseProps = {
  children: ReactNode;
  variant?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: ReactNode;
};

type ButtonAsLink = BaseProps & {
  href: string;
  onClick?: () => void;
  type?: never;
};

type ButtonAsButton = BaseProps & {
  href?: never;
  onClick?: () => void;
  type?: "button" | "submit";
};

type ButtonProps = ButtonAsLink | ButtonAsButton;

const base =
  "group relative inline-flex items-center justify-center gap-2 font-data uppercase tracking-[0.14em] transition-all duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal disabled:opacity-40";

const variants = {
  solid: "bg-signal text-white hover:bg-signal-glow",
  outline:
    "border border-white/25 text-white hover:border-signal hover:text-signal",
  ghost: "text-white/70 hover:text-white",
};

const sizes = {
  sm: "px-4 py-2 text-[11px]",
  md: "px-6 py-3.5 text-xs",
  lg: "px-8 py-4.5 text-sm",
};

export default function Button({
  children,
  variant = "solid",
  size = "md",
  className,
  icon,
  href,
  onClick,
  type = "button",
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
        {icon}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
      {icon}
    </button>
  );
}
