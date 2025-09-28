// components/GlobalLoader.jsx
import { useSelector } from "react-redux";
import Loader from "./Loader";

export default function GlobalLoader() {
  const { isLoading, text } = useSelector((state) => state.loader);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <Loader text={text} />
    </div>
  );
}
