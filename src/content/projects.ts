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
  /** Rendered only when present — this is what prevents dead "Code" buttons. */
  repoUrl?: string;
  demoUrl?: string;
};

export const projects: Project[] = [
  {
    slug: "ai-board-scanner",
    title: "AI Board Scanner",
    context: "Strateger AI · Production",
    year: "2025 — present",
    blurb:
      "A diagram-recognition pipeline that reads engineering drawings and rebuilds them as structured, queryable graphs.",
    highlights: [
      "RF-DETR detection combined with PaddleOCR text extraction and SAM2 segmentation to isolate every node and connector.",
      "Binary-mask pipeline using KD-trees, skeletonisation, and spatial heuristics to resolve which arrow connects which pair of nodes.",
      "Dockerised FastAPI service deployed to AWS, with Terraform-managed infrastructure across regions.",
    ],
    stack: ["RF-DETR", "SAM2", "PaddleOCR", "Python", "FastAPI", "Docker", "AWS"],
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
      "Quantum optimisation for power-grid resilience — QAOA run on real quantum hardware to cut blackout exposure.",
    highlights: [
      "Applied the Quantum Approximate Optimization Algorithm to Max-Cut over electricity distribution networks.",
      "Introduced light-cone decomposition as quantum preconditioning, partitioning large grids into subgraphs that fit hardware limits — a ~10× speedup over standard QAOA.",
      "Executed against Rigetti's 84-qubit Ankaa-3 QPU via PyQuil and Quantum Cloud Services, with an interactive dashboard for circuits, measurements, and sustainability metrics.",
    ],
    stack: ["React", "TypeScript", "PyQuil", "Rigetti Ankaa-3", "QAOA", "Vite"],
    metrics: [
      { value: "84", label: "qubit QPU" },
      { value: "10×", label: "speedup vs. standard QAOA" },
    ],
    image: "/projects/eleqtric.webp",
    repoUrl: "https://github.com/wasifullah7/Q-volution-Hackathon",
    demoUrl: "https://q-volution-hackathon-theta.vercel.app/",
  },
  {
    slug: "document-intelligence-pipeline",
    title: "Document Intelligence Pipeline",
    context: "Open source",
    year: "2026",
    blurb:
      "Fully offline document understanding — ingest, classify, extract, and semantically search PDFs with no cloud dependency.",
    highlights: [
      "Text extraction with PyMuPDF, zero-shot classification via DeBERTa-v3, and field extraction combining regex with spaCy NER.",
      "Semantic search over documents using bge-small-en-v1.5 embeddings stored in ChromaDB.",
      "Runs CPU-only in ~287 MB of models, exposed through a FastAPI service with Swagger docs — deployable where data can't leave the building.",
    ],
    stack: ["Python", "FastAPI", "ChromaDB", "spaCy", "Transformers", "PyMuPDF"],
    metrics: [
      { value: "3", label: "document types" },
      { value: "0", label: "cloud calls" },
    ],
    image: "/projects/document-intelligence.webp",
    repoUrl: "https://github.com/wasifullah7/document-intelligence-pipeline",
  },
  {
    slug: "ai-career-coach",
    title: "AI Career Coach",
    context: "Independent",
    year: "2025",
    blurb:
      "A job recommendation engine built on retrieval-augmented generation over real labour-market data.",
    highlights: [
      "RAG pipeline backed by a Pinecone vector database for semantic matching between candidate profiles and postings.",
      "Trained and evaluated against Dice.com job-market data, reaching 89% predictive accuracy.",
    ],
    stack: ["RAG", "Pinecone", "Python", "LLM"],
    metrics: [{ value: "89%", label: "predictive accuracy" }],
    image: "/projects/ai-career-coach.webp",
  },
  {
    slug: "llm-finetuning",
    title: "LLM Fine-tuning & Deployment",
    context: "Strateger AI",
    year: "2025",
    blurb:
      "Fine-tuned conversational models and the automated pipeline that trains and ships them.",
    highlights: [
      "Fine-tuned models on the EmpatheticDialogues dataset for higher-quality conversational tone.",
      "Automated the training pipeline and deployed via Amazon Bedrock, Lex, and Lambda.",
    ],
    stack: ["Amazon Bedrock", "AWS Lambda", "Amazon Lex", "Python"],
    image: "/projects/llm-finetuning.webp",
  },
  {
    slug: "psl-recognition",
    title: "Pakistani Sign Language Recognition",
    context: "Final Year Project",
    year: "2025",
    blurb:
      "A GAN-based system for assistive communication, generating and recognising Pakistani Sign Language.",
    highlights: [
      "GAN architecture reaching 85% accuracy on sign-language image generation.",
      "Built a custom dataset and image-processing pipeline that lifted model performance by 20%.",
    ],
    stack: ["TensorFlow", "GAN", "OpenCV", "Python"],
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
    title: "Rock–Paper–Scissors Classifier",
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
