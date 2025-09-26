import { useState } from "react"

export default function Toggle({ checked = false, onChange, label }) {
  const [isChecked, setIsChecked] = useState(checked)

  const handleToggle = () => {
    setIsChecked(!isChecked)
    if (onChange) onChange(!isChecked)
  }

  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-gray-700">{label}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-gray-300 transition-colors duration-200 ease-in-out
          ${isChecked ? "bg-blue-600" : "bg-gray-200"}
        `}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
            ${isChecked ? "translate-x-5" : "translate-x-0"}
          `}
        />
      </button>
    </div>
  )
}
