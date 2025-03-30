import { motion } from "framer-motion";

const roadmapData = [
  {
    phase: "Phase 1",
    title: "Foundation",
    description: "Launch of core blockchain infrastructure and smart contract deployment",
    date: "Q1 2024",
  },
  {
    phase: "Phase 2",
    title: "Expansion",
    description: "Integration of advanced features and partnership development",
    date: "Q2 2024",
  },
  {
    phase: "Phase 3",
    title: "Scaling",
    description: "Implementation of layer 2 solutions and cross-chain capabilities",
    date: "Q3 2024",
  },
  {
    phase: "Phase 4",
    title: "Ecosystem",
    description: "Launch of developer tools and community governance",
    date: "Q4 2024",
  },
];

const Roadmap = () => {
  return (
    <div className="py-24 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
            Our Roadmap
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            The journey ahead: Our strategic plan for blockchain innovation
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-cyan-500"></div>

          {/* Timeline items */}
          <div className="space-y-20">
            {roadmapData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
              >
                {/* Content */}
                <div className={`w-1/2 ${index % 2 === 0 ? "pr-12 text-right" : "pl-12 text-left"}`}>
                  <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-purple-500/50 
                                transition-all duration-300 shadow-lg hover:shadow-purple-500/20">
                    <span className="text-sm text-purple-400">{item.phase}</span>
                    <h3 className="text-xl font-semibold text-white mt-2">{item.title}</h3>
                    <p className="text-gray-400 mt-2">{item.description}</p>
                    <div className="text-cyan-400 mt-4">{item.date}</div>
                  </div>
                </div>

                {/* Timeline dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-500 rounded-full 
                              shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;