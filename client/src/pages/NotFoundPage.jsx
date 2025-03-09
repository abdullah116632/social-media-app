import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen" style={{ background: "linear-gradient(to bottom, #111827, #1e40af)", color: "#ffffff" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center p-8 rounded-2xl shadow-2xl"
        style={{ backgroundColor: "rgba(31, 41, 55, 0.7)" }} // bg-gray-800/70
      >
        <motion.div
          initial={{ rotate: -15 }}
          animate={{ rotate: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="flex justify-center"
        >
          <FaExclamationTriangle style={{ fontSize: "3.75rem", color: "#facc15" }} /> {/* text-6xl text-yellow-400 */}
        </motion.div>
        <h1 className="text-5xl font-bold mt-4">404 - Page Not Found</h1>
        <p style={{ color: "#d1d5db" }} className="mt-3"> {/* text-gray-300 */}
          The page you're looking for doesn't exist or has been moved.
        </p>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="mt-6"
        >
          <Link
            to="/"
            className="px-6 py-3 rounded-full font-semibold shadow-lg transition"
            style={{ backgroundColor: "#facc15", color: "#000000", hover: { backgroundColor: "#eab308" } }} // bg-yellow-500 hover:bg-yellow-600 text-black
          >
            Return Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
