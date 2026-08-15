export type SkillGroup = {
  title: string;
  caption: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "AI / ML & Vision",
    caption: "Detection, segmentation, OCR, and the glue between them.",
    items: [
      "RF-DETR",
      "YOLOv8",
      "YOLO-NAS",
      "SAM2",
      "PaddleOCR",
      "OpenCV",
      "TensorFlow",
      "scikit-learn",
      "NumPy",
      "pandas",
    ],
  },
  {
    title: "LLM Engineering",
    caption: "Retrieval, fine-tuning, and agents that ship.",
    items: [
      "RAG pipelines",
      "Pinecone",
      "ChromaDB",
      "Amazon Bedrock",
      "Amazon Lex",
      "Model fine-tuning",
      "Prompt engineering",
      "spaCy",
    ],
  },
  {
    title: "Full Stack",
    caption: "Product surfaces and the APIs behind them.",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Express",
      "FastAPI",
      "MongoDB",
      "PostgreSQL",
      "REST APIs",
      "JWT",
    ],
  },
  {
    title: "Cloud & DevOps",
    caption: "Infrastructure that is reproducible, not hand-made.",
    items: [
      "AWS Lambda",
      "SageMaker",
      "API Gateway",
      "Docker",
      "Terraform",
      "Terragrunt",
      "Git",
      "Agile",
    ],
  },
];

/** Flat list used by the marquee band. */
export const marqueeSkills = [
  "RF-DETR",
  "SAM2",
  "PaddleOCR",
  "YOLOv8",
  "TensorFlow",
  "OpenCV",
  "RAG",
  "Pinecone",
  "ChromaDB",
  "Amazon Bedrock",
  "FastAPI",
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "MongoDB",
  "PostgreSQL",
  "Docker",
  "Terraform",
  "AWS Lambda",
];
