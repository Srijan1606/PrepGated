// ==============================================================================
// PrepGated - Multi-Type Adaptive Level Question Bank & Generator
// Provides diverse question types for every level (Beginner, Intermediate, Advanced, Expert):
// - 'mcq': Conceptual & Architectural Fundamentals
// - 'code_analysis': Code Snippet Bug Spotting, Concurrency, and Time Complexity
// - 'scenario': Production Incident Triage & System Architecture Failure
// - 'numerical_estimate': Quantitative Metrics, Cache Hit Rates & Algorithmic Bounds
// Includes direct official study material links and precise mistake diagnostics.
// Guarantees at least 5 non-repeating questions on each test attempt.
// ==============================================================================

import { getStudyMaterialsForTopic } from './officialStudyMaterials';

export type AdaptiveQuestionType = 'mcq' | 'code_analysis' | 'scenario' | 'numerical_estimate';

export interface LevelQuestionOption {
  id: string; // 'A', 'B', 'C', 'D'
  text: string;
}

export interface AdaptiveLevelQuestion {
  id: string;
  topicTag: string; // 'python' | 'sql' | 'dsa' | 'dbms' | 'cloud' | 'embedded' | 'aiml' | 'concurrency' | 'cache' | 'security' | 'api' | 'distributed' | 'general'
  type: AdaptiveQuestionType;
  typeLabel: string;
  level: number; // 1: Beginner, 2: Intermediate, 3: Advanced, 4: Expert
  levelName: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  prompt: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  options: LevelQuestionOption[];
  correct: string; // 'A' | 'B' | 'C' | 'D'
  explanation: string;
  mistakeDiagnostic: string; // Explicit breakdown of where the student went wrong and what concept was missed
  officialDocLink: {
    title: string;
    url: string;
    source: string;
  };
}

