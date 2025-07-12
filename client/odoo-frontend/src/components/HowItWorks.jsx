import { Search, UserPlus, MessageCircle, Star } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Profile",
    description: "List your skills and what you'd like to learn. Add your availability and make your profile shine."
  },
  {
    icon: Search,
    title: "Find Skills You Need", 
    description: "Browse our community or search for specific skills. Filter by location, availability, and ratings."
  },
  {
    icon: MessageCircle,
    title: "Request a Swap",
    description: "Send a swap request offering your skill in exchange for theirs. Chat to plan your learning session."
  },
  {
    icon: Star,
    title: "Learn & Rate",
    description: "Meet up (virtually or in person) to share knowledge. Rate your experience and build your reputation."
  }
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Getting started with skill swapping is simple. Follow these four steps to begin your learning journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-b from-[#FFD580] to-[#FFB000] shadow-lg flex items-center justify-center">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}