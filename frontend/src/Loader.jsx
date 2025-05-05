import React from "react";
import { motion } from "framer-motion";
import logo from "./assets/logo.png";

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-20">
      <motion.div
        className="w-20 h-20 rounded-full flex justify-center items-center"
      >
        <motion.img
          src={logo}
          alt="Loading..."
          className="w-10 h-10"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 0], // Logo fades in and out
          }}
          transition={{
            opacity: {
              repeat: Infinity,
              duration: 2, // Adjust duration for fading speed
              ease: "easeInOut",
            },
          }}
        />
      </motion.div>
      <motion.p
        className="mt-2 text-lg font-semibold text-red-500"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 1, 0], // Text fades in and out
        }}
        transition={{
          opacity: {
            repeat: Infinity,
            duration: 2, // Adjust duration for fading speed
            ease: "easeInOut",
          },
        }}
      >
        e-guide
      </motion.p>
    </div>
  );
};

export default Loader;
