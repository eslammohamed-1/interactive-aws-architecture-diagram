import type { ComponentInfo } from "./architectureData";

export type CategoryKey = ComponentInfo["category"];

export type CategoryStyle = {
  label: string;
  name: string;
  bg: string;
  border: string;
  text: string;
  badge: string;
  glow: string;
  minimap: string;
};

export const categoryConfig: Record<CategoryKey, CategoryStyle> = {
  aws: {
    label: "AWS",
    name: "Amazon Web Services",
    bg: "bg-orange-950/70",
    border: "border-orange-400/70",
    text: "text-orange-100",
    badge: "bg-orange-500",
    glow: "shadow-orange-500/25",
    minimap: "#f97316",
  },
  kubernetes: {
    label: "K8s",
    name: "Kubernetes",
    bg: "bg-blue-950/70",
    border: "border-blue-400/70",
    text: "text-blue-100",
    badge: "bg-blue-500",
    glow: "shadow-blue-500/25",
    minimap: "#3b82f6",
  },
  network: {
    label: "Net",
    name: "Networking",
    bg: "bg-amber-950/70",
    border: "border-amber-400/70",
    text: "text-amber-100",
    badge: "bg-amber-500",
    glow: "shadow-amber-500/25",
    minimap: "#f59e0b",
  },
  storage: {
    label: "Data",
    name: "Storage & Data",
    bg: "bg-emerald-950/70",
    border: "border-emerald-400/70",
    text: "text-emerald-100",
    badge: "bg-emerald-500",
    glow: "shadow-emerald-500/25",
    minimap: "#10b981",
  },
  security: {
    label: "Sec",
    name: "Security",
    bg: "bg-red-950/70",
    border: "border-red-400/70",
    text: "text-red-100",
    badge: "bg-red-500",
    glow: "shadow-red-500/25",
    minimap: "#ef4444",
  },
  cicd: {
    label: "CI/CD",
    name: "Delivery",
    bg: "bg-purple-950/70",
    border: "border-purple-400/70",
    text: "text-purple-100",
    badge: "bg-purple-500",
    glow: "shadow-purple-500/25",
    minimap: "#8b5cf6",
  },
  observability: {
    label: "Obs",
    name: "Observability",
    bg: "bg-pink-950/70",
    border: "border-pink-400/70",
    text: "text-pink-100",
    badge: "bg-pink-500",
    glow: "shadow-pink-500/25",
    minimap: "#ec4899",
  },
};

export const checklistItems = [
  "VPC is split into public and private subnets across multiple AZs",
  "Worker nodes run in private subnets",
  "Load balancer runs in public subnets",
  "RDS runs in private subnets",
  "Security groups follow least privilege",
  "Container images are stored in ECR",
  "Secrets are not committed to source code",
  "Readiness and liveness probes are configured",
  "CPU and memory requests/limits are defined",
  "HPA is enabled when the app needs horizontal scaling",
  "Logs and metrics are collected",
  "CI/CD builds, pushes, and deploys automatically",
  "TLS/HTTPS is enabled on the Ingress or ALB",
  "Database backups are enabled and tested",
];

export const seniorSummaryItems = [
  ["🏢", "Account", "The AWS boundary that owns resources, permissions, and billing"],
  ["🌍", "Region", "A geographic AWS location such as eu-central-1"],
  ["🏙️", "AZ", "An isolated data center zone used for high availability"],
  ["🛡️", "VPC", "Your private network boundary inside AWS"],
  ["🏘️", "Subnet", "A smaller network segment inside one Availability Zone"],
  ["🖥️", "EC2 Instance", "A virtual machine that provides compute capacity"],
  ["☸️", "K8s Node", "The Kubernetes view of a worker machine"],
  ["🚪", "Pod", "The smallest deployable runtime unit in Kubernetes"],
  ["👤", "Container", "The application process packaged from an image"],
  ["🔗", "Service", "A stable endpoint in front of changing Pods"],
  ["⚖️", "Ingress/ALB", "The external HTTP entry path into the cluster"],
  ["🌐", "Route 53", "DNS that maps a domain name to the application endpoint"],
  ["🗄️", "RDS", "Managed relational storage for durable application data"],
  ["📦", "ECR", "Private registry for container images"],
  ["🔄", "CI/CD", "Automation that moves code from repository to production"],
  ["📈", "HPA", "Autoscaler that changes the number of Pods based on load"],
] as const;

