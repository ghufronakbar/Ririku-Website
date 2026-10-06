import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Magnetic } from "./magnetic";

type ButtonProps = {
  href: string;
  children: string;
  variant?: "primary" | "ghost" | "light";
  icon?: ReactNode;
  className?: string;
  size?: "md" | "lg";
};

/** A pill link whose label rolls up on hover. External links open in a new tab. */
export function Button({ href, children, variant = "primary", icon, className, size = "md" }: ButtonProps) {
  const external = href.startsWith("http");
  return (
    <Magnetic className="inline-block">
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={cn(
          "group relative inline-flex items-center gap-3 overflow-hidden rounded-full font-medium transition-colors duration-500",
          size === "lg" ? "h-14 pr-2 pl-7 text-base" : "h-11 pr-1.5 pl-5 text-sm",
          variant === "primary" && "bg-coral text-ink hover:bg-paper",
          variant === "light" && "bg-paper text-ink hover:bg-coral",
          variant === "ghost" && "border border-paper/20 text-paper hover:border-paper/60",
          className,
        )}
      >
        <span className="relative block overflow-hidden">
          <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">{children}</span>
          <span aria-hidden className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-out-expo group-hover:translate-y-0">
            {children}
          </span>
        </span>
        <span
          className={cn(
            "grid place-items-center rounded-full transition-transform duration-500 ease-out-expo group-hover:rotate-45",
            size === "lg" ? "size-10" : "size-8",
            variant === "ghost" ? "bg-paper/10" : "bg-ink/10",
          )}
        >
          {icon ?? <ArrowUpRight className="size-4" strokeWidth={2.2} />}
        </span>
      </a>
    </Magnetic>
  );
}
