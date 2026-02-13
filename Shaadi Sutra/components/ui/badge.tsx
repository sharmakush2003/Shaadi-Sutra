import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-maroon-800 text-maroon-50 hover:bg-maroon-800/80",
                secondary:
                    "border-transparent bg-gold-100 text-gold-900 hover:bg-gold-100/80",
                destructive:
                    "border-transparent bg-red-500 text-white hover:bg-red-500/80",
                outline: "text-foreground",
                success: "border-transparent bg-green-100 text-green-800", // Added success variant
                warning: "border-transparent bg-yellow-100 text-yellow-800",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>


function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
