import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Shield, Zap } from "lucide-react";

interface HeroSectionProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

const HeroSection = ({ onAnalyze, isLoading }: HeroSectionProps) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) onAnalyze(url.trim());
  };

  return (
    <section className="relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto text-center pt-20 pb-12 px-4">
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-primary">AI-Powered Financial Content Shield</span>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-6xl font-black tracking-tight mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="text-foreground">Detect </span>
          <span className="text-gradient-primary">Misleading</span>
          <br />
          <span className="text-foreground">Financial Content</span>
        </motion.h1>

        <motion.p
          className="text-muted-foreground text-lg max-w-xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Paste a YouTube or Instagram video URL to instantly analyze financial claims,
          detect hype, and get an explainable risk score.
        </motion.p>

        <motion.form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste video URL here (YouTube, Instagram...)"
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
              disabled={isLoading}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="px-8 py-4 rounded-xl gradient-primary font-bold text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all glow-primary flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            {isLoading ? "Analyzing..." : "Analyze"}
          </button>
        </motion.form>

        <motion.div
          className="flex items-center justify-center gap-6 mt-8 text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success" />
            NLP Analysis
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Hype Detection
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-warning" />
            Disclaimer Check
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
