"use client";

import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-border bg-card/85 p-4 shadow-sm shadow-black/5 backdrop-blur sm:p-6",
        "transition-colors duration-200",
        hover && "hover:border-primary/50 hover:shadow-md hover:shadow-primary/10",
        className
      )}
    >
      {children}
    </div>
  );
}

interface AnimatedButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}

export function AnimatedButton({
  children,
  variant = "primary",
  className,
  onClick,
  disabled,
  type = "button",
}: AnimatedButtonProps) {
  const variants = {
    primary:
      "bg-primary text-primary-foreground shadow-sm shadow-primary/25 hover:bg-accent",
    secondary:
      "border border-border bg-secondary text-secondary-foreground hover:border-primary/60 hover:bg-muted",
    ghost:
      "bg-transparent text-foreground hover:bg-secondary",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "relative rounded-xl px-5 py-3 font-medium transition duration-200 sm:px-6",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2 focus:ring-offset-background",
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
}

export function FloatingGradient({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none",
        "bg-[radial-gradient(circle_at_20%_20%,rgba(201,164,92,0.20),transparent_32%),radial-gradient(circle_at_82%_78%,rgba(216,190,120,0.14),transparent_30%)]",
        className
      )}
    />
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-muted", className)} />;
}

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary",
        className
      )}
    />
  );
}
