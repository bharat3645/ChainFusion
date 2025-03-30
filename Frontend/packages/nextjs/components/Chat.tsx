"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Send, BarChart3, Users, Rocket, DollarSign, Lock, Zap } from "lucide-react";
import { BusinessAnalysis } from "./BusinessAnalysis";
import { agents } from "./Agent";

interface Message {
  type: "user" | "agent";
  content: string | BusinessModel;
  contentType?: "text" | "analysis";
  agentName?: string;
  agentImage?: string;
}

interface BusinessModel {
  name: string;
  model: string;
  revenue: string[];
  blockchain: string[];
  integration: string[];
  metrics: {
    marketSize: string;
    users: string;
    growth: string;
    valuation: string;
  };
  challenges: string[];
  opportunities: string[];
}

interface ChatProps {
  mode?: "onboarding" | "general";
  currentStep?: number;
}

const businessModels: { [key: string]: BusinessModel } = {
  uber: {
    name: "Uber",
    model: "Ride-sharing and delivery platform connecting drivers with passengers and restaurants with customers",
    revenue: [
      "Commission from rides and deliveries (15-25%)",
      "Surge pricing during high demand (2-3x normal rates)",
      "Subscription services (Uber Pass - $24.99/month)",
      "Advertisement revenue ($500M+ annually)"
    ],
    blockchain: [
      "Smart contract-based payment system with instant settlements",
      "Tokenized loyalty program with cross-platform benefits",
      "Decentralized driver reputation system with immutable records",
      "Transparent pricing mechanism with real-time data"
    ],
    integration: [
      "Replace traditional payment system with smart contracts (3-6 months)",
      "Implement token rewards for frequent users (2-4 months)",
      "Create decentralized driver rating system (4-8 months)",
      "Build transparent fare calculation system (2-3 months)"
    ],
    metrics: {
      marketSize: "$200B+",
      users: "130M+",
      growth: "20% YoY",
      valuation: "$70B+"
    },
    challenges: [
      "High driver acquisition costs",
      "Regulatory compliance",
      "Market competition",
      "Driver retention"
    ],
    opportunities: [
      "Expand to new markets",
      "Autonomous vehicles",
      "Multi-modal transport",
      "B2B services"
    ]
  },
  airbnb: {
    name: "Airbnb",
    model: "Peer-to-peer property rental platform connecting hosts with guests worldwide",
    revenue: [
      "Service fees from bookings (14-16%)",
      "Host listing fees (3%)",
      "Experience bookings (20%)",
      "Premium host services ($500/year)"
    ],
    blockchain: [
      "Smart contract-based booking system with automated payments",
      "Tokenized property shares for fractional ownership",
      "Decentralized review system with verified stays",
      "Automated payment escrow with dispute resolution"
    ],
    integration: [
      "Implement smart contract booking system (4-6 months)",
      "Create property tokenization platform (6-8 months)",
      "Build decentralized review mechanism (3-4 months)",
      "Develop automated payment release system (2-3 months)"
    ],
    metrics: {
      marketSize: "$150B+",
      users: "150M+",
      growth: "15% YoY",
      valuation: "$80B+"
    },
    challenges: [
      "Regulatory restrictions",
      "Trust and safety",
      "Property quality control",
      "Local competition"
    ],
    opportunities: [
      "Luxury market expansion",
      "Corporate housing",
      "Virtual experiences",
      "Property management"
    ]
  },
  spotify: {
    name: "Spotify",
    model: "Music and podcast streaming platform with freemium business model and personalized content delivery",
    revenue: [
      "Premium subscriptions ($9.99-14.99/month)",
      "Advertisement revenue ($2.5B+ annually)",
      "Partnership deals ($500M+)",
      "Merchandise sales ($100M+)"
    ],
    blockchain: [
      "NFT-based music rights with instant royalty distribution",
      "Token-based royalty payments with transparent tracking",
      "Smart contract licensing with automated compliance",
      "Fan engagement tokens with exclusive benefits"
    ],
    integration: [
      "Create NFT platform for music rights (6-8 months)",
      "Implement automated royalty distribution (4-6 months)",
      "Build smart contract licensing system (3-4 months)",
      "Develop fan token ecosystem (5-7 months)"
    ],
    metrics: {
      marketSize: "$30B+",
      users: "400M+",
      growth: "25% YoY",
      valuation: "$50B+"
    },
    challenges: [
      "Content licensing costs",
      "Artist compensation",
      "Platform competition",
      "User retention"
    ],
    opportunities: [
      "Podcast expansion",
      "Live events",
      "Artist tools",
      "Social features"
    ]
  }
};

