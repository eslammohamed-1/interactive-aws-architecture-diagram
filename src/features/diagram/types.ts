import type { Edge, Node } from "@xyflow/react";
import type { CategoryKey } from "../../data/uiData";
import type { ViewType } from "../../data/architectureData";

export type ArchitectureNodeData = {
  componentId?: string;
  title: string;
  subtitle: string;
  icon: string;
  category: CategoryKey;
  serviceCode?: string;
  selected?: boolean;
  connected?: boolean;
  dimmed?: boolean;
  matched?: boolean;
};

export type ArchitectureNode = Node<ArchitectureNodeData, "architecture">;

export type ArchitectureEdgeData = {
  label?: string;
  title?: string;
  explanation?: string;
  beginnerExplanation?: string;
  seniorExplanation?: string;
};

export type ArchitectureEdge = Edge<ArchitectureEdgeData>;

export type DiagramView = {
  id: ViewType;
  eyebrow: string;
  title: string;
  description: string;
  metrics: { label: string; value: string }[];
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
};