export const COMPREHENSIVE_LEVEL_QUESTIONS: AdaptiveLevelQuestion[] = [
  // ============================================================================
  // LEVEL 1: BEGINNER (Foundations, Syntax, SQL, Python, DSA, Embedded, Cloud, AI)
  // ============================================================================

  // --- Python Beginner ---
  {
    id: 'b-py-1',
    topicTag: 'python',
    type: 'code_analysis',
    typeLabel: 'Python List Membership Bug',
    level: 1,
    levelName: 'Beginner',
    prompt: 'Examine this deduplication function in Python. What is the time complexity and primary algorithmic bottleneck?',
    codeSnippet: {
      language: 'python',
      code: `def has_duplicates(records: list[str]) -> bool:\n    seen = []\n    for item in records:\n        if item in seen:\n            return True\n        seen.append(item)\n    return False`
    },
    options: [
      { id: 'A', text: 'O(N) time complexity because the single for-loop iterates once over the records list' },
      { id: 'B', text: 'O(N^2) time complexity because `item in seen` performs an O(N) linear scan on a Python list for every iteration' },
      { id: 'C', text: 'O(log N) because append maintains an internally sorted binary search array' },
      { id: 'D', text: 'Runtime IndexError when records contains an empty string element' }
    ],
    correct: 'B',
    explanation: 'In Python, checking `item in list` is an O(N) linear scan. When placed inside a loop of size N, the entire algorithm degrades to O(N^2). Replacing `seen = []` with a hash `set()` drops lookup to O(1) and total runtime to O(N).',
    mistakeDiagnostic: 'Mistake: Confusing loop count with overall operation cost. Checking membership in a list requires scanning every item. Review hash sets vs linear arrays in Python docs.',
    officialDocLink: {
      title: 'Python Official Docs: Data Structures & Set Operations',
      url: 'https://docs.python.org/3/tutorial/datastructures.html',
      source: 'Python Software Foundation'
    }
  },
  {
    id: 'b-py-2',
    topicTag: 'python',
    type: 'mcq',
    typeLabel: 'Python Mutable Default Arguments',
    level: 1,
    levelName: 'Beginner',
    prompt: 'What happens in Python when a mutable object (such as a list or dictionary) is used as a default parameter value in a function definition?',
    codeSnippet: {
      language: 'python',
      code: `def append_val(val, target_list=[]):\n    target_list.append(val)\n    return target_list\n\nprint(append_val(1))\nprint(append_val(2))`
    },
    options: [
      { id: 'A', text: 'It creates a fresh empty list on every call, printing `[1]` then `[2]`' },
      { id: 'B', text: 'Default arguments are evaluated once at function definition time, so state persists across calls, printing `[1]` then `[1, 2]`' },
      { id: 'C', text: 'Python raises a static SyntaxError preventing mutable defaults' },
      { id: 'D', text: 'It raises a TypeError when calling append on an uninitialized list' }
    ],
    correct: 'B',
    explanation: 'In Python, function default arguments are evaluated only once when the `def` statement executes. A mutable default like `[]` is shared across all invocations that do not explicitly supply an argument. The idiomatic fix is `target_list=None`.',
    mistakeDiagnostic: 'Mistake: Assuming function arguments reset automatically per call. In Python, default parameter objects are instantiated at definition time.',
    officialDocLink: {
      title: 'Python Official Tutorial: Default Argument Values',
      url: 'https://docs.python.org/3/tutorial/controlflow.html#default-argument-values',
      source: 'Python Software Foundation'
    }
  },
  {
    id: 'b-py-3',
    topicTag: 'python',
    type: 'code_analysis',
    typeLabel: 'Python List Slicing Mechanics',
    level: 1,
    levelName: 'Beginner',
    prompt: 'What is the output and memory behavior of this Python slice operation?',
    codeSnippet: {
      language: 'python',
      code: `nums = [10, 20, 30, 40, 50]\nsub = nums[1:4]\nrev = nums[::-1]`
    },
    options: [
      { id: 'A', text: '`sub` is `[20, 30, 40]` and `rev` is `[50, 40, 30, 20, 10]`; both create shallow copies without modifying `nums`' },
      { id: 'B', text: '`sub` is `[20, 30, 40, 50]` because indices are inclusive on both ends' },
      { id: 'C', text: '`rev` in-place reverses the original list `nums` without creating a new list' },
      { id: 'D', text: 'Raises IndexError because negative step `-1` is invalid in slice syntax' }
    ],
    correct: 'A',
    explanation: 'Python slicing uses a half-open interval `[start, stop)`. Thus `nums[1:4]` takes indices 1, 2, and 3 (`[20, 30, 40]`). Slicing with `[::-1]` returns a new reversed shallow copy, leaving the original `nums` list unchanged.',
    mistakeDiagnostic: 'Mistake: Believing Python slice indices are inclusive of the upper bound, or thinking slice reversal mutates in-place (use `list.reverse()` for in-place).',
    officialDocLink: {
      title: 'Python Documentation: Sequence Types & Slicing',
      url: 'https://docs.python.org/3/library/stdtypes.html#typesseq',
      source: 'Python Software Foundation'
    }
  },
  {
    id: 'b-py-4',
    topicTag: 'python',
    type: 'mcq',
    typeLabel: 'Python Dictionary Keys & Hashability',
    level: 1,
    levelName: 'Beginner',
    prompt: 'Which of the following objects CANNOT be used as a key in a Python dictionary?',
    options: [
      { id: 'A', text: 'A tuple of strings: `("role", "admin")`' },
      { id: 'B', text: 'A list of integers: `[1, 2, 3]`' },
      { id: 'C', text: 'A frozen set: `frozenset([1, 2])`' },
      { id: 'D', text: 'An integer constant: `404`' }
    ],
    correct: 'B',
    explanation: 'Dictionary keys in Python must be hashable and immutable (they must implement `__hash__` and maintain an unchanging hash over their lifetime). Lists are mutable and unhashable, raising `TypeError: unhashable type: list`.',
    mistakeDiagnostic: 'Mistake: Forgetting that lists are mutable. Only immutable types (strings, numbers, tuples with immutable contents, frozensets) can serve as dictionary keys.',
    officialDocLink: {
      title: 'Python Glossary: Hashable & Dictionary Keys',
      url: 'https://docs.python.org/3/glossary.html#term-hashable',
      source: 'Python Software Foundation'
    }
  },
  {
    id: 'b-py-5',
    topicTag: 'python',
    type: 'mcq',
    typeLabel: 'Generators vs List Comprehensions',
    level: 1,
    levelName: 'Beginner',
    prompt: 'When processing 10 million text records from a file, why is a generator expression `(parse(line) for line in file)` preferred over a list comprehension `[parse(line) for line in file]`?',
    options: [
      { id: 'A', text: 'Generators stream items lazily on-demand with O(1) memory consumption, whereas list comprehensions eagerly allocate all 10 million parsed items into RAM' },
      { id: 'B', text: 'Generators automatically execute across 8 CPU cores concurrently' },
      { id: 'C', text: 'List comprehensions cannot parse strings containing whitespace' },
      { id: 'D', text: 'Generators write the data permanently to disk cache' }
    ],
    correct: 'A',
    explanation: 'A generator expression produces items lazily via iterator protocol (`__next__`), using constant O(1) memory regardless of input volume. A list comprehension eagerly allocates the entire list in memory, causing Out-Of-Memory (OOM) crashes on large datasets.',
    mistakeDiagnostic: 'Mistake: Overlooking memory allocation. Large data pipelines must use generator streams rather than loading all records into memory at once.',
    officialDocLink: {
      title: 'Python Tutorial: Generators & Generator Expressions',
      url: 'https://docs.python.org/3/tutorial/classes.html#generators',
      source: 'Python Software Foundation'
    }
  },
  {
    id: 'b-py-6',
    topicTag: 'python',
    type: 'mcq',
    typeLabel: 'Python `is` vs `==` Operators',
    level: 1,
    levelName: 'Beginner',
    prompt: 'In Python, what is the precise distinction between the `is` operator and the `==` operator?',
    options: [
      { id: 'A', text: '`is` checks memory address identity (`id(a) == id(b)`), while `==` checks value equality (`a.__eq__(b)`)' },
      { id: 'B', text: '`==` checks object identity while `is` compares string lengths' },
      { id: 'C', text: '`is` is reserved strictly for integer comparisons' },
      { id: 'D', text: 'They are identical aliases; the Python bytecode compiler treats them identically' }
    ],
    correct: 'A',
    explanation: '`is` checks whether two variables refer to the exact same object in memory (identity). `==` evaluates value equality. For example, `[1] == [1]` is True, but `[1] is [1]` is False.',
    mistakeDiagnostic: 'Mistake: Using `is` to compare values or strings. Always use `==` for value equality and `is` only for singleton checks (such as `x is None`).',
    officialDocLink: {
      title: 'Python Language Reference: Identity Comparisons',
      url: 'https://docs.python.org/3/reference/expressions.html#comparisons',
      source: 'Python Software Foundation'
    }
  },
  {
    id: 'b-py-7',
    topicTag: 'python',
    type: 'mcq',
    typeLabel: 'CPython Global Interpreter Lock (GIL)',
    level: 1,
    levelName: 'Beginner',
    prompt: 'Why does running a CPU-intensive matrix calculation across 4 Python `threading.Thread` instances in CPython fail to utilize all 4 CPU cores?',
    options: [
      { id: 'A', text: 'The Global Interpreter Lock (GIL) enforces that only one native OS thread executes Python bytecode at any given moment in CPython' },
      { id: 'B', text: 'Linux limits Python processes to 1 core maximum' },
      { id: 'C', text: 'Threads in Python are purely green threads managed without OS threads' },
      { id: 'D', text: 'CPython shuts down the CPU to save power during math calculations' }
    ],
    correct: 'A',
    explanation: 'CPython uses a Global Interpreter Lock (GIL) to protect reference-counted memory structures. Because only one thread runs Python bytecode at a time, CPU-bound tasks must use `multiprocessing` or native C/Rust extensions to run on multiple cores.',
    mistakeDiagnostic: 'Mistake: Expecting standard multithreading to speed up CPU-bound math in Python. For CPU parallelism, use multiprocessing; for I/O concurrency, use asyncio or threading.',
    officialDocLink: {
      title: 'Python Glossary: Global Interpreter Lock (GIL)',
      url: 'https://docs.python.org/3/glossary.html#term-global-interpreter-lock',
      source: 'Python Software Foundation'
    }
  },

  // --- SQL & DBMS Beginner ---
  {
    id: 'b-sql-1',
    topicTag: 'sql',
    type: 'mcq',
    typeLabel: 'SQL JOIN Semantics',
    level: 1,
    levelName: 'Beginner',
    prompt: 'You need to list ALL registered students from the `students` table, including those who have NOT enrolled in any course in the `enrollments` table. Which JOIN clause is required?',
    options: [
      { id: 'A', text: 'INNER JOIN enrollments ON students.id = enrollments.student_id' },
      { id: 'B', text: 'LEFT OUTER JOIN enrollments ON students.id = enrollments.student_id' },
      { id: 'C', text: 'CROSS JOIN enrollments' },
      { id: 'D', text: 'NATURAL INNER JOIN enrollments' }
    ],
    correct: 'B',
    explanation: 'A LEFT OUTER JOIN preserves all records from the left table (`students`) regardless of whether a matching record exists in the right table (`enrollments`), populating non-matching right columns with NULL.',
    mistakeDiagnostic: 'Mistake: Using INNER JOIN which filters out rows that lack foreign key matches. When you need "all records from one side even without matches", always use a LEFT or RIGHT OUTER JOIN.',
    officialDocLink: {
      title: 'PostgreSQL Official Docs: Table Joins & Outer Joins',
      url: 'https://www.postgresql.org/docs/current/tutorial-join.html',
      source: 'PostgreSQL Global Development Group'
    }
  },
  {
    id: 'b-sql-2',
    topicTag: 'sql',
    type: 'mcq',
    typeLabel: 'SQL WHERE vs HAVING Filters',
    level: 1,
    levelName: 'Beginner',
    prompt: 'In SQL, what is the fundamental difference between the `WHERE` clause and the `HAVING` clause?',
    options: [
      { id: 'A', text: '`WHERE` filters individual rows before aggregation occurs; `HAVING` filters aggregated group records after `GROUP BY`' },
      { id: 'B', text: '`HAVING` filters columns while `WHERE` filters database tables' },
      { id: 'C', text: '`WHERE` can use aggregate functions like `SUM()` and `COUNT()`, whereas `HAVING` cannot' },
      { id: 'D', text: '`WHERE` and `HAVING` are exact synonyms and can be used interchangeably anywhere' }
    ],
    correct: 'A',
    explanation: '`WHERE` filters individual rows prior to grouping and aggregation. `HAVING` evaluates conditions against aggregated groupings (e.g. `HAVING COUNT(*) > 5`). Using `WHERE COUNT(*) > 5` raises an SQL syntax error.',
    mistakeDiagnostic: 'Mistake: Attempting to put aggregate functions into a WHERE clause. Remember: WHERE filters raw rows; HAVING filters aggregated groups.',
    officialDocLink: {
      title: 'PostgreSQL Official Docs: Aggregate Functions and HAVING',
      url: 'https://www.postgresql.org/docs/current/tutorial-agg.html',
      source: 'PostgreSQL.org'
    }
  },
  {
    id: 'b-sql-3',
    topicTag: 'sql',
    type: 'mcq',
    typeLabel: 'Primary Key vs Unique Constraints',
    level: 1,
    levelName: 'Beginner',
    prompt: 'What is the primary difference between a `PRIMARY KEY` constraint and a `UNIQUE` constraint on a relational table?',
    options: [
      { id: 'A', text: 'A table can have only one PRIMARY KEY and it rejects NULL values, whereas multiple UNIQUE constraints are permitted and allow NULL values' },
      { id: 'B', text: 'UNIQUE constraints can only be applied to integer columns' },
      { id: 'C', text: 'PRIMARY KEY does not create an index, while UNIQUE creates three indexes' },
      { id: 'D', text: 'PRIMARY KEY allows duplicate rows if the table has fewer than 1,000 rows' }
    ],
    correct: 'A',
    explanation: 'Every relational table can have at most one PRIMARY KEY (identifying each row uniquely and strictly prohibiting NULLs). Multiple UNIQUE constraints can exist on other columns (like email or username), and in SQL standard, UNIQUE columns allow NULLs.',
    mistakeDiagnostic: 'Mistake: Confusing primary keys with unique constraints. A table has only one primary key, which forms the entity identity and cannot contain NULL.',
    officialDocLink: {
      title: 'PostgreSQL Docs: Primary and Unique Constraints',
      url: 'https://www.postgresql.org/docs/current/ddl-constraints.html',
      source: 'PostgreSQL.org'
    }
  },
  {
    id: 'b-sql-4',
    topicTag: 'sql',
    type: 'code_analysis',
    typeLabel: 'SQL Aggregate Functions and NULL Handling',
    level: 1,
    levelName: 'Beginner',
    prompt: 'Given a `salaries` column containing values `[100, 200, NULL]`, what is the result of `SELECT AVG(salaries)` in standard SQL?',
    options: [
      { id: 'A', text: '`150`, because SQL aggregate functions (except COUNT(*)) ignore NULLs: (100 + 200) / 2 = 150' },
      { id: 'B', text: '`100`, because NULL is coerced to 0: (100 + 200 + 0) / 3 = 100' },
      { id: 'C', text: '`NULL`, because any arithmetic with NULL returns NULL' },
      { id: 'D', text: 'Raises a runtime division-by-zero database exception' }
    ],
    correct: 'A',
    explanation: 'Standard SQL aggregate functions (`AVG`, `SUM`, `MIN`, `MAX`, `COUNT(col)`) ignore NULL entries. Thus, `AVG` computes the sum of non-null entries divided by the count of non-null entries: 300 / 2 = 150. (Only `COUNT(*)` counts rows with NULLs).',
    mistakeDiagnostic: 'Mistake: Assuming NULL is treated as 0 in aggregate calculations. NULL is skipped entirely when calculating averages and sums.',
    officialDocLink: {
      title: 'PostgreSQL Docs: Aggregate Functions and Null Values',
      url: 'https://www.postgresql.org/docs/current/functions-aggregate.html',
      source: 'PostgreSQL.org'
    }
  },
  {
    id: 'b-sql-5',
    topicTag: 'dbms',
    type: 'mcq',
    typeLabel: 'Database ACID Properties',
    level: 1,
    levelName: 'Beginner',
    prompt: 'In relational database theory, which ACID property guarantees that all operations within a transaction either succeed completely or are rolled back with zero partial changes?',
    options: [
      { id: 'A', text: 'Atomicity' },
      { id: 'B', text: 'Consistency' },
      { id: 'C', text: 'Isolation' },
      { id: 'D', text: 'Durability' }
    ],
    correct: 'A',
    explanation: 'Atomicity guarantees "all-or-nothing" execution. If a transaction consists of 5 updates and fails on the 4th, atomicity ensures that the first 3 updates are rolled back to the initial state.',
    mistakeDiagnostic: 'Mistake: Confusing Atomicity with Consistency or Durability. Atomicity = All or nothing; Consistency = schema constraints satisfied; Isolation = transaction concurrency; Durability = committed data survives power loss.',
    officialDocLink: {
      title: 'PostgreSQL Documentation: Database Transactions & ACID',
      url: 'https://www.postgresql.org/docs/current/tutorial-transactions.html',
      source: 'PostgreSQL.org'
    }
  },
  {
    id: 'b-sql-6',
    topicTag: 'sql',
    type: 'mcq',
    typeLabel: 'Foreign Key Referential Actions',
    level: 1,
    levelName: 'Beginner',
    prompt: 'In a schema where `orders.user_id` references `users.id`, what happens when a user is deleted if the foreign key is defined with `ON DELETE CASCADE`?',
    options: [
      { id: 'A', text: 'All orders associated with that user are automatically deleted from the orders table' },
      { id: 'B', text: 'The delete is rejected with a Foreign Key Violation error' },
      { id: 'C', text: 'The `orders.user_id` column is set to NULL' },
      { id: 'D', text: 'The database shuts down all active connections' }
    ],
    correct: 'A',
    explanation: '`ON DELETE CASCADE` specifies that when the referenced parent row in `users` is deleted, all dependent child rows in `orders` are automatically deleted by the database engine to maintain referential integrity.',
    mistakeDiagnostic: 'Mistake: Assuming foreign keys always block deletion. With CASCADE enabled, child rows are deleted automatically. (Use RESTRICT or NO ACTION to block deletion).',
    officialDocLink: {
      title: 'PostgreSQL Docs: Foreign Key Constraints & Cascading',
      url: 'https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK',
      source: 'PostgreSQL.org'
    }
  },

  // --- DSA Beginner ---
  {
    id: 'b-dsa-1',
    topicTag: 'dsa',
    type: 'mcq',
    typeLabel: 'Hash Table Space-Time Tradeoff',
    level: 1,
    levelName: 'Beginner',
    prompt: 'What is the core algorithmic trade-off when using a Hash Map instead of an unsorted Array for key-value lookups?',
    options: [
      { id: 'A', text: 'Hash maps consume strictly zero RAM while providing O(N) linear search times' },
      { id: 'B', text: 'Hash maps trade O(N) additional auxiliary space to achieve O(1) average lookup time' },
      { id: 'C', text: 'Hash maps guarantee elements are always maintained in sorted lexicographical order' },
      { id: 'D', text: 'Hash maps require O(N log N) time on every write insertion' }
    ],
    correct: 'B',
    explanation: 'The classic space-time trade-off: allocating memory for buckets and collision chains enables O(1) expected lookup, versus O(N) scan time in an unsorted array.',
    mistakeDiagnostic: 'Mistake: Forgetting that hash maps require memory overhead for hash buckets and pointer chains to achieve sub-millisecond retrieval.',
    officialDocLink: {
      title: 'MIT OpenCourseWare: Introduction to Algorithms & Hashing',
      url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
      source: 'MIT OpenCourseWare'
    }
  },
  {
    id: 'b-dsa-2',
    topicTag: 'dsa',
    type: 'code_analysis',
    typeLabel: 'Two-Pointer Array Reversal',
    level: 1,
    levelName: 'Beginner',
    prompt: 'Consider this in-place string reversal algorithm. What are its time and auxiliary space complexities?',
    codeSnippet: {
      language: 'python',
      code: `def reverse_string(s: list[str]) -> None:\n    left, right = 0, len(s) - 1\n    while left < right:\n        s[left], s[right] = s[right], s[left]\n        left += 1\n        right -= 1`
    },
    options: [
      { id: 'A', text: 'O(N) time complexity and O(1) auxiliary space' },
      { id: 'B', text: 'O(N^2) time complexity and O(N) auxiliary space' },
      { id: 'C', text: 'O(log N) time complexity and O(1) auxiliary space' },
      { id: 'D', text: 'O(N) time complexity and O(N) auxiliary space' }
    ],
    correct: 'A',
    explanation: 'The two-pointer technique iterates through N/2 swaps, doing O(1) operations per step for O(N) total time, using no extra arrays for O(1) auxiliary space.',
    mistakeDiagnostic: 'Mistake: Overestimating memory usage for in-place pointer swaps. Since no new array or buffer is allocated, space complexity remains strictly O(1).',
    officialDocLink: {
      title: 'VisuAlgo: Arrays & Two-Pointer In-Place Swaps',
      url: 'https://visualgo.net/en',
      source: 'National University of Singapore'
    }
  },
  {
    id: 'b-dsa-3',
    topicTag: 'dsa',
    type: 'mcq',
    typeLabel: 'Binary Search Algorithmic Precondition',
    level: 1,
    levelName: 'Beginner',
    prompt: 'What mandatory condition must be satisfied before Binary Search can be applied to find a target value in an array in O(log N) time?',
    options: [
      { id: 'A', text: 'The array elements must be monotonically sorted in ascending or descending order' },
      { id: 'B', text: 'The array must contain only power-of-two length elements' },
      { id: 'C', text: 'All array values must be unique prime numbers' },
      { id: 'D', text: 'The array must be stored on SSD rather than RAM' }
    ],
    correct: 'A',
    explanation: 'Binary Search relies on halving the search space based on comparing the target to the midpoint. This ordering deduction is only valid if the collection is sorted. On unsorted arrays, binary search returns incorrect results.',
    mistakeDiagnostic: 'Mistake: Attempting binary search on unsorted data. Binary search requires monotonicity. For unsorted data, linear scan is O(N) or you must sort first in O(N log N).',
    officialDocLink: {
      title: 'MIT Algorithms: Binary Search & Divide and Conquer',
      url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
      source: 'MIT OpenCourseWare'
    }
  },
  {
    id: 'b-dsa-4',
    topicTag: 'dsa',
    type: 'mcq',
    typeLabel: 'Array vs Linked List Insertion Complexity',
    level: 1,
    levelName: 'Beginner',
    prompt: 'Why is prepending an element at index 0 in a Singly Linked List O(1) time, while doing so in a Dynamic Array (e.g. Python list) is O(N)?',
    options: [
      { id: 'A', text: 'Linked lists only require updating the head pointer, while dynamic arrays must shift all N existing elements one slot to the right in memory' },
      { id: 'B', text: 'Dynamic arrays are stored in CPU L1 cache, while linked lists use hard disk storage' },
      { id: 'C', text: 'Linked lists sort the data automatically upon insertion' },
      { id: 'D', text: 'Dynamic arrays recalculate checksum hashes on every insert' }
    ],
    correct: 'A',
    explanation: 'In contiguous arrays, inserting at index 0 requires shifting every existing item rightward by 1 position to vacate slot 0, costing O(N). In a linked list, inserting at head simply links the new node to the old head and updates the head reference in O(1) time.',
    mistakeDiagnostic: 'Mistake: Confusing random index access with insertion. Arrays have O(1) random lookup but O(N) insertion at beginning. Linked lists have O(1) head insertion but O(N) lookup.',
    officialDocLink: {
      title: 'GeeksforGeeks / Standard DSA: Linked List vs Array Complexity',
      url: 'https://en.wikipedia.org/wiki/Linked_list',
      source: 'Computer Science Fundamentals'
    }
  },
  {
    id: 'b-dsa-5',
    topicTag: 'dsa',
    type: 'scenario',
    typeLabel: 'Stack Data Structure for Matching Parentheses',
    level: 1,
    levelName: 'Beginner',
    prompt: 'You are writing an IDE linter to validate whether code has balanced brackets `{[()]}`. Which data structure is ideal and why?',
    options: [
      { id: 'A', text: 'Stack (LIFO): pushes opening brackets and pops them to match corresponding closing brackets in reverse order' },
      { id: 'B', text: 'Queue (FIFO): processes the oldest opened bracket first' },
      { id: 'C', text: 'Binary Search Tree: sorts bracket ASCII values' },
      { id: 'D', text: 'Bloom Filter: randomly samples bracket characters' }
    ],
    correct: 'A',
    explanation: 'Bracket nesting adheres to Last-In, First-Out (LIFO). The most recently opened bracket must be the first one closed. A stack naturally tracks this ordering.',
    mistakeDiagnostic: 'Mistake: Choosing a queue (FIFO). Queues pair the first bracket with the first close, which breaks nested structures like `([{}])`. Always use a stack for nesting.',
    officialDocLink: {
      title: 'VisuAlgo: Stack LIFO Visualization and Applications',
      url: 'https://visualgo.net/en/list',
      source: 'VisuAlgo'
    }
  },

  // --- Cloud & DevOps Beginner ---
  {
    id: 'b-cloud-1',
    topicTag: 'cloud',
    type: 'mcq',
    typeLabel: 'VPC Subnet Security Isolation',
    level: 1,
    levelName: 'Beginner',
    prompt: 'In modern cloud architecture (AWS/GCP), why should relational database instances (PostgreSQL/MySQL) never be deployed in a Public Subnet?',
    options: [
      { id: 'A', text: 'Public subnets automatically delete all database tables after 24 hours' },
      { id: 'B', text: 'Public subnets have routes to the Internet Gateway, assigning public IPs that expose databases directly to global automated port scanners and brute-force attacks' },
      { id: 'C', text: 'Public subnets cannot execute SQL SELECT queries' },
      { id: 'D', text: 'Databases running in public subnets consume 10x more electricity' }
    ],
    correct: 'B',
    explanation: 'Public subnets have routes to the Internet Gateway. Exposing a database on a public IP increases the attack surface. Best practice places databases in Private Subnets with access only from application backends via security groups.',
    mistakeDiagnostic: 'Mistake: Overlooking network ingress boundaries. Internal data tiers must remain isolated in private subnets with no direct internet routes.',
    officialDocLink: {
      title: 'AWS Well-Architected Framework: VPC & Network Security',
      url: 'https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html',
      source: 'Amazon Web Services'
    }
  },
  {
    id: 'b-cloud-2',
    topicTag: 'cloud',
    type: 'mcq',
    typeLabel: 'Docker Container Isolation',
    level: 1,
    levelName: 'Beginner',
    prompt: 'What kernel mechanism does Docker rely on to isolate CPU, RAM, and disk I/O limits between running containers?',
    options: [
      { id: 'A', text: 'Linux Control Groups (cgroups)' },
      { id: 'B', text: 'BIOS hardware overclocking' },
      { id: 'C', text: 'VirtualBox hypervisor emulation' },
      { id: 'D', text: 'TCP packet headers' }
    ],
    correct: 'A',
    explanation: 'Linux cgroups (control groups) enforce resource constraints (CPU limits, memory quotas, disk throttling) on container processes, while namespaces isolate process trees, mounts, and network stacks.',
    mistakeDiagnostic: 'Mistake: Confusing container kernel controls with full hardware hypervisors. Containers use native Linux cgroups and namespaces rather than hypervisors.',
    officialDocLink: {
      title: 'Docker Official Documentation: Container Architecture & Isolation',
      url: 'https://docs.docker.com/get-started/',
      source: 'Docker Official'
    }
  },
  {
    id: 'b-cloud-3',
    topicTag: 'cloud',
    type: 'mcq',
    typeLabel: 'Stateless Architecture in Cloud Autoscaling',
    level: 1,
    levelName: 'Beginner',
    prompt: 'Why is it critical for web application servers behind an Auto Scaling Group to be designed as "stateless"?',
    options: [
      { id: 'A', text: 'Any server instance can be terminated or spawned dynamically without losing user sessions, because sessions are stored in an external shared store (like Redis or DB)' },
      { id: 'B', text: 'Stateless servers do not require an IP address' },
      { id: 'C', text: 'Stateless servers run without an operating system' },
      { id: 'D', text: 'Stateful servers can only handle one HTTP request per week' }
    ],
    correct: 'A',
    explanation: 'Stateless servers store no local in-memory session data. If traffic drops or a node fails, auto-scalers can terminate instances instantly without aborting user shopping carts or active logins.',
    mistakeDiagnostic: 'Mistake: Storing user sessions in local process memory on cloud instances. When instances scale down or restart, all active user sessions are destroyed. Use external Redis caches.',
    officialDocLink: {
      title: '12-Factor App: VI. Processes - Execute as Stateless Processes',
      url: 'https://12factor.net/processes',
      source: 'The Twelve-Factor App'
    }
  },
  {
    id: 'b-cloud-4',
    topicTag: 'cloud',
    type: 'mcq',
    typeLabel: 'Cloud Storage: Block vs Object Storage',
    level: 1,
    levelName: 'Beginner',
    prompt: 'Which AWS/GCP storage service is best suited for hosting static website assets, images, and user-uploaded PDF resumes accessible via public HTTPS URLs?',
    options: [
      { id: 'A', text: 'Amazon S3 / Google Cloud Storage (Object Storage)' },
      { id: 'B', text: 'Amazon EBS / Google Persistent Disk (Block Storage attached to a single VM)' },
      { id: 'C', text: 'Amazon ElastiCache Redis' },
      { id: 'D', text: 'CPU L2 cache memory' }
    ],
    correct: 'A',
    explanation: 'Object storage (S3 / GCS) is designed for unstructured media, PDFs, and static web assets. It offers virtually unlimited scale, high durability (99.999999999%), and direct HTTP/HTTPS access with CDN integration.',
    mistakeDiagnostic: 'Mistake: Confusing block storage (EBS) with object storage (S3). Block storage attaches as a disk to a single virtual machine; object storage serves files over HTTP.',
    officialDocLink: {
      title: 'AWS S3 Documentation: Overview of Amazon S3 Storage',
      url: 'https://docs.aws.amazon.com/s3/',
      source: 'Amazon Web Services'
    }
  },

  // --- Embedded Systems Beginner ---
  {
    id: 'b-emb-1',
    topicTag: 'embedded',
    type: 'mcq',
    typeLabel: 'Embedded C `volatile` Keyword',
    level: 1,
    levelName: 'Beginner',
    prompt: 'In Embedded C development, why must a variable modified inside an Interrupt Service Routine (ISR) be declared with the `volatile` qualifier?',
    options: [
      { id: 'A', text: 'To instruct the compiler NOT to optimize variable reads into CPU registers, ensuring memory is fetched freshly on every access' },
      { id: 'B', text: 'To encrypt the variable value inside microcontroller flash memory' },
      { id: 'C', text: 'To make the variable accessible over the Wi-Fi network' },
      { id: 'D', text: 'To automatically allocate the variable onto external SDRAM' }
    ],
    correct: 'A',
    explanation: 'Compilers optimize loops by caching variable values in CPU registers. If an ISR updates the memory location asynchronously, the main loop would never see the update without `volatile`.',
    mistakeDiagnostic: 'Mistake: Assuming the compiler knows about asynchronous hardware interrupts. Compilers assume single-threaded execution unless told a memory address can change asynchronously via volatile.',
    officialDocLink: {
      title: 'ARM Developer: C/C++ Compiler Optimization & Volatile Variables',
      url: 'https://developer.arm.com/documentation',
      source: 'ARM Developer'
    }
  },
  {
    id: 'b-emb-2',
    topicTag: 'embedded',
    type: 'mcq',
    typeLabel: 'Hardware Communication Protocols',
    level: 1,
    levelName: 'Beginner',
    prompt: 'Which hardware communication bus protocol requires only TWO signal lines (SDA for data, SCL for clock) with pull-up resistors to connect multiple peripheral sensors?',
    options: [
      { id: 'A', text: 'I2C (Inter-Integrated Circuit)' },
      { id: 'B', text: 'SPI (Serial Peripheral Interface)' },
      { id: 'C', text: 'Parallel IEEE-1284' },
      { id: 'D', text: 'Ethernet RJ45' }
    ],
    correct: 'A',
    explanation: 'I2C uses exactly two bidirectional open-drain lines (SDA and SCL) with pull-up resistors and 7-bit device addressing to connect dozens of sensors on a single bus.',
    mistakeDiagnostic: 'Mistake: Confusing I2C with SPI. SPI requires at least 4 wires (MOSI, MISO, SCK, CS), whereas I2C needs only 2 wires (SDA, SCL).',
    officialDocLink: {
      title: 'Linux Kernel Documentation: I2C & SPI Bus Protocols',
      url: 'https://www.kernel.org/doc/html/latest/i2c/index.html',
      source: 'The Linux Kernel Archives'
    }
  },
  {
    id: 'b-emb-3',
    topicTag: 'embedded',
    type: 'mcq',
    typeLabel: 'Microcontroller Memory Architecture',
    level: 1,
    levelName: 'Beginner',
    prompt: 'In typical ARM Cortex-M microcontrollers (e.g. STM32), where is compiled C code stored, and where are active function stack frames and local variables placed at runtime?',
    options: [
      { id: 'A', text: 'Code is stored in non-volatile Flash ROM; active call stacks and local variables reside in volatile SRAM' },
      { id: 'B', text: 'Code is stored in SRAM; variables are stored in USB flash' },
      { id: 'C', text: 'Both code and variables are written directly onto magnetic hard disk' },
      { id: 'D', text: 'Code is fetched across the internet on every clock cycle' }
    ],
    correct: 'A',
    explanation: 'Microcontrollers use Harvard/modified-Harvard architectures: non-volatile Flash memory holds the binary executable code and interrupt vectors, while fast internal SRAM provides runtime scratchpad memory for the stack and heap.',
    mistakeDiagnostic: 'Mistake: Confusing Flash ROM with SRAM. Flash persists without power and holds the code; SRAM loses data on power-off and stores runtime variables.',
    officialDocLink: {
      title: 'ARM Cortex-M Memory Model Documentation',
      url: 'https://developer.arm.com/documentation',
      source: 'ARM Architecture'
    }
  },
  {
    id: 'b-emb-4',
    topicTag: 'embedded',
    type: 'mcq',
    typeLabel: 'Microcontroller Watchdog Timer (WDT)',
    level: 1,
    levelName: 'Beginner',
    prompt: 'What is the primary function of a Hardware Watchdog Timer (WDT) in a mission-critical embedded controller?',
    options: [
      { id: 'A', text: 'To automatically reset and reboot the microcontroller if firmware freezes, enters an infinite loop, or deadlocks' },
      { id: 'B', text: 'To measure ambient temperature around the PCB' },
      { id: 'C', text: 'To speed up CPU clock speed beyond manufacturer specs' },
      { id: 'D', text: 'To play an audible alarm through a buzzer' }
    ],
    correct: 'A',
    explanation: 'A watchdog timer is a hardware counter that continuously counts down. Firmware must periodically "kick" or "feed" the watchdog. If firmware hangs due to a bug or noise, the counter hits zero and triggers a system reset.',
    mistakeDiagnostic: 'Mistake: Believing watchdog timers are software debuggers. They are autonomous hardware safety monitors that force a hardware reset on firmware lockup.',
    officialDocLink: {
      title: 'Embedded Systems Safety: Watchdog Timers',
      url: 'https://developer.arm.com/documentation',
      source: 'ARM Developer'
    }
  },

  // --- AI/ML Beginner ---
  {
    id: 'b-aiml-1',
    topicTag: 'aiml',
    type: 'mcq',
    typeLabel: 'Overfitting vs Underfitting in Machine Learning',
    level: 1,
    levelName: 'Beginner',
    prompt: 'A machine learning model achieves 99.8% accuracy on the training set, but only 58.2% accuracy on the test set. What problem is occurring and what is the primary fix?',
    options: [
      { id: 'A', text: 'Underfitting; the model is too simple and needs more training epochs' },
      { id: 'B', text: 'Overfitting; the model memorized training noise. Fix by applying regularization (L1/L2), dropout, or gathering more training samples' },
      { id: 'C', text: 'Floating point overflow in CPU registers' },
      { id: 'D', text: 'The test set must be deleted and replaced with training data' }
    ],
    correct: 'B',
    explanation: 'A huge gap between high training accuracy and poor test accuracy is textbook overfitting. The model fit noise instead of generalizing. Regularization, pruning, or dropout will penalize excessive complexity.',
    mistakeDiagnostic: 'Mistake: Misdiagnosing variance vs bias. High train performance with low test generalization indicates high variance (overfitting), not underfitting.',
    officialDocLink: {
      title: 'PyTorch Official Tutorials: Training Loops, Validation & Regularization',
      url: 'https://pytorch.org/tutorials/beginner/basics/intro.html',
      source: 'PyTorch / Linux Foundation'
    }
  },
  {
    id: 'b-aiml-2',
    topicTag: 'aiml',
    type: 'mcq',
    typeLabel: 'Tensors and Gradient Descent',
    level: 1,
    levelName: 'Beginner',
    prompt: 'In PyTorch, what is the role of `optimizer.zero_grad()` before running `loss.backward()` in a standard training step?',
    options: [
      { id: 'A', text: 'It clears accumulated gradients from the previous batch so they do not add up across training iterations' },
      { id: 'B', text: 'It resets all model neural network weights to random numbers' },
      { id: 'C', text: 'It deletes all training data from GPU memory' },
      { id: 'D', text: 'It disables GPU hardware acceleration' }
    ],
    correct: 'A',
    explanation: 'By default, PyTorch accumulates (sums) gradients into `.grad` buffers on every `backward()` call. Failing to zero gradients causes values to blow up exponentially across iterations.',
    mistakeDiagnostic: 'Mistake: Not knowing that PyTorch gradients accumulate by default. Always call zero_grad() before backward().',
    officialDocLink: {
      title: 'PyTorch Documentation: Autograd & Optimizers',
      url: 'https://pytorch.org/tutorials/beginner/basics/intro.html',
      source: 'PyTorch Official'
    }
  },
  {
    id: 'b-aiml-3',
    topicTag: 'aiml',
    type: 'mcq',
    typeLabel: 'Classification Evaluation: Precision vs Recall',
    level: 1,
    levelName: 'Beginner',
    prompt: 'In a medical cancer detection model where missing a positive cancer case has fatal consequences, which evaluation metric must be prioritized and maximized?',
    options: [
      { id: 'A', text: 'Recall (Sensitivity): minimizing False Negatives so no actual cases are missed' },
      { id: 'B', text: 'Precision: minimizing False Positives at the expense of missing sick patients' },
      { id: 'C', text: 'Raw Training Set Accuracy alone' },
      { id: 'D', text: 'Model parameter file size in megabytes' }
    ],
    correct: 'A',
    explanation: 'Recall = True Positives / (True Positives + False Negatives). When the penalty of missing a positive instance is catastrophic (cancer, fraud), maximizing Recall ensures minimal False Negatives.',
    mistakeDiagnostic: 'Mistake: Choosing Precision or Accuracy. On heavily imbalanced medical datasets (e.g. 99% healthy, 1% cancer), a dummy model predicting all "healthy" gets 99% accuracy but 0% recall.',
    officialDocLink: {
      title: 'Scikit-Learn Documentation: Precision, Recall & F-measure Metrics',
      url: 'https://scikit-learn.org/stable/modules/model_evaluation.html#precision-recall-f-measure-metrics',
      source: 'Scikit-Learn'
    }
  },
  {
    id: 'b-aiml-4',
    topicTag: 'aiml',
    type: 'mcq',
    typeLabel: 'Gradient Descent Learning Rate Behavior',
    level: 1,
    levelName: 'Beginner',
    prompt: 'During neural network training with Gradient Descent, what happens if the learning rate hyperparameter is set too large?',
    options: [
      { id: 'A', text: 'The optimizer overshoots the minimum and the loss function diverges (oscillates toward infinity or NaN)' },
      { id: 'B', text: 'The model training completes in 0.001 milliseconds with 100% accuracy' },
      { id: 'C', text: 'Weights freeze and cannot be updated at all' },
      { id: 'D', text: 'The GPU memory clock is reduced by 50%' }
    ],
    correct: 'A',
    explanation: 'Large learning rates take oversized steps across the loss landscape, leaping over the local or global minimum. The loss will bounce violently upwards, resulting in divergence or NaN loss.',
    mistakeDiagnostic: 'Mistake: Believing higher learning rates always mean faster convergence. Oversized steps cause severe mathematical divergence.',
    officialDocLink: {
      title: 'Deep Learning Book (Goodfellow et al.): Optimization Algorithms',
      url: 'https://www.deeplearningbook.org/',
      source: 'MIT Press'
    }
  },

  // ============================================================================
  // LEVEL 2: INTERMEDIATE (Deep Dives, Concurrency, Indexing, Systems, Memory)
  // ============================================================================

  // --- Python Intermediate ---
  {
    id: 'i-py-1',
    topicTag: 'python',
    type: 'code_analysis',
    typeLabel: 'Python Decorators & functools.wraps',
    level: 2,
    levelName: 'Intermediate',
    prompt: 'Examine this Python logging decorator. What bug is introduced when `@functools.wraps(fn)` is omitted from the wrapper function?',
    codeSnippet: {
      language: 'python',
      code: `def log_call(fn):\n    def wrapper(*args, **kwargs):\n        print(f"Calling {fn.__name__}")\n        return fn(*args, **kwargs)\n    return wrapper\n\n@log_call\ndef calculate_payroll(employee_id: int) -> float:\n    """Calculates monthly payroll balance."""\n    return 5000.0`
    },
    options: [
      { id: 'A', text: 'The decorated function loses its identity: `calculate_payroll.__name__` becomes "wrapper" and docstrings are erased' },
      { id: 'B', text: 'Python emits a SyntaxError because decorators must accept three arguments' },
      { id: 'C', text: 'The employee_id parameter is permanently converted to a string' },
      { id: 'D', text: 'The function can only be executed once before crashing' }
    ],
    correct: 'A',
    explanation: 'Without `@functools.wraps(fn)`, the returned wrapper replaces the original function metadata (`__name__`, `__doc__`, annotations). This breaks docstring generation, introspection tools, and debugging stack traces.',
    mistakeDiagnostic: 'Mistake: Forgetting that decorators replace the original function object. Always decorate wrapper functions with `@functools.wraps(fn)`.',
    officialDocLink: {
      title: 'Python Official Docs: functools.wraps Decorator Utility',
      url: 'https://docs.python.org/3/library/functools.html#functools.wraps',
      source: 'Python Software Foundation'
    }
  },
  {
    id: 'i-py-2',
    topicTag: 'python',
    type: 'code_analysis',
    typeLabel: 'Python Context Manager Exception Handling',
    level: 2,
    levelName: 'Intermediate',
    prompt: 'In a custom Python class implementing `__enter__` and `__exit__`, what must `__exit__` return to suppress an exception raised inside the `with` block?',
    options: [
      { id: 'A', text: 'It must explicitly return `True` (or a truthy value); returning `False` or `None` causes the exception to re-propagate' },
      { id: 'B', text: 'It must raise `StopIteration`' },
      { id: 'C', text: 'It must return the string "suppress"' },
      { id: 'D', text: 'Context managers cannot catch or inspect exceptions' }
    ],
    correct: 'A',
    explanation: 'In Python context managers, if an exception occurs inside the `with` block, `__exit__(exc_type, exc_val, exc_tb)` is invoked. Returning a true value suppresses the exception; returning false (or None) allows it to propagate.',
    mistakeDiagnostic: 'Mistake: Returning False or None when trying to swallow exceptions. Returning False tells Python: "re-raise this exception".',
    officialDocLink: {
      title: 'Python Docs: Context Manager Types & __exit__ Protocol',
      url: 'https://docs.python.org/3/reference/datamodel.html#context-managers',
      source: 'Python Software Foundation'
    }
  },
  {
    id: 'i-py-3',
    topicTag: 'python',
    type: 'scenario',
    typeLabel: 'Python asyncio Event Loop Starvation',
    level: 2,
    levelName: 'Intermediate',
    prompt: 'A FastAPI service uses `async def handle_request()`. Inside the handler, it executes a synchronous CPU-bound cryptographic hash taking 500ms. What happens to all other incoming HTTP requests during this time?',
    options: [
      { id: 'A', text: 'All other concurrent requests freeze because the synchronous CPU calculation blocks the single-threaded asyncio event loop' },
      { id: 'B', text: 'FastAPI automatically spawns 100 threads to balance the CPU load' },
      { id: 'C', text: 'The Linux kernel terminates the process for memory violation' },
      { id: 'D', text: 'The event loop switches to UDP sockets' }
    ],
    correct: 'A',
    explanation: '`asyncio` uses cooperative multitasking on a single thread. If an `async def` function performs heavy blocking synchronous CPU work without yielding (`await`), the event loop is blocked and cannot process any other requests. Heavy CPU tasks must be offloaded to `loop.run_in_executor()`.',
    mistakeDiagnostic: 'Mistake: Assuming async def makes synchronous code concurrent. Long-running CPU operations in coroutines starve the event loop. Offload CPU tasks to thread pools or worker queues.',
    officialDocLink: {
      title: 'Python asyncio Documentation: Running in Thread Pools',
      url: 'https://docs.python.org/3/library/asyncio-eventloop.html#asyncio.loop.run_in_executor',
      source: 'Python Software Foundation'
    }
  },
  {
    id: 'i-py-4',
    topicTag: 'python',
    type: 'mcq',
    typeLabel: 'Python Class Instantiation: `__new__` vs `__init__`',
    level: 2,
    levelName: 'Intermediate',
    prompt: 'What is the precise role of `__new__` versus `__init__` in Python object instantiation lifecycle?',
    options: [
      { id: 'A', text: '`__new__` is a static method that allocates and returns the new instance; `__init__` receives the instance and initializes its attributes' },
      { id: 'B', text: '`__init__` creates memory while `__new__` cleans it up upon garbage collection' },
      { id: 'C', text: '`__new__` only runs when inheriting from C++ classes' },
      { id: 'D', text: '`__init__` runs before `__new__`' }
    ],
    correct: 'A',
    explanation: '`__new__(cls, ...)` is the true constructor that allocates the object in memory and returns it. Python then calls `__init__(self, ...)` to initialize attributes. Implementing design patterns like Singleton or immutable subclasses requires overriding `__new__`.',
    mistakeDiagnostic: 'Mistake: Thinking `__init__` creates the object. `__init__` merely initializes an already created object. `__new__` creates it.',
    officialDocLink: {
      title: 'Python Reference: Basic Customization & __new__ Method',
      url: 'https://docs.python.org/3/reference/datamodel.html#basic-customization',
      source: 'Python Software Foundation'
    }
  },

  // --- SQL & DBMS Intermediate ---
  {
    id: 'i-sql-1',
    topicTag: 'sql',
    type: 'mcq',
    typeLabel: 'B+ Tree Database Index Mechanics',
    level: 2,
    levelName: 'Intermediate',
    prompt: 'Why are B+ Tree index structures almost universally preferred over in-memory Hash indexes in relational databases (PostgreSQL/MySQL)?',
    options: [
      { id: 'A', text: 'B+ Tree leaf nodes are linked in sequential sorted order, allowing fast range scans (`BETWEEN a AND b`) without random disk I/O' },
      { id: 'B', text: 'Hash indexes consume zero disk storage while B+ Trees take 100x more space' },
      { id: 'C', text: 'Hash indexes cannot store integers larger than 16 bits' },
      { id: 'D', text: 'B+ Trees execute write queries without acquiring locks' }
    ],
    correct: 'A',
    explanation: 'Hash indexes can only perform exact point lookups (`=`). B+ Trees keep data ordered at leaf nodes connected by a linked list, making inequality (`<`, `>`, `<=`) and range scans (`BETWEEN`) extremely fast with sequential reads.',
    mistakeDiagnostic: 'Mistake: Forgetting about range queries. In real workloads, range scans, sorting (ORDER BY), and inequality lookups require sorted leaf nodes which only B+ Trees provide.',
    officialDocLink: {
      title: 'PostgreSQL Documentation: B-Tree Index Mechanics & Query Plans',
      url: 'https://www.postgresql.org/docs/current/indexes-types.html',
      source: 'PostgreSQL.org'
    }
  },
  {
    id: 'i-sql-2',
    topicTag: 'sql',
    type: 'scenario',
    typeLabel: 'Transaction Isolation: Non-Repeatable Reads vs Phantoms',
    level: 2,
    levelName: 'Intermediate',
    prompt: 'Transaction A reads row 42. Transaction B updates row 42 and commits. Transaction A re-reads row 42 and finds different values. What concurrency anomaly occurred, and which isolation level prevents it?',
    options: [
      { id: 'A', text: 'Non-Repeatable Read anomaly; prevented by REPEATABLE READ (or SERIALIZABLE) isolation' },
      { id: 'B', text: 'Dirty Read anomaly; prevented by READ UNCOMMITTED' },
      { id: 'C', text: 'Hardware cache corruption; prevented by restarting Postgres' },
      { id: 'D', text: 'Deadlock timeout error' }
    ],
    correct: 'A',
    explanation: 'A Non-Repeatable Read happens when committed changes from another transaction change a row already read by the current transaction. Under REPEATABLE READ isolation (using MVCC snapshots), Transaction A will continue seeing its original snapshot.',
    mistakeDiagnostic: 'Mistake: Confusing Dirty Read with Non-Repeatable Read. Dirty reads read uncommitted data. Non-repeatable reads read data committed by another transaction.',
    officialDocLink: {
      title: 'PostgreSQL Docs: Transaction Isolation Levels & Concurrency Control',
      url: 'https://www.postgresql.org/docs/current/transaction-iso.html',
      source: 'PostgreSQL.org'
    }
  },
  {
    id: 'i-sql-3',
    topicTag: 'sql',
    type: 'code_analysis',
    typeLabel: 'SQL Window Functions: RANK vs DENSE_RANK',
    level: 2,
    levelName: 'Intermediate',
    prompt: 'When ranking scores `[100, 90, 90, 80]` using SQL window functions, what rank numbers are assigned by `DENSE_RANK() OVER (ORDER BY score DESC)`?',
    options: [
      { id: 'A', text: '`1, 2, 2, 3` (no gaps in ranking sequence)' },
      { id: 'B', text: '`1, 2, 2, 4` (leaves a gap after the tied position, like Olympic medals)' },
      { id: 'C', text: '`1, 2, 3, 4` (ties are arbitrarily broken)' },
      { id: 'D', text: '`4, 3, 2, 1`' }
    ],
    correct: 'A',
    explanation: '`DENSE_RANK()` does not leave gaps in ranking after ties (`1, 2, 2, 3`). In contrast, standard `RANK()` leaves gaps (`1, 2, 2, 4`). `ROW_NUMBER()` arbitrarily numbers rows sequentially without recognizing ties (`1, 2, 3, 4`).',
    mistakeDiagnostic: 'Mistake: Confusing RANK with DENSE_RANK. DENSE_RANK stays "dense" without skipping rank numbers after duplicates.',
    officialDocLink: {
      title: 'PostgreSQL Official Docs: Window Functions Tutorial & Reference',
      url: 'https://www.postgresql.org/docs/current/tutorial-window.html',
      source: 'PostgreSQL.org'
    }
  },
  {
    id: 'i-sql-4',
    topicTag: 'dbms',
    type: 'mcq',
    typeLabel: 'Clustered vs Non-Clustered Indexes',
    level: 2,
    levelName: 'Intermediate',
    prompt: 'Why can a database table have only ONE Clustered Index, but multiple Non-Clustered Indexes?',
    options: [
      { id: 'A', text: 'A Clustered Index physically determines the physical storage order of table data pages on disk, and data can only be physically sorted one way' },
      { id: 'B', text: 'Relational databases only allow 1 file per table' },
      { id: 'C', text: 'Non-clustered indexes cannot store string data' },
      { id: 'D', text: 'Clustered indexes are stored in RAM while non-clustered are in CPU cache' }
    ],
    correct: 'A',
    explanation: 'A Clustered Index dictates the physical on-disk sequence of rows. Because data rows on storage media can only be physically ordered in one sequence, a table can only have one clustered index.',
    mistakeDiagnostic: 'Mistake: Treating clustered index as a generic software setting. It physically rearranges how rows sit on disk sectors.',
    officialDocLink: {
      title: 'MySQL / InnoDB Documentation: Clustered and Secondary Indexes',
      url: 'https://dev.mysql.com/doc/refman/8.0/en/innodb-index-types.html',
      source: 'MySQL / Oracle'
    }
  },
  {
    id: 'i-sql-5',
    topicTag: 'dbms',
    type: 'scenario',
    typeLabel: 'Database Deadlock Detection via Wait-For Graphs',
    level: 2,
    levelName: 'Intermediate',
    prompt: 'Transaction T1 holds a row lock on Record A and requests a lock on Record B. Simultaneously, Transaction T2 holds a lock on Record B and requests a lock on Record A. How does the database engine detect and resolve this?',
    options: [
      { id: 'A', text: 'It detects a directed cycle in its internal Wait-For Graph, aborts/rolls back one of the transactions (the deadlock victim), and allows the other to proceed' },
      { id: 'B', text: 'It merges both transactions into a single thread' },
      { id: 'C', text: 'It writes both records to disk without checking locks' },
      { id: 'D', text: 'Both transactions remain frozen forever until server reboot' }
    ],
    correct: 'A',
    explanation: 'Relational engines maintain a Wait-For Graph where nodes are transactions and edges are requested locks. A cycle indicates a deadlock. The deadlock detector periodically checks for cycles, selects a transaction as victim, and aborts it with an error code.',
    mistakeDiagnostic: 'Mistake: Assuming transactions automatically wait forever. Modern DBMS engines actively detect cycles and kill one transaction with a 40P01 deadlock detected error.',
    officialDocLink: {
      title: 'PostgreSQL Docs: Explicit Locking & Deadlock Handling',
      url: 'https://www.postgresql.org/docs/current/explicit-locking.html#LOCKING-DEADLOCKS',
      source: 'PostgreSQL.org'
    }
  },

  // --- DSA Intermediate ---
  {
    id: 'i-dsa-1',
    topicTag: 'dsa',
    type: 'mcq',
    typeLabel: 'Floyd\'s Cycle-Finding Algorithm (Tortoise and Hare)',
    level: 2,
    levelName: 'Intermediate',
    prompt: 'What are the time and auxiliary space complexities of Floyd\'s Cycle Detection algorithm (slow pointer advancing 1 step, fast pointer advancing 2 steps) on a linked list of N nodes?',
    options: [
      { id: 'A', text: 'O(N) time complexity and O(1) auxiliary space' },
      { id: 'B', text: 'O(N^2) time complexity and O(N) auxiliary space' },
      { id: 'C', text: 'O(log N) time complexity and O(N) auxiliary space' },
      { id: 'D', text: 'O(1) time complexity and O(N) auxiliary space' }
    ],
    correct: 'A',
    explanation: 'The fast pointer closes the gap with the slow pointer by 1 node on each iteration inside the loop of length K. They will meet in at most N iterations (O(N) time). Because only two pointers are allocated, space is strictly O(1).',
    mistakeDiagnostic: 'Mistake: Using a hash set to store seen nodes (which costs O(N) extra space). Floyd\'s algorithm achieves cycle detection in O(1) space.',
    officialDocLink: {
      title: 'Wikipedia: Floyd\'s Cycle Detection Algorithm',
      url: 'https://en.wikipedia.org/wiki/Cycle_detection#Floyd\'s_tortoise_and_hare',
      source: 'Algorithm Classics'
    }
  },
  {
    id: 'i-dsa-2',
    topicTag: 'dsa',
    type: 'scenario',
    typeLabel: 'Monotonic Stack for Next Greater Element',
    level: 2,
    levelName: 'Intermediate',
    prompt: 'You need to find the "Next Greater Element" for every item in an array of size 1,000,000. A brute force nested loop takes O(N^2) (1 trillion operations, timing out). How can this be solved in O(N) linear time?',
    options: [
      { id: 'A', text: 'Using a Monotonic Decreasing Stack where each element is pushed and popped at most once' },
      { id: 'B', text: 'Sorting the array using Quicksort in O(N log N)' },
      { id: 'C', text: 'Using a standard FIFO queue' },
      { id: 'D', text: 'Calculating the sum of all elements' }
    ],
    correct: 'A',
    explanation: 'A monotonic decreasing stack keeps elements in descending order. When an incoming element is larger than the stack top, it is the Next Greater Element for that top, which is popped. Since each element enters and exits the stack at most once, total time is strictly O(N).',
    mistakeDiagnostic: 'Mistake: Re-scanning the array from every element. A monotonic stack amortizes the cost so every element is evaluated in O(1) amortized time.',
    officialDocLink: {
      title: 'GeeksforGeeks: Monotonic Stack Pattern & Applications',
      url: 'https://en.wikipedia.org/wiki/Monotone_priority_queue',
      source: 'Computer Science Data Structures'
    }
  },
  {
    id: 'i-dsa-3',
    topicTag: 'dsa',
    type: 'mcq',
    typeLabel: 'Binary Heap Priority Queue Complexities',
    level: 2,
    levelName: 'Intermediate',
    prompt: 'In a Min-Heap binary priority queue of N elements, what are the time complexities for (1) finding the minimum element, and (2) inserting a new element?',
    options: [
      { id: 'A', text: 'Find minimum is O(1); Insertion is O(log N)' },
      { id: 'B', text: 'Find minimum is O(log N); Insertion is O(N)' },
      { id: 'C', text: 'Find minimum is O(N); Insertion is O(1)' },
      { id: 'D', text: 'Both are strictly O(N^2)' }
    ],
    correct: 'A',
    explanation: 'In a Min-Heap, the minimum element is always at the root node (index 0 in an array), providing instant O(1) peek time. Inserting an element appends to the end and bubbles/sifts up along the tree height, taking O(log N) time.',
    mistakeDiagnostic: 'Mistake: Thinking finding min in a heap requires scanning. The heap property guarantees the minimum is at root: O(1) peek time.',
    officialDocLink: {
      title: 'VisuAlgo: Binary Heap Priority Queue Visualization',
      url: 'https://visualgo.net/en/heap',
      source: 'National University of Singapore'
    }
  },
  {
    id: 'i-dsa-4',
    topicTag: 'dsa',
    type: 'mcq',
    typeLabel: 'Self-Balancing BST vs Degenerate Binary Search Tree',
    level: 2,
    levelName: 'Intermediate',
    prompt: 'If sequential sorted numbers `[1, 2, 3, 4, 5, 6, 7]` are inserted into an unbalance Binary Search Tree (BST), what does lookup time complexity degrade to?',
    options: [
      { id: 'A', text: 'O(N) linear time, because the BST degenerates into a singly linked list skewed to the right' },
      { id: 'B', text: 'O(1) constant time' },
      { id: 'C', text: 'O(log N) logarithmic time' },
      { id: 'D', text: 'The BST raises a compile-time StackOverflow' }
    ],
    correct: 'A',
    explanation: 'Inserting sorted items into a naive BST creates a skewed tree with depth N, turning into a linked list where search degrades from O(log N) to O(N). Self-balancing trees (AVL or Red-Black trees) use rotations to keep height bounded to O(log N).',
    mistakeDiagnostic: 'Mistake: Assuming BST search is always O(log N). Naive BSTs degrade to O(N) on sorted inputs without balance rotations.',
    officialDocLink: {
      title: 'VisuAlgo: AVL Tree & Self-Balancing Rotations',
      url: 'https://visualgo.net/en/bst',
      source: 'VisuAlgo'
    }
  },

  // --- Cloud & DevOps Intermediate ---
  {
    id: 'i-cloud-1',
    topicTag: 'cloud',
    type: 'scenario',
    typeLabel: 'Kubernetes Liveness vs Readiness Probe Failure',
    level: 2,
    levelName: 'Intermediate',
    prompt: 'During high traffic spikes, a backend pod takes 4 seconds to process incoming database batches. Kubernetes suddenly restarts the pod repeatedly in an infinite crash loop. What is the root cause?',
    options: [
      { id: 'A', text: 'The Liveness Probe timeout was too aggressive (e.g. 1s). The slow response caused kubelet to misidentify the busy container as dead and restart it repeatedly' },
      { id: 'B', text: 'The Linux kernel ran out of network socket numbers' },
      { id: 'C', text: 'Docker images cannot exceed 100 megabytes in size' },
      { id: 'D', text: 'The ingress controller deleted the cluster namespace' }
    ],
    correct: 'A',
    explanation: 'A common anti-pattern is putting heavy dependency checks in a Liveness Probe. If the server is slow under load, failing liveness probes cause kubelet to kill and restart it, exacerbating downtime. Readiness probes should be used to manage traffic shedding.',
    mistakeDiagnostic: 'Mistake: Conflating liveness with readiness. Liveness probe says "am I dead / deadlock?". If you tie it to slow database queries, your service will enter a restart death loop under load.',
    officialDocLink: {
      title: 'Kubernetes Docs: Configure Liveness, Readiness and Startup Probes',
      url: 'https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/',
      source: 'Kubernetes (CNCF)'
    }
  },
  {
    id: 'i-cloud-2',
    topicTag: 'cloud',
    type: 'mcq',
    typeLabel: 'Reverse Proxy vs Load Balancer Architecture',
    level: 2,
    levelName: 'Intermediate',
    prompt: 'In a microservice production environment, what critical function does an Nginx or Envoy Reverse Proxy perform at the network edge?',
    options: [
      { id: 'A', text: 'SSL/TLS termination, request routing, rate limiting, and compression before traffic reaches backend containers' },
      { id: 'B', text: 'Compiling Java bytecode into assembly' },
      { id: 'C', text: 'Deleting stale database records' },
      { id: 'D', text: 'Writing customer credit card numbers into plaintext log files' }
    ],
    correct: 'A',
    explanation: 'A reverse proxy sits in front of private backend servers to terminate HTTPS certificates, compress responses (gzip/brotli), enforce rate limits, and proxy HTTP requests across internal container ports.',
    mistakeDiagnostic: 'Mistake: Thinking reverse proxies only balance load. They protect backend clusters by offloading cryptographic TLS handshakes and enforcing edge security policies.',
    officialDocLink: {
      title: 'Nginx Official Documentation: Reverse Proxy Architecture Guide',
      url: 'https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/',
      source: 'F5 / NGINX Docs'
    }
  },
  {
    id: 'i-cloud-3',
    topicTag: 'cloud',
    type: 'scenario',
    typeLabel: 'Infrastructure as Code (Terraform State Drift)',
    level: 2,
    levelName: 'Intermediate',
    prompt: 'An engineer manually changes an AWS EC2 instance type from `t3.medium` to `c5.xlarge` in the AWS Web Console. When the team later runs `terraform plan`, what will Terraform report and propose?',
    options: [
      { id: 'A', text: 'Terraform detects "State Drift" between reality and code, and proposes modifying or recreating the instance to match the `t3.medium` declared in the `.tf` file' },
      { id: 'B', text: 'Terraform automatically rewrites the engineer\'s local Git repository to say `c5.xlarge`' },
      { id: 'C', text: 'Terraform deletes the entire AWS account' },
      { id: 'D', text: 'Terraform ignores the difference and does nothing' }
    ],
    correct: 'A',
    explanation: 'Terraform enforces declarative desired state. When out-of-band manual changes occur in the cloud console, Terraform discovers the drift during refresh and attempts to revert reality back to the declared configuration code.',
    mistakeDiagnostic: 'Mistake: Believing Terraform updates your source code when cloud changes occur. Terraform treats your `.tf` code as the source of truth and reverts manual console edits.',
    officialDocLink: {
      title: 'HashiCorp Terraform Documentation: State & Drift Detection',
      url: 'https://developer.hashicorp.com/terraform/tutorials/state',
      source: 'HashiCorp Official'
    }
  },

  // --- Embedded Systems Intermediate ---
  {
    id: 'i-rtos-1',
    topicTag: 'embedded',
    type: 'mcq',
    typeLabel: 'FreeRTOS Priority Inversion Mitigation',
    level: 2,
    levelName: 'Intermediate',
    prompt: 'In a real-time embedded system (RTOS), how does Priority Inheritance prevent unbounded Priority Inversion when a low-priority task holds a mutex needed by a high-priority task?',
    options: [
      { id: 'A', text: 'It temporarily elevates the low-priority task to the priority of the highest-priority task waiting for the mutex until it releases the lock' },
      { id: 'B', text: 'It permanently terminates the low-priority task immediately' },
      { id: 'C', text: 'It disables all hardware timers on the microcontroller' },
      { id: 'D', text: 'It resets the microcontroller watchdog timer' }
    ],
    correct: 'A',
    explanation: 'Priority Inheritance temporarily boosts the low-priority task to the priority of the waiting high-priority task, preventing intermediate-priority tasks from preempting it and holding up the critical task.',
    mistakeDiagnostic: 'Mistake: Confusing priority inheritance with task cancellation. The low-priority task must run and finish its critical section as fast as possible by borrowing the higher priority.',
    officialDocLink: {
      title: 'FreeRTOS Official Kernel Guide: Priority Inversion & Mutexes',
      url: 'https://www.freertos.org/Documentation/02-Kernel/02-Kernel-features/01-Tasks-and-co-routines/01-Tasks',
      source: 'FreeRTOS (AWS)'
    }
  },
  {
    id: 'i-emb-2',
    topicTag: 'embedded',
    type: 'mcq',
    typeLabel: 'Direct Memory Access (DMA) in High-Speed Data Streaming',
    level: 2,
    levelName: 'Intermediate',
    prompt: 'Why is Direct Memory Access (DMA) essential when streaming high-speed sensor ADC samples or UART data into microcontroller RAM at 20 Megabits/second?',
    options: [
      { id: 'A', text: 'DMA transfers data bytes directly between peripheral registers and RAM without interrupting or consuming CPU instruction cycles on every byte' },
      { id: 'B', text: 'DMA converts analog voltages into AC electricity' },
      { id: 'C', text: 'DMA disables compiler optimizations' },
      { id: 'D', text: 'DMA increases Wi-Fi radio transmission distance by 50 miles' }
    ],
    correct: 'A',
    explanation: 'Without DMA, the CPU must service an interrupt for every single byte, burning 100% of CPU cycles in ISR overhead. DMA transfers hardware buffers directly to RAM in the background and only notifies the CPU once the entire buffer is complete.',
    mistakeDiagnostic: 'Mistake: Believing the CPU must manually copy every byte from hardware registers. DMA unloads byte transfers to dedicated hardware controllers.',
    officialDocLink: {
      title: 'ARM Cortex-M Direct Memory Access (DMA) Controller Architecture',
      url: 'https://developer.arm.com/documentation',
      source: 'ARM Developer'
    }
  },
  {
    id: 'i-emb-3',
    topicTag: 'embedded',
    type: 'scenario',
    typeLabel: 'Mechanical Switch Contact Bouncing Mitigation',
    level: 2,
    levelName: 'Intermediate',
    prompt: 'When a user presses a tactile pushbutton connected to a GPIO interrupt, the microcontroller registers 15 button press interrupts instead of 1. What physical phenomenon causes this and how is it solved?',
    options: [
      { id: 'A', text: 'Contact Bouncing: the physical metal contacts mechanically bounce for 5-20 milliseconds. Solved via a software debounce timer (e.g. 20ms lockout) or hardware RC low-pass filter' },
      { id: 'B', text: 'Quantum tunneling in the silicon crystal' },
      { id: 'C', text: 'The GPIO pin ran out of electrons' },
      { id: 'D', text: 'The pull-up resistor caught fire' }
    ],
    correct: 'A',
    explanation: 'Mechanical spring contacts oscillate and bounce against each other before settling into a closed state. Because microcontrollers run at millions of instructions per second, every bounce looks like a valid button press without debouncing.',
    mistakeDiagnostic: 'Mistake: Assuming mechanical switches transition cleanly between 0 and 1. Mechanical contacts physically bounce for milliseconds; debouncing logic is mandatory.',
    officialDocLink: {
      title: 'Embedded.com: Guide to Debouncing Mechanical Switches',
      url: 'https://developer.arm.com/documentation',
      source: 'Embedded Systems Design'
    }
  },

  // --- AI/ML Intermediate ---
  {
    id: 'i-aiml-1',
    topicTag: 'aiml',
    type: 'code_analysis',
    typeLabel: 'Transformer Scaled Dot-Product Attention Mechanics',
    level: 2,
    levelName: 'Intermediate',
    prompt: 'In the Transformer Attention formula `Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V`, why is the dot product divided by `sqrt(d_k)`?',
    options: [
      { id: 'A', text: 'To prevent large values of d_k from causing the dot product to grow huge, which pushes the softmax function into regions with vanishingly small gradients' },
      { id: 'B', text: 'To convert token embeddings into audio frequencies' },
      { id: 'C', text: 'To reduce the matrix dimensions from 3D to 1D' },
      { id: 'D', text: 'To force all attention weights to equal zero' }
    ],
    correct: 'A',
    explanation: 'For large projection dimensions `d_k`, the dot product grows large in magnitude, pushing softmax into flat saturation zones where its derivative is near zero (vanishing gradient). Scaling by `1/sqrt(d_k)` keeps variance at 1.',
    mistakeDiagnostic: 'Mistake: Overlooking gradient stability. Without scaling by sqrt(d_k), softmax saturates and backpropagation fails during deep transformer training.',
    officialDocLink: {
      title: 'Attention Is All You Need (Vaswani et al. 2017) Paper & PyTorch Implementation',
      url: 'https://pytorch.org/docs/stable/generated/torch.nn.MultiheadAttention.html',
      source: 'NeurIPS / PyTorch'
    }
  },
  {
    id: 'i-aiml-2',
    topicTag: 'aiml',
    type: 'scenario',
    typeLabel: 'Retrieval-Augmented Generation (RAG) Chunking & Embeddings',
    level: 2,
    levelName: 'Intermediate',
    prompt: 'In an enterprise RAG system, the LLM hallucinates answers when querying 500-page PDF financial reports. How does chunking strategy with semantic vector embeddings improve accuracy?',
    options: [
      { id: 'A', text: 'Splitting documents into semantically coherent chunks (e.g. 512 tokens with 50-token overlap) and matching user query embeddings via cosine similarity ensures only relevant context enters the LLM prompt' },
      { id: 'B', text: 'Feeding all 500 pages into the system prompt on every user query' },
      { id: 'C', text: 'Deleting all tables and numbers from the document' },
      { id: 'D', text: 'Converting the PDF into a JPEG screenshot' }
    ],
    correct: 'A',
    explanation: 'RAG works by retrieving the top-k most semantically relevant text chunks using dense vector embeddings (e.g. cosine distance in a vector DB like Chroma/Milvus), injecting only precise factual context into the LLM context window.',
    mistakeDiagnostic: 'Mistake: Stuffing massive raw documents into prompts without chunking. Proper overlap and semantic chunking prevent losing context across sentence boundaries.',
    officialDocLink: {
      title: 'Hugging Face / LangChain: RAG Architecture & Vector Indexing',
      url: 'https://huggingface.co/docs/transformers/index',
      source: 'Hugging Face Official'
    }
  },
  {
    id: 'i-aiml-3',
    topicTag: 'aiml',
    type: 'mcq',
    typeLabel: 'Parameter-Efficient Fine-Tuning (LoRA)',
    level: 2,
    levelName: 'Intermediate',
    prompt: 'How does Low-Rank Adaptation (LoRA) enable fine-tuning a 70-Billion parameter LLM on consumer GPUs with limited VRAM?',
    options: [
      { id: 'A', text: 'It freezes the original model weights W and only trains two low-rank matrices A and B (where ΔW = B * A with rank r << d), reducing trainable parameters by 99%' },
      { id: 'B', text: 'It deletes 90% of the transformer layers' },
      { id: 'C', text: 'It compiles the model to run without a GPU' },
      { id: 'D', text: 'It quantizes all words into 2-letter tokens' }
    ],
    correct: 'A',
    explanation: 'LoRA assumes weight updates have a low intrinsic dimension. Instead of updating all parameters, it decomposes the update `ΔW` into two small low-rank matrices `B * A`. Only `A` and `B` receive gradients, saving massive GPU memory.',
    mistakeDiagnostic: 'Mistake: Thinking fine-tuning always requires updating all 70B weights. LoRA achieves near-identical task adaptation by training less than 1% of parameters.',
    officialDocLink: {
      title: 'Hugging Face PEFT: Low-Rank Adaptation (LoRA) Guide',
      url: 'https://huggingface.co/docs/peft/index',
      source: 'Hugging Face PEFT'
    }
  },

  // --- Concurrency & Systems Intermediate ---
  {
    id: 'i-con-1',
    topicTag: 'concurrency',
    type: 'code_analysis',
    typeLabel: 'TOCTOU Race Condition Analysis',
    level: 2,
    levelName: 'Intermediate',
    prompt: 'Examine this concurrent banking withdrawal service. Under high multi-threaded concurrency, what critical failure occurs?',
    codeSnippet: {
      language: 'typescript',
      code: `class BankAccount {\n  private balance = 1000;\n\n  async withdraw(amount: number): Promise<boolean> {\n    if (this.balance >= amount) {\n      await logTransactionAudit(amount); // Asynchronous I/O call\n      this.balance -= amount;\n      return true;\n    }\n    return false;\n  }\n}`
    },
    options: [
      { id: 'A', text: 'A memory leak in Node.js event loop caused by Promise closures' },
      { id: 'B', text: 'A Time-of-Check to Time-of-Use (TOCTOU) race condition: interleaved async calls can overdraw balance below zero' },
      { id: 'C', text: 'TypeScript compiler emits a static type error on `this.balance -= amount`' },
      { id: 'D', text: 'Audit logging blocks the main thread synchronously' }
    ],
    correct: 'B',
    explanation: 'Because `await logTransactionAudit` yields the thread between checking the balance and modifying the balance, multiple concurrent requests can all pass the check before any subtraction happens, causing balance to go negative.',
    mistakeDiagnostic: 'Mistake: Believing async/await is atomic. Yielding the event loop during an asynchronous call allows other tasks to run and invalidate prior state checks. Use ACID transactions or locks.',
    officialDocLink: {
      title: 'PostgreSQL Official Docs: Transaction Isolation & Concurrency',
      url: 'https://www.postgresql.org/docs/current/transaction-iso.html',
      source: 'PostgreSQL Global Development Group'
    }
  },
  {
    id: 'i-cache-1',
    topicTag: 'cache',
    type: 'numerical_estimate',
    typeLabel: 'Cache Hit Ratio & Database Query Load Calculation',
    level: 2,
    levelName: 'Intermediate',
    prompt: 'An API service receives 20,000 read requests per second. With an in-memory Redis cache hit ratio of 94%, how many queries per second (QPS) will hit the underlying relational database?',
    options: [
      { id: 'A', text: '120 QPS' },
      { id: 'B', text: '1,200 QPS' },
      { id: 'C', text: '18,800 QPS' },
      { id: 'D', text: '2,000 QPS' }
    ],
    correct: 'B',
    explanation: 'Cache miss rate = 100% - 94% = 6%. Uncached requests forwarded to primary DB = 20,000 * 0.06 = 1,200 QPS.',
    mistakeDiagnostic: 'Mistake: Multiplying total traffic by the hit rate rather than the miss rate. Database load comes from the misses: (1 - 0.94) * 20,000 = 1,200 QPS.',
    officialDocLink: {
      title: 'Redis Official Documentation: Caching & Eviction Strategies',
      url: 'https://redis.io/docs/latest/develop/data-types/',
      source: 'Redis.io Official'
    }
  },
  {
    id: 'i-cache-2',
    topicTag: 'cache',
    type: 'scenario',
    typeLabel: 'Cache Stampede (Thundering Herd) Mitigation',
    level: 2,
    levelName: 'Intermediate',
    prompt: 'A popular product page on an e-commerce site experiences 50,000 concurrent requests. The Redis cached key for this product expires. What failure occurs and how do you prevent it?',
    options: [
      { id: 'A', text: 'Cache Stampede: all 50,000 requests simultaneously miss and overload the database. Prevent via mutex locking (single-flight) or probabilistic early recomputation' },
      { id: 'B', text: 'Memory leak in Redis event loop; prevent by deleting all products' },
      { id: 'C', text: 'Network switch port exhaustion; prevent by switching to UDP' },
      { id: 'D', text: 'CPU branch misprediction; prevent by rewriting backend in Assembly' }
    ],
    correct: 'A',
    explanation: 'When a hot key expires, thousands of threads simultaneously query the DB to recompute it. Mutex locking ensures only one thread queries the DB while others wait, preventing total database failure.',
    mistakeDiagnostic: 'Mistake: Assuming caching alone prevents database overload. Without single-flight mutexes or probabilistic early refresh (XFetch), cache expiration under high traffic crashes databases.',
    officialDocLink: {
      title: 'System Design Primer: Cache Invalidation & Thundering Herd',
      url: 'https://github.com/donnemartin/system-design-primer#caching',
      source: 'System Design Primer'
    }
  },
  {
    id: 'i-sec-1',
    topicTag: 'security',
    type: 'code_analysis',
    typeLabel: 'SQL Injection Vulnerability in Dynamic Query',
    level: 2,
    levelName: 'Intermediate',
    prompt: 'Identify the security vulnerability in this authentication snippet and the correct remediation:',
    codeSnippet: {
      language: 'typescript',
      code: `const query = "SELECT * FROM users WHERE username = '" + req.body.username + "' AND password_hash = '" + req.body.password + "'";\nconst result = await db.raw(query);`
    },
    options: [
      { id: 'A', text: 'SQL Injection vulnerability via string concatenation. Remediate by using parameterized queries with prepared statements (e.g. `db.query("SELECT * FROM users WHERE username = $1", [username])`)' },
      { id: 'B', text: 'Buffer overflow in the V8 engine; remediate by upgrading Node.js' },
      { id: 'C', text: 'Timing attack on strings; remediate by adding a 5-second sleep' },
      { id: 'D', text: 'Syntax error because SQL queries must always be written in uppercase' }
    ],
    correct: 'A',
    explanation: 'Concatenating user input into raw SQL allows attackers to inject malicious SQL clauses (e.g. `\' OR \'1\'=\'1`). Parameterized queries separate query structure from untrusted user data, neutralizing injection.',
    mistakeDiagnostic: 'Mistake: Relying on string escaping or sanitization instead of native parameterized queries. Prepared statements are the industry standard defense against SQL injection.',
    officialDocLink: {
      title: 'OWASP Top 10: SQL Injection Prevention Cheat Sheet',
      url: 'https://owasp.org/www-project-top-ten/',
      source: 'OWASP Foundation'
    }
  },
  {
    id: 'i-api-1',
    topicTag: 'api',
    type: 'mcq',
    typeLabel: 'HTTP Status Code Idempotency & Safe Methods',
    level: 2,
    levelName: 'Intermediate',
    prompt: 'Under RFC 9110 HTTP semantics, which set of HTTP methods are strictly defined as idempotent?',
    options: [
      { id: 'A', text: 'GET, HEAD, PUT, DELETE, and OPTIONS' },
      { id: 'B', text: 'POST, PATCH, and CONNECT' },
      { id: 'C', text: 'Only POST and GET' },
      { id: 'D', text: 'No HTTP methods are idempotent' }
    ],
    correct: 'A',
    explanation: 'Idempotent methods can be called multiple times with the exact same side-effect on the server as calling them once. GET, HEAD, PUT, DELETE, and OPTIONS are idempotent. POST and PATCH are not.',
    mistakeDiagnostic: 'Mistake: Thinking DELETE is not idempotent because the second call might return 404. Idempotency refers to the server side-effect state (the resource remains deleted), not the response body.',
    officialDocLink: {
      title: 'MDN Web Docs: HTTP Idempotent Methods Specification',
      url: 'https://developer.mozilla.org/en-US/docs/Glossary/Idempotent',
      source: 'MDN Web Docs'
    }
  },

  // ============================================================================
  // LEVEL 3: ADVANCED (High Scale, Distributed Systems, Sharding, CAP, Raft)
  // ============================================================================
  {
    id: 'a-dist-1',
    topicTag: 'distributed',
    type: 'scenario',
    typeLabel: 'Microservice Cascading Outage & Circuit Breakers',
    level: 3,
    levelName: 'Advanced',
    prompt: 'Under flash traffic, Service B slows down due to high database contention. Service A keeps waiting and timing out, exhausting its thread pool and crashing. What pattern prevents this?',
    options: [
      { id: 'A', text: 'Circuit Breaker Pattern with exponential backoff and jittered retries to shed traffic when downstream dependencies fail' },
      { id: 'B', text: 'Increase HTTP request timeouts from 5 seconds to 120 seconds' },
      { id: 'C', text: 'Disable all logging across both microservices' },
      { id: 'D', text: 'Scale the database server vertically by 20x' }
    ],
    correct: 'A',
    explanation: 'Circuit breakers trip open when failure thresholds are breached, returning fast local fallbacks instead of tying up worker threads and propagating failures upstream.',
    mistakeDiagnostic: 'Mistake: Increasing timeouts when downstream services slow down. Lengthening timeouts ties up worker threads longer, accelerating thread pool exhaustion and total crash.',
    officialDocLink: {
      title: 'Microservices.io: Circuit Breaker Resiliency Pattern',
      url: 'https://microservices.io/patterns/reliability/circuit-breaker.html',
      source: 'Microservices.io'
    }
  },
  {
    id: 'a-dist-2',
    topicTag: 'distributed',
    type: 'mcq',
    typeLabel: 'CAP Theorem & PACELC Trade-offs',
    level: 3,
    levelName: 'Advanced',
    prompt: 'In a distributed database facing a network partition (P), what does the PACELC theorem dictate regarding system behavior in the absence of partitions (Else)?',
    options: [
      { id: 'A', text: 'Else, the system must choose between Latency (L) and Consistency (C)' },
      { id: 'B', text: 'Else, the system automatically shuts down all read replicas' },
      { id: 'C', text: 'Else, the database achieves zero latency with infinite storage' },
      { id: 'D', text: 'Else, the system must drop ACID transactions entirely' }
    ],
    correct: 'A',
    explanation: 'PACELC states: if Partition (P), choose between Availability (A) and Consistency (C); Else (E), choose between Latency (L) and Consistency (C). Even without partitions, maintaining strict consistency incurs replication latency overhead.',
    mistakeDiagnostic: 'Mistake: Thinking CAP theorem covers all operational states. Even under normal operation with zero network partitions, synchronizing nodes introduces unavoidable latency.',
    officialDocLink: {
      title: 'System Design Primer: CAP Theorem & PACELC Model',
      url: 'https://github.com/donnemartin/system-design-primer#cap-theorem',
      source: 'System Design Primer'
    }
  },
  {
    id: 'a-db-1',
    topicTag: 'dbms',
    type: 'mcq',
    typeLabel: 'Database Sharding & Hotspot Partitioning',
    level: 3,
    levelName: 'Advanced',
    prompt: 'When horizontally sharding a user database across 64 database nodes, why is sharding by `created_at` timestamp an anti-pattern?',
    options: [
      { id: 'A', text: 'It creates massive write hotspots because 100% of current write traffic hits only the single shard representing the current timestamp' },
      { id: 'B', text: 'Timestamps cannot be parsed by relational databases' },
      { id: 'C', text: 'Sharding by timestamp breaks primary key auto-increment constraints' },
      { id: 'D', text: 'Timestamp sharding requires 64 separate cloud providers' }
    ],
    correct: 'A',
    explanation: 'Monotonically increasing shard keys like `created_at` send all new write operations to the single active shard for today, leaving the other 63 shards idle. Hash sharding by `user_id` distributes load evenly.',
    mistakeDiagnostic: 'Mistake: Using sequential or temporal keys as shard keys. Good shard keys must distribute concurrent writes uniformly across all nodes.',
    officialDocLink: {
      title: 'System Design Primer: Horizontal Database Sharding Strategies',
      url: 'https://github.com/donnemartin/system-design-primer#sharding',
      source: 'System Design Primer'
    }
  },

  // ============================================================================
  // LEVEL 4: EXPERT (Consensus, Zero-Downtime, Hardware Profile, Kernel Tuning)
  // ============================================================================
  {
    id: 'e-cons-1',
    topicTag: 'distributed',
    type: 'scenario',
    typeLabel: 'Raft Consensus Split-Brain Prevention',
    level: 4,
    levelName: 'Expert',
    prompt: 'In a 5-node Raft consensus cluster, a network partition isolates 2 nodes on side A and 3 nodes on side B. What happens to write requests sent to side A?',
    options: [
      { id: 'A', text: 'Side A cannot achieve a quorum majority (3 out of 5), so all write proposals are rejected or queued without committing' },
      { id: 'B', text: 'Side A elects a rogue leader and commits divergent state permanently' },
      { id: 'C', text: 'Both sides merge writes automatically using vector clocks' },
      { id: 'D', text: 'All 5 nodes reboot immediately' }
    ],
    correct: 'A',
    explanation: 'Raft requires a strict majority quorum (`N/2 + 1`, which is 3 out of 5 nodes). The 2-node partition on Side A cannot reach quorum and cannot commit writes, preventing split-brain corruption.',
    mistakeDiagnostic: 'Mistake: Thinking isolated partitions can commit state in leader-based consensus systems. Strict majority requirements prevent split-brain state divergence.',
    officialDocLink: {
      title: 'Raft Consensus Algorithm Paper & Interactive Visualization',
      url: 'https://raft.github.io/',
      source: 'Stanford University'
    }
  },
  {
    id: 'e-ebpf-1',
    topicTag: 'cloud',
    type: 'mcq',
    typeLabel: 'Linux Kernel Observability with eBPF',
    level: 4,
    levelName: 'Expert',
    prompt: 'What unique architectural advantage does eBPF (Extended Berkeley Packet Filter) provide for production observability and security in cloud clusters?',
    options: [
      { id: 'A', text: 'It runs sandboxed bytecode safely inside the Linux kernel at runtime without modifying kernel source code or loading unstable external modules' },
      { id: 'B', text: 'It replaces all userland software with Assembly language' },
      { id: 'C', text: 'It prevents all network traffic from entering the operating system' },
      { id: 'D', text: 'It compiles web applications into GPU shaders' }
    ],
    correct: 'A',
    explanation: 'eBPF allows safe, event-driven sandboxed bytecode to execute directly in the Linux kernel on socket events, system calls, and network traces with minimal overhead and zero kernel recompilation.',
    mistakeDiagnostic: 'Mistake: Believing kernel tracing requires dangerous proprietary kernel modules. eBPF provides verified, non-crashing kernel runtime hooks.',
    officialDocLink: {
      title: 'eBPF Documentation & Architecture Guide',
      url: 'https://ebpf.io/what-is-ebpf/',
      source: 'Linux Foundation / eBPF Project'
    }
  }
];

