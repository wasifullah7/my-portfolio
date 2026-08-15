export type Project = {
  slug: string;
  title: string;
  context: string;
  year: string;
  blurb: string;
  highlights: string[];
  stack: string[];
  metrics?: { value: string; label: string }[];
  image?: string;
  /** Rendered only when present. This is what prevents dead "Source" buttons. */
  repoUrl?: string;
  demoUrl?: string;
  /** Case-study detail for /work/[slug]. Pages render only when present. */
  problem?: string;
  approach?: string[];
  outcome?: string;
  /** Slugs from src/content/posts, for internal linking between work and writing. */
  relatedPosts?: string[];
};

export const projects: Project[] = [
  {
    slug: "ai-board-scanner",
    title: "AI Board Scanner",
    context: "Strateger AI / Production",
    year: "2025",
    blurb:
      "A diagram-recognition pipeline that reads engineering drawings and emits them as structured JSON.",
    highlights: [
      "RF-DETR object detection combined with PaddleOCR text extraction and SAM2 segmentation to isolate every node and connector.",
      "Binary mask pipelines using KD-trees, BFS skeletonisation, and colour and angle heuristics to resolve which arrow connects which pair of nodes, even with overlapping objects and OCR gaps.",
      "Dockerised FastAPI services on AWS EC2 and S3, with GitHub Actions CI/CD and Terraform-managed infrastructure across enterprise regions.",
    ],
    stack: ["RF-DETR", "SAM2", "PaddleOCR", "PyTorch", "FastAPI", "Docker", "AWS", "Terraform"],
    metrics: [
      { value: "0.83", label: "mAP" },
      { value: "97%", label: "arrow association" },
    ],
    image: "/projects/ai-board-scanner.webp",
    problem:
      "Enterprise engineering diagrams carry their meaning in structure: which box connects to which, in what direction. Off-the-shelf OCR returns floating text with no topology, and object detection returns boxes with no relationships. Neither answers the question the business actually asks, which is what does this diagram say.",
    approach: [
      "Detect every node and connector with RF-DETR, then read embedded text with PaddleOCR and isolate shapes with SAM2 segmentation.",
      "Reconstruct topology from the detections: binary mask pipelines, KD-tree nearest-neighbour search, and BFS skeletonisation to trace each arrow from tail to head.",
      "Resolve ambiguity with colour and angle heuristics where objects overlap or OCR drops characters, which is the normal case rather than the exception.",
      "Serve the result as structured JSON from a dockerised FastAPI service on AWS EC2 and S3, with GitHub Actions CI/CD and Terraform-managed infrastructure across regions.",
    ],
    outcome:
      "0.83 mAP on detection and 97% arrow-association accuracy against industry benchmarks, with output consumed directly by downstream frontend and enterprise integrations.",
  },
  {
    slug: "voice-ai-platform",
    title: "Production Voice AI Platform",
    context: "Production deployment",
    year: "2026",
    blurb:
      "Real-time telephony voice agents cut from 1.8 seconds of latency to under 300ms, with hybrid retrieval answering from a live industrial catalogue.",
    highlights: [
      "Replaced rigid IVR call flows with autonomous agents built on Twilio and LiveKit, streaming audio over WebSockets rather than request-response turns.",
      "Built hybrid retrieval combining pgvector similarity with BM25 keyword search behind async FastAPI, returning grounded answers in under 150ms.",
      "Tuned vLLM across a 3-node, 6-GPU cluster (A4500 and A100) serving a Qwen conversational model under high concurrency.",
    ],
    stack: ["LiveKit", "Twilio", "WebRTC", "vLLM", "FastAPI", "pgvector", "Python"],
    metrics: [
      { value: "300ms", label: "end-to-end latency, from 1.8s" },
      { value: "150ms", label: "hybrid RAG retrieval" },
    ],
    image: "/projects/voice-ai.webp",
    problem:
      "A voice agent that takes 1.8 seconds to answer is unusable. Humans read that pause as the line going dead and start talking over it. Every component in the chain, speech recognition, retrieval, inference and speech synthesis, has to be measured and cut, because latency is the product.",
    approach: [
      "Profile the full turn rather than guessing, then attack the largest segment first instead of micro-optimising the model.",
      "Stream over Twilio WebSockets so audio moves continuously rather than in discrete request-response turns.",
      "Combine pgvector semantic search with BM25 keyword matching, because catalogue queries contain part numbers that embeddings alone handle badly.",
      "Tune vLLM batching and concurrency across the GPU cluster so throughput holds up when many calls arrive at once.",
    ],
    outcome:
      "End-to-end response under 300ms, down from 1.8 seconds, with retrieval consistently under 150ms. The work is documented in detail across five engineering write-ups.",
    relatedPosts: [
      "how-i-reduced-voice-ai-latency-from-18-seconds-to-under",
      "architecting-sub-150ms-hybrid-rag-for-voice-agents",
      "beyond-the-sandbox",
      "how-i-optimized-vllm-for-high-concurrency-in-a-production",
      "from-call-flows-to-autonomous-agents",
    ],
  },
  {
    slug: "eleqtric",
    title: "Ele(Q)tric",
    context: "Q-volution Hackathon",
    year: "2026",
    blurb:
      "Quantum optimisation for power-grid resilience, running QAOA on real quantum hardware to cut blackout exposure.",
    highlights: [
      "Applied the Quantum Approximate Optimization Algorithm to Max-Cut over electricity distribution networks.",
      "Introduced light-cone decomposition as quantum preconditioning, partitioning large grids into subgraphs that fit hardware limits for roughly a 10x speedup over standard QAOA.",
      "Executed against Rigetti's 84-qubit Ankaa-3 QPU via PyQuil and Quantum Cloud Services, with an interactive dashboard for circuits, measurements, and sustainability metrics.",
    ],
    stack: ["React", "TypeScript", "PyQuil", "Rigetti Ankaa-3", "QAOA", "Vite"],
    metrics: [
      { value: "84", label: "qubit QPU" },
      { value: "10x", label: "speedup vs standard QAOA" },
    ],
    image: "/projects/eleqtric.webp",
    repoUrl: "https://github.com/wasifullah7/Q-volution-Hackathon",
    demoUrl: "https://q-volution-hackathon-theta.vercel.app/",
    problem:
      "Partitioning a power grid to minimise blackout cascade is a Max-Cut problem, which is NP-hard and grows intractable fast. Quantum hardware is theoretically suited to it, but real QPUs have too few qubits and too much noise to take a full grid graph directly.",
    approach: [
      "Formulate grid partitioning as Max-Cut and solve with the Quantum Approximate Optimization Algorithm.",
      "Apply light-cone decomposition as a preconditioning step, splitting the graph into subgraphs small enough to fit hardware limits while preserving the structure that matters.",
      "Execute against Rigetti's 84-qubit Ankaa-3 QPU through PyQuil and Quantum Cloud Services rather than a simulator.",
      "Surface circuits, measurement distributions and sustainability metrics in an interactive React dashboard so the result is inspectable, not a black box.",
    ],
    outcome:
      "Roughly a 10x speedup over standard QAOA on the same problems, running on real quantum hardware with a live public demo.",
  },
  {
    slug: "ai-career-coach",
    title: "AI Career Coach",
    context: "Independent",
    year: "2025",
    blurb:
      "A job recommendation engine built on retrieval-augmented generation over live labour-market data.",
    highlights: [
      "RAG pipeline backed by a Pinecone vector database, matching candidate profiles to postings by embedding similarity rather than keyword overlap.",
      "Evaluated against live job-market data, reaching 89% predictive accuracy.",
      "Served through a FastAPI REST layer with LangChain orchestrating retrieval and generation.",
    ],
    stack: ["FastAPI", "LangChain", "Pinecone", "Python", "REST API"],
    metrics: [{ value: "89%", label: "predictive accuracy" }],
    image: "/projects/ai-career-coach.webp",
  },
  {
    slug: "document-intelligence-pipeline",
    title: "Document Intelligence Pipeline",
    context: "Open source",
    year: "2026",
    blurb:
      "Fully offline document understanding: ingest, classify, extract, and semantically search PDFs with no cloud dependency.",
    highlights: [
      "Text extraction with PyMuPDF, zero-shot classification via DeBERTa-v3, and field extraction combining regex with spaCy NER.",
      "Semantic search using bge-small-en-v1.5 embeddings stored in ChromaDB.",
      "Runs CPU-only in roughly 287 MB of models behind a FastAPI service, deployable where data cannot leave the building.",
    ],
    stack: ["Python", "FastAPI", "ChromaDB", "spaCy", "Transformers", "PyMuPDF"],
    metrics: [
      { value: "287MB", label: "total model size" },
      { value: "0", label: "cloud calls" },
    ],
    image: "/projects/document-intelligence.webp",
    repoUrl: "https://github.com/wasifullah7/document-intelligence-pipeline",
    problem:
      "Plenty of organisations cannot send documents to a cloud API: legal, medical and financial records carry data that is not allowed to leave the building. That rules out most document-understanding tooling, which assumes an internet round trip.",
    approach: [
      "Extract text with PyMuPDF, then classify document type with zero-shot DeBERTa-v3 so new categories need no retraining.",
      "Pull structured fields with regex where the format is rigid and spaCy NER where it is not.",
      "Index bge-small-en-v1.5 embeddings in ChromaDB for semantic search across the whole corpus.",
      "Keep the entire model set under 300 MB and CPU-only, so it runs on ordinary hardware behind a firewall.",
    ],
    outcome:
      "Invoices, resumes and utility bills parsed to structured JSON with zero cloud calls, exposed through a FastAPI service with Swagger docs.",
  },
  {
    slug: "hrms-platform",
    title: "HRMS Platform",
    context: "Gojins / UK enterprise client",
    year: "2024",
    blurb:
      "End-to-end human resource management covering payroll, leave, attendance, performance reviews, and analytics.",
    highlights: [
      "Secure REST APIs with JWT authentication over a dual-database architecture combining PostgreSQL and MongoDB.",
      "Analytics dashboards surfacing attendance and performance trends for HR teams rather than raw tables.",
      "Shipped alongside a real-time Portfolio Builder with live editing and custom domain support.",
    ],
    stack: ["React", "Next.js", "Redux Toolkit", "Node.js", "Express", "PostgreSQL", "MongoDB", "JWT"],
    image: "/projects/hrms.webp",
  },
  {
    slug: "psl-recognition",
    title: "Pakistani Sign Language Recognition",
    context: "Final Year Project",
    year: "2025",
    blurb:
      "A GAN-based system for real-time image recognition of Pakistani Sign Language, built for assistive communication.",
    highlights: [
      "Generative Adversarial Network trained for real-time image-based sign recognition.",
      "Custom dataset and image-processing pipeline that lifted model performance by 20%.",
    ],
    stack: ["PyTorch", "OpenCV", "GAN", "Python"],
    metrics: [{ value: "85%", label: "accuracy" }],
    image: "/projects/psl.webp",
    relatedPosts: ["building-a-text-to-sign-language-for-pakistani-urdu"],
  },
];

export type EarlierWork = {
  title: string;
  note: string;
  repoUrl: string;
};

export const earlierWork: EarlierWork[] = [
  {
    title: "Rock-Paper-Scissors Classifier",
    note: "CNN gesture recognition, 92% accuracy",
    repoUrl: "https://github.com/wasifullah7/Rock_Paper_scissor",
  },
  {
    title: "Titanic Survival Predictor",
    note: "Classification with feature engineering, 89% accuracy",
    repoUrl: "https://github.com/wasifullah7/prediction_survival_on_titanic_dataset",
  },
  {
    title: "Real-Time Location Tracker",
    note: "Live location sharing with user management",
    repoUrl:
      "https://github.com/wasifullah7/Real-Time-Location-Tracker-with-User-Management",
  },
  {
    title: "Code Snippets Vault",
    note: "Reusable production-ready web snippets",
    repoUrl: "https://github.com/wasifullah7/code-snippets-vault",
  },
];