export const seniorInsightCards = [
  {
    title: "Design for Failure",
    description: "Assume a Pod, node, or Availability Zone can fail. Multi-AZ placement and Kubernetes self-healing make the system resilient.",
  },
  {
    title: "Scaling Chain",
    description: "HPA adds more Pods when load rises. If there is not enough node capacity, Karpenter provisions more worker nodes.",
  },
  {
    title: "Security Layers",
    description: "Use AWS Security Groups at the network layer, Kubernetes Network Policies inside the cluster, and IRSA for Pod-level AWS permissions.",
  },
  {
    title: "Cost Awareness",
    description: "NAT Gateways and oversized instances can become expensive. Monitor usage, right-size workloads, and use autoscaling intentionally.",
  },
];

export const learningNotesByCategory: Record<CategoryKey, string> = {
  aws: "AWS resources provide the cloud foundation: networking, compute, managed services, identity, and regional availability.",
  kubernetes: "Kubernetes manages the desired state of your workloads: it schedules Pods, replaces failures, and exposes stable service endpoints.",
  network: "Networking controls where traffic can enter, how private resources reach dependencies, and which paths remain isolated.",
  storage: "Storage services keep data outside ephemeral Pods, so application state survives restarts, rescheduling, and deployments.",
  security: "Security should be layered: public filtering, network rules, identity permissions, secrets handling, and runtime isolation.",
  cicd: "CI/CD turns source code changes into repeatable production releases by building images and syncing Kubernetes manifests.",
  observability: "Observability gives feedback from the running system through metrics, logs, traces, dashboards, and alerts.",
};

export const beginnerNotesByCategory: Record<CategoryKey, string> = {
  aws: "This is a managed cloud building block. You use it instead of running everything yourself.",
  kubernetes: "This is part of Kubernetes, the system that keeps your app running in the desired shape.",
  network: "This controls traffic paths: what can enter, what stays private, and how services connect.",
  storage: "This stores data outside the short-lived application containers.",
  security: "This limits who can access what, and reduces the blast radius if something goes wrong.",
  cicd: "This automates the path from code changes to a running application.",
  observability: "This helps you see what the system is doing after it is deployed.",
};

export const serviceCodeOverrides: Record<string, string> = {
  "User / Client": "USER",
  "Route 53": "R53",
  "Application Load Balancer": "ALB",
  "Ingress / Ingress Controller": "ING",
  "Kubernetes Service": "SVC",
  Deployment: "DEP",
  "Pod 1": "POD",
  "Pod 2": "POD",
  "Pod 3": "POD",
  Container: "APP",
  "EC2 Worker Node 1": "EC2",
  "EC2 Worker Node 2": "EC2",
  "EKS Cluster": "EKS",
  "RDS Database": "RDS",
  "ElastiCache / Redis": "REDIS",
  "Amazon S3": "S3",
  "Amazon ECR": "ECR",
  "CI/CD Pipeline": "CI",
  HPA: "HPA",
  Karpenter: "KARP",
  "IAM / IRSA": "IAM",
  CloudWatch: "CW",
  "NAT Gateway": "NAT",
  "ConfigMap / Secret": "CFG",
  "AWS Account": "ACCT",
  Region: "REG",
  VPC: "VPC",
  "Public Subnets": "PUB",
  "Private Subnets": "PRIV",
  "Internet Gateway": "IGW",
  Developer: "DEV",
  "Git Repository": "GIT",
  "Build Docker Image": "IMG",
  "Update Image Tag": "TAG",
  "ArgoCD / Helm": "ARGO",
  "Security Groups": "SG",
  "AWS WAF": "WAF",
  "Network Policy": "NP",
  "TLS / ACM": "TLS",
  "Secrets Manager": "SEC",
  "Prometheus / Grafana": "PROM",
};
