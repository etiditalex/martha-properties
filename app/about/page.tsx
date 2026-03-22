"use client";

import { AboutHero } from "@/components/AboutHero";
import { CoreValuesSection } from "@/components/CoreValuesSection";
import { MissionVisionSection } from "@/components/MissionVisionSection";

export default function AboutPage() {
  return (
    <div>
      <AboutHero />

      <MissionVisionSection />

      <CoreValuesSection />
    </div>
  );
}
