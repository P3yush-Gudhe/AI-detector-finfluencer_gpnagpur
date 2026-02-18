import { useState } from "react";
import { toast } from "sonner";
import HeroSection from "@/components/HeroSection";
import AnalysisSteps, { Step } from "@/components/AnalysisSteps";
import ResultsDashboard, { AnalysisResult } from "@/components/ResultsDashboard";
import { Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const initialSteps: Step[] = [
  { id: "extract", label: "Extracting audio from video...", status: "pending" },
  { id: "transcript", label: "Generating transcript (Whisper AI)...", status: "pending" },
  { id: "analyze", label: "Running NLP & risk analysis...", status: "pending" },
  { id: "score", label: "Computing risk score...", status: "pending" },
];

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showSteps, setShowSteps] = useState(false);

  const updateStep = (id: string, status: Step["status"]) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const simulateProgress = async () => {
    const delays = [
      { id: "extract", delay: 800 },
      { id: "transcript", delay: 1500 },
      { id: "analyze", delay: 1200 },
      { id: "score", delay: 500 },
    ];

    for (const { id, delay } of delays) {
      updateStep(id, "active");
      await new Promise((r) => setTimeout(r, delay));
      updateStep(id, "complete");
    }
  };

  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setResult(null);
    setShowSteps(true);
    setSteps(initialSteps.map((s) => ({ ...s, status: "pending" as const })));

    const progressPromise = simulateProgress();

    try {
      const { data, error } = await supabase.functions.invoke("analyze-video", {
        body: { videoUrl: url },
      });

      await progressPromise;

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult(data as AnalysisResult);
      toast.success("Analysis complete!");
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Analysis failed. Please try again.");
      setSteps((prev) =>
        prev.map((s) => (s.status === "active" || s.status === "pending" ? { ...s, status: "error" as const } : s))
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Scan line effect */}
      <div className="fixed inset-0 scan-line pointer-events-none z-50 opacity-30" />

      {/* Nav */}
      <nav className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg text-foreground tracking-tight">
              Fin<span className="text-primary">Shield</span> AI
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="hidden sm:inline">Powered by AI</span>
            <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
            <span className="text-success text-xs font-medium">Online</span>
          </div>
        </div>
      </nav>

      <HeroSection onAnalyze={handleAnalyze} isLoading={isLoading} />

      <AnimatePresence>
        {showSteps && (
          <motion.div
            className="max-w-md mx-auto px-4 pb-10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <AnalysisSteps steps={steps} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ResultsDashboard result={result} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-10">
        <div className="max-w-6xl mx-auto px-4 text-center text-xs text-muted-foreground">
          FinShield AI — Protecting retail investors from misleading financial content
        </div>
      </footer>
    </div>
  );
};

export default Index;
