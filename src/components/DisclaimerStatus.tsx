import { motion } from "framer-motion";
import { ShieldCheck, ShieldX } from "lucide-react";

interface DisclaimerStatusProps {
  found: boolean;
  disclaimers: string[];
}

const DisclaimerStatus = ({ found, disclaimers }: DisclaimerStatusProps) => {
  return (
    <motion.div
      className={`rounded-lg border p-4 ${
        found
          ? "border-success/30 bg-success/5"
          : "border-destructive/30 bg-destructive/5"
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center gap-2 mb-2">
        {found ? (
          <ShieldCheck className="w-5 h-5 text-success" />
        ) : (
          <ShieldX className="w-5 h-5 text-destructive" />
        )}
        <h3 className="text-sm font-semibold text-foreground">
          {found ? "Disclaimers Found" : "No Disclaimers Detected"}
        </h3>
      </div>
      {found && disclaimers.length > 0 ? (
        <ul className="space-y-1 mt-2">
          {disclaimers.map((d, i) => (
            <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success flex-shrink-0" />
              {d}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-muted-foreground mt-1">
          This content does not include standard financial disclaimers, which increases risk.
        </p>
      )}
    </motion.div>
  );
};

export default DisclaimerStatus;
