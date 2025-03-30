import { motion } from "framer-motion";

const CTA = () => {
  return (
    <div className="py-24 bg-gray-900 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-purple-500/20 to-cyan-500/20 animate-pulse"></div>
      
      {/* Glassmorphism container */}
      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center p-12 rounded-3xl
                     bg-gradient-to-r from-white/5 to-white/10
                     backdrop-blur-xl border border-white/10
                     shadow-[0_0_30px_rgba(168,85,247,0.2)]"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Build the Future?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join us in revolutionizing the blockchain space. Start building your decentralized applications today.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-semibold
                       shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all
                       hover:shadow-[0_0_30px_rgba(168,85,247,0.8)]"
            >
              Get Started
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-transparent border-2 border-purple-500/50 rounded-full text-white font-semibold
                       transition-all hover:border-purple-500"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CTA;