export const site = {
  name: "Wasif Ullah",
  role: "Full-Stack AI Engineer",
  disciplines: ["Computer Vision", "LLM Engineering", "Cloud Infrastructure"],
  tagline:
    "I build AI systems that hold up in production — vision pipelines, retrieval-augmented agents, and the cloud infrastructure that keeps them running.",
  bio: [
    "I'm a software engineer working at the seam between machine learning and production web systems. Today I build enterprise AI at Strateger AI, where I lead the AI Board Scanner — a diagram-recognition pipeline that turns engineering drawings into structured graphs using RF-DETR detection, PaddleOCR, and SAM2 segmentation.",
    "Before that I shipped production MERN platforms at Gojins and UNAZ Legal Services: business management systems, a real-time portfolio builder with custom domains, and a full HRMS handling payroll, attendance, and performance analytics.",
    "What ties it together is a preference for systems that actually survive contact with real data — measured with real metrics, containerised, and deployed on infrastructure I can reason about.",
  ],
  location: "Pakistan",
  email: "wasif.wwez@gmail.com",
  phone: "+92 318 9340438",
  phoneHref: "+923189340438",
  availability: "Open to AI engineering and full-stack roles",
  url: "https://v0-professional-portfolio-website-one-kappa.vercel.app",
  resumePath: "/resume.pdf",
  links: {
    github: "https://github.com/wasifullah7",
    linkedin: "https://www.linkedin.com/in/wasifullahdev",
    medium: "https://medium.com/@wasifullahdev",
  },
  education: {
    degree: "BSc (Hons) Computer Science",
    school: "University of Engineering & Technology, Mardan",
    period: "2021 — 2025",
  },
  certifications: [
    { name: "Web Development Specialization", issuer: "Vanderbilt University" },
    { name: "Computer Vision Expert", issuer: "DeepLearning.AI" },
    { name: "Applied Machine Learning", issuer: "LinkedIn Learning" },
  ],
  stats: [
    { value: "0.83", label: "mAP on diagram detection" },
    { value: "97%", label: "arrow-association accuracy" },
    { value: "3", label: "production teams shipped for" },
  ],
} as const;

export const navItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
] as const;
