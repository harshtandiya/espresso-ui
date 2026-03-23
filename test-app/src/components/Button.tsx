import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--btn-ring] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-[--btn-disabled-opacity] [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        solid: "bg-[--btn-solid-bg] text-[--btn-solid-fg] hover:bg-[--btn-solid-bg-hover]",
        outline:
          "border border-[--btn-outline-border] text-[--btn-outline-fg] hover:bg-[--btn-outline-bg-hover]",
        ghost: "text-[--btn-ghost-fg] hover:bg-[--btn-ghost-bg-hover]",
        link: "text-[--btn-link-fg] underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-[--btn-sm-height] px-[--btn-sm-px] text-[--btn-sm-font-size] rounded-[--btn-radius]",
        md: "h-[--btn-md-height] px-[--btn-md-px] text-[--btn-md-font-size] rounded-[--btn-radius]",
        lg: "h-[--btn-lg-height] px-[--btn-lg-px] text-[--btn-lg-font-size] rounded-[--btn-radius]",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  },
);
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };
export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
