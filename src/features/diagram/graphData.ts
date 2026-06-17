import { componentData, type ComponentInfo, type ViewType } from "../../data/architectureData";
import { serviceCodeOverrides } from "../../data/uiData";
import type { ArchitectureEdge, ArchitectureNode, DiagramView } from "./types";

type VirtualNode = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  category: ComponentInfo["category"];
};

const virtualNodes: Record<string, VirtualNode> = {
  account: { id: "account", title: "AWS Account", subtitle: "Owns resources, IAM, and billing", icon: "🏢", category: "aws" },
  region: { id: "region", title: "Region", subtitle: "eu-central-1 / me-south-1", icon: "🌍", category: "aws" },
  az1: { id: "az1", title: "Availability Zone 1", subtitle: "High availability", icon: "🏙️", category: "network" },
  az2: { id: "az2", title: "Availability Zone 2", subtitle: "Failover capacity", icon: "🏙️", category: "network" },
  vpc: { id: "vpc", title: "VPC", subtitle: "Private network boundary", icon: "🛡️", category: "network" },
  publicSubnets: { id: "publicSubnets", title: "Public Subnets", subtitle: "ALB + NAT", icon: "🌐", category: "network" },
  privateSubnets: { id: "privateSubnets", title: "Private Subnets", subtitle: "Nodes + data layer", icon: "🔒", category: "network" },
  internet: { id: "internet", title: "Internet Gateway", subtitle: "Public egress/ingress", icon: "🛰️", category: "network" },
  developer: { id: "developer", title: "Developer", subtitle: "Git push", icon: "👨‍💻", category: "cicd" },
  repo: { id: "repo", title: "Git Repository", subtitle: "Source control", icon: "📘", category: "cicd" },
  build: { id: "build", title: "Build Docker Image", subtitle: "docker build", icon: "🐳", category: "cicd" },
  imageTag: { id: "imageTag", title: "Update Image Tag", subtitle: "values.yaml / kustomize", icon: "✏️", category: "cicd" },
  gitops: { id: "gitops", title: "ArgoCD / Helm", subtitle: "GitOps sync", icon: "🚀", category: "cicd" },
  securityGroup: { id: "securityGroup", title: "Security Groups", subtitle: "AWS firewall", icon: "🧱", category: "security" },
  waf: { id: "waf", title: "AWS WAF", subtitle: "SQLi, XSS, rate limit", icon: "🛡️", category: "security" },
  networkPolicy: { id: "networkPolicy", title: "Network Policy", subtitle: "Pod-to-Pod controls", icon: "🚦", category: "security" },
  tls: { id: "tls", title: "TLS / ACM", subtitle: "HTTPS termination", icon: "🔏", category: "security" },
  secretsManager: { id: "secretsManager", title: "Secrets Manager", subtitle: "External secrets", icon: "🗝️", category: "security" },
  prometheus: { id: "prometheus", title: "Prometheus / Grafana", subtitle: "Metrics dashboards", icon: "📈", category: "observability" },
};

function node(
  id: string,
  position: { x: number; y: number },
  options: Partial<ArchitectureNode["data"]> = {},
): ArchitectureNode {
  const component = componentData[options.componentId ?? id];
  const fallback = virtualNodes[id];
  const source = component ?? fallback;

  if (!source && (!options.title || !options.subtitle || !options.icon || !options.category)) {
    throw new Error(`Unknown architecture node: ${id}`);
  }

  return {
    id,
    type: "architecture",
    position,
    data: {
      componentId: component?.id,
      title: source?.title ?? options.title ?? id,
      subtitle: component?.titleAr ?? fallback?.subtitle ?? options.subtitle ?? "",
      icon: source?.icon ?? options.icon ?? "•",
      category: source?.category ?? options.category ?? "kubernetes",
      serviceCode: serviceCodeOverrides[source?.title ?? options.title ?? id],
      ...options,
    },
  };
}

function edge(
  source: string,
  target: string,
  label: string,
  options: Partial<ArchitectureEdge> = {},
): ArchitectureEdge {
  const title = `${label}: ${source} to ${target}`;
  const explanation = `This relationship shows how ${source} depends on or sends traffic to ${target}. The label "${label}" describes the kind of communication or control happening between them.`;

  return {
    id: `${source}-${target}`,
    source,
    target,
    label,
    animated: true,
    type: "smoothstep",
    style: { strokeWidth: 2 },
    data: {
      label,
      title,
      explanation,
      beginnerExplanation: `Read this edge as: ${source} connects to ${target} for "${label}".`,
      seniorExplanation: `Review this path for security boundaries, failure impact, latency, and whether retries or health checks are required.`,
      ...options.data,
    },
    ...options,
  };
}

