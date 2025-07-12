import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { MapPin, Clock, Star, ArrowRight } from "lucide-react";

export function SkillCard({ user }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border rounded-lg p-4">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="w-12 h-12 rounded-full">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{user.name}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {user.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {user.location}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                {user.rating}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-1 text-accent">Skills Offered</h4>
          <div className="flex flex-wrap gap-2">
            {user.skillsOffered.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="highlight" className="bg-[#fca311] text-white text-xs">
                {skill}
              </Badge>
            ))}
            {user.skillsOffered.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{user.skillsOffered.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-1 text-primary">Looking For</h4>
          <div className="flex flex-wrap gap-2">
            {user.skillsWanted.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs bg-[#fca311] text-white ">
                {skill}
              </Badge>
            ))}
            {user.skillsWanted.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{user.skillsWanted.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {user.availability}
          </div>
          <Button
            size="sm"
            variant="hero"
            className="flex items-center gap-1 bg-[#fca311] text-white hover:bg-yellow-500 px-3 py-1 rounded"
          >
            View Profile
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

import PropTypes from 'prop-types';

SkillCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    location: PropTypes.string,
    rating: PropTypes.number.isRequired,
    skillsOffered: PropTypes.arrayOf(PropTypes.string).isRequired,
    skillsWanted: PropTypes.arrayOf(PropTypes.string).isRequired,
    availability: PropTypes.string.isRequired,
  }).isRequired,
};