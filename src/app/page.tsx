import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { VoiceAgentSection } from "@/components/sections/VoiceAgentSection";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";
import { GitHubCard } from "@/components/sections/GitHubCard";
import { LatestWriting } from "@/components/sections/LatestWriting";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <VoiceAgentSection />
      <Skills />
      <Experience />
      <Projects />
      <LatestWriting />
      <GitHubCard />
      <Contact />
    </>
  );
}
