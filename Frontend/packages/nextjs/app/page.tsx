"use client";

import { useEffect } from "react";
import type { NextPage } from "next";
import AOS from "aos";
import "aos/dist/aos.css";
import AgentCard from "~~/components/Agent";
import Hero from "~~/components/Hero";

const agents = [
  {
    name: "Samay",
    role: "System Architect",
    image: "/agents/samay.png",
    prompt:
      "I am an experienced system architect that has designed many systems. I am Samay, focusing on helping you with your system architecture needs.",
    skills: [
      { name: "Frontend", color: "blue" },
      { name: "Backend", color: "purple" },
      { name: "Database", color: "pink" },
      { name: "DevOps", color: "green" },
    ],
  },
  {
    name: "Mahip",
    role: "Research Analyst",
    image: "/agents/mahip.png",
    prompt:
      "I am as nerdy as it gets, I can research anything and everything. I am Mahip, focusing on helping you with your research needs.",
    skills: [
      { name: "NFTs", color: "blue" },
      { name: "Tokenization", color: "purple" },
      { name: "UI/UX", color: "pink" },
      { name: "Marketing", color: "green" },
    ],
  },
  {
    name: "Rebel Kid",
    role: "Smart Contract Developer",
    image: "/agents/rebel.png",
    prompt:
      "I am a cracked smart contract developer that can work 24/7. Yo call me Rebel Kid, I'll focus on helping you with your smart contract needs.",
    skills: [
      { name: "Tokenization", color: "blue" },
      { name: "NFTs", color: "purple" },
      { name: "Bridges", color: "pink" },
      { name: "DeFi", color: "green" },
    ],
  },
];

const Home: NextPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out",
    });
  }, []);

  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <Hero />

      {/* Agents Section */}
      <section className="relative py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Your{" "}
              <span className="text-[#9333EA]">
                Onchain
              </span>{" "}
              Team
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Meet our specialized AI agents ready to help you bridge the gap between Web2 and Web3
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {agents.map((agent, index) => (
              <div 
                key={agent.name} 
                data-aos="fade-up" 
                data-aos-delay={index * 100}
                className="transform hover:-translate-y-1 transition-transform duration-300"
              >
                <AgentCard {...agent} />
              </div>
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
      </section>
    </main>
  );
};

export default Home;
