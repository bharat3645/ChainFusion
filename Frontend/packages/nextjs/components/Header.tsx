"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

export const Header = () => {
  const pathname = usePathname();
  const { push } = useRouter();

  const navigation = [
    { name: "Home", path: "/" },
    { name: "Get Started", path: "/onboard" },
    { name: "Chat", path: "/chat" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
      <nav className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => push("/")}
        >
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black/20 backdrop-blur-sm
                         border border-white/5 transition-all duration-300
                         group-hover:border-[#9333EA]/30 group-hover:shadow-[0_0_15px_rgba(147,51,234,0.1)]">
            <Image
              src="/logo.png"
              alt="Bridge Onchain"
              width={64}
              height={64}
              className="object-contain p-1 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg"
              priority
            />
          </div>
          <span className="text-xl text-white font-semibold tracking-wide
                         bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent transition-transform duration-300 group-hover:scale-105">
            ChainFusion 
          </span>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-6"
        >
          {navigation.map((item, index) => (
            <motion.button
              key={item.path}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                pathname === item.path
                  ? "bg-[#9333EA]/20 text-white border border-[#9333EA]/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
              onClick={() => push(item.path)}
            >
              {item.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Connect Wallet Button */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#9333EA] hover:bg-[#7928CA] text-white px-6 py-2 rounded-lg
                   transition-all duration-200 shadow-[0_0_15px_rgba(168,85,247,0.2)]
                   hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
        >
          Connect Wallet
        </motion.button>
      </nav>
    </header>
  );
};