const BusinessModelCard = ({ title, items, icon: Icon }: { title: string; items: string[]; icon: any }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-8 h-8 rounded-lg bg-[#9333EA]/20 flex items-center justify-center">
        <Icon className="w-5 h-5 text-[#9333EA]" />
      </div>
      <h3 className="text-white font-medium">{title}</h3>
    </div>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="text-gray-300 text-sm flex items-start gap-2">
          <span className="text-[#9333EA] mt-1">•</span>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const MetricsGrid = ({ metrics }: { metrics: BusinessModel['metrics'] }) => (
  <div className="grid grid-cols-2 gap-3 mb-4">
    {Object.entries(metrics).map(([key, value]) => (
      <div key={key} className="bg-white/5 border border-white/10 rounded-lg p-3">
        <div className="text-gray-400 text-sm mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
        <div className="text-white font-medium">{value}</div>
      </div>
    ))}
  </div>
);

const analyzeBusinessModel = (company: string): Message['content'] => {
  const model = businessModels[company.toLowerCase()];
  if (!model) {
    return "I don't have detailed information about this company yet. However, I can help you analyze your business model and suggest Web3 integration points. Would you like to proceed with that?";
  }
  return model;
};

const getInitialMessage = (mode: string, step?: number) => {
  if (mode === "onboarding") {
    switch (step) {
      case 0:
        return "Let's start by analyzing your business structure. Could you tell me about your current business model and the key areas you'd like to enhance with blockchain technology?";
      case 1:
        return "Now, let's focus on the technical requirements. What specific blockchain features are you most interested in implementing?";
      case 2:
        return "Great! Let's create your implementation roadmap. What's your desired timeline for this Web3 transformation?";
      default:
        return "Hey, I'm Samay, your AI Business Architect. Let me help you map your business out and separate it into different components to modularise and make a plan to bring you onchain.";
    }
  }
  return "Hey, I'm Samay, your AI Business Architect. Let me help you map your business out and separate it into different components to modularise and make a plan to bring you onchain.";
};

// Sample responses based on keywords
const getAIResponse = (input: string, mode: string, step: number) => {
  const inputLower = input.toLowerCase();
  
  // Check for company analysis requests
  for (const company of Object.keys(businessModels)) {
    if (inputLower.includes(company)) {
      return analyzeBusinessModel(company);
    }
  }
  
  // Onboarding mode responses
  if (mode === "onboarding") {
    if (step === 0) {
      if (inputLower.includes("uber") || inputLower.includes("ride")) {
        return "I see you're in the ride-sharing business. For Web3 integration, we could focus on:\n\n1. Tokenized Rewards System\n2. Decentralized Driver Reputation\n3. Smart Contract-based Payments\n4. Transparent Pricing Mechanism\n\nWhich of these areas interests you most?";
      }
      return "Thanks for sharing your business model. I can suggest several blockchain integration points:\n\n1. Smart Contract Automation\n2. Token-based Loyalty Program\n3. Decentralized Identity Management\n4. Transparent Supply Chain\n\nWould you like to explore any of these areas in detail?";
    }
    if (step === 1) {
      return "Based on your technical requirements, here's what we could implement:\n\n1. ERC-20 tokens for rewards\n2. Smart contracts for automated payments\n3. IPFS for decentralized data storage\n4. Zero-knowledge proofs for privacy\n\nLet's discuss which features would provide the most value for your business.";
    }
  }
  
  // General mode responses
  if (inputLower.includes("how") || inputLower.includes("what")) {
    return "Let me explain the process. We'll:\n\n1. Analyze your current system\n2. Identify integration points\n3. Design smart contracts\n4. Implement Web3 features\n\nWould you like me to elaborate on any of these steps?";
  }
  
  // Add analysis prompt if user mentions business model
  if (inputLower.includes("business model") || inputLower.includes("analyze")) {
    return "I can help analyze business models of companies like Uber, Airbnb, or Spotify and suggest Web3 integration strategies. Which company would you like to learn about?";
  }
  
  return "I understand your requirements. Let's break this down into manageable components:\n\n1. Frontend Integration\n2. Smart Contract Development\n3. Token Economics\n4. Security Measures\n\nWhich aspect would you like to explore first?";
};

const getAgentByName = (name: string) => {
  return agents.find(agent => agent.name === name) || agents[0];
};

const getRespondingAgent = (input: string) => {
  const inputLower = input.toLowerCase();
  
  if (inputLower.includes("research") || inputLower.includes("analyze")) {
    return getAgentByName("Mahip");
  } else if (inputLower.includes("smart contract") || inputLower.includes("code")) {
    return getAgentByName("Rebel Kid");
  }
  
  return getAgentByName("Samay");
};

export default function Chat({ mode = "general", currentStep = 0 }: ChatProps) {
  const defaultAgent = getAgentByName("Samay");
  
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "agent",
      content: getInitialMessage(mode, currentStep),
      contentType: "text",
      agentName: defaultAgent.name,
      agentImage: defaultAgent.image
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(defaultAgent);

  const handleAgentSelect = (agentName: string) => {
    const newAgent = getAgentByName(agentName);
    setSelectedAgent(newAgent);
    // Add a system message indicating agent switch
    setMessages(prev => [...prev, {
      type: "agent",
      content: `Hey, ${newAgent.name} here! How can I help you with ${newAgent.role.toLowerCase()} today?`,
      contentType: "text",
      agentName: newAgent.name,
      agentImage: newAgent.image
    }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    // Add user message
    const userMessage = input.trim();
    setMessages(prev => [...prev, { type: "user", content: userMessage, contentType: "text" }]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Use selected agent instead of determining from input
    const respondingAgent = selectedAgent;

    // Check for company analysis
    const companyMatch = Object.keys(businessModels).find(company => 
      userMessage.toLowerCase().includes(company)
    );

    if (companyMatch) {
      const analysis = analyzeBusinessModel(companyMatch);
      setMessages(prev => [...prev, {
        type: "agent",
        content: analysis,
        contentType: typeof analysis === "string" ? "text" : "analysis",
        agentName: respondingAgent.name,
        agentImage: respondingAgent.image
      }]);
    } else {
      // Get regular AI response
      const response = getAIResponse(userMessage, mode, currentStep);
      setMessages(prev => [...prev, {
        type: "agent",
        content: response,
        contentType: "text",
        agentName: respondingAgent.name,
        agentImage: respondingAgent.image
      }]);
    }
    
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-screen max-h-[800px] bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden
                    shadow-[0_0_15px_rgba(168,85,247,0.1)] relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#9333EA]/5 via-black/50 to-black pointer-events-none"></div>

      {/* Chat Header with Agent Selector */}
      <div className="relative p-6 border-b border-white/10 bg-gradient-to-r from-[#9333EA]/10 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">AI Assistant</h2>
            <p className="text-gray-400 text-sm mt-1">Powered by advanced AI</p>
          </div>
          
          {/* Agent Selector */}
          <div className="flex items-center gap-4">
            {agents.map((agent) => (
              <button
                key={agent.name}
                onClick={() => handleAgentSelect(agent.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
                          ${selectedAgent.name === agent.name
                            ? "bg-[#9333EA]/20 text-white border border-[#9333EA]/30"
                            : "text-gray-400 hover:text-white hover:bg-white/5"}`}
              >
                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/10">
                  <Image
                    src={agent.image}
                    alt={agent.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="hidden md:block">{agent.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex items-start gap-4 max-w-[80%] ${
                  message.type === "user"
                    ? "flex-row-reverse"
                    : "flex-row"
                }`}
              >
                {message.type === "agent" && (
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#9333EA]/30 flex-shrink-0
                               shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                    <Image
                      src={message.agentImage || "/samay.png"}
                      alt={message.agentName || "AI"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div
                  className={`p-4 rounded-2xl backdrop-blur-sm ${
                    message.type === "user"
                      ? "bg-[#9333EA]/20 text-white border border-[#9333EA]/30"
                      : "bg-white/5 border border-white/10"
                  }`}
                >
                  {message.type === "agent" && (
                    <div className="text-[#9333EA] font-medium mb-1">{message.agentName}</div>
                  )}
                  {message.contentType === "analysis" && typeof message.content === "object" ? (
                    <BusinessAnalysis model={message.content} />
                  ) : (
                    <p className="text-gray-100 leading-relaxed whitespace-pre-line">{message.content as string}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-gray-400"
          >
            <div className="w-2 h-2 bg-[#9333EA] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2 h-2 bg-[#9333EA] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2 h-2 bg-[#9333EA] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </motion.div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative p-6 border-t border-white/10 bg-black/30">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${selectedAgent.name} something...`}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500
                     focus:outline-none focus:border-[#9333EA]/50 focus:ring-1 focus:ring-[#9333EA]/30 transition-all"
          />
          <button
            type="submit"
            disabled={isTyping}
            className={`text-white px-4 rounded-xl transition-all duration-200
                     flex items-center justify-center group shadow-[0_0_15px_rgba(168,85,247,0.2)]
                     ${isTyping 
                       ? "bg-gray-700 cursor-not-allowed" 
                       : "bg-[#9333EA] hover:bg-[#7928CA] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                     }`}
          >
            <Send size={20} className="group-hover:scale-110 transition-transform duration-200" />
          </button>
        </div>
      </form>
    </div>
  );
}