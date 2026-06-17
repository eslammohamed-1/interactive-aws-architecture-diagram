import { categoryConfig } from "../data/uiData";
import { views, type ViewType } from "../data/architectureData";
import { cn } from "../utils/cn";

export type LearningMode = "beginner" | "senior";

type ToolbarProps = {
  activeView: ViewType;
  searchTerm: string;
  checklistProgress: string;
  showSummary: boolean;
  showChecklist: boolean;
  learningMode: LearningMode;
  searchResultText: string;
  onViewChange: (view: ViewType) => void;
  onSearchChange: (value: string) => void;
  onFitView: () => void;
  onResetLayout: () => void;
  onExportPng: () => void;
  onExportSvg: () => void;
  onStartTour: () => void;
  onLearningModeChange: (mode: LearningMode) => void;
  onToggleSummary: () => void;
  onToggleChecklist: () => void;
};

export function Toolbar({
  activeView,
  searchTerm,
  checklistProgress,
  showSummary,
  showChecklist,
  learningMode,
  searchResultText,
  onViewChange,
  onSearchChange,
  onFitView,
  onResetLayout,
  onExportPng,
  onExportSvg,
  onStartTour,
  onLearningModeChange,
  onToggleSummary,
  onToggleChecklist,
}: ToolbarProps) {
  return (
    <section
      className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-2xl"
      data-tour="toolbar"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-cyan-300/30 bg-cyan-400/10 text-2xl shadow-lg shadow-cyan-500/20">
              ☸️
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-200">Interactive Architecture Map</p>
              <h1 className="text-xl font-black tracking-tight text-white">AWS & Kubernetes Production Blueprint</h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onToggleSummary}
              className={cn(
                "rounded-xl border px-3 py-2 text-xs font-bold transition",
                showSummary ? "border-cyan-300 bg-cyan-400/20 text-cyan-50" : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10",
              )}
            >
              Summary
            </button>
            <button
              onClick={onToggleChecklist}
              className={cn(
                "rounded-xl border px-3 py-2 text-xs font-bold transition",
                showChecklist ? "border-emerald-300 bg-emerald-400/20 text-emerald-50" : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10",
              )}
            >
              Checklist {checklistProgress}
            </button>
            <button onClick={onFitView} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10">
              Fit view
            </button>
            <button onClick={onResetLayout} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10">
              Restore layout
            </button>
            <button onClick={onStartTour} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10">
              Start tour
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1" data-tour="view-tabs">
            {views.map((view) => (
              <button
                key={view.id}
                onClick={() => onViewChange(view.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-black transition",
                  activeView === view.id
                    ? "border-cyan-300/80 bg-cyan-400/15 text-white shadow-lg shadow-cyan-500/20"
                    : "border-white/10 bg-slate-900/70 text-slate-400 hover:border-white/20 hover:text-white",
                )}
              >
                <span>{view.icon}</span>
                <span>{view.label}</span>
              </button>
            ))}
          </div>

          <label className="relative min-w-0 flex-1 xl:max-w-sm" data-tour="search">
            <span className="sr-only">Search components</span>
            <input
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search: RDS, IAM, Pod..."
              className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-2.5 text-left text-sm text-white outline-none ring-cyan-300/0 transition placeholder:text-slate-500 focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/10"
              dir="ltr"
            />
            {searchResultText && <span className="mt-1 block text-xs font-semibold text-cyan-100/75">{searchResultText}</span>}
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-2xl border border-white/10 bg-white/[0.03] p-1" data-tour="learning-mode">
            {(["beginner", "senior"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => onLearningModeChange(mode)}
                className={cn(
                  "rounded-xl px-3 py-1.5 text-xs font-black capitalize transition",
                  learningMode === mode ? "bg-cyan-400/20 text-cyan-50" : "text-slate-400 hover:text-white",
                )}
              >
                {mode}
              </button>
            ))}
          </div>
          <div className="flex gap-2" data-tour="export">
            <button onClick={onExportPng} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10">
              Export PNG
            </button>
            <button onClick={onExportSvg} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10">
              Export SVG
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryConfig).map(([key, category]) => (
            <div key={key} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">
              <span className={cn("h-2.5 w-2.5 rounded-full", category.badge)} />
              <span className="text-[11px] font-bold text-slate-300">{category.label}</span>
              <span className="text-[11px] text-slate-500">{category.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
