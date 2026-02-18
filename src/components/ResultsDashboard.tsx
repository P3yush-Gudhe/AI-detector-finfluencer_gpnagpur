import { motion } from "framer-motion";
import RiskGauge from "./RiskGauge";
import FlagsList, { Flag } from "./FlagsList";
import TranscriptPreview from "./TranscriptPreview";
import DisclaimerStatus from "./DisclaimerStatus";
import { BarChart3, Flag as FlagIcon, FileText, ShieldAlert } from "lucide-react";

export interface AnalysisResult {
  riskScore: number;
  riskLevel: "Low" | "Medium" | "High";
  flags: Flag[];
  transcript: string;
  disclaimerFound: boolean;
  disclaimers: string[];
  summary: string;
}

interface ResultsDashboardProps {
  result: AnalysisResult;
}

const SectionHeader = ({ icon: Icon, title }: { icon: any; title: string }) => (
  <div className="flex items-center gap-2 mb-4">
    <Icon className="w-4 h-4 text-primary" />
    <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">{title}</h2>
  </div>
);

const ResultsDashboard = ({ result }: ResultsDashboardProps) => {
  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 pb-20"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Summary */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-foreground mb-2">Analysis Complete</h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">{result.summary}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Score */}
        <div className="lg:col-span-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <SectionHeader icon={BarChart3} title="Risk Score" />
            <RiskGauge score={result.riskScore} level={result.riskLevel} />
          </div>
        </div>

        {/* Flags */}
        <div className="lg:col-span-8">
          <div className="rounded-xl border border-border bg-card p-6 h-full">
            <SectionHeader icon={FlagIcon} title={`Flags Detected (${result.flags.length})`} />
            <FlagsList flags={result.flags} />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="lg:col-span-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <SectionHeader icon={ShieldAlert} title="Disclaimer Status" />
            <DisclaimerStatus found={result.disclaimerFound} disclaimers={result.disclaimers} />
          </div>
        </div>

        {/* Transcript */}
        <div className="lg:col-span-8">
          <div className="rounded-xl border border-border bg-card p-6">
            <SectionHeader icon={FileText} title="Transcript Preview" />
            <TranscriptPreview transcript={result.transcript} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultsDashboard;
