import { AnimatePresence, motion } from "framer-motion";
import { checklistItems, seniorInsightCards, seniorSummaryItems } from "../data/uiData";
import { cn } from "../utils/cn";

type InsightPanelsProps = {
  showSummary: boolean;
  showChecklist: boolean;
  checkedItems: Record<number, boolean>;
  onToggleCheck: (index: number) => void;
};

export function InsightPanels({ showSummary, showChecklist, checkedItems, onToggleCheck }: InsightPanelsProps) {
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  return (
    <AnimatePresence mode="wait">
      {showSummary && (
        <motion.section
          key="summary"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden border-b border-white/10 bg-slate-950/70 backdrop-blur-xl"
        >
          <div className="mx-auto grid max-w-7xl gap-4 p-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-200">Learning mental model</p>
              <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
                {seniorSummaryItems.map(([icon, title, description]) => (
                  <div key={title} className="rounded-2xl border border-white/5 bg-slate-900/70 p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{icon}</span>
                      <p className="text-xs font-black text-white">{title}</p>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-slate-400">{description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {seniorInsightCards.map((card) => (
                <article key={card.title} className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4">
                  <h3 className="text-sm font-black text-cyan-100">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{card.description}</p>
                </article>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {showChecklist && (
        <motion.section
          key="checklist"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden border-b border-white/10 bg-slate-950/70 backdrop-blur-xl"
        >
          <div className="mx-auto max-w-7xl p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-200">Production readiness</p>
                <h2 className="mt-1 text-lg font-black text-white">Pre-production checklist</h2>
              </div>
              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm font-black text-emerald-100">
                {checkedCount} / {checklistItems.length}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
              {checklistItems.map((item, index) => {
                const checked = Boolean(checkedItems[index]);
                return (
                  <button
                    key={item}
                    onClick={() => onToggleCheck(index)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border p-3 text-left text-sm transition",
                      checked
                        ? "border-emerald-300/40 bg-emerald-400/10 text-emerald-100"
                        : "border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-6 w-6 shrink-0 place-items-center rounded-lg border text-xs font-black",
                        checked ? "border-emerald-300 bg-emerald-400 text-slate-950" : "border-slate-600",
                      )}
                    >
                      {checked && "✓"}
                    </span>
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
