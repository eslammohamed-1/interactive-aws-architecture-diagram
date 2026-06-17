import { useMemo, useState } from "react";
import { toPng, toSvg } from "html-to-image";
import { DetailsDrawer } from "./components/DetailsDrawer";
import { GuidedTour } from "./components/GuidedTour";
import { InsightPanels } from "./components/InsightPanels";
import { Toolbar, type LearningMode } from "./components/Toolbar";
import { componentData, type ViewType } from "./data/architectureData";
import { checklistItems } from "./data/uiData";
import { DiagramCanvas } from "./features/diagram/DiagramCanvas";
import { diagramViews } from "./features/diagram/graphData";

type SelectedNode = {
  nodeId: string;
  componentId?: string;
} | null;

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>("traffic");
  const [selectedNode, setSelectedNode] = useState<SelectedNode>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [learningMode, setLearningMode] = useState<LearningMode>("beginner");
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [showChecklist, setShowChecklist] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [fitRequest, setFitRequest] = useState(0);
  const [resetRequest, setResetRequest] = useState(0);
  const [tourRunId, setTourRunId] = useState(0);

  const activeDiagram = diagramViews[activeView];

  const selectedNodeData = useMemo(() => {
    if (!selectedNode) return null;
    return activeDiagram.nodes.find((node) => node.id === selectedNode.nodeId)?.data ?? null;
  }, [activeDiagram.nodes, selectedNode]);

  const selectedInfo = selectedNode?.componentId ? componentData[selectedNode.componentId] : undefined;
  const selectedEdge = selectedEdgeId ? activeDiagram.edges.find((edge) => edge.id === selectedEdgeId) : undefined;

  const searchResultText = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return "";

    const matches = activeDiagram.nodes.filter((node) => {
      const component = node.data.componentId ? componentData[node.data.componentId] : undefined;
      return [
        node.data.title,
        node.data.subtitle,
        node.data.category,
        component?.title,
        component?.titleAr,
        component?.description,
        ...(component?.details ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query);
    }).length;

    return matches === 0 ? "No matching nodes in this view" : `${matches} matching node${matches === 1 ? "" : "s"}`;
  }, [activeDiagram.nodes, searchTerm]);

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const checklistProgress = `${checkedCount}/${checklistItems.length}`;

  const handleViewChange = (view: ViewType) => {
    setActiveView(view);
    setSelectedNode(null);
    setSelectedEdgeId(null);
    setFitRequest((value) => value + 1);
  };

  const handleSelectNode = (nodeId: string, componentId?: string) => {
    if (!nodeId) {
      setSelectedNode(null);
      setSelectedEdgeId(null);
      return;
    }

    setSelectedEdgeId(null);
    setSelectedNode((current) => (current?.nodeId === nodeId ? null : { nodeId, componentId }));
  };

  const handleSelectEdge = (edgeId: string) => {
    setSelectedNode(null);
    setSelectedEdgeId((current) => (current === edgeId ? null : edgeId));
  };

  const toggleCheck = (index: number) => {
    setCheckedItems((current) => ({ ...current, [index]: !current[index] }));
  };

  const exportDiagram = async (format: "png" | "svg") => {
    const target = document.querySelector<HTMLElement>("[data-export-target='diagram-canvas']");
    if (!target) return;

    const dataUrl =
      format === "png"
        ? await toPng(target, { cacheBust: true, pixelRatio: 2, backgroundColor: "#020617" })
        : await toSvg(target, { cacheBust: true, backgroundColor: "#020617" });

    const link = document.createElement("a");
    link.download = `aws-kubernetes-${activeView}.${format}`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white" dir="ltr">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.22),transparent_34%),radial-gradient(circle_at_75%_15%,rgba(168,85,247,0.16),transparent_28%),linear-gradient(135deg,#020617,#0f172a_55%,#020617)]" />
      <GuidedTour runId={tourRunId} />
      <Toolbar
        activeView={activeView}
        searchTerm={searchTerm}
        checklistProgress={checklistProgress}
        showSummary={showSummary}
        showChecklist={showChecklist}
        learningMode={learningMode}
        searchResultText={searchResultText}
        onViewChange={handleViewChange}
        onSearchChange={setSearchTerm}
        onFitView={() => setFitRequest((value) => value + 1)}
        onResetLayout={() => setResetRequest((value) => value + 1)}
        onExportPng={() => void exportDiagram("png")}
        onExportSvg={() => void exportDiagram("svg")}
        onStartTour={() => setTourRunId((value) => value + 1)}
        onLearningModeChange={setLearningMode}
        onToggleSummary={() => {
          setShowSummary((value) => !value);
          setShowChecklist(false);
        }}
        onToggleChecklist={() => {
          setShowChecklist((value) => !value);
          setShowSummary(false);
        }}
      />

      <InsightPanels
        showSummary={showSummary}
        showChecklist={showChecklist}
        checkedItems={checkedItems}
        onToggleCheck={toggleCheck}
      />

      <main className="mx-auto flex min-h-[760px] max-w-7xl flex-col gap-4 p-3 sm:p-4 lg:h-[calc(100vh-238px)] lg:min-h-[620px]">
        <section className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-200">{activeDiagram.eyebrow}</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-white md:text-3xl">{activeDiagram.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">{activeDiagram.description}</p>
            <p className="mt-3 max-w-3xl text-xs leading-6 text-cyan-100/80">
              Learning tip: click any node to open its explanation, drag nodes to explore the layout, and read edge labels to understand how components communicate.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:w-[420px]">
            {activeDiagram.metrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-center shadow-xl shadow-black/20">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{metric.label}</p>
                <p className="mt-1 text-sm font-black text-white">{metric.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="min-h-0 flex-1">
          <DiagramCanvas
            key={activeView}
            view={activeDiagram}
            selectedNodeId={selectedNode?.nodeId ?? null}
            selectedEdgeId={selectedEdgeId}
            searchTerm={searchTerm}
            fitRequest={fitRequest}
            resetRequest={resetRequest}
            onSelectNode={handleSelectNode}
            onSelectEdge={handleSelectEdge}
          />
        </section>
      </main>

      <DetailsDrawer
        node={selectedNodeData}
        edge={selectedEdge}
        info={selectedInfo}
        learningMode={learningMode}
        onClose={() => {
          setSelectedNode(null);
          setSelectedEdgeId(null);
        }}
      />
    </div>
  );
}
