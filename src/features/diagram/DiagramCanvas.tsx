import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type Edge,
  type EdgeMouseHandler,
  type Node,
  type NodeDragHandler,
  type NodeMouseHandler,
} from "@xyflow/react";
import { useEffect, useMemo, useState } from "react";
import { componentData } from "../../data/architectureData";
import { categoryConfig } from "../../data/uiData";
import { ArchitectureNode } from "./ArchitectureNode";
import type { ArchitectureEdge, ArchitectureNode as ArchitectureNodeType, DiagramView } from "./types";

const nodeTypes = {
  architecture: ArchitectureNode,
};

type DiagramCanvasProps = {
  view: DiagramView;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  searchTerm: string;
  fitRequest: number;
  resetRequest: number;
  onSelectNode: (nodeId: string, componentId?: string) => void;
  onSelectEdge: (edgeId: string) => void;
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function matchesSearch(node: ArchitectureNodeType, searchTerm: string) {
  const query = normalize(searchTerm);
  if (!query) return false;

  const component = node.data.componentId ? componentData[node.data.componentId] : undefined;
  const haystack = [
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
    .toLowerCase();

  return haystack.includes(query);
}

function getConnectedNodeIds(edges: ArchitectureEdge[], selectedNodeId: string | null) {
  const connected = new Set<string>();
  if (!selectedNodeId) return connected;

  connected.add(selectedNodeId);
  edges.forEach((edgeItem) => {
    if (edgeItem.source === selectedNodeId) connected.add(edgeItem.target);
    if (edgeItem.target === selectedNodeId) connected.add(edgeItem.source);
  });

  return connected;
}

function DiagramCanvasInner({
  view,
  selectedNodeId,
  selectedEdgeId,
  searchTerm,
  fitRequest,
  resetRequest,
  onSelectNode,
  onSelectEdge,
}: DiagramCanvasProps) {
  const { fitView, getNodes } = useReactFlow();
  const layoutStorageKey = `architecture-layout:${view.id}`;
  const [savedPositions, setSavedPositions] = useState<Record<string, { x: number; y: number }>>(() => {
    try {
      return JSON.parse(window.localStorage.getItem(layoutStorageKey) ?? "{}") as Record<string, { x: number; y: number }>;
    } catch {
      return {};
    }
  });
  const connectedNodeIds = useMemo(() => getConnectedNodeIds(view.edges, selectedNodeId), [view.edges, selectedNodeId]);
  const hasSearch = normalize(searchTerm).length > 0;

  const hydratedNodes = useMemo(
    () =>
      view.nodes.map((item) => {
        const matched = matchesSearch(item, searchTerm);
        const savedPosition = savedPositions[item.id];
        return {
          ...item,
          position: savedPosition ?? item.position,
          data: {
            ...item.data,
            selected: selectedNodeId === item.id,
            connected: connectedNodeIds.has(item.id),
            matched,
            dimmed: (selectedNodeId ? !connectedNodeIds.has(item.id) : false) || (hasSearch ? !matched : false),
          },
        };
      }),
    [connectedNodeIds, hasSearch, savedPositions, searchTerm, selectedNodeId, view.nodes],
  );

  const hydratedEdges = useMemo(
    () =>
      view.edges.map((item) => {
        const active = selectedEdgeId === item.id || (selectedNodeId ? item.source === selectedNodeId || item.target === selectedNodeId : true);
        return {
          ...item,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 18,
            height: 18,
            color: active ? "#67e8f9" : "#64748b",
          },
          style: {
            ...item.style,
            stroke: active ? "#67e8f9" : "#64748b",
            opacity: active ? 0.95 : 0.22,
          },
          labelBgPadding: [8, 4] as [number, number],
          labelBgBorderRadius: 999,
          labelStyle: {
            fill: active ? "#e0f2fe" : "#94a3b8",
            fontSize: 11,
            fontWeight: 700,
          },
          labelBgStyle: {
            fill: active ? "rgba(8, 47, 73, 0.92)" : "rgba(15, 23, 42, 0.85)",
          },
          animated: active,
        };
      }),
    [selectedEdgeId, selectedNodeId, view.edges],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(hydratedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(hydratedEdges);
  const matchedCount = hydratedNodes.filter((nodeItem) => nodeItem.data.matched).length;

  useEffect(() => {
    setNodes(hydratedNodes);
  }, [hydratedNodes, setNodes]);

  useEffect(() => {
    setEdges(hydratedEdges);
  }, [hydratedEdges, setEdges]);

  useEffect(() => {
    window.setTimeout(() => fitView({ padding: 0.18, duration: 550 }), 40);
  }, [fitRequest, fitView, view.id]);

  useEffect(() => {
    window.localStorage.removeItem(layoutStorageKey);
    setSavedPositions({});
    setNodes(view.nodes);
    window.setTimeout(() => fitView({ padding: 0.18, duration: 550 }), 40);
  }, [fitView, layoutStorageKey, resetRequest, setNodes, view.nodes]);

  const handleNodeClick: NodeMouseHandler = (_event, nodeItem) => {
    const data = nodeItem.data as ArchitectureNodeType["data"];
    onSelectNode(nodeItem.id, data.componentId);
  };

  const handleEdgeClick: EdgeMouseHandler = (_event, edgeItem) => {
    onSelectEdge(edgeItem.id);
  };

  const handleNodeDragStop: NodeDragHandler = () => {
    const nextPositions = Object.fromEntries(getNodes().map((nodeItem) => [nodeItem.id, nodeItem.position]));
    setSavedPositions(nextPositions);
    window.localStorage.setItem(layoutStorageKey, JSON.stringify(nextPositions));
  };

  return (
    <div
      className="relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/60 shadow-2xl shadow-black/40"
      data-export-target="diagram-canvas"
      data-tour="canvas"
    >
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.14),transparent_30%)]" />
      <div className="pointer-events-none absolute left-4 top-4 z-20 rounded-2xl border border-white/10 bg-slate-950/75 px-3 py-2 text-xs font-semibold text-slate-300 shadow-xl backdrop-blur-xl">
        Drag nodes • Scroll to zoom • Click edges for relationship details
      </div>
      {hasSearch && matchedCount === 0 && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 w-[min(90%,360px)] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-amber-300/20 bg-amber-300/[0.08] p-5 text-center shadow-2xl backdrop-blur-xl">
          <p className="text-sm font-black text-amber-100">No nodes match this search in the current view.</p>
          <p className="mt-2 text-xs leading-5 text-amber-100/70">Try a service name like RDS, IAM, Pod, ALB, ECR, or switch to another view.</p>
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onNodeDragStop={handleNodeDragStop}
        onPaneClick={() => onSelectNode("", undefined)}
        fitView
        minZoom={0.25}
        maxZoom={1.8}
        nodesDraggable
        proOptions={{ hideAttribution: true }}
        className="professional-flow"
      >
        <Background color="#334155" gap={24} size={1.2} variant={BackgroundVariant.Dots} />
        <Controls
          position="bottom-left"
          showInteractive={false}
          className="!rounded-2xl !border !border-white/10 !bg-slate-900/90 !p-1 !shadow-2xl"
        />
        <MiniMap
          position="bottom-right"
          pannable
          zoomable
          nodeColor={(nodeItem) => {
            const data = nodeItem.data as ArchitectureNodeType["data"];
            return categoryConfig[data.category]?.minimap ?? "#38bdf8";
          }}
          maskColor="rgba(2, 6, 23, 0.72)"
          className="!rounded-2xl !border !border-white/10 !bg-slate-900/90 !shadow-2xl"
        />
      </ReactFlow>
    </div>
  );
}

export function DiagramCanvas(props: DiagramCanvasProps) {
  return (
    <ReactFlowProvider>
      <DiagramCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