/**
 * Smart Non-Repeating Question Selector
 * Retrieves at least 5 to 10 distinct questions for the requested level and topic.
 * Excludes previously answered questions (excludeIds) so retests present fresh questions!
 */
export function getAdaptiveQuestionsForTopic(
  topicTitle: string,
  level: number = 1,
  count: number = 5,
  excludeIds: string[] = []
): AdaptiveLevelQuestion[] {
  const norm = (topicTitle || '').toLowerCase();
  const levelNames = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;
  const targetLevelName = levelNames[Math.min(3, Math.max(0, level - 1))];

  // Primary filter by level
  const candidatesAtLevel = COMPREHENSIVE_LEVEL_QUESTIONS.filter(
    (q) => q.level === level || q.levelName === targetLevelName
  );

  // Score candidate relevance by topic keywords
  const scored = candidatesAtLevel.map((q) => {
    let score = 0;
    if (norm.includes('python') && q.topicTag === 'python') score += 15;
    if ((norm.includes('sql') || norm.includes('database') || norm.includes('dbms')) && (q.topicTag === 'sql' || q.topicTag === 'dbms')) score += 15;
    if ((norm.includes('data') || norm.includes('algorithm') || norm.includes('dsa')) && q.topicTag === 'dsa') score += 15;
    if ((norm.includes('cloud') || norm.includes('devops') || norm.includes('kubernetes') || norm.includes('docker')) && q.topicTag === 'cloud') score += 15;
    if ((norm.includes('embed') || norm.includes('hardware') || norm.includes('firmware') || norm.includes('iot')) && q.topicTag === 'embedded') score += 15;
    if ((norm.includes('ai') || norm.includes('machine learning') || norm.includes('ml') || norm.includes('deep learning')) && q.topicTag === 'aiml') score += 15;
    if (norm.includes('concurrency') && q.topicTag === 'concurrency') score += 15;
    if (norm.includes('cache') && q.topicTag === 'cache') score += 15;
    if (norm.includes('security') && q.topicTag === 'security') score += 15;

    // Check prompt and type label text
    if (q.prompt.toLowerCase().includes(norm) || norm.includes(q.typeLabel.toLowerCase())) {
      score += 5;
    }

    return { q, score };
  });

  // Sort by relevance score
  scored.sort((a, b) => b.score - a.score);

  // Filter out excluded IDs to prevent repeating questions
  const freshList = scored
    .map((s) => s.q)
    .filter((q) => !excludeIds.includes(q.id));

  let result: AdaptiveLevelQuestion[] = [];
  if (freshList.length >= count) {
    // We have enough fresh questions! Take the top relevant ones (or shuffle top pool)
    const topPool = freshList.slice(0, Math.max(count, count + 2));
    result = [...topPool].sort(() => 0.5 - Math.random()).slice(0, count);
  } else {
    // Take all fresh ones, then fill remaining slots with candidates from level not in freshList
    const remainingNeeded = count - freshList.length;
    const fallbackCandidates = candidatesAtLevel
      .filter((q) => !freshList.some((f) => f.id === q.id))
      .sort(() => 0.5 - Math.random());

    result = [...freshList, ...fallbackCandidates.slice(0, remainingNeeded)];
  }

  // Ensure count is strictly met (minimum 5)
  if (result.length < count) {
    const filler = COMPREHENSIVE_LEVEL_QUESTIONS.filter((q) => !result.some((r) => r.id === q.id));
    result = [...result, ...filler].slice(0, Math.max(5, count));
  }

  return result.slice(0, count);
}

/**
 * Backward compatibility generator
 */
export function generateAdaptiveLevelQuestions(topicTitle: string, level: number = 1): AdaptiveLevelQuestion[] {
  return getAdaptiveQuestionsForTopic(topicTitle, level, 5, []);
}
