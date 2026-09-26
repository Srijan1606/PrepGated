// ==============================================================================
// CareerPath AI - 2026 Real-Time In-Demand Jobs & Skill Intelligence
// Sourced from BLS, LinkedIn Jobs on the Rise, CompTIA, Robert Half, and Industry Reports
// ==============================================================================

export interface InDemandJob {
  id: string;
  title: string;
  category: 'Tech & AI' | 'Cloud & Security' | 'Healthcare' | 'Leadership' | 'Skilled Trades';
  demandLevel: 'Very High' | 'High';
  projectedGrowth: string; // e.g. "+38% (2024-2028)"
  salaryRange: string; // e.g. "$145,000 - $210,000 / yr"
  blsCode?: string;
  summary: string;
  keySkills: string[];
  recommendedSkills: Array<{
    name: string;
    priority: 'Critical' | 'High' | 'Differentiating';
    marketDemandScore: number; // 0-100
    category: 'Core Technical' | 'Domain & Tooling' | 'Architecture' | 'Leadership & Soft Skills';
    description: string;
  }>;
  curriculumTopics: Array<{
    id: string;
    title: string;
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    summary: string;
    estimatedHours: number;
    keyLearningObjectives: string[];
    practiceCount: number;
  }>;
  mockInterviewFocus: {
    technicalDomain: string;
    scenarioType: string;
    behavioralAspects: string[];
  };
}

