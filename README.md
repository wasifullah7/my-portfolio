# Wasif Ullah

**Voice AI & Full-Stack AI Engineer** · Python · FastAPI · LiveKit · React · Next.js · Computer Vision

[wasif.wwez@gmail.com](mailto:wasif.wwez@gmail.com) · +92 318 9340438 · Lahore, Pakistan
[LinkedIn](https://www.linkedin.com/in/wasifullahdev) · [GitHub](https://github.com/wasifullah7) · [Medium](https://medium.com/@wasifullahdev) · [Portfolio](https://wasif-ullah-portfolio.vercel.app)

---

## Summary

Voice AI and Full-Stack AI Engineer with 2+ years shipping production systems for clients across the UK, EU and US. Most of my work is real-time voice: agents that answer a live phone call, understand it, retrieve from a knowledge base and hand off to a human when they should. The rest is computer vision and the backend infrastructure that carries both.

Measured results: voice latency cut from **1.8 seconds to under 300ms**, hybrid retrieval **under 150ms**, **0.83 mAP** on a diagram digitisation pipeline with **97%** arrow-association accuracy, and **89%** prediction accuracy on a live RAG recommendation system.

---

## Experience

### Voice AI & Full-Stack AI Engineer · RTC League
`Jul 2025 – Present` · Lahore, Pakistan (onsite)

- Built **real-time voice agents** on LiveKit and SIP telephony, streaming audio rather than waiting on complete turns, cutting end-to-end response from 1.8 seconds to under 300 milliseconds.
- Tuned **vLLM** across a multi-node GPU cluster with continuous batching so throughput holds under concurrent calls, and built hybrid retrieval combining vector and keyword search returning grounded answers in under 150 milliseconds.
- Designed an **on-premise voice platform** for a healthcare client where patient data could never leave their hardware: telephony, call analytics, a knowledge assistant and live agent assist across four workstreams.
- Architected and deployed the **AI Board Scanner**, a diagram recognition system combining RF-DETR detection, PaddleOCR text extraction and SAM2 segmentation, reaching 0.83 mAP and 97% arrow-association accuracy.
- Built binary mask pipelines using KD-trees, BFS skeletonisation and colour and angle heuristics to extract graphs from diagrams with overlapping objects and OCR gaps.
- Automated cloud infrastructure with Terraform and Terragrunt, and CI/CD with GitHub Actions and Docker.

### Full-Stack Developer · Gojins
`Aug 2024 – Jun 2025` · Lahore, Pakistan (onsite)

- Designed and built a comprehensive **HRMS** covering leave tracking, payroll, attendance, performance reviews and analytics, backed by secure REST APIs, PostgreSQL, MongoDB and JWT authentication for a UK enterprise client.
- Built a **CRM** covering the lead pipeline, projects and tasks with role-based access and threaded comments, as lead backend engineer on a team of five.
- Developed a real-time **Portfolio Builder** with live editing and custom domain support.
- Shipped a two-service **image moderation API** and cut its median response from 1.67 seconds to 170 milliseconds without touching the model or losing accuracy.
- Delivered a standards-compliant **LMS integration** for an education client as a pure wrapper, adding only new files and leaving their existing sign-on untouched.

### Junior Software Developer · UNAZ Legal Services
`Oct 2023 – May 2024` · Hull, UK (remote)

- Built a **Lawyer Case Management** backend in Node.js handling document workflows, scheduling, case tracking and client management.
- Designed a **Zakat Automation System** with real-time analytics, a PostgreSQL data layer and cross-module state via React Context API.
- Applied async patterns to optimise notification delivery and case-tracking responsiveness across high-volume workflows.

---

## Key Projects

| Project | Result | Stack |
| --- | --- | --- |
| **AI Board Scanner** | 0.83 mAP, 97% arrow association | RF-DETR, SAM2, PaddleOCR, FastAPI, Docker, AWS |
| **PPTX Adaptation Agent** | Layout-preserving slide agent with vision self-correction, 1,197 tests | LangChain, LangGraph, python-pptx, Next.js |
| **On-Premise Voice Platform** | Four workstreams under HIPAA constraints, 500 concurrent calls targeted | Kubernetes, LiveKit, SIP, vLLM, Qdrant, gRPC |
| **[Document Intelligence Pipeline](https://github.com/wasifullah7/document-intelligence-pipeline)** | Fully offline, 287 MB of models, zero cloud calls | FastAPI, ChromaDB, spaCy, PyMuPDF |
| **Content Moderation API** | 1.67s to 170ms median, accuracy held at 96% | Node.js, FastAPI, TensorFlow.js, Docker |
| **[Ele(Q)tric](https://github.com/wasifullah7/Q-volution-Hackathon)** ([live](https://q-volution-hackathon-theta.vercel.app/)) | QAOA on Rigetti's 84-qubit Ankaa-3, ~10x speedup | React, TypeScript, PyQuil, QAOA |

Fifteen written case studies, with the problem, the approach and the measured outcome for each: **[wasif-ullah-portfolio.vercel.app/work](https://wasif-ullah-portfolio.vercel.app/work)**

---

## Technical Skills

| | |
| --- | --- |
| **Languages** | Python, JavaScript, TypeScript, SQL |
| **Voice & Real-time** | LiveKit, SIP telephony, WebRTC, vLLM, streaming STT and TTS, WebSockets |
| **Backend** | FastAPI, Node.js, Express, REST APIs, GraphQL, JWT, OAuth, Pydantic, Async Python, Microservices |
| **Frontend** | React, Next.js, Redux Toolkit, Tailwind CSS, shadcn/ui, React Query, Zustand, React Hook Form |
| **Databases** | PostgreSQL, MongoDB, MySQL, Redis, Qdrant, Pinecone, pgvector, schema design, query optimisation |
| **AI & Vision** | PyTorch, RF-DETR, YOLOv8, SAM2, PaddleOCR, OpenCV, object detection, image segmentation, OCR, RAG, LangChain, embeddings, semantic search |
| **Cloud & DevOps** | AWS (EC2, S3, SageMaker, API Gateway, Lambda), Kubernetes, Docker, Terraform, Terragrunt, GitHub Actions, CI/CD |
| **Testing** | Pytest, Jest, unit and integration testing, Postman |

---

## Education & Certifications

**BSc (Hons) Computer Science** · University of Engineering & Technology, Mardan
`Sep 2021 – May 2025` · GPA 3.0 / 4.0

- Computer Vision Specialization, DeepLearning.AI · Oct 2025
- Applied Machine Learning: Algorithms, LinkedIn Learning · Apr 2024
- Web Development Specialization, Vanderbilt University · Jan 2023

---

Open to AI engineering and full-stack roles. **[Get in touch](https://wasif-ullah-portfolio.vercel.app/hire)**
