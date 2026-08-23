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
 * Source of truth is the LinkedIn profile, which carries more specific detail
 * than the CV: named models, measured latencies, and the actual corpus sizes.
 */
export const experience: Role[] = [
  {
    company: "RTC League",
    title: "Voice AI & Full-Stack AI Engineer",
    location: "Lahore, onsite",
    period: "Jul 2025 / Present",
    current: true,
    summary:
      "Three production voice agents in a year, each with a different constraint: e-commerce latency, healthcare compliance, and municipal accuracy in German.",
    points: [
      "Shipped a voice agent for Shopify e-commerce carrying Twilio WebSocket audio at 8 kHz mu-law, with Silero VAD for interrupt handling, ElevenLabs Scribe v2 speech recognition at 150ms and 2.8% word error rate, retrieval over 1,881 products through pgvector hybrid search, Redis cross-session memory and Zendesk auto-ticketing. Average response 1.94 seconds.",
      "Built a HIPAA-compliant enterprise voice agent on an on-premise GPU cluster of RTX A6000 and A4500 cards: Qwen 3.5 served through vLLM with speculative decoding, Moonshine v2 speech recognition, and pluggable synthesis across Kokoro-82M, CosyVoice 2 and MeloTTS over gRPC, bridged to the phone network through LiveKit SIP.",
      "Developed a German municipal voice assistant using hybrid retrieval over 566 documents, combining FAISS, BM25 and Cohere reranking, with confidence-based escalation to a human and Azure Speech at both ends.",
      "Architected the AI Board Scanner: RF-DETR detection, PaddleOCR text extraction and SAM2 segmentation, reaching 0.83 mAP and 97% arrow-association accuracy through BFS skeletonisation.",
      "Deployed dockerised FastAPI services on AWS EC2 and S3, automated infrastructure with Terraform and Terragrunt, and wired CI/CD through GitHub Actions.",
    ],
    stack: [
      "LiveKit",
      "Twilio",
      "SIP",
      "vLLM",
      "Silero VAD",
      "pgvector",
      "FAISS",
      "RF-DETR",
      "SAM2",
      "FastAPI",
      "Terraform",
      "AWS",
    ],
  },
  {
    company: "Gojins",
    title: "Full-Stack Developer",
    location: "Lahore, onsite",
    period: "Aug 2024 / Jun 2025",
    summary:
      "Production platforms for a UK tech client. Real users, real money moving, short delivery cycles.",
    points: [
      "Designed and built a CRM managing customer pipelines, lead management and client communication workflows, backed by secure REST APIs, PostgreSQL, MongoDB and JWT authentication.",
      "Developed a real-time Portfolio Builder letting users create, update and publish personal sites with live editing and custom domain support, on React, Next.js, Redux Toolkit and Node.js.",
      "Engineered production platforms for business management and equipment troubleshooting on dual-database architectures combining PostgreSQL and MongoDB.",
      "Maintained code quality through Jest unit and integration testing, working in cross-functional Agile teams on tight delivery cycles.",
    ],
    stack: [
      "React",
      "Next.js",
      "Redux Toolkit",
      "Node.js",
      "Express",
      "PostgreSQL",
      "MongoDB",
      "Jest",
    ],
  },
  {
    company: "UNAZ Legal Services",
    title: "Junior Software Engineer",
    location: "Hull, UK, remote",
    period: "Oct 2023 / May 2024",
    summary:
      "My first production role, fully remote. Internal tooling for people who bill by the hour, so nothing could be slow.",
    points: [
      "Built a Lawyer Case Management backend in Node.js handling document workflows, scheduling, case tracking and client management.",
      "Designed a Zakat Automation System with real-time analytics, a PostgreSQL data layer and cross-module state through React Context API.",
      "Applied async programming patterns to optimise notification delivery and case-tracking responsiveness across high-volume legal workflows.",
    ],
    stack: ["Node.js", "React", "PostgreSQL", "REST APIs", "Context API"],
  },
];
