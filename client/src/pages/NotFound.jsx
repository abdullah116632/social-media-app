import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-blue-800 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center p-8 bg-gray-800/70 rounded-2xl shadow-2xl"
      >
        <motion.div
          initial={{ rotate: -15 }}
          animate={{ rotate: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="flex justify-center"
        >
          <FaExclamationTriangle className="text-6xl text-yellow-400" />
        </motion.div>
        <h1 className="text-5xl font-bold mt-4">404 - Page Not Found</h1>
        <p className="text-gray-300 mt-3">The page you're looking for doesn't exist or has been moved.</p>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="mt-6"
        >
          <Link
            to="/"
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-full font-semibold shadow-lg transition"
          >
            Return Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}