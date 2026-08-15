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
