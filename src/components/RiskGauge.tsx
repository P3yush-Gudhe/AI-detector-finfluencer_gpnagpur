import { motion } from "framer-motion";

interface RiskGaugeProps {
  score: number;
  level: "Low" | "Medium" | "High";
}

const RiskGauge = ({ score, level }: RiskGaugeProps) => {
  const percentage = (score / 10) * 100;
  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference - (percentage / 100) * circumference * 0.75;

  const colorClass = level === "Low" ? "text-risk-low" : level === "Medium" ? "text-risk-medium" : "text-risk-high";
  const glowClass = level === "Low" ? "glow-accent" : level === "Medium" ? "glow-warning" : "glow-destructive";
  const gradientClass = level === "Low" ? "gradient-risk-low" : level === "Medium" ? "gradient-risk-medium" : "gradient-risk-high";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`relative w-52 h-52 ${glowClass} rounded-full`}>
        <svg className="w-full h-full -rotate-[135deg]" viewBox="0 0 200 200">
          <circle
            cx="100" cy="100" r="80"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
          />
          <motion.circle
            cx="100" cy="100" r="80"
            fill="none"
            stroke="currentColor"
            className={colorClass}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`text-5xl font-bold font-mono ${colorClass}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {score.toFixed(1)}
          </motion.span>
          <span className="text-sm text-muted-foreground mt-1">/ 10</span>
        </div>
      </div>
      <motion.div
        className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider ${gradientClass}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {level} Risk
      </motion.div>
    </div>
  );
};

export default RiskGauge;
