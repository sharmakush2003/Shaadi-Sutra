import * as React from "react"
import { cn } from "@/lib/utils"
import { Check, ChevronDown } from "lucide-react"

// Simple custom select implementation without Radix for now to avoid complex setup
// In a real production app, I would use @radix-ui/react-select

interface SelectProps {
    value: string
    onValueChange: (value: string) => void
    children: React.ReactNode
}

const SelectContext = React.createContext<{
    value: string
    onValueChange: (value: string) => void
    open: boolean
    setOpen: (open: boolean) => void
} | null>(null)

export const Select = ({ value, onValueChange, children }: SelectProps) => {
    const [open, setOpen] = React.useState(false)
    return (
        <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
            <div className="relative inline-block w-full">{children}</div>
        </SelectContext.Provider>
    )
}

export const SelectTrigger = ({ className, children }: { className?: string; children: React.ReactNode }) => {
    const context = React.useContext(SelectContext)
    if (!context) throw new Error("SelectTrigger must be used within Select")

    return (
        <button
            type="button"
            onClick={() => context.setOpen(!context.open)}
            className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-maroon-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-maroon-800 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
        >
            {children}
            <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
    )
}

export const SelectValue = ({ placeholder }: { placeholder?: string }) => {
    const context = React.useContext(SelectContext)
    if (!context) throw new Error("SelectValue must be used within Select")
    return <span>{context.value || placeholder}</span>
}

export const SelectContent = ({ className, children }: { className?: string; children: React.ReactNode }) => {
    const context = React.useContext(SelectContext)
    if (!context) throw new Error("SelectContent must be used within Select")

    if (!context.open) return null

    return (
        <div className={cn("absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-maroon-100 bg-white text-maroon-950 shadow-md animate-in fade-in-80", className)}>
            <div className="p-1">{children}</div>
        </div>
    )
}

export const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => {
    const context = React.useContext(SelectContext)
    if (!context) throw new Error("SelectItem must be used within Select")

    const isSelected = context.value === value

    return (
        <div
            onClick={() => {
                context.onValueChange(value)
                context.setOpen(false)
            }}
            className={cn(
                "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-maroon-50 focus:bg-maroon-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                isSelected && "font-semibold"
            )}
        >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {isSelected && <Check className="h-4 w-4" />}
            </span>
            {children}
        </div>
    )
}
