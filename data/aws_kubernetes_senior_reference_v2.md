# AWS Kubernetes Deployment — Senior Reference (Version 2)

> ده المرجع المتقدم اللي ينقلك من مستوى “فاهم الأساسيات” إلى “بتفكر كـ Senior / Architect”.

---

# 1) التفكير المعماري (Architecture Thinking)

## الهدف الأساسي:
مش مجرد Deploy…
لكن:
- Scalability
- High Availability
- Fault Tolerance
- Security
- Cost Optimization

## القاعدة الذهبية:

```text
Design for Failure
```

يعني افترض إن كل حاجة هتقع:
- Node هيموت
- Pod هيكراش
- AZ هتقع
- Region ممكن يقع

---

# 2) Advanced Networking (المستوى التقيل)

## CIDR Planning
لازم تخطط VPC من الأول:

```text
VPC: 10.0.0.0/16
Public Subnet AZ1: 10.0.1.0/24
Private Subnet AZ1: 10.0.2.0/24
Public Subnet AZ2: 10.0.3.0/24
Private Subnet AZ2: 10.0.4.0/24
```

## Internal DNS
Kubernetes بيعمل DNS داخلي:

```text
service-name.namespace.svc.cluster.local
```

## VPC Peering
- ربط VPC بـ VPC
- بدون Internet

## PrivateLink
- توصل Service بشكل private
- بدون exposure

---

# 3) Kubernetes Advanced Concepts

## StatefulSet
للتطبيقات اللي محتاجة state:

```text
Database
Kafka
Redis Cluster
```

## DaemonSet
Pod على كل Node:

```text
Logging Agent
Monitoring Agent
```

## Taints & Tolerations

```text
Node: special=true:NoSchedule
Pod لازم يكون عنده toleration
```

## Affinity / Anti-Affinity

- Pod يفضل يشتغل جنب Pod تاني
- أو يبعد عنه

## Init Containers

- container بيشتغل قبل main container
- تجهيز البيئة

---

# 4) Deployment Strategies (Production)

## Rolling Update (default)

```text
v1 → تدريجي → v2
```

## Blue / Green

```text
Blue = current
Green = new
Switch traffic مرة واحدة
```

## Canary

```text
90% v1
10% v2
```

---

# 5) Security Advanced

## Layers:

### 1) Network
- Security Groups
- NACL

### 2) Kubernetes
- Network Policies

### 3) Identity
- IAM + IRSA

### 4) App
- Auth / JWT

## WAF
- يحمي من attacks

## TLS
- AWS ACM Certificates

---

# 6) Observability (مش optional)

## 3 حاجات لازم:

### Logs
- CloudWatch
- ELK

### Metrics
- Prometheus

### Tracing
- Jaeger / AWS X-Ray

---

# 7) Cost Optimization

## أهم الأخطاء:

- NAT Gateway غالي
- Instances oversized

## الحلول:

### Spot Instances
- أرخص بكتير

### Right Sizing

### Auto Scaling

---

# 8) Autoscaling Architecture

```text
HPA → Pods
Karpenter → Nodes
```

Scenario:

```text
Load زاد
→ Pods زادت
→ مفيش Nodes كفاية
→ Karpenter يضيف Nodes
```

---

# 9) Storage Deep Dive

## EBS
- مربوط بـ Node

## EFS
- Shared

## S3
- خارج الكلاستر

## Pattern:

```text
Stateless → API → S3
Stateful → StatefulSet + EBS
```

---

# 10) Real Production Architecture

```text
Multi AZ
Private Nodes
Public LoadBalancer

ALB
 → Ingress
   → Service
     → Pods
       → RDS Multi-AZ

Pods → S3
Pods → Redis (ElastiCache)
```

---

# 11) Failure Scenarios (مهم جدًا)

## Node Dies

```text
Pods rescheduled
```

## Pod Crash

```text
Deployment يعمله restart
```

## AZ Down

```text
Traffic يتحول لـ AZ تاني
```

---

# 12) CI/CD Advanced

## GitOps (أفضل Practice)

Tools:
- ArgoCD
- Flux

Flow:

```text
Git → ArgoCD → Cluster
```

---

# 13) Infrastructure as Code

## Terraform

```text
VPC
EKS
RDS
IAM
```

## AWS CDK
- Code بدل YAML

---

# 14) Debugging (سينيور level)

## لما الخدمة تقع:

### Step 1
```bash
kubectl get pods
```

### Step 2
```bash
kubectl describe pod
```

### Step 3
```bash
kubectl logs
```

### Step 4

شوف:
- CPU
- memory
- network

---

# 15) تبسيط سينيور

السيستم الحقيقي:

- AWS = البنية التحتية
- Kubernetes = مدير التشغيل
- Pods = workers
- Deployments = manager
- LoadBalancer = الباب
- CI/CD = المصنع

---

# 16) الخلاصة النهائية

```text
Instance → Node → Pod → Container
Service → ثابت
Ingress → دخول
ALB → External

HPA → scaling pods
Karpenter → scaling nodes

IAM → permissions
Security Groups → network firewall

S3/RDS → data layer
```

---

# 17) Road to Senior

لازم تبقى كويس في:

- Kubernetes internals
- Networking
- Linux
- Debugging
- Cost
- System Design


