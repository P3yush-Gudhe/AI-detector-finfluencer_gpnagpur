import { motion } from "framer-motion";
import { Loader2, CheckCircle2, Circle, AlertCircle } from "lucide-react";

export type StepStatus = "pending" | "active" | "complete" | "error";

export interface Step {
  id: string;
  label: string;
  status: StepStatus;
}

interface AnalysisStepsProps {
  steps: Step[];
}

const statusIcon = (status: StepStatus) => {
  switch (status) {
    case "pending": return <Circle className="w-5 h-5 text-muted-foreground" />;
    case "active": return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
    case "complete": return <CheckCircle2 className="w-5 h-5 text-success" />;
    case "error": return <AlertCircle className="w-5 h-5 text-destructive" />;
  }
};

const AnalysisSteps = ({ steps }: AnalysisStepsProps) => {
  return (
    <div className="flex flex-col gap-3">
      {steps.map((step, i) => (
        <motion.div
          key={step.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${
            step.status === "active"
              ? "border-primary/30 bg-primary/5"
              : step.status === "complete"
              ? "border-success/20 bg-success/5"
              : step.status === "error"
              ? "border-destructive/20 bg-destructive/5"
              : "border-border bg-card"
          }`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          {statusIcon(step.status)}
          <span className={`text-sm font-medium ${
            step.status === "active" ? "text-primary" :
            step.status === "complete" ? "text-success" :
            step.status === "error" ? "text-destructive" :
            "text-muted-foreground"
          }`}>
            {step.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default AnalysisSteps;
