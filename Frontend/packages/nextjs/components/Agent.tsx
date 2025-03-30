"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface Skill {
  name: string;
  color: string;
}

interface AgentCardProps {
  name: string;
  role: string;
  image: string;
  prompt: string;
  skills: Skill[];
}

const getSkillColor = (color: string) => {
  const colors = {
    blue: "bg-blue-500/5 text-blue-400 border-blue-500/20",
    purple: "bg-purple-500/5 text-purple-400 border-purple-500/20",
    pink: "bg-pink-500/5 text-pink-400 border-pink-500/20",
    green: "bg-green-500/5 text-green-400 border-green-500/20",
  };
  return colors[color as keyof typeof colors] || colors.blue;
};

export const agents = [
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

const AgentCard = ({ name, role, image, prompt, skills }: AgentCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="group"
    >
      <div className="relative p-6 bg-black border border-gray-800 rounded-xl
                    transition-all duration-300 hover:border-purple-500/30
                    hover:bg-gradient-to-b hover:from-purple-900/10 hover:to-black">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <motion.div 
            className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-800
                     group-hover:border-purple-500/30 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src={image}
              alt={name}
              width={48}
              height={48}
              className="object-cover"
            />
          </motion.div>
          <div>
            <h3 className="text-lg font-medium text-white group-hover:text-purple-400 transition-colors duration-300">
              {name}
            </h3>
            <p className="text-gray-500 text-sm">{role}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-6 line-clamp-3 group-hover:text-gray-300 transition-colors duration-300">
          {prompt}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <motion.span
              key={skill.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`px-3 py-1 text-xs rounded-md border ${getSkillColor(skill.color)}
                       transition-all duration-300`}
            >
              {skill.name}
            </motion.span>
          ))}
        </div>

        {/* Hover gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-transparent
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl
                      pointer-events-none"></div>
      </div>
    </motion.div>
  );
};

export default AgentCard;
