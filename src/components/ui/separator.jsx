// src/components/ui/separator.jsx
import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

const Separator = React.forwardRef(({ className = "", orientation = "horizontal", decorative = false, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={
      orientation === "horizontal"
        ? `shrink-0 bg-gray-300 h-px w-full ${className}`
        : `shrink-0 bg-gray-300 w-px h-full ${className}`
    }
    {...props}
  />
))

Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
