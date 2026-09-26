// ==============================================================================
// Placement Prep Platform - Supabase Client Bridge
// Seamlessly connects to real Supabase when VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY
// are supplied; provides an in-browser simulated state during initial AI Studio preview
// so that the UI can be interacted with before manual backend provisioning.
// ==============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { JobTrack } from '../types';

const envSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const envSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isRealSupabaseConfigured = Boolean(
  envSupabaseUrl &&
  envSupabaseAnonKey &&
  envSupabaseUrl !== 'MY_SUPABASE_URL' &&
  !envSupabaseUrl.includes('placeholder')
);

export const SEED_JOB_TRACKS: JobTrack[] = [
  // Standard Roles (Stable, Evergreen Careers)
  {
    id: 'track-sde-1',
    name: 'SDE / Backend Engineer',
    category: 'standard',
    description: 'Specializes in distributed systems, API architecture, data structures, algorithms, and concurrency.',
    core_topics: ['Data Structures & Algorithms', 'System Design & Scalability', 'Databases & Indexing', 'Concurrency & Multithreading', 'REST & gRPC APIs'],
    salary_range: '$130k - $195k (₹18 - 36 LPA)',
    demand_trend: 'Stable',
    estimated_time: '8-10 weeks',
  },
  {
    id: 'track-fe-2',
    name: 'Frontend Engineer',
    category: 'standard',
    description: 'Master of browser rendering, modern JavaScript/TypeScript, reactive UI architectures, CSS layout engines, and web performance.',
    core_topics: ['DOM & Browser Internals', 'React Architecture & State', 'CSS Grid & Responsive Systems', 'Web Performance & Core Web Vitals', 'Accessibility (a11y) & WCAG'],
    salary_range: '$115k - $175k (₹15 - 30 LPA)',
    demand_trend: 'Stable',
    estimated_time: '6-8 weeks',
  },
  {
    id: 'track-fs-3',
    name: 'Full-Stack Developer',
    category: 'standard',
    description: 'Bridges client and server, crafting end-to-end applications from database models to responsive web experiences.',
    core_topics: ['Full-Stack System Architecture', 'API Design & Integration', 'State Management & Async Flows', 'Authentication & Web Security', 'Relational & NoSQL Databases'],
    salary_range: '$125k - $185k (₹16 - 32 LPA)',
    demand_trend: 'Stable',
    estimated_time: '8-10 weeks',
  },
  {
    id: 'track-da-4',
    name: 'Data Analyst',
    category: 'standard',
    description: 'Extracts strategic insights from raw data using SQL, statistical modeling, analytical dashboards, and business acumen.',
    core_topics: ['Advanced SQL & Aggregations', 'Descriptive & Inferential Statistics', 'Business Intelligence & Dashboards', 'Data Wrangling & Cleaning', 'A/B Testing & Metric Design'],
    salary_range: '$95k - $145k (₹12 - 24 LPA)',
    demand_trend: 'Stable',
    estimated_time: '6-8 weeks',
  },
  {
    id: 'track-devops-7',
    name: 'DevOps / Cloud Engineer',
    category: 'standard',
    description: 'Architects reliable cloud infrastructure, CI/CD pipelines, container orchestration, monitoring, and infrastructure-as-code.',
    core_topics: ['Docker & Containerization', 'Kubernetes Orchestration', 'CI/CD Pipeline Automation', 'Cloud Networking & VPCs', 'Observability, Logging & SRE'],
    salary_range: '$135k - $200k (₹18 - 38 LPA)',
    demand_trend: 'Stable',
    estimated_time: '8-10 weeks',
  },

  // Booming Roles (High-growth / Emerging Careers in 2025–2026)
  {
    id: 'track-ai-6',
    name: 'Generative AI & LLM Systems Architect',
    category: 'booming',
    description: 'Integrates large language models, agent workflows, vector embeddings, retrieval-augmented generation (RAG), and generative APIs.',
    core_topics: ['LLM Architectures & Transformers', 'Prompt Engineering & Structured Outputs', 'Vector Embeddings & RAG Systems', 'Agentic Workflows & Tool Calling', 'Evaluation & Guardrails'],
    salary_range: '$165k - $250k (₹28 - 55 LPA)',
    demand_trend: 'Rising',
    estimated_time: '6-8 weeks',
  },
  {
    id: 'track-agent-10',
    name: 'Agentic Systems & Automation Engineer',
    category: 'booming',
    description: 'Builds autonomous multi-agent swarms, MCP servers, browser agents, self-healing code executors, and memory architectures.',
    core_topics: ['Autonomous Agent Loops', 'Multi-Agent Collaboration & Swarms', 'Tool Calling & Model Context Protocols', 'Long-Term Memory & Knowledge Graphs', 'Sandboxed Code Execution'],
    salary_range: '$170k - $260k (₹30 - 60 LPA)',
    demand_trend: 'Rising',
    estimated_time: '6-8 weeks',
  },
  {
    id: 'track-ml-5',
    name: 'Data Scientist / ML Engineer',
    category: 'booming',
    description: 'Designs predictive models, statistical frameworks, training pipelines, and production inference systems.',
    core_topics: ['Supervised & Unsupervised Learning', 'Feature Engineering & Cross-Validation', 'Deep Learning Architectures', 'Model Evaluation & Loss Metrics', 'MLOps & Pipeline Deployment'],
    salary_range: '$145k - $220k (₹22 - 45 LPA)',
    demand_trend: 'Rising',
    estimated_time: '8-10 weeks',
  },
  {
    id: 'track-ai-sec-11',
    name: 'AI Security, Alignment & Safety Specialist',
    category: 'booming',
    description: 'Protects enterprise AI models against prompt injections, jailbreaks, data poisoning, privacy leakage, and hallucination exploits.',
    core_topics: ['Red-Teaming & Prompt Injection Defense', 'Model Alignment (RLHF / DPO)', 'Differential Privacy in AI', 'Adversarial Attacks on Neural Nets', 'Compliance & EU AI Act Guardrails'],
    salary_range: '$160k - $240k (₹26 - 52 LPA)',
    demand_trend: 'Rising',
    estimated_time: '6-8 weeks',
  },
  {
    id: 'track-edge-ai-12',
    name: 'Edge AI & Robotics Software Engineer',
    category: 'booming',
    description: 'Deploys quantized neural networks on edge hardware (Jetson, Coral, Apple Silicon), robotics perception, and real-time vision.',
    core_topics: ['Model Quantization (INT4/INT8/FP8)', 'TensorRT & ONNX Runtime', 'Edge Computer Vision & SLAM', 'Embedded Linux & ROS 2', 'Real-time Latency Optimization'],
    salary_range: '$150k - $230k (₹25 - 48 LPA)',
    demand_trend: 'Rising',
    estimated_time: '8-10 weeks',
  },
];

// Initialize real Supabase client if configured
let realClient: SupabaseClient | null = null;
if (isRealSupabaseConfigured) {
  try {
    realClient = createClient(envSupabaseUrl, envSupabaseAnonKey);
  } catch (err) {
    console.warn('[Supabase Init] Could not initialize real Supabase client:', err);
  }
}

export const supabase = realClient ?? (createClient('https://preview.supabase.co', 'preview-anon-key') as any);
