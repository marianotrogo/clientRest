import React from "react"

export default function Select({ label, value, onChange, options = [], placeholder = "Selecciona una opción" }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-gray-700 font-medium">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-md px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
