import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const description = `${site.name} is a ${site.role} in ${site.location}, building computer-vision pipelines, RAG systems and production backends. Currently at RTC League.`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}, ${site.role}, Computer Vision & RAG`,
    template: `%s · ${site.name}`,
  },
  description,
  keywords: [
    "Wasif Ullah",
    "AI Engineer",
    "Computer Vision",
    "Full Stack Developer",
    "RAG",
    "Next.js",
    "FastAPI",
    "AWS",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": `${site.url}/blog/rss.xml` },
  },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: `${site.name}, Portfolio`,
    title: `${site.name}, ${site.role}`,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}, ${site.role}`,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  email: `mailto:${site.email}`,
  telephone: site.phone,
  url: site.url,
  worksFor: { "@type": "Organization", name: "RTC League" },
  alumniOf: { "@type": "CollegeOrUniversity", name: site.education.school },
  knowsAbout: [
    "Computer Vision",
    "Large Language Models",
    "Retrieval-Augmented Generation",
    "Full-Stack Web Development",
    "Cloud Infrastructure",
  ],
  sameAs: [site.links.github, site.links.linkedin, site.links.medium],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          // Static, author-controlled metadata.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <SmoothScroll />
          <ScrollProgress />
          <Nav />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