const trafficNodes = [
  node("user", { x: 80, y: 220 }),
  node("route53", { x: 330, y: 220 }),
  node("alb", { x: 590, y: 220 }),
  node("ingress", { x: 850, y: 220 }),
  node("service", { x: 1110, y: 220 }),
  node("pod1", { x: 1370, y: 80 }),
  node("pod2", { x: 1370, y: 220 }),
  node("pod3", { x: 1370, y: 360 }),
  node("container-a", { x: 1600, y: 80 }, { componentId: "container", title: "Container A", subtitle: "backend-api" }),
  node("container-b", { x: 1600, y: 220 }, { componentId: "container", title: "Container B", subtitle: "backend-api" }),
  node("container-c", { x: 1600, y: 360 }, { componentId: "container", title: "Container C", subtitle: "backend-api" }),
  node("rds", { x: 1880, y: 80 }),
  node("redis", { x: 1880, y: 220 }),
  node("s3", { x: 1880, y: 360 }),
];

const trafficEdges = [
  edge("user", "route53", "DNS lookup"),
  edge("route53", "alb", "Resolved endpoint"),
  edge("alb", "ingress", "HTTPS / TLS"),
  edge("ingress", "service", "Host + path rule"),
  edge("service", "pod1", "Load balance"),
  edge("service", "pod2", "Load balance"),
  edge("service", "pod3", "Load balance"),
  edge("pod1", "container-a", "Runs"),
  edge("pod2", "container-b", "Runs"),
  edge("pod3", "container-c", "Runs"),
  edge("container-a", "rds", "SQL query"),
  edge("container-b", "redis", "Cache read/write"),
  edge("container-c", "s3", "Object storage"),
];

const infraNodes = [
  node("account", { x: 80, y: 240 }),
  node("region", { x: 310, y: 240 }),
  node("vpc", { x: 540, y: 240 }),
  node("publicSubnets", { x: 790, y: 90 }),
  node("privateSubnets", { x: 790, y: 390 }),
  node("internet", { x: 1040, y: -50 }),
  node("alb", { x: 1040, y: 90 }),
  node("nat", { x: 1040, y: 230 }),
  node("az1", { x: 1040, y: 390 }),
  node("az2", { x: 1040, y: 570 }),
  node("node1", { x: 1290, y: 330 }),
  node("node2", { x: 1290, y: 510 }),
  node("pod1", { x: 1530, y: 260 }),
  node("pod2", { x: 1530, y: 400 }),
  node("pod3", { x: 1530, y: 540 }),
  node("eks", { x: 1290, y: 90 }),
  node("ecr", { x: 1530, y: 90 }),
  node("rds", { x: 1780, y: 330 }),
  node("redis", { x: 1780, y: 470 }),
  node("hpa", { x: 1780, y: 610 }),
  node("karpenter", { x: 2020, y: 430 }),
  node("configmap", { x: 1780, y: 750 }),
];

const infraEdges = [
  edge("account", "region", "Contains"),
  edge("region", "vpc", "Hosts"),
  edge("vpc", "publicSubnets", "Public tier"),
  edge("vpc", "privateSubnets", "Private tier"),
  edge("publicSubnets", "internet", "0.0.0.0/0"),
  edge("publicSubnets", "alb", "Ingress point"),
  edge("publicSubnets", "nat", "Private egress"),
  edge("privateSubnets", "az1", "AZ spread"),
  edge("privateSubnets", "az2", "AZ spread"),
  edge("az1", "node1", "EC2 = K8s Node"),
  edge("az2", "node2", "EC2 = K8s Node"),
  edge("node1", "pod1", "Schedules"),
  edge("node1", "pod2", "Schedules"),
  edge("node2", "pod3", "Schedules"),
  edge("eks", "node1", "Controls"),
  edge("eks", "node2", "Controls"),
  edge("ecr", "pod1", "Image pull"),
  edge("ecr", "pod3", "Image pull"),
  edge("pod1", "rds", "Private DB"),
  edge("pod2", "redis", "Private cache"),
  edge("hpa", "pod1", "Scale pods"),
  edge("hpa", "pod3", "Scale pods"),
  edge("karpenter", "node2", "Scale nodes"),
  edge("configmap", "pod2", "Env + secrets"),
];

const cicdNodes = [
  node("developer", { x: 80, y: 250 }),
  node("repo", { x: 310, y: 250 }),
  node("cicd", { x: 560, y: 250 }),
  node("build", { x: 810, y: 250 }),
  node("ecr", { x: 1060, y: 250 }),
  node("imageTag", { x: 1310, y: 250 }),
  node("gitops", { x: 1560, y: 250 }),
  node("eks", { x: 1810, y: 150 }),
  node("deployment", { x: 1810, y: 350 }),
  node("pod1", { x: 2060, y: 210 }),
  node("pod2", { x: 2060, y: 350 }),
  node("service", { x: 2310, y: 280 }),
];

