/**
 * Canonical origin for metadata, OG tags, JSON-LD and the sitemap.
 * Follows whatever domain the Vercel project is serving, so attaching a custom
 * domain later needs no code change. Override locally with NEXT_PUBLIC_SITE_URL.
 */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://wasif-ullah-portfolio.vercel.app");

export const site = {
  name: "Wasif Ullah",
  role: "Full-Stack AI Engineer",
  roleLines: ["Full-Stack", "AI Engineer"],
  disciplines: ["Computer Vision", "LLM Engineering", "Cloud Infrastructure"],
  tagline:
    "I build AI systems that survive production: vision pipelines that read engineering drawings, retrieval agents that answer from real documents, and the backend infrastructure that keeps both running. Two years shipping for clients across the UK, EU, and US.",
  bio: [
    "I work at the seam between machine learning and production web systems. At Strateger AI I architected the AI Board Scanner, an end-to-end pipeline that reads engineering diagrams and rebuilds them as structured JSON using RF-DETR detection, PaddleOCR, and SAM2 segmentation.",
    "The hard part was never the model. It was the spatial reasoning around it: binary mask pipelines, KD-trees, and BFS skeletonisation that resolve which arrow connects which pair of nodes when objects overlap and OCR drops characters.",
    "Before that I built production platforms at Gojins and UNAZ Legal Services for UK enterprise clients: a full HRMS covering payroll, attendance and performance analytics, a real-time portfolio builder with custom domains, and legal case management systems.",
    "What ties it together is a bias toward systems that survive contact with real data. Measured against real benchmarks, containerised, tested, and deployed on infrastructure I can reason about at 3am.",
  ],
  location: "Lahore, Pakistan",
  locationNote: "Open to remote",
  email: "wasif.wwez@gmail.com",
  phone: "+92 318 9340438",
  phoneHref: "+923189340438",
  availability: "Open to AI engineering and full-stack roles",
  currentRole: "Strateger AI",
  url: SITE_URL,
  resumePath: "/resume.pdf",
  links: {
    github: "https://github.com/wasifullah7",
    linkedin: "https://www.linkedin.com/in/wasifullahdev",
    medium: "https://medium.com/@wasifullahdev",
  },
  education: {
    degree: "BSc (Hons) Computer Science",
    school: "University of Engineering & Technology, Mardan",
    period: "Sep 2021 / May 2025",
    detail: "GPA 3.0 / 4.0",
  },
  certifications: [
    {
      name: "Computer Vision Specialization",
      issuer: "DeepLearning.AI",
      date: "Oct 2025",
    },
    {
      name: "Applied Machine Learning: Algorithms",
      issuer: "LinkedIn Learning",
      date: "Apr 2024",
    },
    {
      name: "Web Development Specialization",
      issuer: "Vanderbilt University",
      date: "Jan 2023",
    },
  ],
  /** Rendered as an instrument readout. `value` animates, `suffix` does not. */
  stats: [
    { value: 0.83, decimals: 2, suffix: "", label: "mAP, diagram detection" },
    { value: 97, decimals: 0, suffix: "%", label: "arrow association accuracy" },
    { value: 89, decimals: 0, suffix: "%", label: "RAG recommendation accuracy" },
    { value: 3, decimals: 0, suffix: "", label: "regions shipped to: UK, EU, US" },
  ],
} as const;

/**
 * Recruiter-facing content for /hire.
 * Review and edit these before sharing widely: the FAQ answers are written to
 * be safe and general, not to speak for you on notice period or salary.
 * Set bookingUrl to a Cal.com or Calendly link to turn on the booking button.
 */
export const hire = {
  headline: "Hiring for an AI engineering role?",
  lead: "Here is everything a recruiter usually asks, answered up front, plus the fastest way to reach me.",
  bookingUrl: "",
  lookingFor: [
    "Full-stack AI engineering, where the model and the product are the same job",
    "Computer vision and retrieval systems that run in production, not notebooks",
    "Remote-first teams, or onsite in Lahore",
  ],
  strengths: [
    {
      title: "Measured, not claimed",
      body: "0.83 mAP on diagram detection, 97% arrow association, voice latency cut from 1.8s to under 300ms. Every number on this site comes from a shipped system.",
    },
    {
      title: "The whole path to production",
      body: "Model work through to dockerised FastAPI services, Terraform infrastructure and GitHub Actions pipelines. I do not hand off at the notebook.",
    },
    {
      title: "Written down",
      body: "Ten published engineering write-ups on latency, concurrency and retrieval. If you want to know how I think before you interview me, it is already public.",
    },
  ],
  faqs: [
    {
      q: "What kind of roles are you looking for?",
      a: "Full-stack AI engineering: computer vision, retrieval-augmented systems, and the backend infrastructure around them. Remote-first, or onsite in Lahore. Open to both permanent roles and contract work.",
    },
    {
      q: "What do you actually build?",
      a: "Production AI systems. Recent work includes a diagram recognition pipeline using RF-DETR, PaddleOCR and SAM2 reaching 0.83 mAP, and real-time voice agents cut from 1.8 seconds of latency to under 300ms using Twilio, LiveKit and vLLM.",
    },
    {
      q: "Have you worked with international teams?",
      a: "Yes. I have shipped for clients across the UK, EU and US, working in Agile cross-functional teams on tight delivery cycles, including a fully remote role for a UK company.",
    },
    {
      q: "What is your core stack?",
      a: "Python and FastAPI on the backend, PyTorch for vision, React and Next.js on the frontend, PostgreSQL and MongoDB for data, and AWS with Docker and Terraform for infrastructure.",
    },
    {
      q: "How soon could you start?",
      a: "It depends on notice, so email me with the role and timeline and I will give you exact dates rather than a guess.",
    },
    {
      q: "Can I see code?",
      a: "Yes. Several projects link straight to their repositories, and my GitHub activity is shown live on this site. Employer work is proprietary, but I am happy to walk through the architecture in a call.",
    },
  ],
} as const;

export const navItems = [
  { label: "About", href: "#about", index: "01" },
  { label: "Stack", href: "#skills", index: "02" },
  { label: "Experience", href: "#experience", index: "03" },
  { label: "Work", href: "#work", index: "04" },
  { label: "Contact", href: "#contact", index: "05" },
] as const;
