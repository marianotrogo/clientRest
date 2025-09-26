// src/components/ui/badge.jsx
import React from "react"

function Badge({ className = "", variant = "default", children, ...props }) {
  // colores y estilos por variante
  const variants = {
    default: "bg-black text-white border-transparent",
    secondary: "bg-gray-200 text-black border-transparent",
    destructive: "bg-red-600 text-white border-transparent",
    outline: "bg-white text-black border border-gray-300",
  }

  const base =
    "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap gap-1"

  return (
    <span
      data-slot="badge"
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}

export { Badge }