const cicdEdges = [
  edge("developer", "repo", "Git push"),
  edge("repo", "cicd", "Trigger pipeline"),
  edge("cicd", "build", "Run CI"),
  edge("build", "ecr", "Push image"),
  edge("ecr", "imageTag", "New tag"),
  edge("imageTag", "gitops", "Manifest change"),
  edge("gitops", "eks", "Sync cluster"),
  edge("gitops", "deployment", "helm upgrade"),
  edge("deployment", "pod1", "Rolling update"),
  edge("deployment", "pod2", "Rolling update"),
  edge("pod1", "service", "Healthy endpoint"),
  edge("pod2", "service", "Healthy endpoint"),
];

const securityNodes = [
  node("waf", { x: 80, y: 140 }),
  node("alb", { x: 340, y: 140 }),
  node("securityGroup", { x: 600, y: 140 }),
  node("node1", { x: 860, y: 140 }),
  node("networkPolicy", { x: 1120, y: 140 }),
  node("pod1", { x: 1380, y: 60 }),
  node("pod2", { x: 1380, y: 220 }),
  node("iam", { x: 1120, y: 420 }),
  node("secretsManager", { x: 1380, y: 420 }),
  node("configmap", { x: 1640, y: 420 }),
  node("tls", { x: 340, y: 360 }),
  node("rds", { x: 1640, y: 120 }),
  node("ecr", { x: 1640, y: 260 }),
  node("cloudwatch", { x: 1900, y: 200 }),
  node("prometheus", { x: 1900, y: 380 }),
];

const securityEdges = [
  edge("waf", "alb", "Filter attacks"),
  edge("alb", "securityGroup", "443 only"),
  edge("securityGroup", "node1", "Allow ALB traffic"),
  edge("node1", "networkPolicy", "Pod firewall"),
  edge("networkPolicy", "pod1", "Allow service path"),
  edge("networkPolicy", "pod2", "Deny direct DB"),
  edge("pod1", "rds", "5432 scoped"),
  edge("iam", "pod1", "IRSA role"),
  edge("secretsManager", "configmap", "External secret"),
  edge("configmap", "pod2", "Env injection"),
  edge("tls", "alb", "ACM certificate"),
  edge("ecr", "pod2", "Scanned image"),
  edge("pod1", "cloudwatch", "Logs"),
  edge("pod2", "prometheus", "Metrics"),
];

export const diagramViews: Record<ViewType, DiagramView> = {
  traffic: {
    id: "traffic",
    eyebrow: "External Traffic Flow",
    title: "How user traffic reaches the application",
    description: "Follow the request from DNS to ALB, then through Ingress and Service into Pods and the data layer.",
    metrics: [
      { label: "Entry", value: "Route 53 + ALB" },
      { label: "Runtime", value: "3 Pods" },
      { label: "Data", value: "RDS / Redis / S3" },
    ],
    nodes: trafficNodes,
    edges: trafficEdges,
  },
  infra: {
    id: "infra",
    eyebrow: "AWS Infrastructure",
    title: "AWS infrastructure map",
    description: "See how Account, Region, VPC, subnets, EKS nodes, and data services fit across multiple Availability Zones.",
    metrics: [
      { label: "Availability", value: "Multi-AZ" },
      { label: "Network", value: "Public + Private" },
      { label: "Scaling", value: "HPA + Karpenter" },
    ],
    nodes: infraNodes,
    edges: infraEdges,
  },
  cicd: {
    id: "cicd",
    eyebrow: "CI/CD Deployment Flow",
    title: "From source code to the cluster",
    description: "A Git push triggers the pipeline, builds an image, pushes it to ECR, and lets GitOps update EKS.",
    metrics: [
      { label: "Pattern", value: "GitOps" },
      { label: "Registry", value: "ECR" },
      { label: "Deploy", value: "Rolling update" },
    ],
    nodes: cicdNodes,
    edges: cicdEdges,
  },
  security: {
    id: "security",
    eyebrow: "Security & Observability",
    title: "Security and observability layers",
    description: "Connect WAF, Security Groups, Network Policies, IAM/IRSA, logs, and metrics into one defense-in-depth view.",
    metrics: [
      { label: "Identity", value: "IRSA" },
      { label: "Network", value: "SG + Policy" },
      { label: "Signals", value: "Logs + Metrics" },
    ],
    nodes: securityNodes,
    edges: securityEdges,
  },
};
