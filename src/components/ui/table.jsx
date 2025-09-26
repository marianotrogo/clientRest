export function Table({ children, className }) {
  return (
    <table className={`w-full text-sm border-collapse ${className || ""}`}>
      {children}
    </table>
  )
}

export function TableHead({ children }) {
  return <thead className="border-b border-gray-200 bg-gray-50">{children}</thead>
}

export function TableRow({ children }) {
  return <tr className="border-b border-gray-100 hover:bg-gray-50">{children}</tr>
}

export function TableCell({ children, className }) {
  return <td className={`px-2 py-1 ${className || ""}`}>{children}</td>
}

export function TableHeader({ children }) {
  return (
    <th className="px-2 py-1 text-left font-medium text-gray-600">{children}</th>
  )
}
