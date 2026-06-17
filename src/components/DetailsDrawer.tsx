import { AnimatePresence, motion } from "framer-motion";
import type { ComponentInfo } from "../data/architectureData";
import { beginnerNotesByCategory, categoryConfig, learningNotesByCategory, seniorInsightCards } from "../data/uiData";
import { cn } from "../utils/cn";
import type { LearningMode } from "./Toolbar";
import type { ArchitectureEdge, ArchitectureNodeData } from "../features/diagram/types";

type DetailsDrawerProps = {
  node: ArchitectureNodeData | null;
  edge?: ArchitectureEdge;
  info?: ComponentInfo;
  learningMode: LearningMode;
  onClose: () => void;
};

export function DetailsDrawer({ node, edge, info, learningMode, onClose }: DetailsDrawerProps) {
  const category = node ? categoryConfig[node.category] : edge ? categoryConfig.network : null;
  const isEdge = Boolean(edge && !node);

  return (
    <AnimatePresence>
      {(node || edge) && category && (
        <motion.aside
          key={node?.title ?? edge?.id}
          initial={{ opacity: 0, x: 48 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 48 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="fixed bottom-3 left-3 right-3 top-3 z-50 flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/60 backdrop-blur-2xl sm:bottom-4 sm:left-auto sm:right-4 sm:top-4 sm:w-[min(92vw,420px)]"
          dir="ltr"
        >
          <div className={cn("relative border-b p-5", category.border)}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wide text-white", category.badge)}>
                  {category.label}
                </span>
                <h2 className="mt-3 text-2xl font-black leading-tight text-white">{isEdge ? edge?.data?.title ?? "Relationship" : info?.title ?? node?.title}</h2>
                <p className="mt-1 text-sm text-slate-400">{isEdge ? edge?.label : info?.titleAr ?? node?.subtitle}</p>
              </div>
              <div className={cn("grid h-16 w-16 shrink-0 place-items-center rounded-2xl border text-4xl", category.bg, category.border)}>
                {isEdge ? "→" : node?.icon}
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto p-5">
            <section>
              <h3 className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">What it does</h3>
              <p className="mt-2 text-sm leading-7 text-slate-200">{isEdge ? edge?.data?.explanation : info?.description ?? node?.subtitle}</p>
            </section>

            {!isEdge && (
              <section>
                <h3 className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">Key details</h3>
                <ul className="mt-3 space-y-2">
                  {(info?.details ?? ["This node explains a relationship in the architecture graph.", "Drag nodes in the canvas or use Fit view to return to the full picture."]).map((detail) => (
                    <li key={detail} className="flex gap-2 rounded-2xl border border-white/5 bg-white/[0.03] p-3 text-sm leading-6 text-slate-300">
                      <span className={cn("mt-2 h-2 w-2 shrink-0 rounded-full", category.badge)} />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className={cn("rounded-2xl border p-4", category.bg, category.border)}>
              <h3 className="text-xs font-black uppercase tracking-[0.25em] text-slate-300">Learning note</h3>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                {isEdge
                  ? learningMode === "beginner"
                    ? edge?.data?.beginnerExplanation
                    : edge?.data?.seniorExplanation
                  : learningMode === "beginner"
                    ? beginnerNotesByCategory[node!.category]
                    : learningNotesByCategory[node!.category]}
              </p>
            </section>

            {learningMode === "senior" && !isEdge && (
              <section className="rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] p-4">
                <h3 className="text-xs font-black uppercase tracking-[0.25em] text-cyan-100">Senior perspective</h3>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  {seniorInsightCards.find((card) => card.title.toLowerCase().includes(node!.category))?.description ??
                    "When reviewing this component, think about availability, security, cost, and observability before production."}
                </p>
              </section>
            )}

            <section className="grid grid-cols-2 gap-2 text-left" dir="ltr">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{isEdge ? "Edge ID" : "Node ID"}</p>
                <p className="mt-1 truncate font-mono text-xs text-slate-300">{isEdge ? edge?.id : info?.id ?? node?.title}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{isEdge ? "Label" : "Category"}</p>
                <p className="mt-1 font-mono text-xs text-slate-300">{isEdge ? edge?.label : node?.category}</p>
              </div>
            </section>
          </div>

          <button
            onClick={onClose}
            className="m-5 mt-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-slate-200 transition hover:bg-white/10"
          >
            Close details
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
