import Calendar from 'react-calendar';
import { useBooking } from '@/context/BookingContext';
import { format } from 'date-fns';

interface BookingCalendarProps {
  hallId: string;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  hallId,
  selectedDate,
  onDateSelect,
}) => {
  const { isDateBlocked, bookings } = useBooking();

  const tileDisabled = ({ date }: { date: Date }) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Disable past dates
    if (date < today) return true;
    
    // Disable blocked dates
    if (isDateBlocked(hallId, dateStr)) return true;
    
    return false;
  };

  const tileClassName = ({ date }: { date: Date }) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Check if there are any bookings on this date
    const hasBookings = bookings.some(
      b => b.hallId === hallId && b.date === dateStr && b.status !== 'rejected'
    );
    
    if (hasBookings) {
      return 'bg-warning/20 text-warning-foreground';
    }
    
    return '';
  };

  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      onDateSelect(value);
    }
  };

  return (
    <div className="w-full">
      <Calendar
        onChange={handleDateChange}
        value={selectedDate}
        tileDisabled={tileDisabled}
        tileClassName={tileClassName}
        minDate={new Date()}
        locale="en-US"
      />
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-warning/20 border border-warning/30" />
          <span className="text-muted-foreground">Partially Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-destructive/20 border border-destructive/30" />
          <span className="text-muted-foreground">Blocked</span>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
