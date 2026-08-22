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
 * Source of truth is WASIF_ULLAH.pdf (the CV). It supersedes both the old v0
 * site and the GitHub README, which disagreed with each other on dates and had
 * UNAZ in the wrong location.
 */
export const experience: Role[] = [
  {
    company: "RTC League",
    title: "Voice AI & Full-Stack AI Engineer",
    location: "Lahore, onsite",
    period: "Jul 2025 / Present",
    current: true,
    summary:
      "Real-time voice agents and computer-vision pipelines for enterprise clients in the UK, EU and beyond. Most of my time goes on making live calls fast enough to feel like a conversation.",
    points: [
      "Built real-time voice agents on LiveKit and SIP telephony, streaming audio rather than waiting on complete turns, and cut end-to-end response from 1.8 seconds to under 300 milliseconds.",
      "Tuned vLLM across a multi-node GPU cluster with continuous batching so throughput holds when many calls arrive at once, and built hybrid retrieval combining vector and keyword search that returns grounded answers in under 150 milliseconds.",
      "Designed an on-premise voice platform for a healthcare client where patient data could never leave their hardware, covering telephony, call analytics, a knowledge assistant and live agent assist.",
      "Architected and deployed the AI Board Scanner, an end-to-end diagram recognition system combining RF-DETR object detection, PaddleOCR text extraction, and SAM2 segmentation, achieving 0.83 mAP and 97% arrow-association accuracy against industry benchmarks.",
      "Built dynamic binary mask pipelines and spatial algorithms using KD-trees, BFS skeletonisation, and colour and angle detection logic to extract complex graphs from diagrams with overlapping objects and OCR gaps.",
      "Developed and dockerised FastAPI REST services for scalable deployment across AWS EC2 and S3, emitting structured JSON consumed by downstream frontend and enterprise integrations.",
      "Automated cloud infrastructure with Terraform and Terragrunt, supporting consistent rollout of AI microservices across multiple enterprise regions.",
      "Implemented CI/CD with GitHub Actions and Docker to streamline build, test, and deployment cycles across the AI backend.",
    ],
    stack: ["LiveKit", "SIP", "vLLM", "WebRTC", "RF-DETR", "SAM2", "PaddleOCR", "FastAPI", "Docker", "Terraform", "AWS"],
  },
  {
    company: "Gojins",
    title: "Full-Stack Developer",
    location: "Lahore, onsite",
    period: "Aug 2024 / Jun 2025",
    summary:
      "Production platforms for a UK enterprise client. Real users, real payroll runs, short delivery cycles.",
    points: [
      "Designed and built a comprehensive HRMS covering leave tracking, payroll, attendance, performance reviews, and analytics dashboards, backed by secure REST APIs, PostgreSQL, MongoDB, and JWT authentication.",
      "Developed a real-time Portfolio Builder letting users create, update, and publish personal sites with live editing and custom domain support.",
      "Engineered business management and equipment troubleshooting platforms on dual-database architectures combining PostgreSQL and MongoDB.",
      "Built a CRM covering the lead pipeline, projects and tasks, with role-based access, threaded comments and a KPI dashboard, as lead backend engineer on a team of five.",
      "Shipped a two-service image moderation API and cut its median response from 1.67 seconds to 170 milliseconds without touching the model or losing accuracy.",
      "Delivered a standards-compliant LMS integration for an education client as a pure wrapper, adding only new files and leaving their existing sign-on code untouched.",
      "Integrated ML-driven logic for predictive diagnostics, smart recommendations, and adaptive workflow automation.",
      "Maintained reliability through Jest unit and integration testing while shipping on tight Agile delivery cycles.",
    ],
    stack: ["React", "Next.js", "Redux Toolkit", "Node.js", "Express", "PostgreSQL", "MongoDB", "Jest"],
  },
  {
    company: "UNAZ Legal Services",
    title: "Junior Software Developer",
    location: "Hull, UK, remote",
    period: "Oct 2023 / May 2024",
    summary:
      "My first production role, fully remote for a firm in Hull. Internal tooling for people who bill by the hour, so nothing could be slow.",
    points: [
      "Built a Lawyer Case Management backend in Node.js handling document workflows, scheduling, case tracking, and client management.",
      "Designed a Zakat Automation System with real-time analytics, a PostgreSQL data layer, and cross-module state via React Context API.",
      "Applied async programming patterns to optimise notification delivery and case-tracking responsiveness across high-volume workflows.",
    ],
    stack: ["Node.js", "React", "PostgreSQL", "REST APIs", "Context API"],
  },
];
