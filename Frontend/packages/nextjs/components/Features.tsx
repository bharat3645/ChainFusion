import { motion } from "framer-motion";

const features = [
  {
    title: "Decentralized Security",
    description: "Enterprise-grade security through distributed blockchain technology",
    icon: "🔒",
  },
  {
    title: "Smart Contracts",
    description: "Automated, trustless transactions with smart contract technology",
    icon: "📝",
  },
  {
    title: "Transparency",
    description: "Complete visibility and immutability of all transactions",
    icon: "👁️",
  },
  {
    title: "Scalability",
    description: "Built for growth with efficient scaling solutions",
    icon: "📈",
  },
];

const Features = () => {
  return (
    <div className="py-24 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
            Why Choose Us
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience the power of blockchain technology with our cutting-edge features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700
                         hover:border-purple-500/50 transition-all duration-300
                         shadow-lg hover:shadow-purple-500/20"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;