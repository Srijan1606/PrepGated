// ==============================================================================
// PrepGated - Comprehensive Domain Question Bank & Study Resources
// Multi-level (Beginner / Intermediate / Advanced), diverse question types,
// and verified official documentation resource links.
// ==============================================================================

export interface BankQuestion {
  id: string;
  track_id: string;
  skill_name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  question_type: 'mcq' | 'code' | 'scenario' | 'audio';
  prompt: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  sub_topic: string;
  resource_url: string;
  resource_label: string;
}

export interface OfficialStudyResource {
  skill_name: string;
  tier: 'Foundation' | 'Core' | 'Advanced';
  title: string;
  provider: string;
  url: string;
  description: string;
}

export const OFFICIAL_STUDY_MATERIALS: Record<string, OfficialStudyResource[]> = {
  'ml-data-scientist': [
    {
      skill_name: 'Python Programming',
      tier: 'Foundation',
      title: 'Official Python 3 Documentation & Tutorial',
      provider: 'Python Software Foundation',
      url: 'https://docs.python.org/3/tutorial/',
      description: 'Comprehensive official guide covering control flow, data structures, OOP, and standard libraries.',
    },
    {
      skill_name: 'Statistics & Probability',
      tier: 'Foundation',
      title: 'College Statistics and Probability',
      provider: 'Khan Academy',
      url: 'https://www.khanacademy.org/math/statistics-probability',
      description: 'Foundations of random variables, distributions, confidence intervals, and hypothesis testing.',
    },
    {
      skill_name: 'SQL & Databases',
      tier: 'Foundation',
      title: 'Interactive SQL Tutorial & Joins Drill',
      provider: 'SQLZoo',
      url: 'https://sqlzoo.net/wiki/SQL_Tutorial',
      description: 'Hands-on practice covering SELECT, GROUP BY, aggregations, and multi-table INNER/LEFT/OUTER JOINs.',
    },
    {
      skill_name: 'Data Wrangling (Pandas)',
      tier: 'Core',
      title: '10 Minutes to Pandas & User Guide',
      provider: 'Pandas Docs',
      url: 'https://pandas.pydata.org/docs/user_guide/10min.html',
      description: 'DataFrames, Series, missing data interpolation, groupby pivots, and indexing idioms.',
    },
    {
      skill_name: 'Machine Learning Basics',
      tier: 'Core',
      title: 'Scikit-Learn Supervised & Unsupervised Learning',
      provider: 'Scikit-Learn Docs',
      url: 'https://scikit-learn.org/stable/tutorial/index.html',
      description: 'Regression, classification, cross-validation, regularization (L1/L2), and evaluation metrics.',
    },
    {
      skill_name: 'Deep Learning & PyTorch',
      tier: 'Advanced',
      title: 'Deep Learning with PyTorch Official Tutorial',
      provider: 'PyTorch.org',
      url: 'https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html',
      description: 'Tensors, Autograd, neural networks, backpropagation, and loss optimizers (Adam, SGD).',
    },
    {
      skill_name: 'Model Deployment & MLOps',
      tier: 'Advanced',
      title: 'Production ML Pipelines & Serving',
      provider: 'Google Cloud ML Guides',
      url: 'https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning',
      description: 'Continuous training, model drift detection, Dockerized API inference, and low-latency serving.',
    },
  ],
  'full-stack-dev': [
    {
      skill_name: 'Modern JavaScript (ES6+)',
      tier: 'Foundation',
      title: 'JavaScript Guide & Modern Syntax',
      provider: 'MDN Web Docs',
      url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide',
      description: 'Closures, Event Loop, Promises, Async/Await, ES Modules, and prototype inheritance.',
    },
    {
      skill_name: 'TypeScript Core',
      tier: 'Foundation',
      title: 'The TypeScript Handbook',
      provider: 'Microsoft TypeScript',
      url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
      description: 'Generics, union types, interfaces, utility types, and structural type system semantics.',
    },
    {
      skill_name: 'React 19 & State Architecture',
      tier: 'Core',
      title: 'React Official Documentation',
      provider: 'React.dev',
      url: 'https://react.dev/learn',
      description: 'Hooks, Suspense, Concurrent mode, component lifecycles, and context optimization.',
    },
    {
      skill_name: 'Node.js & Express REST APIs',
      tier: 'Core',
      title: 'Node.js Architecture & Event Loop',
      provider: 'Nodejs.org Docs',
      url: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs',
      description: 'Non-blocking I/O, middleware pipelines, error handling, rate limiting, and JWT authentication.',
    },
    {
      skill_name: 'Relational Database Design & Postgres',
      tier: 'Core',
      title: 'PostgreSQL Manual & Indexing Guide',
      provider: 'PostgreSQL.org',
      url: 'https://www.postgresql.org/docs/current/tutorial.html',
      description: 'B-tree vs GIN indexes, query plans (EXPLAIN ANALYZE), ACID transactions, and normalization.',
    },
    {
      skill_name: 'Distributed Caching & Redis',
      tier: 'Advanced',
      title: 'Redis Patterns & Cache Strategies',
      provider: 'Redis University',
      url: 'https://redis.io/docs/latest/develop/use/',
      description: 'Cache-aside, write-through, cache stampede prevention, eviction policies, and pub/sub.',
    },
    {
      skill_name: 'System Design & Scalability',
      tier: 'Advanced',
      title: 'System Design Primer',
      provider: 'GitHub Open Source Architecture',
      url: 'https://github.com/donnemartin/system-design-primer',
      description: 'Load balancing, horizontal sharding, microservices communication, CAP theorem, and CDN caching.',
    },
  ],
  'cloud-devops': [
    {
      skill_name: 'Linux Shell & Bash Scripting',
      tier: 'Foundation',
      title: 'Linux Command Line Architecture',
      provider: 'The Linux Documentation Project',
      url: 'https://tldp.org/LDP/Bash-Beginners-Guide/html/',
      description: 'Process management, pipes, cron scheduling, permissions, signals, and automation scripting.',
    },
    {
      skill_name: 'Docker & Containerization',
      tier: 'Foundation',
      title: 'Docker Official Get Started Guide',
      provider: 'Docker Docs',
      url: 'https://docs.docker.com/get-started/',
      description: 'Multi-stage builds, layer caching, volume mounts, bridge networks, and security hardening.',
    },
    {
      skill_name: 'Kubernetes Orchestration',
      tier: 'Core',
      title: 'Kubernetes Official Concepts & Tutorials',
      provider: 'Kubernetes.io',
      url: 'https://kubernetes.io/docs/tutorials/',
      description: 'Pods, Deployments, ReplicaSets, Ingress controllers, Services, ConfigMaps, and Rolling updates.',
    },
    {
      skill_name: 'CI/CD & GitOps',
      tier: 'Core',
      title: 'GitHub Actions Continuous Integration',
      provider: 'GitHub Docs',
      url: 'https://docs.github.com/en/actions',
      description: 'Workflows, action matrix, secrets management, artifact retention, and automated deployment pipelines.',
    },
    {
      skill_name: 'Infrastructure as Code (Terraform)',
      tier: 'Advanced',
      title: 'HashiCorp Terraform Tutorials',
      provider: 'HashiCorp Developer',
      url: 'https://developer.hashicorp.com/terraform/tutorials',
      description: 'State management, modules, declarative HCL, resource dependencies, and cloud provisioning.',
    },
  ],
};

