export type Role = {
  company: string;
  title: string;
  location: string;
  period: string;
  current?: boolean;
  summary: string;
  points: string[];
  stack: string[];
};

/**
 * Dates are the canonical set from the GitHub profile README — the live v0 site
 * carried an older, conflicting set that omitted Strateger AI entirely.
 */
export const experience: Role[] = [
  {
    company: "Strateger AI",
    title: "Full-Stack AI Engineer",
    location: "Lahore",
    period: "Jul 2025 — Present",
    current: true,
    summary:
      "Enterprise AI: computer-vision pipelines and LLM agents, deployed on automated multi-region cloud infrastructure.",
    points: [
      "Built the AI Board Scanner — a diagram recognition pipeline using RF-DETR detection, PaddleOCR, and SAM2 segmentation, reaching 0.83 mAP and 97% arrow-association accuracy.",
      "Engineered binary-mask pipelines with KD-trees, skeletonisation, and spatial algorithms to reconstruct graph topology from raw engineering drawings.",
      "Deployed LLM-powered conversational agents through Amazon Lex and Bedrock, with Dockerised FastAPI services on AWS.",
      "Automated cloud infrastructure with Terraform and Terragrunt for repeatable multi-region enterprise deployments.",
    ],
    stack: ["RF-DETR", "SAM2", "PaddleOCR", "FastAPI", "AWS Bedrock", "Terraform", "Docker"],
  },
  {
    company: "Gojins",
    title: "MERN Stack Developer",
    location: "Lahore",
    period: "Aug 2024 — Jun 2025",
    summary:
      "Production business platforms for real operators, with ML woven into the workflows rather than bolted on.",
    points: [
      "Built business management platforms and a real-time portfolio builder with custom domain support.",
      "Shipped a full HRMS covering payroll, attendance, leave tracking, and performance analytics.",
      "Integrated ML models for predictive diagnostics and workflow automation across the product suite.",
    ],
    stack: ["React", "Node.js", "Express", "MongoDB", "JWT", "REST APIs"],
  },
  {
    company: "UNAZ Legal Services",
    title: "Junior Software Developer",
    location: "Nowshera",
    period: "Jan 2024 — May 2024",
    summary: "First production role — legal-sector internal tooling.",
    points: [
      "Developed a lawyer case management application and a Zakat automation system.",
      "Focused on async programming patterns, responsive UI, and scalable API design.",
    ],
    stack: ["React", "Node.js", "Context API"],
  },
];
