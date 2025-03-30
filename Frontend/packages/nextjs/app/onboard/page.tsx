"use client";

import { useState, useEffect } from "react";
import type { NextPage } from "next";
import { motion } from "framer-motion";
import Chat from "~~/components/Chat";

interface Step {
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    title: "Business Analysis",
    description: "Map your business structure and identify Web3 integration points"
  },
  {
    title: "Technical Planning",
    description: "Design the technical architecture and smart contract requirements"
  },
  {
    title: "Implementation Strategy",
    description: "Create a detailed roadmap for Web3 transformation"
  }
];

const OnboardPage: NextPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [key, setKey] = useState(0); // Key to force Chat component remount

  // Reset chat when step changes
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [currentStep]);

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#9333EA]/10 via-black to-black"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] pointer-events-none"></div>
      </div>

      <div className="relative container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Start Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9333EA] to-purple-400">
              Web3 Journey
            </span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Let our AI team guide you through the process of bringing your business onchain
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6
                          shadow-[0_0_15px_rgba(168,85,247,0.1)]">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer
                            ${currentStep === index
                              ? "bg-[#9333EA]/10 border border-[#9333EA]/30"
                              : "hover:bg-white/5"}`}
                  onClick={() => setCurrentStep(index)}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                                ${currentStep === index
                                  ? "bg-[#9333EA] text-white"
                                  : "bg-white/5 text-gray-400"}`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">{step.title}</h3>
                    <p className="text-gray-400 text-sm">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Chat key={key} mode="onboarding" currentStep={currentStep} />
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#9333EA]/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#9333EA]/20 to-transparent"></div>
      </div>
    </main>
  );
};

export default OnboardPage;
