export type Plan = {
  title: string;
  description: string;
  category: string;
  duration: string;
  memorySpan: string;
  risk: string;
  source: string;
};

export type Tone = "dark" | "light" | "corporate";

export type SimpleCard = {
  title: string;
  description: string;
};

export type Faq = {
  question: string;
  answer: string;
};

export type PurchaseUseCase = SimpleCard & {
  label: string;
  desire: string;
  examples: string[];
  startingPrice: string;
};

export type Review = {
  quote: string;
  memory: string;
  effect: string;
  participant: string;
};

export type ExperienceTemplate = SimpleCard & {
  slug: string;
  tagline: string;
  duration: string;
  memorySpan: string;
  risk: string;
  chapters: string[];
  sensations: string[];
  recommendedPlans: string[];
};

export type MemoryEpisode = SimpleCard & {
  slug: string;
  period: string;
  intensity: string;
  tag: string;
  source: string;
  synopsis: string;
  timeline: string[];
  details: string[];
  sensations: string[];
  purchaseNotes: string[];
};

