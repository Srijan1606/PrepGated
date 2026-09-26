// ==============================================================================
// PrepGated - Official Study Materials & Reference Documentation
// Curated, authoritative, official technical documentation links that open when clicked.
// Covers Data Structures, System Design, Concurrency, Databases, Cloud, AI, and Networking.
// ==============================================================================

export interface OfficialStudyMaterial {
  id: string;
  title: string;
  description: string;
  url: string;
  officialSource: string; // e.g. "MDN Web Docs", "Python.org", "Kubernetes.io", "MIT OpenCourseWare"
  authorityBadge: string; // e.g. "Official Documentation", "Academic Standard", "Architecture Standard"
  category: 'DSA & Algorithms' | 'System Design & Scalability' | 'Databases & Storage' | 'Concurrency & OS' | 'Cloud & DevOps' | 'AI & Machine Learning' | 'Security & Protocols';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'All Levels';
  estimatedReadTime: string;
  coreTopics: string[];
}

export const OFFICIAL_STUDY_MATERIALS: OfficialStudyMaterial[] = [
  // 1. Data Structures & Algorithms
  {
    id: 'mat-mit-dsa',
    title: 'MIT OpenCourseWare 6.006: Introduction to Algorithms',
    description: 'Comprehensive foundational lectures on asymptotic analysis, balanced BSTs, graph traversal, and dynamic programming from MIT.',
    url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
    officialSource: 'MIT OpenCourseWare',
    authorityBadge: 'Academic Gold Standard',
    category: 'DSA & Algorithms',
    level: 'Beginner',
    estimatedReadTime: 'Course Lectures & Notes',
    coreTopics: ['Data Structures & Algorithms Basics', 'Arrays', 'Trees', 'Graphs', 'Dynamic Programming'],
  },
  {
    id: 'mat-visualgo',
    title: 'VisuAlgo: Visualising Data Structures and Algorithms through Animation',
    description: 'Interactive step-by-step visualizations for AVL trees, red-black trees, binary search, sorting, and graph shortest path algorithms.',
    url: 'https://visualgo.net/en',
    officialSource: 'National University of Singapore',
    authorityBadge: 'Interactive Visualization',
    category: 'DSA & Algorithms',
    level: 'Beginner',
    estimatedReadTime: '15 min interactive walkthrough',
    coreTopics: ['Data Structures & Algorithms Basics', 'Binary Search', 'Sorting', 'Graph Algorithms'],
  },
  {
    id: 'mat-python-dsa-docs',
    title: 'Python Official Documentation: Data Structures & Collections',
    description: 'Official Python standard library reference on list internals, deque, heapq (priority queues), and bisect module for algorithm optimization.',
    url: 'https://docs.python.org/3/tutorial/datastructures.html',
    officialSource: 'Python Software Foundation',
    authorityBadge: 'Official Language Docs',
    category: 'DSA & Algorithms',
    level: 'Intermediate',
    estimatedReadTime: '20 min read',
    coreTopics: ['Python & PyTorch', 'Data Structures & Algorithms Basics', 'Collections', 'Heapq'],
  },

  // 2. System Design & Scalability
  {
    id: 'mat-system-design-primer',
    title: 'The System Design Primer (by Donne Martin)',
    description: 'The industry-standard open source guide to scalable architectures, covering horizontal scaling, load balancing, caching, CDN, sharding, and CAP theorem.',
    url: 'https://github.com/donnemartin/system-design-primer',
    officialSource: 'System Design Primer (GitHub)',
    authorityBadge: 'Industry Standard Guide',
    category: 'System Design & Scalability',
    level: 'Intermediate',
    estimatedReadTime: '45 min comprehensive guide',
    coreTopics: ['System Design & Scalability', 'System Architecture', 'High-Concurrency Systems', 'Load Balancing'],
  },
  {
    id: 'mat-aws-well-architected',
    title: 'AWS Well-Architected Framework: Reliability & Performance Pillar',
    description: 'Official Amazon Web Services architectural best practices for designing fault-tolerant, resilient, and highly available distributed systems.',
    url: 'https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html',
    officialSource: 'Amazon Web Services (AWS)',
    authorityBadge: 'Official Cloud Architecture',
    category: 'System Design & Scalability',
    level: 'Advanced',
    estimatedReadTime: '35 min whitepaper',
    coreTopics: ['System Design & Scalability', 'Cloud Architecture', 'Disaster Recovery', 'Fault Tolerance'],
  },
  {
    id: 'mat-microservices-patterns',
    title: 'Microservice Architecture Patterns & Circuit Breakers (Chris Richardson)',
    description: 'Official pattern catalog for distributed transaction management (Saga), API Gateways, CQRS, and Circuit Breaker resiliency.',
    url: 'https://microservices.io/patterns/index.html',
    officialSource: 'Microservices.io',
    authorityBadge: 'Architecture Pattern Standard',
    category: 'System Design & Scalability',
    level: 'Advanced',
    estimatedReadTime: '25 min patterns review',
    coreTopics: ['REST & gRPC Microservice APIs', 'Microservices', 'Circuit Breakers', 'Event-Driven Architecture'],
  },

  // 3. Databases & Storage
  {
    id: 'mat-postgresql-indexing',
    title: 'PostgreSQL Official Documentation: B-Tree, GIN, and GiST Indexes',
    description: 'Official PostgreSQL architectural manual on index internals, execution plan optimization with EXPLAIN ANALYZE, and vacuum maintenance.',
    url: 'https://www.postgresql.org/docs/current/indexes.html',
    officialSource: 'PostgreSQL Global Development Group',
    authorityBadge: 'Official Database Manual',
    category: 'Databases & Storage',
    level: 'Intermediate',
    estimatedReadTime: '30 min reference',
    coreTopics: ['Database Indexing & ACID Protocols', 'PostgreSQL', 'SQL Optimization', 'B+ Trees'],
  },
  {
    id: 'mat-postgresql-transactions',
    title: 'PostgreSQL Official Documentation: Transaction Isolation & MVCC',
    description: 'In-depth explanation of Read Committed, Repeatable Read, and Serializable isolation levels, dirty reads, phantom reads, and MVCC locks.',
    url: 'https://www.postgresql.org/docs/current/transaction-iso.html',
    officialSource: 'PostgreSQL Global Development Group',
    authorityBadge: 'Official Database Manual',
    category: 'Databases & Storage',
    level: 'Advanced',
    estimatedReadTime: '25 min deep dive',
    coreTopics: ['Database Indexing & ACID Protocols', 'ACID Transactions', 'Concurrency Control', 'Pessimistic Locking'],
  },
  {
    id: 'mat-redis-docs',
    title: 'Redis Official Documentation: In-Memory Data Structures & Eviction',
    description: 'Official Redis documentation on strings, hashes, sorted sets (ZSET), hyperloglogs, stream processing, and LRU/LFU cache eviction policies.',
    url: 'https://redis.io/docs/latest/develop/data-types/',
    officialSource: 'Redis.io Official',
    authorityBadge: 'Official Cache & Memory Docs',
    category: 'Databases & Storage',
    level: 'Intermediate',
    estimatedReadTime: '20 min guide',
    coreTopics: ['Caching & In-Memory Store', 'Redis', 'Eviction Policies', 'Distributed Locks'],
  },

  // 4. Concurrency, Thread Synchronization & OS
  {
    id: 'mat-python-concurrency',
    title: 'Python Official Documentation: asyncio — Asynchronous I/O',
    description: 'Official guide to event loops, coroutines, tasks, synchronization primitives (asyncio.Lock, Semaphore), and non-blocking I/O.',
    url: 'https://docs.python.org/3/library/asyncio.html',
    officialSource: 'Python Software Foundation',
    authorityBadge: 'Official Language Docs',
    category: 'Concurrency & OS',
    level: 'Intermediate',
    estimatedReadTime: '35 min practical reference',
    coreTopics: ['Concurrency & Thread Synchronization', 'Async I/O', 'Event Loops', 'Coroutines'],
  },
  {
    id: 'mat-linux-kernel-mem',
    title: 'The Linux Kernel Documentation: Memory Management Architecture',
    description: 'Official Linux kernel documentation explaining page tables, virtual memory management, slab allocators, and dirty page writebacks.',
    url: 'https://www.kernel.org/doc/html/latest/admin-guide/mm/index.html',
    officialSource: 'Linux Kernel Organization',
    authorityBadge: 'Official OS Architecture',
    category: 'Concurrency & OS',
    level: 'Expert',
    estimatedReadTime: '40 min system manual',
    coreTopics: ['Operating Systems & Memory Models', 'Virtual Memory', 'Page Caching', 'Linux Kernel'],
  },

  // 5. Cloud, DevOps & Containers
  {
    id: 'mat-kubernetes-concepts',
    title: 'Kubernetes Official Documentation: Cluster Architecture & Pod Lifecycle',
    description: 'Official production guide on Control Plane components (etcd, kube-apiserver, kube-scheduler), Pod lifecycle, Deployments, and Services.',
    url: 'https://kubernetes.io/docs/concepts/overview/components/',
    officialSource: 'Kubernetes.io / CNCF',
    authorityBadge: 'Official CNCF Standard',
    category: 'Cloud & DevOps',
    level: 'Intermediate',
    estimatedReadTime: '30 min reference',
    coreTopics: ['Kubernetes', 'Cloud Infrastructure', 'Container Orchestration', 'Microservices'],
  },
  {
    id: 'mat-docker-docs',
    title: 'Docker Official Documentation: Multi-Stage Builds & Container Security',
    description: 'Official best practices for minimizing container image footprints, non-root user execution, caching layers, and security scanning.',
    url: 'https://docs.docker.com/build/building/multi-stage/',
    officialSource: 'Docker Official',
    authorityBadge: 'Official Containerization Docs',
    category: 'Cloud & DevOps',
    level: 'Beginner',
    estimatedReadTime: '15 min tutorial',
    coreTopics: ['Docker Containers', 'CI/CD Pipelines', 'DevOps', 'Multi-Stage Builds'],
  },

  // 6. Web & APIs
  {
    id: 'mat-mdn-http',
    title: 'MDN Web Docs: HTTP Protocols, Caching & Response Status Codes',
    description: 'Authoritative Mozilla documentation on HTTP/1.1 vs HTTP/2 vs HTTP/3, Cache-Control headers, ETag validation, and security headers (CORS, CSP).',
    url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP',
    officialSource: 'MDN Web Docs (Mozilla)',
    authorityBadge: 'Authoritative Web Standard',
    category: 'Security & Protocols',
    level: 'Beginner',
    estimatedReadTime: '25 min guide',
    coreTopics: ['REST & gRPC Microservice APIs', 'HTTP Protocols', 'Web Fundamentals', 'API Design'],
  },
  {
    id: 'mat-grpc-official',
    title: 'gRPC Official Documentation: Protocol Buffers (Proto3) & Streaming',
    description: 'Official gRPC guide on defining service contracts, binary wire serialization with Protocol Buffers, and unary vs bi-directional streaming.',
    url: 'https://grpc.io/docs/what-is-grpc/introduction/',
    officialSource: 'gRPC.io Official (CNCF)',
    authorityBadge: 'Official RPC Protocol',
    category: 'System Design & Scalability',
    level: 'Advanced',
    estimatedReadTime: '20 min guide',
    coreTopics: ['REST & gRPC Microservice APIs', 'gRPC', 'Protocol Buffers', 'High-Throughput APIs'],
  },

  // 7. Security & Threat Modeling
  {
    id: 'mat-owasp-top-10',
    title: 'OWASP Top 10 Web Application Security Risks: Official Standard',
    description: 'The internationally recognized standard awareness document for developers and security analysts covering Broken Access Control, Injection, and SSRF.',
    url: 'https://owasp.org/www-project-top-ten/',
    officialSource: 'OWASP Foundation',
    authorityBadge: 'Global Security Standard',
    category: 'Security & Protocols',
    level: 'Intermediate',
    estimatedReadTime: '30 min reference',
    coreTopics: ['Cybersecurity', 'Web Security', 'Broken Access Control', 'SQL Injection'],
  },

  // 8. AI & Machine Learning
  {
    id: 'mat-pytorch-tutorials',
    title: 'PyTorch Official Tutorials: Deep Learning Foundations & Autograd',
    description: 'Official PyTorch learning track: Tensor operations, automatic differentiation (autograd), building nn.Module architectures, and training loops.',
    url: 'https://pytorch.org/tutorials/beginner/basics/intro.html',
    officialSource: 'PyTorch / Linux Foundation',
    authorityBadge: 'Official Deep Learning Docs',
    category: 'AI & Machine Learning',
    level: 'Beginner',
    estimatedReadTime: '30 min interactive code walk',
    coreTopics: ['AI / Machine Learning Engineer', 'PyTorch & PyTorch', 'Deep Learning', 'Neural Networks'],
  },
  {
    id: 'mat-huggingface-rag',
    title: 'Hugging Face Official Course: Retrieval Augmented Generation (RAG)',
    description: 'Official open source course covering dense retrieval, sentence transformers, vector databases (Chroma/FAISS), and hybrid search reranking.',
    url: 'https://huggingface.co/learn/nlp-course/chapter1/1',
    officialSource: 'Hugging Face Learning',
    authorityBadge: 'Leading NLP Standard',
    category: 'AI & Machine Learning',
    level: 'Advanced',
    estimatedReadTime: '35 min tutorial',
    coreTopics: ['AI / Machine Learning Engineer', 'RAG & Vector Embeddings', 'LLM Fine-tuning', 'Vector DBs'],
  },

  // 9. Hardware & Embedded Systems
  {
    id: 'mat-freertos-kernel',
    title: 'FreeRTOS Official Kernel Guide: Tasks, Queues & Semaphores',
    description: 'Official documentation and architecture manual for FreeRTOS real-time kernel, preemptive scheduler, priority inversion, and mutex management.',
    url: 'https://www.freertos.org/Documentation/02-Kernel/02-Kernel-features/01-Tasks-and-co-routines/01-Tasks',
    officialSource: 'FreeRTOS (Amazon Web Services)',
    authorityBadge: 'Official RTOS Standard',
    category: 'Concurrency & OS',
    level: 'Intermediate',
    estimatedReadTime: '25 min official guide',
    coreTopics: ['Hardware & Embedded Systems Engineer', 'FreeRTOS', 'RTOS', 'Embedded C', 'Embedded'],
  },
  {
    id: 'mat-arm-developer',
    title: 'ARM Developer Documentation: Cortex-M Architecture & Registers',
    description: 'Official ARM architecture reference manuals covering memory maps, interrupt handling (NVIC), GPIO registers, and low-power modes.',
    url: 'https://developer.arm.com/documentation',
    officialSource: 'ARM Developer',
    authorityBadge: 'Official Hardware Spec',
    category: 'Concurrency & OS',
    level: 'Beginner',
    estimatedReadTime: '30 min reference',
    coreTopics: ['Hardware & Embedded Systems Engineer', 'ARM Cortex-M', 'Microcontrollers', 'GPIO', 'Embedded'],
  },
  {
    id: 'mat-linux-kernel-embedded',
    title: 'The Linux Kernel Documentation: I2C & SPI Subsystem Architecture',
    description: 'Official Linux kernel driver documentation for serial communication buses, clock stretching, bus arbitration, and device tree bindings.',
    url: 'https://www.kernel.org/doc/html/latest/i2c/index.html',
    officialSource: 'The Linux Kernel Archives',
    authorityBadge: 'Official OS Kernel Docs',
    category: 'Concurrency & OS',
    level: 'Intermediate',
    estimatedReadTime: '20 min technical guide',
    coreTopics: ['Hardware & Embedded Systems Engineer', 'I2C', 'SPI', 'UART', 'Hardware Protocols'],
  },

  // 10. Core Programming & DBMS Fundamentals
  {
    id: 'mat-python-official-tutorial',
    title: 'Python 3 Official Tutorial: Control Flow, Functions & OOP',
    description: 'The authoritative official Python language walkthrough covering syntax, scopes, classes, standard libraries, and virtual environments.',
    url: 'https://docs.python.org/3/tutorial/',
    officialSource: 'Python Software Foundation',
    authorityBadge: 'Official Language Docs',
    category: 'DSA & Algorithms',
    level: 'Beginner',
    estimatedReadTime: '25 min tutorial',
    coreTopics: ['Python', 'Python Programming', 'Data Structures & Algorithms Basics', 'AI / Machine Learning Engineer'],
  },
  {
    id: 'mat-postgres-sql-tutorial',
    title: 'PostgreSQL Official Documentation: SQL Language & Relational Queries',
    description: 'Comprehensive official Postgres guide to schema design, table constraints, aggregate functions, window functions, and transactions.',
    url: 'https://www.postgresql.org/docs/current/tutorial-sql.html',
    officialSource: 'PostgreSQL Global Development Group',
    authorityBadge: 'Official DBMS Docs',
    category: 'Databases & Storage',
    level: 'Beginner',
    estimatedReadTime: '30 min reference',
    coreTopics: ['SQL', 'DBMS', 'Databases', 'Relational Databases', 'PostgreSQL', 'Data Scientist / Data Engineer'],
  },
  {
    id: 'mat-docker-get-started',
    title: 'Docker Official Documentation: Containerization & Compose',
    description: 'Official Docker guides covering image layers, multi-stage builds, container isolation, port forwarding, and docker-compose files.',
    url: 'https://docs.docker.com/get-started/',
    officialSource: 'Docker Official',
    authorityBadge: 'Official Container Docs',
    category: 'Cloud & DevOps',
    level: 'Beginner',
    estimatedReadTime: '20 min walkthrough',
    coreTopics: ['Docker', 'DevOps / Platform Engineer', 'Cloud Engineer / Cloud Architect', 'Containerization'],
  },
  {
    id: 'mat-kubernetes-concepts',
    title: 'Kubernetes Official Documentation: Core Architecture & Pod Lifecycle',
    description: 'The definitive Kubernetes guide to Pods, Deployments, Services, ConfigMaps, and cluster networking from the Cloud Native Computing Foundation.',
    url: 'https://kubernetes.io/docs/concepts/',
    officialSource: 'Kubernetes (CNCF)',
    authorityBadge: 'Official Orchestration Docs',
    category: 'Cloud & DevOps',
    level: 'Intermediate',
    estimatedReadTime: '30 min architecture guide',
    coreTopics: ['Kubernetes', 'Cloud Engineer / Cloud Architect', 'DevOps / Platform Engineer', 'Cloud Infrastructure'],
  }
];

/**
 * Filter official study materials matching a topic or level
 */
export function getStudyMaterialsForTopic(topicTitle: string): OfficialStudyMaterial[] {
  const normalized = topicTitle.toLowerCase();
  const matched = OFFICIAL_STUDY_MATERIALS.filter((mat) => {
    return (
      mat.coreTopics.some((t) => normalized.includes(t.toLowerCase()) || t.toLowerCase().includes(normalized)) ||
      mat.title.toLowerCase().includes(normalized) ||
      mat.description.toLowerCase().includes(normalized)
    );
  });

  // If no direct keyword match, return the best foundational materials
  if (matched.length === 0) {
    return OFFICIAL_STUDY_MATERIALS.slice(0, 4);
  }
  return matched;
}
