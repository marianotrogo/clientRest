function Card({ className = "", ...props }) {
  return (
    <div
      data-slot="card"
      className={`bg-[#f1f5f9] text-[#1f2937] flex flex-col gap-6 rounded-xl border border-gray-300 shadow-md hover:shadow-lg transition-shadow py-6 ${className}`}
      {...props}
    />
  )
}

function CardHeader({ className = "", ...props }) {
  return (
    <div
      data-slot="card-header"
      className={`grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 ${className}`}
      {...props}
    />
  )
}

function CardTitle({ className = "", ...props }) {
  return (
    <div
      data-slot="card-title"
      className={`leading-none font-semibold text-lg ${className}`}
      {...props}
    />
  )
}

function CardDescription({ className = "", ...props }) {
  return (
    <div
      data-slot="card-description"
      className={`text-gray-500 text-sm ${className}`}
      {...props}
    />
  )
}

function CardContent({ className = "", ...props }) {
  return (
    <div
      data-slot="card-content"
      className={`px-6 ${className}`}
      {...props}
    />
  )
}

function CardFooter({ className = "", ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={`flex items-center px-6 ${className}`}
      {...props}
    />
  )
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
