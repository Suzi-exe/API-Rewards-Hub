// Mock catalog of premium AI APIs available for redemption.
// `cost` is the credit price for one redeemable API key.
const mockApis = [
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    description:
      "Top-tier reasoning, coding, and long-context understanding. Great for complex agentic workflows.",
    cost: 500,
    accent: "from-orange-500/20 to-amber-500/10",
    badge: "Most Popular",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    description:
      "Multimodal flagship with vision, audio, and fast text generation across most languages.",
    cost: 600,
    accent: "from-emerald-500/20 to-teal-500/10",
    badge: "Multimodal",
  },
  {
    id: "gemini-1-5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    description:
      "1M-token context window, excellent for analyzing massive documents, codebases, and video.",
    cost: 450,
    accent: "from-sky-500/20 to-indigo-500/10",
    badge: "Long Context",
  },
  {
    id: "llama-3-1-405b",
    name: "Llama 3.1 405B",
    provider: "Meta",
    description:
      "Open-weight powerhouse competitive with frontier models. Ideal for self-hosted deployments.",
    cost: 350,
    accent: "from-fuchsia-500/20 to-purple-500/10",
    badge: "Open Source",
  },
  {
    id: "mistral-large",
    name: "Mistral Large",
    provider: "Mistral AI",
    description:
      "Strong reasoning and multilingual support with industry-leading function-calling reliability.",
    cost: 300,
    accent: "from-rose-500/20 to-pink-500/10",
    badge: "Best Value",
  },
  {
    id: "perplexity-sonar",
    name: "Perplexity Sonar",
    provider: "Perplexity",
    description:
      "Online-augmented model with real-time web search baked into every response.",
    cost: 250,
    accent: "from-cyan-500/20 to-blue-500/10",
    badge: "Web-Aware",
  },
];

export default mockApis;
