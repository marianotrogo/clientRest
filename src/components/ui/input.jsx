// src/components/ui/input.jsx
import React from "react"

function Input({ className = "", type = "text", ...props }) {
  const baseClasses = `
    w-full min-w-0 h-9 px-3 py-1 text-base
    rounded-md border border-gray-300 
    placeholder-gray-400 selection:bg-black selection:text-white
    shadow-sm outline-none
    disabled:opacity-100 disabled:cursor-not-allowed disabled:pointer-events-none
    focus:ring-2 focus:ring-black
  `

  return <input type={type} className={`${baseClasses} ${className}`} {...props} />
}

export { Input }
