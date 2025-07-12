import { Button } from "../components/ui/Button";
import { ArrowRight, Users, BookOpen, Handshake } from "lucide-react";
import HeroImage from "../assets/HeroImage.png";


export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div 
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: `url(${HeroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'top',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Exchange Skills,
              <br />
              <span className="text-transparent bg-gradient-accent bg-clip-text">
                Grow Together
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
              Connect with professionals, share your expertise, and learn new skills through 
              our innovative skill-swapping platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Button size="lg" variant="default" className="text-lg px-10 py-4 ">
              <span className="flex items-center gap-2">
                Start Swapping Skills
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
            <Button size="lg" variant="default" className="text-lg px-8 py-4 bg-white/10 text-white border-white/20 hover:bg-white/20">
              Browse Skills
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-12 h-12 text-accent text-[#fca311] text-bold" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">5,000+</div>
              <div className="text-white/60">Active Members</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-12 h-12 text-accent text-[#fca311] text-bold" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">200+</div>
              <div className="text-white/60">Skills Available</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Handshake className="w-12 h-12 text-accent text-[#fca311] text-bold" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">1,200+</div>
              <div className="text-white/60">Successful Swaps</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
    </section>
  );
}