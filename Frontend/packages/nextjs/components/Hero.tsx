"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "~~/shadcn/components/ui/button";

export default function Hero() {
  const { push } = useRouter();

  return (
    <section className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* Subtle gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-black"></div>
      </div>

      <div className="relative container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight"
          >
            Bridge Your Web2 Apps to Web3 with{" "}
            <span className="text-[#9333EA]">
              AI Agents
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-gray-400 text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Enhance your user experience with AI-powered agents that can automate tasks, provide support, and more.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Button 
              className="bg-[#9333EA] hover:bg-[#7928CA] text-white px-8 py-6 text-lg rounded-lg
                       transition-all duration-300 transform hover:scale-105"
              onClick={() => push("/onboard")}
            >
              Get Started
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative gradient lines */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
    </section>
  );
}
