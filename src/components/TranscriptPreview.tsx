import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";

interface TranscriptPreviewProps {
  transcript: string;
}

const TranscriptPreview = ({ transcript }: TranscriptPreviewProps) => {
  const [expanded, setExpanded] = useState(false);
  const preview = transcript.slice(0, 500);
  const isLong = transcript.length > 500;

  return (
    <motion.div
      className="rounded-lg border border-border bg-card p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Transcript</h3>
        <span className="text-xs text-muted-foreground font-mono">
          ({transcript.split(/\s+/).length} words)
        </span>
      </div>
      <div className="bg-muted rounded-md p-3">
        <p className="text-sm text-secondary-foreground leading-relaxed font-mono whitespace-pre-wrap">
          {expanded ? transcript : preview}
          {isLong && !expanded && "..."}
        </p>
      </div>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 mt-2 text-xs text-primary hover:text-primary/80 transition-colors"
        >
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? "Show less" : "Show full transcript"}
        </button>
      )}
    </motion.div>
  );
};

export default TranscriptPreview;
