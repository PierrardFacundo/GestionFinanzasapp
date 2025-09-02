import * as React from "react"
import { cn } from "@/lib/utils"

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn("h-10 w-full rounded-xl border bg-transparent px-3 text-sm outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700", className)}
      {...props}
    >
      {children}
    </select>
  )
})
Select.displayName = "Select"
export { Select }
