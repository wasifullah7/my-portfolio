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
  disciplines: ["Voice AI", "Computer Vision", "Real-Time Systems"],
  tagline:
    "Most AI demos work. Very few survive real data. I build the ones that do: voice agents that answer in under 300ms on a live phone line, diagram recognition at 0.83 mAP, and the infrastructure that keeps both up.",
  bio: [
    "I am a Voice AI and Full-Stack AI Engineer at RTC League, in Lahore. For two years I have been shipping AI systems for clients in the UK, EU and US.",
    "Most of my work is real-time voice. Agents that pick up a live phone call, understand it, answer from a knowledge base and hand off to a human when they should. I have taken that loop from 1.8 seconds down to under 300 milliseconds, tuned vLLM across a GPU cluster so it holds up under concurrent calls, and designed an on-premise platform for a healthcare client where patient data was never allowed to leave their hardware.",
    "Latency is not a metric in voice AI. It is the product. Nobody forgives a system that pauses for a second and a half, because people read that pause as the line going dead.",
    "The other half is vision. The AI Board Scanner reads engineering diagrams and turns them into structured JSON using RF-DETR, PaddleOCR and SAM2. It hits 0.83 mAP and gets the arrow connections right 97% of the time. The models were never the hard part. The hard part was working out which arrow connects which two boxes when the shapes overlap and OCR drops half the characters.",
    "Before this I built production platforms at Gojins and UNAZ Legal Services: a full HRMS handling payroll and attendance for a UK client, a portfolio builder with live editing and custom domains, and case management tooling for a legal firm in Hull.",
    "The thread through all of it: I care about what happens after the demo. Real inputs, measured results, containers, and infrastructure I can reason about at 3am.",
  ],
  location: "Lahore, Pakistan",
  locationNote: "Open to remote",
  /**
   * Portrait shown in the About section. Set to null to remove it everywhere;
   * nothing else needs changing. Generated from the original studio shot with
   * scripts/remove-background.mjs.
   */
  portrait: {
    src: "/wasif-ullah.webp",
    width: 400,
    height: 400,
    alt: "Wasif Ullah, smiling, arms folded",
  } as { src: string; width: number; height: number; alt: string } | null,
  email: "wasif.wwez@gmail.com",
  phone: "+92 318 9340438",
  phoneHref: "+923189340438",
  availability: "Open to AI engineering and full-stack roles",
  currentRole: "RTC League",
  url: SITE_URL,
  resumePath: "/resume.pdf",
  links: {
    github: "https://github.com/wasifullah7",
    linkedin: "https://www.linkedin.com/in/wasifullahdev",
    medium: "https://medium.com/@wasifullahdev",
  },
  education: {
    degree: "BSc Computational Science",
    school: "University of Engineering & Technology, Mardan",
    period: "Sep 2021 / May 2025",
    detail: "GPA 3.0 / 4.0",
  },
  certifications: [
    { name: "Computer Vision Specialization", issuer: "DeepLearning.AI", date: "Oct 2025" },
    { name: "Applied Machine Learning: Algorithms", issuer: "LinkedIn Learning", date: "Apr 2024" },
    { name: "Web Development Specialization", issuer: "Vanderbilt University", date: "Jan 2023" },
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
 * Review before sharing widely: the FAQ answers are written to be safe and
 * general, not to speak for you on notice period or salary.
 * Set bookingUrl to a Cal.com or Calendly link to turn on the booking button.
 */
export const hire = {
  headline: "Hiring for an AI engineering role?",
  lead: "Most of what a recruiter asks me in the first email is answered below. What is left is the form, which takes about a minute.",
  bookingUrl: "",
  lookingFor: [
    "Full-stack AI engineering, where the model and the product are the same job",
    "Computer vision and retrieval systems that run in production, not in notebooks",
    "Remote-first teams, or onsite in Lahore",
  ],
  strengths: [
    {
      title: "The numbers are real",
      body: "0.83 mAP. 97% arrow association. Voice latency from 1.8 seconds down to under 300ms. Every figure on this site came off a system that shipped, and I can walk you through how each one was measured.",
    },
    {
      title: "I do not stop at the model",
      body: "The model is usually a week. The other three months are OCR that fails on scanned pages, classifiers that are confidently wrong, and libraries that phone home when you promised they would not. That part is the job.",
    },
    {
      title: "It is already written down",
      body: "Eleven published articles on latency, GPU concurrency and retrieval. If you want to know how I think before you spend an hour interviewing me, it is public.",
    },
  ],
  faqs: [
    {
      q: "What kind of roles are you looking for?",
      a: "Voice AI and full-stack AI engineering. Real-time agents, computer vision, retrieval systems, and the backend around them. Remote-first, or onsite in Lahore. Permanent or contract, both fine.",
    },
    {
      q: "What do you actually build?",
      a: "Mostly real-time voice agents: LiveKit and SIP telephony in front of vLLM, with retrieval over a live knowledge base, cut from 1.8 seconds of latency to under 300ms. Alongside that, a diagram recognition pipeline using RF-DETR, PaddleOCR and SAM2 that reads engineering drawings and outputs structured JSON.",
    },
    {
      q: "Have you worked with international teams?",
      a: "Yes. UK, EU and US clients, in Agile teams on short delivery cycles. My first production role was fully remote for a company in Hull.",
    },
    {
      q: "What is your core stack?",
      a: "Python and FastAPI on the backend. PyTorch for vision. React and Next.js on the front. PostgreSQL and MongoDB. AWS with Docker and Terraform.",
    },
    {
      q: "How soon could you start?",
      a: "It depends on notice, so I would rather not guess. Send me the role and the timeline and I will give you exact dates.",
    },
    {
      q: "Can I see code?",
      a: "Some of it. Several projects link straight to their repositories, and my GitHub activity is on this site. Employer work is proprietary, but I am happy to walk through the architecture on a call.",
    },
  ],
} as const;

/**
 * Hiring enquiry form. Wording lives here so it stays editable without
 * touching the component.
 */
export const hiringForm = {
  title: "Tell me about the role",
  lead: "The more context you give me, the more useful my reply will be. I read every message myself and normally answer within a day.",
  engagementOptions: [
    "Full-time role",
    "Contract",
    "Technical advisory",
    "Audit or code review",
    "Something else",
  ],
  timelineOptions: [
    "As soon as possible",
    "Within a month",
    "One to three months",
    "Just exploring for now",
  ],
  budgetHelp:
    "A range, a ceiling, or \"not sure yet\" are all fine. I would rather know roughly than not at all.",
  successTitle: "Message sent",
  successBody: "Thanks. I will read it properly and get back to you, normally within a day.",
} as const;

export const navItems = [
  { label: "About", href: "#about", index: "01" },
  { label: "Stack", href: "#skills", index: "02" },
  { label: "Experience", href: "#experience", index: "03" },
  { label: "Work", href: "#work", index: "04" },
  { label: "Contact", href: "#contact", index: "05" },
] as const;
