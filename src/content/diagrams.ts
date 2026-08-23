/**
 * The path data actually takes through each system, drawn on the case study
 * pages by <ProjectDiagram>.
 *
 * Most of this work is backend: voice agents, moderation, retrieval, log
 * pipelines. There is no interface to screenshot, and the client systems could
 * not be screenshotted anyway. The architecture is the thing worth showing.
 *
 * No employer or client name appears in a diagram. These render into shareable
 * images, and the project titles carry enough on their own.
 *
 * Every stage has to be traceable to the project's own problem, approach or
 * highlights text. Nothing here is invented for the sake of a fuller picture.
 */
export type DiagramStage = {
  label: string;
  /** One short qualifier. Wraps to two lines, so keep it under ~60 characters. */
  note?: string;
  /** Draws in the accent colour. Use once per diagram at most, on the payoff. */
  accent?: boolean;
};

export const diagrams: Record<string, DiagramStage[]> = {
  "ai-board-scanner": [
    { label: "Engineering drawing", note: "PDF or raster scan" },
    { label: "RF-DETR", note: "detect every node and connector" },
    { label: "PaddleOCR", note: "read embedded text" },
    { label: "SAM2", note: "segment shapes into masks" },
    { label: "BFS skeletonisation", note: "trace each arrow tail to head" },
    { label: "Structured JSON", note: "topology, not floating text", accent: true },
  ],

  "pptx-adaptation-agent": [
    { label: "Source deck", note: "plus the new target topic" },
    { label: "Parse", note: "geometry, typography, z-order" },
    { label: "Rewrite", note: "every text run, shape by shape" },
    { label: "Render", note: "LibreOffice rasterises the slide" },
    { label: "Vision check", note: "the agent reads its own output" },
    { label: "Adapted .pptx", note: "layout untouched", accent: true },
  ],

  "voice-platform-architecture": [
    { label: "PSTN", note: "inbound and outbound calls" },
    { label: "SIP trunk", note: "into LiveKit" },
    { label: "Streaming STT", note: "partial transcripts, no waiting" },
    { label: "gRPC gateway", note: "one contract per model" },
    { label: "vLLM", note: "served on-premise, HIPAA constrained" },
    { label: "Speech synthesis", note: "streamed back as it generates" },
    { label: "Warm transfer", note: "human takes the call with context", accent: true },
  ],

  "voice-ai-platform": [
    { label: "Twilio WebSocket", note: "8 kHz mu-law, streamed" },
    { label: "Silero VAD", note: "detects barge-in mid-sentence" },
    { label: "Streaming STT", note: "150ms, 2.8% word error rate" },
    { label: "Hybrid retrieval", note: "live catalogue, 150ms" },
    { label: "vLLM", note: "continuous batching" },
    { label: "Streaming TTS", note: "300ms end to end, from 1.8s", accent: true },
  ],

  "crm-platform": [
    { label: "React 19", note: "TanStack Query for server state" },
    { label: "FastAPI", note: "role-based access at the edge" },
    { label: "Lead state machine", note: "not a status column" },
    { label: "PostgreSQL", note: "23 models" },
    { label: "Redis", note: "real-time notifications and mentions" },
    { label: "KPI dashboard", note: "pipeline visible to the whole team", accent: true },
  ],

  "content-moderation-api": [
    { label: "Upload", note: "image buffer arrives" },
    { label: "sharp", note: "native preprocessing, runs concurrently" },
    { label: "Fast classifier", note: "handles the clear cases" },
    { label: "Grey area?", note: "only ambiguous scores escalate" },
    { label: "Vision transformer", note: "second opinion on the rest" },
    { label: "Verdict", note: "170ms median, accuracy unchanged", accent: true },
  ],

  "document-intelligence-pipeline": [
    { label: "PDF", note: "ingested locally" },
    { label: "PyMuPDF", note: "text and layout extraction" },
    { label: "DeBERTa-v3", note: "zero-shot classification" },
    { label: "Field extraction", note: "regex paired with spaCy NER" },
    { label: "ChromaDB", note: "embeddings stored on disk" },
    { label: "Semantic search", note: "287MB total, zero cloud calls", accent: true },
  ],

  eleqtric: [
    { label: "Distribution network", note: "the grid as a graph" },
    { label: "Max-Cut", note: "blackout exposure as a cut problem" },
    { label: "QAOA circuit", note: "built with PyQuil" },
    { label: "Ankaa-3 QPU", note: "84 qubits, real hardware" },
    { label: "Resilience plan", note: "10x faster than standard QAOA", accent: true },
  ],

  "voice-ai-assessment": [
    { label: "Platform codebase", note: "multi-tenant, healthcare" },
    { label: "Concurrency review", note: "shared mutable state under load" },
    { label: "Tenancy review", note: "a config singleton across requests" },
    { label: "5 ranked findings", note: "severity ordered, each reproduced" },
    { label: "Remediation roadmap", note: "costed across 12 to 16 weeks", accent: true },
  ],

  "voice-assistant-audit": [
    { label: "Production assistant", note: "German municipal service" },
    { label: "Architecture review", note: "strong foundations, confirmed" },
    { label: "Race conditions", note: "five, firing on every call" },
    { label: "Security and resources", note: "unbounded growth under load" },
    { label: "18 ranked findings", note: "scored 5.5 out of 10", accent: true },
  ],

  "log-sentinel": [
    { label: "Heterogeneous logs", note: "every source in its own format" },
    { label: "Fluent Bit", note: "shipping and parsing" },
    { label: "One event schema", note: "normalised on the way in" },
    { label: "Fingerprint dedupe", note: "one incident, not a thousand alerts" },
    { label: "Rules from git", note: "a detection change is a reviewed commit" },
    { label: "Playbook fires", note: "response without a console click", accent: true },
  ],

  "lti-integration": [
    { label: "Canvas or Moodle", note: "the tutor launches from the LMS" },
    { label: "LTI 1.3 launch", note: "signed JWT, validated" },
    { label: "OIDC single sign-on", note: "no new credentials" },
    { label: "Embedded display", note: "deep linking and content selection" },
    { label: "Grade passback", note: "results returned to the gradebook" },
    { label: "Existing app", note: "not one line changed", accent: true },
  ],

  "ai-career-coach": [
    { label: "Candidate profile", note: "skills and history" },
    { label: "Embedding", note: "meaning, not keyword overlap" },
    { label: "Pinecone", note: "retrieval over live postings" },
    { label: "LangChain", note: "reasoning over what came back" },
    { label: "Ranked matches", note: "89% predictive accuracy", accent: true },
  ],

  "hrms-platform": [
    { label: "Next.js", note: "Redux Toolkit for cross-module state" },
    { label: "JWT auth", note: "role scoped per module" },
    { label: "Express REST API", note: "one surface for every module" },
    { label: "PostgreSQL", note: "payroll, leave, attendance" },
    { label: "MongoDB", note: "documents and review histories" },
    { label: "Analytics", note: "headcount and performance reporting", accent: true },
  ],

  "psl-recognition": [
    { label: "Camera frame", note: "live capture" },
    { label: "OpenCV", note: "segmentation and preprocessing" },
    { label: "GAN augmentation", note: "custom dataset, expanded" },
    { label: "Classifier", note: "trained on the augmented set" },
    { label: "Recognised sign", note: "85% accuracy, real time", accent: true },
  ],
};
