import { Link } from 'react-router-dom';
import { Hall } from '@/context/BookingContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, ArrowRight } from 'lucide-react';

interface HallCardProps {
  hall: Hall;
}

const HallCard: React.FC<HallCardProps> = ({ hall }) => {
  return (
    <Card className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48 overflow-hidden bg-muted">
        <div className="absolute inset-0 hero-gradient opacity-80" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl font-bold text-primary-foreground/20">
            {hall.name.charAt(0)}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <Badge className="bg-card/90 text-foreground backdrop-blur-sm border-0">
            <Users className="h-3 w-3 mr-1" />
            {hall.capacity} seats
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-5">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
          {hall.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {hall.description}
        </p>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1.5 text-primary/70" />
          {hall.location}
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex flex-wrap gap-2">
        {hall.facilities.slice(0, 3).map((facility) => (
          <Badge key={facility} variant="secondary" className="text-xs">
            {facility}
          </Badge>
        ))}
        {hall.facilities.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{hall.facilities.length - 3} more
          </Badge>
        )}
      </CardFooter>

      <div className="px-5 pb-5">
        <Button asChild className="w-full group/btn">
          <Link to={`/hall/${hall.id}`}>
            View Details & Book
            <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </Card>
  );
};

export default HallCard;
