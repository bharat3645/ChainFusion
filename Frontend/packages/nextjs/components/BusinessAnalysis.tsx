import { BarChart3, Users, Rocket, DollarSign, Lock, Zap } from "lucide-react";

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

export const BusinessAnalysis = ({ model }: { model: BusinessModel }) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-xl font-bold text-white mb-2">{model.name} Business Analysis</h2>
        <p className="text-gray-300">{model.model}</p>
      </div>

      <MetricsGrid metrics={model.metrics} />

      <BusinessModelCard
        title="Revenue Streams"
        items={model.revenue}
        icon={DollarSign}
      />

      <BusinessModelCard
        title="Blockchain Integration"
        items={model.blockchain}
        icon={Lock}
      />

      <BusinessModelCard
        title="Implementation Steps"
        items={model.integration}
        icon={Rocket}
      />

      <div className="grid grid-cols-2 gap-4">
        <BusinessModelCard
          title="Challenges"
          items={model.challenges}
          icon={BarChart3}
        />
        <BusinessModelCard
          title="Opportunities"
          items={model.opportunities}
          icon={Zap}
        />
      </div>
    </div>
  );
}; 