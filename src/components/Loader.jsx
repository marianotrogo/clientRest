export default function Loader({ size = 16, text = 'Cargando...' }) {
    return (
        <div className="flex flex-col items-center justify-center p-6">
            <div className="animate-spin rounded-full border-4 border-t-4 border-gray-300 border-t-black w-16 h-16 mb-2"></div>
            <span className="text-gray-700">{text}</span>
        </div>
    );
}
