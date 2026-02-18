import { motion } from "framer-motion";
import { AlertTriangle, TrendingUp, ShieldAlert, Megaphone } from "lucide-react";

export interface Flag {
  type: "hype_keyword" | "unrealistic_return" | "missing_disclaimer" | "aggressive_sentiment";
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  scoreImpact: number;
}

const iconMap = {
  hype_keyword: Megaphone,
  unrealistic_return: TrendingUp,
  missing_disclaimer: ShieldAlert,
  aggressive_sentiment: AlertTriangle,
};

const severityColor = {
  low: "border-risk-low/30 bg-risk-low/5",
  medium: "border-risk-medium/30 bg-risk-medium/5",
  high: "border-risk-high/30 bg-risk-high/5",
};

const severityText = {
  low: "text-risk-low",
  medium: "text-risk-medium",
  high: "text-risk-high",
};

const FlagsList = ({ flags }: { flags: Flag[] }) => {
  if (flags.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <ShieldAlert className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No flags detected</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {flags.map((flag, i) => {
        const Icon = iconMap[flag.type];
        return (
          <motion.div
            key={i}
            className={`p-4 rounded-lg border ${severityColor[flag.severity]}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="flex items-start gap-3">
              <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${severityText[flag.severity]}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-foreground">{flag.title}</h4>
                  <span className={`text-xs font-mono font-bold ${severityText[flag.severity]}`}>
                    +{flag.scoreImpact}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{flag.description}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default FlagsList;