export const IN_DEMAND_JOBS_2026: InDemandJob[] = [
  {
    id: 'ai-ml-engineer',
    title: 'AI / Machine Learning Engineer',
    category: 'Tech & AI',
    demandLevel: 'Very High',
    projectedGrowth: '+38% projected growth through 2028',
    salaryRange: '$150,000 – $225,000 / yr',
    summary: 'Architect, fine-tune, and deploy production LLM pipelines, autonomous agents, and scalable vector retrieval architectures.',
    keySkills: ['PyTorch / TensorFlow', 'LLMs & Fine-Tuning (LoRA)', 'Vector DBs & RAG', 'Python', 'MLOps & Triton', 'CUDA / GPU Optimization'],
    recommendedSkills: [
      { name: 'Python & PyTorch', priority: 'Critical', marketDemandScore: 98, category: 'Core Technical', description: 'Fundamental tensor manipulation and deep neural network training loops.' },
      { name: 'RAG & Vector Embeddings', priority: 'Critical', marketDemandScore: 95, category: 'Architecture', description: 'Hybrid search, re-ranking, and chunking with Pinecone, Milvus, and pgvector.' },
      { name: 'LLM Fine-tuning & LoRA/QLoRA', priority: 'High', marketDemandScore: 92, category: 'Domain & Tooling', description: 'Quantized PEFT adaptation and task-specific instruction alignment.' },
      { name: 'vLLM & Inference Serving', priority: 'High', marketDemandScore: 89, category: 'Architecture', description: 'PagedAttention, continuous batching, and high-throughput low-latency model APIs.' },
      { name: 'Agentic Workflows & Tool Calling', priority: 'Differentiating', marketDemandScore: 86, category: 'Leadership & Soft Skills', description: 'Multi-agent orchestration, state machines, and real-time environment interaction.' }
    ],
    curriculumTopics: [
      { id: 'ai-t1', title: 'Foundations of Deep Learning & PyTorch Autograd', level: 'Beginner', summary: 'Backpropagation, gradient descent, tensors, and neural networks.', estimatedHours: 12, keyLearningObjectives: ['Build feedforward models', 'Inspect tensor dimensions', 'Train simple classifiers'], practiceCount: 15 },
      { id: 'ai-t2', title: 'Transformers, Attention Mechanisms & Tokenization', level: 'Intermediate', summary: 'Multi-head self-attention, rotary embeddings (RoPE), and byte-pair encoding.', estimatedHours: 18, keyLearningObjectives: ['Implement self-attention from scratch', 'Understand decoder-only models', 'Optimize context windows'], practiceCount: 20 },
      { id: 'ai-t3', title: 'Enterprise RAG & Hybrid Vector Retrieval', level: 'Advanced', summary: 'Sparse + dense hybrid search, reciprocal rank fusion, and chunking strategies.', estimatedHours: 22, keyLearningObjectives: ['Setup pgvector pipelines', 'Implement BM25 + dense search', 'Measure recall and MRR'], practiceCount: 18 },
      { id: 'ai-t4', title: 'High-Throughput Model Serving & Hardware Profiling', level: 'Expert', summary: 'TensorRT, vLLM continuous batching, GPU VRAM caching, and FP8 quantization.', estimatedHours: 25, keyLearningObjectives: ['Deploy vLLM clusters', 'Benchmark token latency', 'Handle GPU out-of-memory states'], practiceCount: 16 }
    ],
    mockInterviewFocus: {
      technicalDomain: 'Low-latency LLM serving, Transformer architecture, and RAG evaluation',
      scenarioType: 'Production hallucination mitigation and GPU cluster out-of-memory triage',
      behavioralAspects: ['Cross-functional collaboration with product teams', 'Balancing model accuracy vs compute expenditure']
    }
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst / Information Security Analyst',
    category: 'Cloud & Security',
    demandLevel: 'Very High',
    projectedGrowth: '+32% projected growth through 2028',
    salaryRange: '$115,000 – $170,000 / yr',
    summary: 'Defend enterprise infrastructure, monitor threat detection sensors (SIEM/XDR), orchestrate zero-trust posture, and lead incident response.',
    keySkills: ['SIEM (Splunk / Sentinel)', 'Zero-Trust Architecture', 'Incident Response & Forensics', 'Network Security', 'Threat Hunting', 'Cloud IAM'],
    recommendedSkills: [
      { name: 'Threat Hunting & Log Correlation', priority: 'Critical', marketDemandScore: 96, category: 'Core Technical', description: 'Investigating anomalous user behavior and parsing complex auth logs in SIEM.' },
      { name: 'Zero-Trust Network Access (ZTNA)', priority: 'Critical', marketDemandScore: 94, category: 'Architecture', description: 'Enforcing least-privilege, dynamic device posture checks, and mTLS.' },
      { name: 'Cloud Security Posture (CSPM/CIEM)', priority: 'High', marketDemandScore: 91, category: 'Domain & Tooling', description: 'Detecting misconfigurations and privilege escalation paths in AWS/GCP/Azure.' },
      { name: 'Incident Playbook Orchestration (SOAR)', priority: 'High', marketDemandScore: 88, category: 'Domain & Tooling', description: 'Automating containment of compromised endpoints and revocations.' },
      { name: 'Security Compliance (SOC2, ISO 27001)', priority: 'Differentiating', marketDemandScore: 82, category: 'Leadership & Soft Skills', description: 'Translating regulatory mandates into practical technical controls.' }
    ],
    curriculumTopics: [
      { id: 'sec-t1', title: 'Network Protocols & Threat Vectors', level: 'Beginner', summary: 'TCP/IP handshakes, DNS poisoning, ARP spoofing, and port scanning.', estimatedHours: 10, keyLearningObjectives: ['Analyze Wireshark packet dumps', 'Identify perimeter attack vectors'], practiceCount: 14 },
      { id: 'sec-t2', title: 'SIEM Log Correlation & Incident Detection', level: 'Intermediate', summary: 'Splunk/Sentinel query construction, alert rule tuning, and false positive reduction.', estimatedHours: 16, keyLearningObjectives: ['Write KQL/SPL queries', 'Detect brute-force & credential stuffing'], practiceCount: 18 },
      { id: 'sec-t3', title: 'Cloud IAM & Zero-Trust Architecture', level: 'Advanced', summary: 'AWS IAM policy evaluation logic, service account tokens, and metadata API defense.', estimatedHours: 20, keyLearningObjectives: ['Prevent IAM role assumption exploits', 'Configure private endpoints'], practiceCount: 16 },
      { id: 'sec-t4', title: 'Live Ransomware Incident Response & Digital Forensics', level: 'Expert', summary: 'Memory forensics, volatility analysis, timeline reconstruction, and containment.', estimatedHours: 24, keyLearningObjectives: ['Isolate infected hypervisors', 'Extract memory dump indicators of compromise'], practiceCount: 15 }
    ],
    mockInterviewFocus: {
      technicalDomain: 'MITRE ATT&CK framework, forensic timeline reconstruction, and IAM privilege escalation',
      scenarioType: 'Active credential exfiltration and unauthorized lateral movement in cloud tenant',
      behavioralAspects: ['Executive escalation during high-stress breaches', 'Coordinating legal and technical containment']
    }
  },
  {
    id: 'data-scientist-engineer',
    title: 'Data Scientist / Data Engineer',
    category: 'Tech & AI',
    demandLevel: 'Very High',
    projectedGrowth: '+35% projected growth through 2028',
    salaryRange: '$130,000 – $190,000 / yr',
    summary: 'Design scalable distributed streaming pipelines, build predictive statistical models, and transform multi-terabyte data warehouses.',
    keySkills: ['Apache Spark / PySpark', 'SQL & dbt', 'Data Lakehouses (Iceberg / Delta)', 'Python (Pandas / Scikit-learn)', 'Kafka', 'Snowflake / BigQuery'],
    recommendedSkills: [
      { name: 'Distributed Processing (PySpark)', priority: 'Critical', marketDemandScore: 97, category: 'Core Technical', description: 'Writing efficient partitioned transformations and avoiding memory shuffle bottlenecks.' },
      { name: 'Advanced SQL & Data Modeling (dbt)', priority: 'Critical', marketDemandScore: 95, category: 'Core Technical', description: 'Dimensional modeling (Kimball), window aggregations, and idempotent transforms.' },
      { name: 'Streaming Ingestion (Apache Kafka)', priority: 'High', marketDemandScore: 90, category: 'Architecture', description: 'Exactly-once semantics, consumer lag monitoring, and Avro/Protobuf schema registries.' },
      { name: 'Lakehouse Formats (Apache Iceberg)', priority: 'High', marketDemandScore: 89, category: 'Domain & Tooling', description: 'ACID transactions on object storage, metadata pruning, and time-travel queries.' },
      { name: 'Statistical Testing & A/B Experimentation', priority: 'Differentiating', marketDemandScore: 85, category: 'Leadership & Soft Skills', description: 'Hypothesis testing, p-values, sample size power calculations, and lift analysis.' }
    ],
    curriculumTopics: [
      { id: 'ds-t1', title: 'Advanced SQL & Relational Query Optimization', level: 'Beginner', summary: 'Window functions, recursive CTEs, indexing strategies, and execution plans.', estimatedHours: 12, keyLearningObjectives: ['Optimize slow analytical queries', 'Eliminate Cartesian joins'], practiceCount: 18 },
      { id: 'ds-t2', title: 'ETL Orchestration with dbt & Airflow', level: 'Intermediate', summary: 'DAG authoring, lineage dependency tracking, testing, and documentation.', estimatedHours: 16, keyLearningObjectives: ['Build modular data models', 'Set up automated data quality tests'], practiceCount: 16 },
      { id: 'ds-t3', title: 'Large-Scale PySpark & Lakehouse Architecture', level: 'Advanced', summary: 'Partitioning, broadcast joins, Iceberg metadata management, and compaction.', estimatedHours: 22, keyLearningObjectives: ['Tweak Spark memory configurations', 'Handle data skew in joins'], practiceCount: 20 },
      { id: 'ds-t4', title: 'Real-time Event Streaming & Feature Stores', level: 'Expert', summary: 'Kafka event-driven streaming, micro-batching, and low-latency feature serving for ML.', estimatedHours: 26, keyLearningObjectives: ['Design real-time aggregations', 'Prevent consumer group rebalancing storms'], practiceCount: 15 }
    ],
    mockInterviewFocus: {
      technicalDomain: 'Distributed storage, data skew handling in Spark, and dimensional schema design',
      scenarioType: 'Upstream schema drift breaking mission-critical reporting dashboards',
      behavioralAspects: ['Aligning technical metrics with stakeholder business KPIs', 'Prioritizing data correctness over pipeline speed']
    }
  },
  {
    id: 'software-engineer',
    title: 'Software Engineer (Full-stack, Backend, Frontend)',
    category: 'Tech & AI',
    demandLevel: 'Very High',
    projectedGrowth: '+25% projected growth through 2028',
    salaryRange: '$120,000 – $185,000 / yr',
    summary: 'Deliver resilient modern web applications, scalable REST/gRPC backend APIs, distributed microservices, and slick reactive user interfaces.',
    keySkills: ['TypeScript & React / Next.js', 'Go / Node.js / Java', 'Distributed Systems & Caching', 'PostgreSQL / NoSQL', 'System Design', 'Docker & CI/CD'],
    recommendedSkills: [
      { name: 'Full-Stack TypeScript & React 19', priority: 'Critical', marketDemandScore: 96, category: 'Core Technical', description: 'Server components, reactive state patterns, client-side caching, and accessibility.' },
      { name: 'Backend Concurrency & Clean Architecture', priority: 'Critical', marketDemandScore: 94, category: 'Core Technical', description: 'Thread pools, goroutines, async I/O, domain-driven design, and middleware chains.' },
      { name: 'High-Performance Database Indexing', priority: 'High', marketDemandScore: 92, category: 'Architecture', description: 'B-tree vs GIN indexes, query plans, connection pooling, and optimistic locking.' },
      { name: 'Distributed Caching (Redis)', priority: 'High', marketDemandScore: 89, category: 'Architecture', description: 'Cache-aside, write-through, cache stampede prevention, and TTL invalidation.' },
      { name: 'System Design & Trade-off Communication', priority: 'Differentiating', marketDemandScore: 91, category: 'Leadership & Soft Skills', description: 'CAP theorem, horizontal vs vertical scaling, rate limiting, and circuit breakers.' }
    ],
    curriculumTopics: [
      { id: 'swe-t1', title: 'Data Structures & Algorithmic Problem Solving', level: 'Beginner', summary: 'Arrays, hash maps, two pointers, sliding windows, and binary trees.', estimatedHours: 14, keyLearningObjectives: ['Master O(1) space optimizations', 'Handle recursive base cases'], practiceCount: 25 },
      { id: 'swe-t2', title: 'RESTful API Engineering & Relational Persistency', level: 'Intermediate', summary: 'HTTP status semantics, idempotent endpoints, transactions, and migration scripts.', estimatedHours: 18, keyLearningObjectives: ['Design clean REST contracts', 'Write safe database migrations'], practiceCount: 20 },
      { id: 'swe-t3', title: 'Concurrent Systems, Caching & Resilience', level: 'Advanced', summary: 'Race condition prevention, distributed locking, Redis caching patterns, and retry policies.', estimatedHours: 24, keyLearningObjectives: ['Implement token bucket rate limiter', 'Design cache invalidation system'], practiceCount: 18 },
      { id: 'swe-t4', title: 'Global-Scale Distributed Systems Architecture', level: 'Expert', summary: 'Event sourcing, CQRS, sharding, consensus protocols, and microservice mesh.', estimatedHours: 28, keyLearningObjectives: ['Design a distributed URL shortener or chat system', 'Mitigate hot partition bottlenecks'], practiceCount: 15 }
    ],
    mockInterviewFocus: {
      technicalDomain: 'System design, database transactions, concurrency, and API idempotency',
      scenarioType: 'Live site outage caused by connection pool exhaustion during flash traffic',
      behavioralAspects: ['Resolving technical disagreements with senior peers', 'Mentoring junior developers']
    }
  },
  {
    id: 'cloud-engineer',
    title: 'Cloud Engineer / Cloud Architect',
    category: 'Cloud & Security',
    demandLevel: 'Very High',
    projectedGrowth: '+29% projected growth through 2028',
    salaryRange: '$135,000 – $195,000 / yr',
    summary: 'Design fault-tolerant multi-region cloud topology on AWS/GCP/Azure, automate infrastructure with Terraform, and optimize cloud unit economics.',
    keySkills: ['AWS / GCP / Azure Solutions', 'Terraform (IaC)', 'Kubernetes (EKS / GKE)', 'Cloud Networking (VPC / BGP)', 'FinOps & Cost Optimization', 'Disaster Recovery'],
    recommendedSkills: [
      { name: 'Infrastructure as Code (Terraform / OpenTofu)', priority: 'Critical', marketDemandScore: 97, category: 'Core Technical', description: 'Declarative state management, reusable modules, and drift detection.' },
      { name: 'Container Orchestration (Kubernetes)', priority: 'Critical', marketDemandScore: 95, category: 'Core Technical', description: 'Ingress controllers, daemonsets, HPA autoscaling, and persistent volumes.' },
      { name: 'Advanced Cloud Networking & Security', priority: 'High', marketDemandScore: 91, category: 'Architecture', description: 'Transit gateways, private endpoints, peering, egress filtering, and DirectConnect.' },
      { name: 'FinOps & Cloud Cost Optimization', priority: 'High', marketDemandScore: 88, category: 'Leadership & Soft Skills', description: 'Reserved instances, savings plans, auto-stopping idle dev environments, and egress analysis.' },
      { name: 'Multi-Region Disaster Recovery (RTO/RPO)', priority: 'Differentiating', marketDemandScore: 89, category: 'Architecture', description: 'Active-active databases, automated DNS failover with Route53, and cross-region replication.' }
    ],
    curriculumTopics: [
      { id: 'cloud-t1', title: 'Cloud Infrastructure & VPC Fundamentals', level: 'Beginner', summary: 'Subnets, route tables, internet gateways, security groups, and CIDR blocks.', estimatedHours: 12, keyLearningObjectives: ['Architect multi-tier VPC', 'Isolate private database tier'], practiceCount: 15 },
      { id: 'cloud-t2', title: 'Automated Provisioning with Terraform', level: 'Intermediate', summary: 'State backends, remote locking with DynamoDB, variables, and module composition.', estimatedHours: 16, keyLearningObjectives: ['Write production Terraform modules', 'Manage environment workspaces'], practiceCount: 18 },
      { id: 'cloud-t3', title: 'Production Kubernetes Cluster Management', level: 'Advanced', summary: 'Node pool management, spot instances, cluster autoscaler, and resource requests/limits.', estimatedHours: 24, keyLearningObjectives: ['Deploy highly-available services', 'Configure Horizontal Pod Autoscaler'], practiceCount: 16 },
      { id: 'cloud-t4', title: 'Global Multi-Region Cloud Resilience & FinOps', level: 'Expert', summary: 'Active-active multi-region failover, cost allocation tags, and chaos engineering experiments.', estimatedHours: 28, keyLearningObjectives: ['Execute simulated region blackout test', 'Optimize 30% monthly AWS bill'], practiceCount: 14 }
    ],
    mockInterviewFocus: {
      technicalDomain: 'Terraform state management, VPC topology, Kubernetes scheduling, and cloud egress cost',
      scenarioType: 'Complete AWS primary region outage requiring automated multi-region failover',
      behavioralAspects: ['Advising executive leadership on cloud budget governance', 'Vendor lock-in trade-offs']
    }
  },
  {
    id: 'nurse-practitioner',
    title: 'Nurse Practitioner / Registered Nurse',
    category: 'Healthcare',
    demandLevel: 'Very High',
    projectedGrowth: '+40% projected growth through 2028',
    salaryRange: '$95,000 – $140,000 / yr',
    summary: 'Deliver advanced clinical diagnostic care, order laboratory evaluations, manage chronic disease management, and lead patient care teams.',
    keySkills: ['Advanced Physical Assessment', 'Pharmacology & Therapeutics', 'Diagnostic Interpretation', 'Electronic Health Records (Epic)', 'Patient Advocacy & Communication', 'Evidence-Based Practice'],
    recommendedSkills: [
      { name: 'Clinical Pharmacology & Prescribing', priority: 'Critical', marketDemandScore: 98, category: 'Core Technical', description: 'Pharmacokinetics, drug interactions, contraindications, and therapeutic monitoring.' },
      { name: 'Differential Diagnosis Formulation', priority: 'Critical', marketDemandScore: 96, category: 'Core Technical', description: 'Synthesizing symptom constellations, vitals, and lab data into prioritized differential diagnoses.' },
      { name: 'EHR Informatics (Epic Systems)', priority: 'High', marketDemandScore: 90, category: 'Domain & Tooling', description: 'Order entry, clinical documentation, secure messaging, and care coordination workflows.' },
      { name: 'Trauma & Acute Resuscitation (ACLS)', priority: 'High', marketDemandScore: 93, category: 'Domain & Tooling', description: 'Code management, airway stabilization, and hemodynamic pharmacology.' },
      { name: 'Compassionate Patient & Family Communication', priority: 'Differentiating', marketDemandScore: 95, category: 'Leadership & Soft Skills', description: 'Empathetic de-escalation, delivering critical prognoses, and cross-cultural care.' }
    ],
    curriculumTopics: [
      { id: 'nurse-t1', title: 'Systematic Physical Health Assessment', level: 'Beginner', summary: 'Cardiovascular, respiratory, neurological, and abdominal examination techniques.', estimatedHours: 14, keyLearningObjectives: ['Recognize abnormal heart murmurs', 'Interpret lung adventitious sounds'], practiceCount: 20 },
      { id: 'nurse-t2', title: 'Advanced Pharmacotherapy & Drug Interactions', level: 'Intermediate', summary: 'Antihypertensives, antibiotics, anticoagulants, insulin regimens, and dosing adjustments.', estimatedHours: 20, keyLearningObjectives: ['Calculate renal clearance adjustments', 'Identify life-threatening drug reactions'], practiceCount: 18 },
      { id: 'nurse-t3', title: 'Laboratory Interpretation & Acute Differential Diagnosis', level: 'Advanced', summary: 'Arterial blood gases (ABG), comprehensive metabolic panels, troponins, and imaging triage.', estimatedHours: 24, keyLearningObjectives: ['Interpret complex acid-base disorders', 'Formulate prioritized diagnostic plans'], practiceCount: 16 },
      { id: 'nurse-t4', title: 'Complex Care Management & Clinical Leadership', level: 'Expert', summary: 'Multi-morbid chronic disease stabilization, palliative care transitions, and clinical quality audits.', estimatedHours: 26, keyLearningObjectives: ['Coordinate interprofessional discharge planning', 'Lead code blue debriefs'], practiceCount: 15 }
    ],
    mockInterviewFocus: {
      technicalDomain: 'Evidence-based clinical guidelines, pharmacological safety, and diagnostic algorithms',
      scenarioType: 'Acute patient decompensation with deteriorating vitals and conflicting lab findings',
      behavioralAspects: ['Resolving ethical conflicts between patient autonomy and family desires', 'Workplace resilience']
    }
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    category: 'Leadership',
    demandLevel: 'High',
    projectedGrowth: '+20% projected growth through 2028',
    salaryRange: '$125,000 – $180,000 / yr',
    summary: 'Define product vision, synthesize customer discovery insights, align cross-functional engineering teams, and drive product-led growth metrics.',
    keySkills: ['Customer Discovery & User Research', 'Roadmap Prioritization (RICE)', 'Data Analytics (SQL & Amplitude)', 'Product Requirements (PRDs)', 'Go-to-Market Strategy', 'Stakeholder Management'],
    recommendedSkills: [
      { name: 'Roadmap Prioritization & Strategy', priority: 'Critical', marketDemandScore: 96, category: 'Core Technical', description: 'Framing strategic bets, applying RICE scoring, and communicating trade-offs.' },
      { name: 'Product Analytics & Experimentation', priority: 'Critical', marketDemandScore: 94, category: 'Domain & Tooling', description: 'Funnel drop-off analysis, cohort retention, and A/B test statistical significance.' },
      { name: 'Technical Product Requirements (PRD)', priority: 'High', marketDemandScore: 92, category: 'Domain & Tooling', description: 'Defining acceptance criteria, edge cases, and non-functional engineering requirements.' },
      { name: 'Customer Interviewing & Problem Validation', priority: 'High', marketDemandScore: 89, category: 'Leadership & Soft Skills', description: 'Uncovering latent customer pain points without leading questions.' },
      { name: 'Executive Stakeholder Influence', priority: 'Differentiating', marketDemandScore: 93, category: 'Leadership & Soft Skills', description: 'Saying no gracefully, securing cross-org alignment, and unblocking engineering teams.' }
    ],
    curriculumTopics: [
      { id: 'pm-t1', title: 'Customer Discovery & Opportunity Solution Trees', level: 'Beginner', summary: 'Continuous interview frameworks, persona creation, and problem definition.', estimatedHours: 12, keyLearningObjectives: ['Conduct unbiased customer interviews', 'Map problem spaces'], practiceCount: 15 },
      { id: 'pm-t2', title: 'Writing Technical PRDs & Agile Execution', level: 'Intermediate', summary: 'Feature scoping, MVP definition, user stories, and sprint planning workflows.', estimatedHours: 16, keyLearningObjectives: ['Draft comprehensive PRDs', 'Define quantifiable success metrics'], practiceCount: 18 },
      { id: 'pm-t3', title: 'Product Analytics, Retention & Growth Funnels', level: 'Advanced', summary: 'North star metrics, cohort retention curves, viral loops, and churn diagnosis.', estimatedHours: 20, keyLearningObjectives: ['Analyze funnel attrition in Amplitude', 'Design onboarding growth experiments'], practiceCount: 16 },
      { id: 'pm-t4', title: 'Multi-Product Portfolio Strategy & Board Communication', level: 'Expert', summary: 'TAM/SAM expansion, competitive moats, pricing strategy, and executive presentations.', estimatedHours: 24, keyLearningObjectives: ['Construct 3-year strategic roadmaps', 'Defend feature deprioritizations'], practiceCount: 14 }
    ],
    mockInterviewFocus: {
      technicalDomain: 'Product design frameworks, metric trade-offs, and root cause metric diagnosis',
      scenarioType: 'Key engagement metric drops by 18% overnight following a feature release',
      behavioralAspects: ['Managing conflict between engineering estimates and sales deadlines', 'Customer empathy']
    }
  },
  {
    id: 'devops-platform-engineer',
    title: 'DevOps / Platform Engineer',
    category: 'Cloud & Security',
    demandLevel: 'Very High',
    projectedGrowth: '+30% projected growth through 2028',
    salaryRange: '$130,000 – $190,000 / yr',
    summary: 'Build internal developer platforms (IDP), engineer robust CI/CD deployment pipelines, manage observability telemetry, and ensure 99.99% uptime.',
    keySkills: ['CI/CD (GitHub Actions / GitLab)', 'Docker & Containerization', 'Kubernetes & Helm', 'Observability (Prometheus / Grafana)', 'ArgoCD / GitOps', 'Linux & Bash Scripting'],
    recommendedSkills: [
      { name: 'GitOps & Declarative Delivery (ArgoCD)', priority: 'Critical', marketDemandScore: 96, category: 'Core Technical', description: 'Zero-touch continuous delivery, automated sync, and instant rollbacks.' },
      { name: 'Observability & Distributed Tracing', priority: 'Critical', marketDemandScore: 94, category: 'Core Technical', description: 'OpenTelemetry collectors, Prometheus metrics, and Grafana alert thresholds.' },
      { name: 'Production CI/CD Automation', priority: 'High', marketDemandScore: 93, category: 'Domain & Tooling', description: 'Reusable pipeline templates, build matrixes, automated security scanning, and caching.' },
      { name: 'Linux Kernel & System Performance Tuning', priority: 'High', marketDemandScore: 89, category: 'Domain & Tooling', description: 'File descriptors, TCP buffer tuning, cgroups, and eBPF observability probes.' },
      { name: 'Incident On-Call Leadership & Postmortems', priority: 'Differentiating', marketDemandScore: 88, category: 'Leadership & Soft Skills', description: 'Blameless retrospectives, SLA/SLO definition, and error budget policies.' }
    ],
    curriculumTopics: [
      { id: 'devops-t1', title: 'Docker Containers & Multi-Stage Builds', level: 'Beginner', summary: 'Container namespaces, layers, image caching, and non-root security practices.', estimatedHours: 10, keyLearningObjectives: ['Minimize Docker image footprint', 'Secure container runtimes'], practiceCount: 15 },
      { id: 'devops-t2', title: 'Advanced CI/CD Pipelines & Artifact Management', level: 'Intermediate', summary: 'Automated testing stages, vulnerability scanning with Trivy, and semantic releases.', estimatedHours: 16, keyLearningObjectives: ['Build parallelized GitHub Action workflows', 'Implement canary deployments'], practiceCount: 18 },
      { id: 'devops-t3', title: 'GitOps with ArgoCD & Helm Charts', level: 'Advanced', summary: 'Umbrella charts, values overlays, automated reconciliation, and progressive delivery with Flagger.', estimatedHours: 22, keyLearningObjectives: ['Deploy multi-environment ArgoCD apps', 'Automate blue-green rollouts'], practiceCount: 16 },
      { id: 'devops-t4', title: 'Full-Stack Observability & Chaos Engineering', level: 'Expert', summary: 'SLO/SLI dashboards, synthetic monitoring, Chaos Mesh injection, and automated self-healing.', estimatedHours: 26, keyLearningObjectives: ['Set up OpenTelemetry tracing pipelines', 'Execute chaos latency experiments'], practiceCount: 14 }
    ],
    mockInterviewFocus: {
      technicalDomain: 'GitOps synchronization, eBPF debugging, Prometheus query optimization, and container security',
      scenarioType: 'Intermittent packet drops across Kubernetes worker nodes causing cascading timeouts',
      behavioralAspects: ['Conducting constructive blameless incident reviews', 'Advocating for engineering hygiene']
    }
  },
  {
    id: 'medical-health-services-manager',
    title: 'Medical & Health Services Manager',
    category: 'Healthcare',
    demandLevel: 'Very High',
    projectedGrowth: '+28% projected growth through 2028',
    salaryRange: '$110,000 – $165,000 / yr',
    summary: 'Direct operations, regulatory compliance, budgeting, and clinical workflows across hospital departments, clinics, and healthcare networks.',
    keySkills: ['Healthcare Operations Management', 'HIPAA & Regulatory Compliance', 'Healthcare Finance & Billing', 'Staff Scheduling & Retention', 'Quality Improvement (Lean / Six Sigma)', 'Health Informatics'],
    recommendedSkills: [
      { name: 'Healthcare Financial Management & Revenue Cycle', priority: 'Critical', marketDemandScore: 95, category: 'Core Technical', description: 'Payer contracts, fee-for-service vs value-based models, and departmental budgeting.' },
      { name: 'Regulatory Standards (HIPAA, Joint Commission)', priority: 'Critical', marketDemandScore: 94, category: 'Core Technical', description: 'Patient privacy protections, audit readiness, and accreditation requirements.' },
      { name: 'Clinical Quality & Patient Safety Metrics', priority: 'High', marketDemandScore: 91, category: 'Domain & Tooling', description: 'CAHPS scores, hospital-acquired infection reduction, and readmission penalties.' },
      { name: 'Capacity Planning & Staff Resource Allocation', priority: 'High', marketDemandScore: 89, category: 'Leadership & Soft Skills', description: 'Nurse-to-patient ratios, predictive census modeling, and burnout mitigation.' },
      { name: 'Healthcare Change Leadership', priority: 'Differentiating', marketDemandScore: 88, category: 'Leadership & Soft Skills', description: 'Transitioning medical staff to new EHR tools and fostering a culture of safety.' }
    ],
    curriculumTopics: [
      { id: 'hsm-t1', title: 'Healthcare Systems, HIPAA & Health Law', level: 'Beginner', summary: 'Federal privacy frameworks, business associate agreements, and compliance governance.', estimatedHours: 12, keyLearningObjectives: ['Conduct HIPAA risk assessments', 'Respond to data breach incidents'], practiceCount: 16 },
      { id: 'hsm-t2', title: 'Revenue Cycle Management & Healthcare Reimbursement', level: 'Intermediate', summary: 'DRGs, ICD-10 coding compliance, claims denials management, and Medicare billing.', estimatedHours: 18, keyLearningObjectives: ['Audit hospital denial rates', 'Optimize clean claims throughput'], practiceCount: 18 },
      { id: 'hsm-t3', title: 'Operational Efficiency & Lean Healthcare', level: 'Advanced', summary: 'Emergency room throughput optimization, bed management, and surgical scheduling.', estimatedHours: 22, keyLearningObjectives: ['Reduce patient wait times using queuing theory', 'Implement 5S hospital inventory'], practiceCount: 15 },
      { id: 'hsm-t4', title: 'Strategic Healthcare Leadership & Crisis Operations', level: 'Expert', summary: 'Disaster response plans, hospital surge staffing, medical staff credentialing, and mergers.', estimatedHours: 26, keyLearningObjectives: ['Develop hospital surge capacity protocol', 'Present clinical capital budget to trustees'], practiceCount: 14 }
    ],
    mockInterviewFocus: {
      technicalDomain: 'Healthcare finance, Joint Commission compliance, patient satisfaction metrics, and clinical workflow',
      scenarioType: 'Departmental budget deficit combined with an unannounced regulatory audit',
      behavioralAspects: ['Negotiating staffing compromises with senior physician leads', 'Transparent crisis communication']
    }
  },
  {
    id: 'skilled-trades',
    title: 'Skilled Trades (Electrician, HVAC, Solar & Wind Tech)',
    category: 'Skilled Trades',
    demandLevel: 'Very High',
    projectedGrowth: '+31% projected growth through 2028',
    salaryRange: '$75,000 – $125,000 / yr',
    summary: 'Install, maintain, and troubleshoot modern clean energy electrical grids, high-efficiency HVAC heat pumps, solar arrays, and wind generation systems.',
    keySkills: ['Electrical Schematics & NEC Code', 'HVAC Refrigeration & Heat Pumps', 'Solar Photovoltaic (PV) Systems', 'Wind Turbine Mechanical Diagnostics', 'OSHA 30 Safety Protocols', 'PLC & Industrial Controls'],
    recommendedSkills: [
      { name: 'National Electrical Code (NEC) & Circuitry', priority: 'Critical', marketDemandScore: 97, category: 'Core Technical', description: 'Conduit bending, circuit breaker sizing, 3-phase power distribution, and load calculations.' },
      { name: 'Inverter & Clean Energy Storage Systems', priority: 'Critical', marketDemandScore: 95, category: 'Core Technical', description: 'Grid-tied solar inverters, battery storage integration, and bidirectional charging.' },
      { name: 'HVAC Diagnostics & EPA 608 Certification', priority: 'High', marketDemandScore: 92, category: 'Domain & Tooling', description: 'Refrigerant recovery, psychrometrics, variable-speed compressors, and airflow balancing.' },
      { name: 'Industrial PLC & Automation Controls', priority: 'High', marketDemandScore: 88, category: 'Domain & Tooling', description: 'Ladder logic diagnostics, relay logic, sensor calibration, and telemetry testing.' },
      { name: 'Jobsite Safety & OSHA 30 Compliance', priority: 'Differentiating', marketDemandScore: 96, category: 'Leadership & Soft Skills', description: 'Lockout/tagout (LOTO), arc flash PPE, fall protection, and safety inspections.' }
    ],
    curriculumTopics: [
      { id: 'trade-t1', title: 'Electrical Fundamentals, NEC Code & Blueprint Reading', level: 'Beginner', summary: "Ohm's law, single-phase wiring, reading electrical schematics, and proper grounding.", estimatedHours: 14, keyLearningObjectives: ['Calculate circuit wire gauge needs', 'Trace wiring faults on blueprints'], practiceCount: 18 },
      { id: 'trade-t2', title: 'Modern HVAC Heat Pumps & Refrigeration Cycles', level: 'Intermediate', summary: 'Thermodynamics of refrigeration, ductless mini-splits, thermostats, and electrical controls.', estimatedHours: 18, keyLearningObjectives: ['Diagnose faulty capacitors and contactors', 'Perform EPA refrigerant recovery'], practiceCount: 16 },
      { id: 'trade-t3', title: 'Solar PV & Battery Storage Installation', level: 'Advanced', summary: 'Rooftop mounting, string vs microinverters, battery management systems, and net metering.', estimatedHours: 22, keyLearningObjectives: ['Wire high-voltage DC combiner boxes', 'Commission Tesla/Enphase battery banks'], practiceCount: 15 },
      { id: 'trade-t4', title: 'Commercial Industrial Controls & Renewable Wind Systems', level: 'Expert', summary: 'Hydraulic pitch control in wind turbines, 480V 3-phase motor starters, and PLC troubleshooting.', estimatedHours: 26, keyLearningObjectives: ['Troubleshoot industrial PLC fault lights', 'Inspect wind generator slip rings'], practiceCount: 14 }
    ],
    mockInterviewFocus: {
      technicalDomain: 'NEC code requirements, voltage drop calculations, refrigerant pressure gauges, and LOTO safety',
      scenarioType: 'Sudden electrical phase unbalance causing commercial equipment motor tripping',
      behavioralAspects: ['Demonstrating uncompromised safety under urgent production deadlines', 'Client service communication']
    }
  },
  {
    id: 'hardware-embedded-engineer',
    title: 'Hardware & Embedded Systems Engineer',
    category: 'Tech & AI',
    demandLevel: 'Very High',
    projectedGrowth: '+27% projected growth through 2028',
    salaryRange: '$120,000 – $185,000 / yr',
    summary: 'Design, program, and validate embedded firmware, RTOS applications, board bring-up, and IoT microcontroller communication protocols.',
    keySkills: ['Embedded C / C++', 'FreeRTOS / Zephyr RTOS', 'ARM Cortex-M / RISC-V', 'I2C / SPI / UART / CAN', 'PCB Design & Debugging', 'Low-Power Firmware'],
    recommendedSkills: [
      { name: 'Embedded C / C++ & Memory Safety', priority: 'Critical', marketDemandScore: 98, category: 'Core Technical', description: 'Volatile pointers, bitwise manipulation, interrupt service routines (ISR), and register mapping.' },
      { name: 'Real-Time Operating Systems (FreeRTOS)', priority: 'Critical', marketDemandScore: 96, category: 'Core Technical', description: 'Preemptive scheduling, task priority inversion, queues, semaphores, and memory heaps.' },
      { name: 'Hardware Bus Protocols (SPI / I2C / CAN)', priority: 'High', marketDemandScore: 94, category: 'Domain & Tooling', description: 'Clock synchronization, addressing, timing constraints, logic analyzer packet decoding.' },
      { name: 'Microcontroller Peripheral Architecture', priority: 'High', marketDemandScore: 91, category: 'Architecture', description: 'DMA transfers, timers, PWM controllers, ADC sampling, and sleep wake-up interrupts.' },
      { name: 'Hardware-Software Debugging & Board Bring-up', priority: 'Differentiating', marketDemandScore: 93, category: 'Leadership & Soft Skills', description: 'JTAG/SWD debugging, oscilloscopes, schematics inspection, and automated flash testing.' }
    ],
    curriculumTopics: [
      { id: 'emb-t1', title: 'Embedded C, Pointer Arithmetic & GPIO Registers', level: 'Beginner', summary: 'Memory layouts, volatile keyword, bit masking, GPIO configuration, and basic hardware timers.', estimatedHours: 12, keyLearningObjectives: ['Configure GPIO pins at register level', 'Handle volatile memory constraints'], practiceCount: 18 },
      { id: 'emb-t2', title: 'Hardware Bus Protocols (I2C, SPI & UART)', level: 'Intermediate', summary: 'Master-slave arbitration, clock polarities, baud rate registers, and sensor communication.', estimatedHours: 16, keyLearningObjectives: ['Implement non-blocking SPI driver', 'Decode I2C waveforms with logic analyzer'], practiceCount: 20 },
      { id: 'emb-t3', title: 'FreeRTOS Task Scheduling & Concurrency', level: 'Advanced', summary: 'Context switching, priority inversion mitigation, mutexes, message queues, and ISR deferred work.', estimatedHours: 22, keyLearningObjectives: ['Prevent priority inversion using mutexes', 'Stream telemetry over FreeRTOS queues'], practiceCount: 16 },
      { id: 'emb-t4', title: 'DMA Direct Memory Access & Low-Power Firmware', level: 'Expert', summary: 'Circular DMA buffers, peripheral-to-memory streaming, deep sleep modes, and bootloaders.', estimatedHours: 26, keyLearningObjectives: ['Stream high-speed ADC data with zero CPU overhead', 'Implement secure OTA bootloader'], practiceCount: 15 }
    ],
    mockInterviewFocus: {
      technicalDomain: 'Interrupt latency, volatile pointers, RTOS task synchronization, and bus timing constraints',
      scenarioType: 'Intermittent I2C bus lockup caused by clock stretching under high sensor sampling rates',
      behavioralAspects: ['Bridging communication between hardware mechanical engineers and firmware teams', 'Root cause discipline']
    }
  }
];

export function getJobById(id: string): InDemandJob | undefined {
  return IN_DEMAND_JOBS_2026.find((j) => j.id === id);
}
