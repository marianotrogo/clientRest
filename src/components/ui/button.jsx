// src/components/ui/button.jsx
import React from "react"

function Button({
  className = "",
  variant = "default",
  size = "default",
  ...props
}) {
  let base =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none"

  // variantes de color
  let variants = {
    default: "bg-black text-white shadow hover:bg-gray-900",
    destructive: "bg-red-600 text-white shadow hover:bg-red-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-100 text-black",
    secondary: "bg-gray-200 text-black shadow hover:bg-gray-300",
    ghost: "hover:bg-gray-100 text-black",
    link: "text-blue-600 hover:underline underline-offset-4",
  }

  // tamaños
  let sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-sm",
    lg: "h-10 rounded-md px-6 text-base",
    icon: "h-9 w-9 p-0",
  }

  return (
    <button
      data-slot="button"
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  )
}

export { Button }
