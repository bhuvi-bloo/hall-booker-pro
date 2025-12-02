import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface BookingStatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected';
}

const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({ status }) => {
  const config = {
    pending: {
      label: 'Pending',
      icon: Clock,
      className: 'bg-warning/10 text-warning border-warning/20',
    },
    approved: {
      label: 'Approved',
      icon: CheckCircle,
      className: 'bg-success/10 text-success border-success/20',
    },
    rejected: {
      label: 'Rejected',
      icon: XCircle,
      className: 'bg-destructive/10 text-destructive border-destructive/20',
    },
  };

  const { label, icon: Icon, className } = config[status];

  return (
    <Badge variant="outline" className={cn('gap-1', className)}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
};

export default BookingStatusBadge;
