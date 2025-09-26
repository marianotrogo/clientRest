

export default function Textarea({ value, onChange, placeholder, className = "" }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      rows={3} // altura por defecto
    />
  );
}
