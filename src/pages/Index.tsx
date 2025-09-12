import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Process } from "@/components/Process";
import { AIModules } from "@/components/AIModules";
import { CallToAction } from "@/components/CallToAction";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Process />
      <AIModules />
      <CallToAction />
    </div>
  );
};

export default Index;
