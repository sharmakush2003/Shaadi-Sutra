import { cn } from "@/lib/utils";
import React from "react";

export type CardProps = React.HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "bg-white rounded-xl border border-maroon-100 shadow-sm hover:shadow-md transition-shadow duration-300",
                className
            )}
            {...props}
        />
    );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("p-6 pb-2", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3
            className={cn("text-2xl font-serif text-maroon-800 font-medium leading-none tracking-tight", className)}
            {...props}
        />
    );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("p-6 pt-2", className)} {...props} />;
}
