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
    context: "RTC League / Production",
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
    slug: "pptx-adaptation-agent",
    title: "PPTX Adaptation Agent",
    context: "Strategy-consulting client",
    year: "2026",
    blurb:
      "Give it a PowerPoint deck and a new topic. It rewrites every piece of text for a different domain while leaving geometry, typography and z-order untouched, then renders the slide and looks at its own work to check it.",
    highlights: [
      "Domain-driven architecture with a strictly one-way dependency rule, so the agent has no path to the filesystem except through use cases that enforce its own policies.",
      "Nine tools wrapping single use cases, including a guarded resize with seven policy checks and a test asserting the repository is never called when a resize is rejected.",
      "Self-correction loop: generate, validate fit, inject, render, then run vision QA on the pixels and feed the findings back as hard corrections.",
      "Caps its repair passes, then enumerates residual issues honestly rather than declaring success.",
    ],
    stack: ["Python", "LangChain v1", "LangGraph", "Anthropic SDK", "python-pptx", "LibreOffice", "Next.js"],
    metrics: [
      { value: "1,197", label: "test functions" },
      { value: "113k", label: "lines across 422 files" },
    ],
    image: "/projects/pptx-agent.webp",
    problem:
      "PPTX manipulation has no tolerance for nondeterminism: two runs on the same file must produce the same XML or the agent cannot reason about its own output. But the interesting work is the judgment between steps. Does the generated text actually fit? Is that large upper-left shape a title or a heading? When the render looks wrong but the character counts said it would fit, which do you trust? A fixed pipeline cannot make those calls.",
    approach: [
      "Split the system so the model decides content and repair strategy while deterministic, tested code does every file mutation, validation and render.",
      "Put the resize policy inside the use case rather than in a prompt, so there is structurally no path from the agent to the geometry that skips the guardrails.",
      "Verify with a different modality than the one that generated: the writer works from the file, the inspector works from the rendered pixels.",
      "Feed vision findings back as a hint to the content generator, then re-render and re-inspect, with a hard cap on passes.",
    ],
    outcome:
      "On the documented run the loop actually fired. Vision QA caught an overlap the character counts had missed, the agent regenerated, re-injected and re-inspected, and finished clean with geometry untouched. A system catching and fixing its own mistake, with the trace to prove it.",
  },
  {
    slug: "voice-platform-architecture",
    title: "On-Premise Voice AI Platform",
    context: "Architecture engagement, healthcare client",
    year: "2026",
    blurb:
      "Architecture and delivery leadership for a four-workstream, on-premise Kubernetes voice platform: a real-time telephony agent, call analytics, an internal knowledge assistant and live agent assist, all designed under HIPAA constraints.",
    highlights: [
      "Real-time path from the phone network through a SIP trunk and LiveKit into streaming speech recognition, a gRPC gateway, vLLM and speech synthesis, with warm transfer to a human.",
      "Compliance treated as an architectural constraint: explicit trust boundaries for patient data, an immutable audit log, mutual TLS between services, and a legal gate on any third-party model.",
      "Models chosen for licensing as much as quality, with the banned components drawn inside the diagrams so reviewers can see what was excluded and why.",
      "A diagramming style guide fixing file naming, a shared class import and a palette where each colour carries a defined meaning, enforced at review time.",
    ],
    stack: ["Kubernetes", "LiveKit", "SIP", "vLLM", "Qdrant", "PostgreSQL", "gRPC", "LangGraph", "Prometheus"],
    metrics: [
      { value: "4", label: "parallel workstreams" },
      { value: "500", label: "concurrent calls targeted" },
    ],
    image: "/projects/voice-architecture.webp",
    problem:
      "A healthcare communications company needed voice AI that could never send patient data to a third-party API, had to run on their own hardware, and had to survive an audit. That rules out most of the obvious stack, so the constraint had to drive the architecture rather than be bolted on afterwards.",
    approach: [
      "Design four workstreams as one coherent system rather than four projects that happen to share a cluster.",
      "Select only permissively licensed speech and synthesis models, and record the rejected ones inside the architecture diagrams.",
      "Separate GPU and CPU nodes explicitly, and put continuous batching in front of the language model so concurrency is a capacity question rather than a surprise.",
      "Write the decisions down as architecture decision records, with research and benchmarks behind each one.",
    ],
    outcome:
      "A full architecture specification, decision records, capacity and model-selection research, and a phased delivery plan. I led the architecture and the delivery plan: the specification, the decision records, the model and capacity research, and the weekly client cadence.",
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
    slug: "crm-platform",
    title: "CRM Platform",
    context: "Team of five, lead author",
    year: "2026",
    blurb:
      "A complete internal CRM: lead pipeline, projects and tasks, role-based access, real-time notifications, threaded comments with mentions, file attachments and a KPI dashboard.",
    highlights: [
      "23 database models and an opinionated lead state machine, rather than a generic table with a status column.",
      "The test suite refuses to start unless the target database name ends in _test. That guardrail is written by someone who has been burned, or thought hard enough not to be.",
      "CPU-only PyTorch pinned in the Docker build to stop multi-gigabyte CUDA wheels breaking image builds, a diagnosed fix rather than a guess.",
      "Production posture written down: run migrations explicitly, keep docs endpoints disabled, front the app with a reverse proxy.",
    ],
    stack: ["FastAPI", "PostgreSQL", "Redis", "React 19", "TanStack Query", "Docker", "Alembic"],
    metrics: [
      { value: "48k", label: "lines across 288 files" },
      { value: "88", label: "of 129 commits mine" },
    ],
    image: "/projects/crm.webp",
    problem:
      "Sales, delivery and support all needed the same records but wanted different views of them, and the process was running on spreadsheets and message threads. The hard part was not any single feature. It was making one permission model and one notification system serve several roles without turning into a maze.",
    approach: [
      "Model the domain properly first, including the states a lead can actually be in and which transitions are legal.",
      "Put role-based access at the API layer, so the frontend is never the thing enforcing it.",
      "Run the whole stack under Docker Compose, so a new developer gets a working database, cache and app in one command.",
      "Treat operations as part of the product: migration chain, health checks, and guardrails against destructive test runs.",
    ],
    outcome:
      "A deployed internal platform used across sales and delivery. I was lead backend engineer on a team of five and wrote 88 of the 129 commits.",
  },
  {
    slug: "content-moderation-api",
    title: "Content Moderation API",
    context: "Production",
    year: "2026",
    blurb:
      "A two-service image moderation pipeline that classifies uploads in real time, escalating anything ambiguous to a second model. Median response cut from 1.67 seconds to 170ms with no change to the model, the thresholds or the accuracy.",
    highlights: [
      "Two-tier classification: a fast model handles the clear cases, and only grey-area scores get escalated to a vision transformer for a second opinion.",
      "An image quality pre-check runs in parallel with classification rather than before it, because neither reads the other's output. That alone was costing 400ms per request.",
      "Preprocessing moved off pure-JavaScript canvas work, which had been looping over roughly 12 million pixels and handing the model a 36 MB tensor for a single 4K upload.",
      "Instrumented every stage first. The model was never the bottleneck, which is exactly why profiling came before optimising.",
    ],
    stack: ["Node.js", "Express", "FastAPI", "TensorFlow.js", "sharp", "Docker", "Kubernetes", "Prometheus"],
    metrics: [
      { value: "170ms", label: "median, from 1.67s" },
      { value: "96%", label: "accuracy, unchanged" },
    ],
    image: "/projects/content-moderation.webp",
    problem:
      "The numbers looked fine in staging and then real traffic arrived. A single classification call was taking 1.67 seconds on average, the service level objectives were slipping, and users were waiting on an upload to clear. The obvious suspect was the model, and the obvious suspect was wrong.",
    approach: [
      "Instrument every stage with timing before changing anything, so the fix targets the actual cost rather than the assumed one.",
      "Run the quality check and the classification concurrently, since both only read the same image buffer and neither depends on the other.",
      "Replace the canvas pixel loop with a native image pipeline, cutting both the work and the size of the tensor handed to the model.",
      "Keep the second-opinion model for ambiguous scores only, so the expensive path stays rare.",
    ],
    outcome:
      "Median response fell to 170 to 250 milliseconds, an 85% reduction, with accuracy holding at 96%. No infrastructure changes, no threshold changes, and the response shape stayed identical, so nothing downstream had to be touched.",
    relatedPosts: ["from-167-seconds-to-170ms"],
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
    relatedPosts: ["how-i-built-a-document-ai-that-runs-fully-offline"],
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
    slug: "voice-ai-assessment",
    title: "Voice AI Production Readiness Audit",
    context: "Advisory, healthcare voice platform",
    year: "2026",
    blurb:
      "A first-principles assessment of a multi-tenant healthcare voice platform, concluding it was not architecturally sound for its 500-concurrent-call target, with five ranked flaws and a costed remediation roadmap.",
    highlights: [
      "A global mutable config singleton shared across requests, which on a multi-tenant healthcare platform is a data-leakage path, not a code smell.",
      "Blocking synchronous calls inside the async event loop, so token-refresh storms stall every call on the machine under load.",
      "In-memory state and local audit logs, meaning a restart drops live calls and horizontal scaling produces inconsistency.",
      "Findings ranked by severity with each dimension scored separately, rather than flattened into one comfortable number.",
    ],
    stack: ["FastAPI", "LiveKit", "asyncio", "Redis", "AWS", "Distributed systems"],
    metrics: [
      { value: "5", label: "critical findings" },
      { value: "12-16", label: "week remediation plan" },
    ],
    image: "/projects/voice-audit.webp",
    problem:
      "The platform worked in demos and small pilots, and the team wanted to know whether it would hold at 500 concurrent calls. Answering that honestly meant reasoning from principles rather than counting bugs, because the failures at that scale are architectural and do not show up in a small test.",
    approach: [
      "Name the distributed-systems principles the system violates, then derive the consequences, instead of listing symptoms.",
      "Separate what breaks correctness from what breaks scale, because they deserve different urgency.",
      "Phase the remediation so the highest-risk fixes land first and every phase leaves the system shippable.",
      "Put a number on both sides: the cost of doing nothing, and the cost of the fix.",
    ],
    outcome:
      "A ranked assessment with a costed four-phase roadmap, and the reasoning behind every finding written down so the team could act on it without me in the room.",
  },
  {
    slug: "voice-assistant-audit",
    title: "Municipal Voice Assistant Audit",
    context: "Advisory, German municipal provider",
    year: "2026",
    blurb:
      "A deep audit of a production German municipal voice assistant, scoring it 5.5 out of 10: strong architecture undermined by concurrency, security and resource-management issues, with 18 ranked findings.",
    highlights: [
      "Five race conditions firing on every call, because shared mutable state had no locks anywhere in the system.",
      "Three exploitable injection paths, including speech-markup injection through unescaped text on its way to the synthesiser.",
      "HTTP clients leaked per request and synchronous database calls sat inside the audio path, so latency grew with load rather than staying flat.",
      "Each dimension scored separately, so an eight out of ten on architecture could not hide a four on concurrency safety.",
    ],
    stack: ["Python", "LiveKit Agents", "Azure Speech", "RAG", "PostgreSQL", "asyncio"],
    metrics: [
      { value: "18", label: "ranked findings" },
      { value: "5.5", label: "overall score out of 10" },
    ],
    image: "/projects/voice-assistant-audit.webp",
    problem:
      "The system was live, serving a municipality, and the architecture was genuinely good: clean separation, a smart multi-stage retrieval pipeline, real multitenancy. That is exactly the situation where problems hide, because the shape is right and nobody looks closer at what happens under concurrent load.",
    approach: [
      "Score each dimension separately rather than producing one number, so strengths cannot mask the weaknesses.",
      "Trace shared mutable state through a single call to find where two concurrent calls touch the same object.",
      "Follow untrusted text all the way to where it is interpreted, which is where the injection paths were.",
      "Estimate the fix for each finding, so the ranking is by value and not just by severity.",
    ],
    outcome:
      "Eighteen findings ranked by severity, four of them critical, with roughly eight hours of estimated fixes for the ones that mattered most. Strong architecture, specific and addressable flaws.",
  },
  {
    slug: "log-sentinel",
    title: "Log Sentinel",
    context: "Open source",
    year: "2026",
    blurb:
      "A compact security monitoring and automated-response stack: normalise heterogeneous logs into one event schema, deduplicate incidents by fingerprint, provision detection rules from version control, and fire playbooks.",
    highlights: [
      "Detection rules live in git as files, so changing a detection is a reviewed commit rather than a click in a console.",
      "Incidents deduplicate by fingerprint, which is what stops one noisy source burying everything else.",
      "API sources poll with cursor checkpoints, so a restart neither replays nor skips events.",
      "About a thousand lines in total. The restraint is the point.",
    ],
    stack: ["FastAPI", "OpenSearch", "Fluent Bit", "PostgreSQL", "Shuffle"],
    metrics: [
      { value: "1,050", label: "lines across 29 files" },
      { value: "100%", label: "detection rules in git" },
    ],
    image: "/projects/log-sentinel.webp",
    problem:
      "Small teams get told they need a security operations centre, price one, and give up. Most of the value sits in a handful of behaviours: collect logs in one shape, notice when the same incident arrives twice, and act automatically on the obvious cases.",
    approach: [
      "Normalise every source into one compact event schema at ingestion, so downstream code never branches on source type.",
      "Keep detection rules as version-controlled files and provision them into the search cluster from there.",
      "Fingerprint incidents so repeats collapse instead of paging someone five times.",
      "Gate the automated-response stack behind a profile, so it can be run or omitted per environment.",
    ],
    outcome:
      "Minimum viable security operations: detection as code, deduplication and automated response, in about a thousand lines.",
  },
  {
    slug: "lti-integration",
    title: "LTI 1.3 Advantage Integration",
    context: "Education-technology client",
    year: "2026",
    blurb:
      "A standards-compliant wrapper letting a client web application plug into Canvas and Moodle with single sign-on, embedded display, content selection and grade passback, without changing a line of their existing code.",
    highlights: [
      "The requirement was absolute: do not touch the current sign-on code, just wrap it. So the integration only ever adds files.",
      "The whole layer switches on with one environment variable. If it is absent, the application behaves exactly as it did before.",
      "The handoff into the existing sign-on happens at exactly one documented seam, the same one their current provider uses.",
      "A full test environment was built against real Canvas and Moodle instances, because standards compliance cannot be asserted, only demonstrated.",
    ],
    stack: ["Java 17", "Spring Boot", "Spring Security", "LTI 1.3", "Canvas", "Moodle"],
    metrics: [{ value: "1", label: "environment variable kill switch" }],
    image: "/projects/lti.webp",
    problem:
      "The client had a working application with its own single sign-on and would not accept changes to it. It still had to appear inside two different learning management systems as a first-class tool, which normally means threading a new identity flow straight through existing authentication code.",
    approach: [
      "Make every change additive, so the existing code paths are untouched and the diff stays reviewable.",
      "Gate the entire layer behind one environment variable, giving the client a kill switch they control.",
      "Implement the five LTI Advantage mechanisms against the specification rather than against one vendor's behaviour.",
      "Stand up real Canvas and Moodle instances and prove the flows end to end.",
    ],
    outcome:
      "A standards-compliant bridge delivered as a wrapper, with the client's original code and its behaviour intact, and a documented way to switch the whole thing off.",
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
    problem:
      "Job boards match on keywords. A CV that says PyTorch never surfaces a posting that says deep learning framework, even when it is the same job. That is not a ranking problem, it is a vocabulary problem, and no amount of filter tuning fixes it.",
    approach: [
      "Embed both sides, candidate profiles and job postings, so matching happens on meaning instead of exact words.",
      "Store the vectors in Pinecone and retrieve by similarity, then let the language model explain why a given role fits.",
      "Evaluate against live job-market data rather than a static sample, because postings drift and a model tuned on last year's wording quietly rots.",
      "Serve it through FastAPI with LangChain handling retrieval and generation.",
    ],
    outcome:
      "89% predictive accuracy on live job-market data, with matches that hold up when the posting and the CV use completely different words for the same skill.",
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
    problem:
      "Payroll is the one system nobody forgives you for breaking. It depends on attendance, which depends on leave balances, which depend on approvals. At this client all of that lived in separate places, so every month someone reconciled it by hand.",
    approach: [
      "Put the whole chain behind one set of REST APIs with JWT auth, so attendance, leave and payroll read from the same source instead of three.",
      "Split storage by shape rather than by habit: PostgreSQL for the relational parts where correctness matters, MongoDB for the documents that change structure per client.",
      "Build dashboards that answer the questions HR actually asks, like who is off next week, rather than dumping tables.",
      "Cover the payroll paths with Jest unit and integration tests, because those are the ones you cannot fix after the fact.",
    ],
    outcome:
      "One system carrying a UK enterprise client from clock-in to payslip, with leave, attendance, performance reviews and analytics in the same place.",
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
    problem:
      "Pakistani Sign Language has almost no public dataset. That is the real reason deaf users here get so little assistive tooling: you cannot train what you cannot collect, and every off-the-shelf sign model is trained on ASL, which is a different language.",
    approach: [
      "Build the dataset first, because nothing else was possible without it.",
      "Use a generative adversarial network to produce sign imagery, so the system could cover signs the dataset was thin on.",
      "Spend most of the effort on the image-processing pipeline rather than the architecture, since preprocessing was where the accuracy actually moved.",
      "Keep it real-time, because a translation aid that lags is not an aid.",
    ],
    outcome:
      "85% accuracy on sign recognition, with the preprocessing work alone accounting for a 20% improvement in model performance.",
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
