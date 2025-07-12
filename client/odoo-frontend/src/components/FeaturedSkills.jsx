import { SkillCard } from "./SkillCard";
import { Button } from "./ui/Button";
import { useNavigate } from "react-router-dom";

const mockUsers = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
    location: "San Francisco, CA",
    rating: 4.9,
    skillsOffered: ["React", "JavaScript", "UI/UX Design", "Figma"],
    skillsWanted: ["Machine Learning", "Python", "Data Analysis"],
    availability: "Weekends"
  },
  {
    id: "2", 
    name: "Marcus Johnson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    location: "New York, NY",
    rating: 4.8,
    skillsOffered: ["Photography", "Video Editing", "Adobe Creative Suite"],
    skillsWanted: ["Web Development", "SEO", "Digital Marketing"],
    availability: "Evenings"
  },
  {
    id: "3",
    name: "Emma Rodriguez", 
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    location: "Austin, TX",
    rating: 4.7,
    skillsOffered: ["Digital Marketing", "Content Writing", "Social Media"],
    skillsWanted: ["Graphic Design", "Branding", "Illustration"],
    availability: "Flexible"
  },
  {
    id: "4",
    name: "Alex Kim",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face", 
    location: "Seattle, WA",
    rating: 4.9,
    skillsOffered: ["Python", "Machine Learning", "Data Science"],
    skillsWanted: ["Frontend Development", "React", "TypeScript"],
    availability: "Weekdays"
  },
  {
    id: "5",
    name: "Lisa Park",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
    location: "Los Angeles, CA", 
    rating: 4.8,
    skillsOffered: ["Graphic Design", "Branding", "Illustration"],
    skillsWanted: ["Animation", "3D Modeling", "After Effects"],
    availability: "Weekends"
  },
  {
    id: "6",
    name: "David Wilson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    location: "Chicago, IL",
    rating: 4.6,
    skillsOffered: ["Project Management", "Agile", "Leadership"],
    skillsWanted: ["Data Analytics", "Excel", "Business Intelligence"],
    availability: "Evenings"
  }
];

export function FeaturedSkills() {
    const navigate = useNavigate();
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Featured Skill Swappers
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover talented professionals ready to share their expertise and learn something new
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockUsers.map((user) => (
            <SkillCard key={user.id} user={user} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="text-accent font-semibold hover:text-accent/80 transition-colors" onClick={()=>{navigate('/register')}}>
            View All Skill Swappers →
          </Button>
        </div>
      </div>
    </section>
  );
}