export const DOMAIN_QUESTION_BANK: BankQuestion[] = [
  // ----------------------------------------------------------------------------
  // Track 1: ML / Data Scientist - Beginner
  // ----------------------------------------------------------------------------
  {
    id: 'ml-b-1',
    track_id: 'ml-data-scientist',
    skill_name: 'Python Programming',
    level: 'Beginner',
    question_type: 'mcq',
    prompt: 'In Python, what is the key difference between a list and a tuple in memory and syntax?',
    options: [
      'Lists are mutable and enclosed in [], tuples are immutable and enclosed in ()',
      'Lists are immutable and enclosed in (), tuples are mutable and enclosed in []',
      'Tuples can store only numeric values while lists store any data type',
      'Lists allocate static contiguous blocks whereas tuples use dynamic pointers',
    ],
    correct_answer: 'Lists are mutable and enclosed in [], tuples are immutable and enclosed in ()',
    explanation: 'Lists can be mutated in-place with append/extend, whereas tuples cannot be altered after instantiation, making tuples hashable as dictionary keys.',
    sub_topic: 'Python Data Structures',
    resource_url: 'https://docs.python.org/3/tutorial/datastructures.html',
    resource_label: 'Python Docs - Data Structures',
  },
  {
    id: 'ml-b-2',
    track_id: 'ml-data-scientist',
    skill_name: 'SQL & Databases',
    level: 'Beginner',
    question_type: 'mcq',
    prompt: 'What does an INNER JOIN between table A and table B return in relational databases?',
    options: [
      'Only the rows that have matching values in both tables based on the join predicate',
      'All rows from table A and only matching rows from table B',
      'All rows from both tables, filling unmatched columns with NULLs',
      'The Cartesian cross-product of all rows regardless of key matching',
    ],
    correct_answer: 'Only the rows that have matching values in both tables based on the join predicate',
    explanation: 'An INNER JOIN filters for intersections, keeping only records where the specified matching keys exist in both relational datasets.',
    sub_topic: 'SQL JOIN Types',
    resource_url: 'https://sqlzoo.net/wiki/The_JOIN_operation',
    resource_label: 'SQLZoo - The JOIN Operation',
  },
  {
    id: 'ml-b-3',
    track_id: 'ml-data-scientist',
    skill_name: 'Statistics & Probability',
    level: 'Beginner',
    question_type: 'mcq',
    prompt: 'When analyzing a dataset with extreme positive outliers (e.g. software engineer compensation), which measure of central tendency is most robust?',
    options: [
      'Median, because it relies on ranking position rather than algebraic sums',
      'Arithmetic Mean, because it incorporates all data points equally',
      'Mode, because it identifies the highest peak frequency',
      'Standard deviation, because it scales with variance',
    ],
    correct_answer: 'Median, because it relies on ranking position rather than algebraic sums',
    explanation: 'The median represents the 50th percentile and is resilient to skewness and extreme outliers, unlike the mean which is pulled toward the long tail.',
    sub_topic: 'Central Tendency & Outliers',
    resource_url: 'https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data',
    resource_label: 'Khan Academy - Summarizing Data',
  },
  {
    id: 'ml-b-4',
    track_id: 'ml-data-scientist',
    skill_name: 'Python Programming',
    level: 'Beginner',
    question_type: 'mcq',
    prompt: 'Which Python standard library function returns an iterator of paired elements from multiple sequences?',
    options: [
      'zip()',
      'enumerate()',
      'map()',
      'filter()',
    ],
    correct_answer: 'zip()',
    explanation: 'zip() takes multiple iterables and yields tuples grouping elements with corresponding indices until the shortest iterable is exhausted.',
    sub_topic: 'Python Built-in Iterators',
    resource_url: 'https://docs.python.org/3/library/functions.html#zip',
    resource_label: 'Python Docs - Built-in zip()',
  },
  {
    id: 'ml-b-5',
    track_id: 'ml-data-scientist',
    skill_name: 'Data Wrangling (Pandas)',
    level: 'Beginner',
    question_type: 'mcq',
    prompt: 'In Pandas, which method is used to filter out rows containing missing or NaN values?',
    options: [
      'df.dropna()',
      'df.fillna()',
      'df.isnull()',
      'df.filter()',
    ],
    correct_answer: 'df.dropna()',
    explanation: 'dropna() removes missing values along the specified axis (default rows axis=0), leaving only complete observations.',
    sub_topic: 'Handling Missing Data in Pandas',
    resource_url: 'https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.dropna.html',
    resource_label: 'Pandas Docs - dropna',
  },

  // ----------------------------------------------------------------------------
  // Track 1: ML / Data Scientist - Intermediate
  // ----------------------------------------------------------------------------
  {
    id: 'ml-i-1',
    track_id: 'ml-data-scientist',
    skill_name: 'Machine Learning Basics',
    level: 'Intermediate',
    question_type: 'mcq',
    prompt: 'When a model exhibits very low training loss but high validation loss, which phenomenon is occurring and how do you resolve it?',
    options: [
      'Overfitting (High Variance); introduce L1/L2 regularization, dropout, or collect more data',
      'Underfitting (High Bias); increase model parameter capacity and decrease regularization',
      'Data leakage; remove validation features from the test pipeline',
      'Vanishing gradient; switch activation functions from ReLU to Sigmoid',
    ],
    correct_answer: 'Overfitting (High Variance); introduce L1/L2 regularization, dropout, or collect more data',
    explanation: 'Overfitting happens when a high-capacity model memorizes noise in training samples. Regularization penalizes large weight coefficients to force generalization.',
    sub_topic: 'Bias-Variance Tradeoff & Regularization',
    resource_url: 'https://scikit-learn.org/stable/modules/linear_model.html#ridge-regression-and-classification',
    resource_label: 'Scikit-Learn - Regularization & Ridge',
  },
  {
    id: 'ml-i-2',
    track_id: 'ml-data-scientist',
    skill_name: 'Machine Learning Basics',
    level: 'Intermediate',
    question_type: 'mcq',
    prompt: 'In highly imbalanced binary classification (e.g. fraud detection with 99.8% non-fraud), why is raw classification accuracy misleading?',
    options: [
      'A trivial classifier predicting majority class achieves 99.8% accuracy while catching zero fraud cases; use Precision, Recall, and PR-AUC instead',
      'Accuracy cannot be calculated on binary labels without multiclass one-vs-rest transformation',
      'Accuracy produces infinite loss values under cross-entropy evaluation',
      'Imbalanced datasets invert true positives into false negatives mathematically',
    ],
    correct_answer: 'A trivial classifier predicting majority class achieves 99.8% accuracy while catching zero fraud cases; use Precision, Recall, and PR-AUC instead',
    explanation: 'When minority classes are rare, accuracy masks total failure on the class of interest. Precision (avoiding false alarms) and Recall (catching all fraud) are essential.',
    sub_topic: 'Model Evaluation on Imbalanced Data',
    resource_url: 'https://scikit-learn.org/stable/modules/model_evaluation.html#precision-recall-f-measure-metrics',
    resource_label: 'Scikit-Learn - Evaluation Metrics',
  },
  {
    id: 'ml-i-3',
    track_id: 'ml-data-scientist',
    skill_name: 'SQL & Databases',
    level: 'Intermediate',
    question_type: 'mcq',
    prompt: 'Which SQL Window function assigns unique sequential integer rankings to rows within a partition without skipping numbers on ties?',
    options: [
      'ROW_NUMBER()',
      'RANK()',
      'DENSE_RANK()',
      'NTILE()',
    ],
    correct_answer: 'ROW_NUMBER()',
    explanation: 'ROW_NUMBER() gives unique incremental integers (1, 2, 3...) regardless of identical values. RANK() leaves gaps after ties, and DENSE_RANK() assigns identical ranks without gaps.',
    sub_topic: 'SQL Window Functions',
    resource_url: 'https://www.postgresql.org/docs/current/tutorial-window.html',
    resource_label: 'Postgres Docs - Window Functions',
  },
  {
    id: 'ml-i-4',
    track_id: 'ml-data-scientist',
    skill_name: 'Machine Learning Basics',
    level: 'Intermediate',
    question_type: 'mcq',
    prompt: 'How does Random Forest reduce prediction variance compared to an individual Decision Tree?',
    options: [
      'By training trees on bootstrapped subsets (bagging) with random feature selection and averaging predictions',
      'By sequentially fitting each tree to the gradient residuals of previous trees',
      'By pruning the depth of the single tree using cost-complexity alpha penalties',
      'By converting continuous features into orthogonal Fourier representations',
    ],
    correct_answer: 'By training trees on bootstrapped subsets (bagging) with random feature selection and averaging predictions',
    explanation: 'Bagging and feature subsampling decorrelate individual trees. Averaging uncorrelated predictions drastically lowers variance while preserving low bias.',
    sub_topic: 'Ensemble Learning & Bagging',
    resource_url: 'https://scikit-learn.org/stable/modules/ensemble.html#forest',
    resource_label: 'Scikit-Learn - Forest Classifiers',
  },
  {
    id: 'ml-i-5',
    track_id: 'ml-data-scientist',
    skill_name: 'Statistics & Probability',
    level: 'Intermediate',
    question_type: 'mcq',
    prompt: 'According to the Central Limit Theorem (CLT), what happens to the sampling distribution of the sample mean as sample size n increases?',
    options: [
      'It approaches a normal distribution regardless of the underlying population distribution, provided variance is finite',
      'It perfectly mirrors the exact skew and kurtosis of the underlying population distribution',
      'Its variance increases proportionally to the square root of n',
      'It collapses into a discrete uniform distribution',
    ],
    correct_answer: 'It approaches a normal distribution regardless of the underlying population distribution, provided variance is finite',
    explanation: 'The Central Limit Theorem guarantees that independent sample sums and averages asymptotically converge to normal distributions with standard error = sigma / sqrt(n).',
    sub_topic: 'Central Limit Theorem & Sampling',
    resource_url: 'https://www.khanacademy.org/math/statistics-probability/sampling-distributions-library/sample-means/v/central-limit-theorem',
    resource_label: 'Khan Academy - Central Limit Theorem',
  },

  // ----------------------------------------------------------------------------
  // Track 1: ML / Data Scientist - Advanced
  // ----------------------------------------------------------------------------
  {
    id: 'ml-a-1',
    track_id: 'ml-data-scientist',
    skill_name: 'Deep Learning & PyTorch',
    level: 'Advanced',
    question_type: 'mcq',
    prompt: 'In the Transformer architecture, what is the computational and memory complexity of the standard Scaled Dot-Product Self-Attention mechanism with respect to sequence length N?',
    options: [
      'O(N^2) in both time and memory due to the full N x N pairwise query-key matrix multiplication',
      'O(N log N) through recursive Fast Fourier Transforms',
      'O(N) linear complexity because attention weights are computed sequentially',
      'O(d^2) where complexity depends solely on embedding dimension d independent of token count',
    ],
    correct_answer: 'O(N^2) in both time and memory due to the full N x N pairwise query-key matrix multiplication',
    explanation: 'Calculating Q * K^T produces an N x N matrix of attention logits, creating quadratic scaling O(N^2). FlashAttention and linear attention architectures mitigate memory IO bottlenecks.',
    sub_topic: 'Transformer Attention Complexity',
    resource_url: 'https://pytorch.org/tutorials/beginner/transformer_tutorial.html',
    resource_label: 'PyTorch Docs - Sequence-to-Sequence Modeling',
  },
  {
    id: 'ml-a-2',
    track_id: 'ml-data-scientist',
    skill_name: 'Model Deployment & MLOps',
    level: 'Advanced',
    question_type: 'mcq',
    prompt: 'When deploying a real-time computer vision or LLM inference API, which technique avoids cold start latency spikes under fluctuating traffic?',
    options: [
      'Configuring minimum pre-warmed replica pods, dynamic batching, and model quantization (e.g. INT8 / FP8)',
      'Running models directly from object storage buckets on every HTTP request',
      'Switching from asynchronous event loops to synchronous single-thread blocking calls',
      'Increasing max output tokens to maximum context length on all requests',
    ],
    correct_answer: 'Configuring minimum pre-warmed replica pods, dynamic batching, and model quantization (e.g. INT8 / FP8)',
    explanation: 'Keeping warm GPU/CPU pods eliminates heavy model initialization latencies. Quantization halves memory bandwidth requirements, and dynamic batching maximizes GPU tensor core utilization.',
    sub_topic: 'Production ML Serving & Low-Latency Inference',
    resource_url: 'https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning',
    resource_label: 'Google Cloud - MLOps Continuous Delivery',
  },

  // ----------------------------------------------------------------------------
  // Track 2: Full Stack Developer - Beginner
  // ----------------------------------------------------------------------------
  {
    id: 'fs-b-1',
    track_id: 'full-stack-dev',
    skill_name: 'Modern JavaScript (ES6+)',
    level: 'Beginner',
    question_type: 'mcq',
    prompt: 'What will console.log(typeof null) output in modern JavaScript, and why?',
    options: [
      '"object", due to a legacy bug in the initial JavaScript implementation where type tags for objects were 0',
      '"null", because null is a distinct primitive data type',
      '"undefined", because null represents uninitialized references',
      '"boolean", as null evaluates to false in truthy checks',
    ],
    correct_answer: '"object", due to a legacy bug in the initial JavaScript implementation where type tags for objects were 0',
    explanation: 'In the original JS engine, values were stored in 32-bit units with a type tag. 000 was object, and null was represented as the NULL pointer (0x00), triggering the typeof "object" bug which persists for web compatibility.',
    sub_topic: 'JavaScript Primitive Types & Runtime',
    resource_url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof#typeof_null',
    resource_label: 'MDN - typeof null',
  },
  {
    id: 'fs-b-2',
    track_id: 'full-stack-dev',
    skill_name: 'React 19 & State Architecture',
    level: 'Beginner',
    question_type: 'mcq',
    prompt: 'In React, why must state updates never directly mutate state objects (e.g. state.count = 5)?',
    options: [
      'React uses shallow reference equality (Object.is) to detect changes and trigger virtual DOM re-renders',
      'Direct mutations throw uncaught TypeError exceptions in modern browsers',
      'React state properties are strictly frozen with Object.freeze() at build time',
      'Mutations disable JavaScript garbage collection across component trees',
    ],
    correct_answer: 'React uses shallow reference equality (Object.is) to detect changes and trigger virtual DOM re-renders',
    explanation: 'If the reference does not change, React assumes nothing has changed and skips the re-render. Always return new references using spread operators or updater functions.',
    sub_topic: 'React Immutability & Re-renders',
    resource_url: 'https://react.dev/learn/updating-objects-in-state',
    resource_label: 'React Docs - Updating Objects in State',
  },
  {
    id: 'fs-b-3',
    track_id: 'full-stack-dev',
    skill_name: 'TypeScript Core',
    level: 'Beginner',
    question_type: 'mcq',
    prompt: 'In TypeScript, what is the key difference between type "any" and type "unknown"?',
    options: [
      '"unknown" is type-safe; operations cannot be performed on an unknown value until type narrowing or assertions occur, whereas "any" bypasses all type checking',
      '"any" can only accept objects while "unknown" accepts primitives',
      '"unknown" is deprecated in modern TypeScript compilers in favor of "any"',
      '"any" requires explicit runtime validation whereas "unknown" compiles to void',
    ],
    correct_answer: '"unknown" is type-safe; operations cannot be performed on an unknown value until type narrowing or assertions occur, whereas "any" bypasses all type checking',
    explanation: '`unknown` represents any value but forces the developer to check types (via typeof, instanceof, or custom guards) before accessing properties or invoking methods.',
    sub_topic: 'TypeScript Type System & Safety',
    resource_url: 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html',
    resource_label: 'TypeScript Handbook - Type Narrowing',
  },
  {
    id: 'fs-b-4',
    track_id: 'full-stack-dev',
    skill_name: 'Node.js & Express REST APIs',
    level: 'Beginner',
    question_type: 'mcq',
    prompt: 'In Express middleware functions, what happens if neither next() is called nor a response (res.send/res.json) is returned?',
    options: [
      'The client request hangs indefinitely until a gateway or client timeout triggers',
      'Express automatically returns HTTP 200 OK with empty body',
      'The Node process immediately crashes with an unhandled rejection',
      'Express reroutes the request to the static file server',
    ],
    correct_answer: 'The client request hangs indefinitely until a gateway or client timeout triggers',
    explanation: 'Express middleware chains rely on explicit progression. If you do not call next() or terminate the connection with res.end()/res.json(), the socket remains open waiting for a response.',
    sub_topic: 'Express Middleware Lifecycle',
    resource_url: 'https://expressjs.com/en/guide/using-middleware.html',
    resource_label: 'Express Docs - Using Middleware',
  },
  {
    id: 'fs-b-5',
    track_id: 'full-stack-dev',
    skill_name: 'Relational Database Design & Postgres',
    level: 'Beginner',
    question_type: 'mcq',
    prompt: 'What is the purpose of a FOREIGN KEY constraint in relational databases?',
    options: [
      'Enforces referential integrity by ensuring child row values correspond to valid parent row primary keys',
      'Encrypts columns containing personally identifiable user credentials',
      'Automatically builds full-text search dictionaries across multiple schemas',
      'Generates unique UUID v4 strings for each new inserted row',
    ],
    correct_answer: 'Enforces referential integrity by ensuring child row values correspond to valid parent row primary keys',
    explanation: 'Foreign keys prevent orphan records and maintain database consistency by guaranteeing that linked relationships between tables remain valid.',
    sub_topic: 'Database Referential Integrity & Constraints',
    resource_url: 'https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK',
    resource_label: 'PostgreSQL Docs - Foreign Keys',
  },

  // ----------------------------------------------------------------------------
  // Track 2: Full Stack Developer - Intermediate
  // ----------------------------------------------------------------------------
  {
    id: 'fs-i-1',
    track_id: 'full-stack-dev',
    skill_name: 'Modern JavaScript (ES6+)',
    level: 'Intermediate',
    question_type: 'mcq',
    prompt: 'In the JavaScript Event Loop, what is the order of execution between Microtasks (Promise.then, queueMicrotask) and Macrotasks (setTimeout, setInterval)?',
    options: [
      'All pending microtasks are drained to completion immediately after each synchronous task and before the next macrotask is processed',
      'Macrotasks execute first, followed by microtasks only when the call stack has been empty for >10ms',
      'Microtasks and macrotasks are processed concurrently using Web Worker threads',
      'The browser alternates strictly 1-for-1 between microtask queues and macrotask queues',
    ],
    correct_answer: 'All pending microtasks are drained to completion immediately after each synchronous task and before the next macrotask is processed',
    explanation: 'Microtasks have priority. After the current synchronous call stack clears, the microtask queue empties completely before the event loop advances to render steps or the next macrotask.',
    sub_topic: 'Event Loop & Microtask Queue Priority',
    resource_url: 'https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide',
    resource_label: 'MDN - Microtasks & Event Loop',
  },
  {
    id: 'fs-i-2',
    track_id: 'full-stack-dev',
    skill_name: 'Distributed Caching & Redis',
    level: 'Intermediate',
    question_type: 'mcq',
    prompt: 'What is a "Cache Stampede" (Thundering Herd) in high-traffic applications, and how is it mitigated?',
    options: [
      'When a popular cache key expires and concurrent requests simultaneously query the primary database; mitigate with mutex locks, probabilistic early expiration (XFetch), or background refresh',
      'When Redis runs out of memory and crashes all cluster worker nodes simultaneously',
      'When client browser caches refuse to invalidate HTTP ETag headers',
      'When DNS propagation delays send traffic to decommissioned cache replicas',
    ],
    correct_answer: 'When a popular cache key expires and concurrent requests simultaneously query the primary database; mitigate with mutex locks, probabilistic early expiration (XFetch), or background refresh',
    explanation: 'A cache stampede causes massive DB CPU spikes as thousands of threads try to recompute the same expired key. Distributed locks or probabilistic recomputation prevents multiple duplicate DB calls.',
    sub_topic: 'Cache Invalidation & Thundering Herd',
    resource_url: 'https://redis.io/docs/latest/develop/use/patterns/',
    resource_label: 'Redis Docs - Caching Patterns',
  },
  {
    id: 'fs-i-3',
    track_id: 'full-stack-dev',
    skill_name: 'Relational Database Design & Postgres',
    level: 'Intermediate',
    question_type: 'mcq',
    prompt: 'Why would a PostgreSQL query planner execute a Sequential Scan instead of using an existing B-Tree Index on a column?',
    options: [
      'The table has very few rows, or the query condition matches a large percentage (>15-20%) of total table rows, making random index lookups more expensive than sequential disk reads',
      'Postgres requires manual cache flushing before indexes can be read',
      'B-Tree indexes cannot index string VARCHAR fields',
      'Postgres only supports indexes when queries contain explicit ORDER BY DESC clauses',
    ],
    correct_answer: 'The table has very few rows, or the query condition matches a large percentage (>15-20%) of total table rows, making random index lookups more expensive than sequential disk reads',
    explanation: 'Sequential reads are fast on modern NVMe drives. If a large portion of the table matches, seeking through the index tree plus fetching table heap pages takes more total IO than reading consecutive blocks.',
    sub_topic: 'Postgres Query Planner & Index Optimization',
    resource_url: 'https://www.postgresql.org/docs/current/using-explain.html',
    resource_label: 'PostgreSQL - EXPLAIN & Query Planning',
  },

  // ----------------------------------------------------------------------------
  // Track 2: Full Stack Developer - Advanced
  // ----------------------------------------------------------------------------
  {
    id: 'fs-a-1',
    track_id: 'full-stack-dev',
    skill_name: 'System Design & Scalability',
    level: 'Advanced',
    question_type: 'mcq',
    prompt: 'When designing idempotent REST APIs for financial payments, which architecture pattern ensures network retries never double-charge a customer?',
    options: [
      'Requiring an Idempotency-Key header stored with transaction status in an ACID database with unique constraints',
      'Relying on HTTP keep-alive timeouts to disconnect failed requests',
      'Using HTTP GET methods for payment authorization',
      'Limiting API clients to exactly 1 request per 24 hours via rate limiting',
    ],
    correct_answer: 'Requiring an Idempotency-Key header stored with transaction status in an ACID database with unique constraints',
    explanation: 'The client sends a UUID idempotency key. The server stores this key before processing. If a retry arrives with the same key, the server returns the cached response rather than creating a duplicate transaction.',
    sub_topic: 'API Idempotency & Distributed Transactions',
    resource_url: 'https://github.com/donnemartin/system-design-primer#idempotent',
    resource_label: 'System Design Primer - Idempotency',
  },
  {
    id: 'fs-a-2',
    track_id: 'full-stack-dev',
    skill_name: 'System Design & Scalability',
    level: 'Advanced',
    question_type: 'mcq',
    prompt: 'In distributed microservices, how does the Outbox Pattern guarantee data consistency between relational databases and message brokers (e.g. Kafka)?',
    options: [
      'Writes the domain change and an outbox event inside the same database transaction; an asynchronous worker polls the outbox and publishes to the broker',
      'Uses two-phase commit (2PC) distributed locks across network boundaries',
      'Publishes to Kafka first and rolls back the database if the network drops',
      'Duplicates database tables into Redis memory buffers on every write',
    ],
    correct_answer: 'Writes the domain change and an outbox event inside the same database transaction; an asynchronous worker polls the outbox and publishes to the broker',
    explanation: 'Dual writes directly to DB and Kafka risk partial failure. The Transactional Outbox pattern guarantees at-least-once message delivery by making event publishing part of the DB commit.',
    sub_topic: 'Transactional Outbox Pattern & Event Sourcing',
    resource_url: 'https://microservices.io/patterns/data/transactional-outbox.html',
    resource_label: 'Microservices.io - Transactional Outbox',
  },

  // ----------------------------------------------------------------------------
  // Track 3: Cloud / DevOps - Beginner to Advanced
  // ----------------------------------------------------------------------------
  {
    id: 'devops-b-1',
    track_id: 'cloud-devops',
    skill_name: 'Docker & Containerization',
    level: 'Beginner',
    question_type: 'mcq',
    prompt: 'Why are Multi-Stage Docker builds considered an essential production best practice?',
    options: [
      'They separate compilation tools and SDKs from the final runtime image, resulting in dramatically smaller and more secure images',
      'They allow containers to bypass Docker daemon root permissions entirely',
      'They eliminate the need to write Dockerfiles by compiling binaries directly from git tags',
      'They automatically provision cloud Kubernetes clusters on build',
    ],
    correct_answer: 'They separate compilation tools and SDKs from the final runtime image, resulting in dramatically smaller and more secure images',
    explanation: 'Multi-stage builds use heavy compiler toolchains in stage 1, then copy only the compiled executable or artifact into a minimal alpine/scratch base image in stage 2.',
    sub_topic: 'Multi-stage Docker Builds & Security',
    resource_url: 'https://docs.docker.com/build/building/multi-stage/',
    resource_label: 'Docker Docs - Multi-stage Builds',
  },
  {
    id: 'devops-i-1',
    track_id: 'cloud-devops',
    skill_name: 'Kubernetes Orchestration',
    level: 'Intermediate',
    question_type: 'mcq',
    prompt: 'In Kubernetes, what is the critical difference between a Liveness Probe and a Readiness Probe?',
    options: [
      'Liveness probe restarts a failed container; Readiness probe controls whether traffic is routed to the Pod via Service endpoints',
      'Liveness probe checks CPU utilization; Readiness probe checks available memory',
      'Readiness probe runs once on startup; Liveness probe never runs after container initialization',
      'Liveness probe is for StatefulSets only; Readiness probe is for DaemonSets only',
    ],
    correct_answer: 'Liveness probe restarts a failed container; Readiness probe controls whether traffic is routed to the Pod via Service endpoints',
    explanation: 'If a liveness probe fails, kubelet kills and restarts the container. If a readiness probe fails, the pod is temporarily removed from service endpoints so clients do not receive 502/504 errors while it warms up.',
    sub_topic: 'Kubernetes Health Probes & High Availability',
    resource_url: 'https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/',
    resource_label: 'Kubernetes Docs - Pod Health Probes',
  },
  {
    id: 'devops-a-1',
    track_id: 'cloud-devops',
    skill_name: 'Infrastructure as Code (Terraform)',
    level: 'Advanced',
    question_type: 'mcq',
    prompt: 'Why must the Terraform State file (terraform.tfstate) be stored remotely with state locking (e.g. AWS S3 + DynamoDB or Terraform Cloud)?',
    options: [
      'To prevent concurrent team deployments from creating race conditions and state corruption, and to keep sensitive resource metadata securely encrypted',
      'Because Terraform CLI cannot execute on local machines without a remote network connection',
      'Remote state files compile HCL code into native C++ binaries',
      'To avoid exceeding local disk quotas during provider downloads',
    ],
    correct_answer: 'To prevent concurrent team deployments from creating race conditions and state corruption, and to keep sensitive resource metadata securely encrypted',
    explanation: 'State locking prevents two engineers or CI pipelines from running `terraform apply` concurrently, which would overwrite state records and cause ghost cloud resources.',
    sub_topic: 'Terraform Remote State & Distributed Locking',
    resource_url: 'https://developer.hashicorp.com/terraform/language/state/remote',
    resource_label: 'HashiCorp Terraform - Remote State',
  },
];

// Helper to get questions for track and level (minimum 5, up to 10 questions)
export function getDomainQuestions(trackId: string, level: 'Beginner' | 'Intermediate' | 'Advanced', limit = 5): BankQuestion[] {
  const normalized = trackId.toLowerCase();
  let matched = DOMAIN_QUESTION_BANK.filter(
    (q) => q.level.toLowerCase() === level.toLowerCase() && (q.track_id.includes(normalized) || normalized.includes(q.track_id))
  );

  // If matched questions are fewer than limit, include relevant level questions from other tracks
  if (matched.length < limit) {
    const additional = DOMAIN_QUESTION_BANK.filter((q) => q.level.toLowerCase() === level.toLowerCase() && !matched.includes(q));
    matched = [...matched, ...additional];
  }

  // Shuffle and slice to ensure fresh questions
  const shuffled = [...matched].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.max(limit, Math.min(10, shuffled.length)));
}
