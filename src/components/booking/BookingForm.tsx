import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useBooking, Hall } from '@/context/BookingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Loader2, CalendarCheck } from 'lucide-react';

interface BookingFormProps {
  hall: Hall;
  selectedDate: Date | null;
  onSuccess: () => void;
}

const timeSlots = [
  '09:00 - 12:00',
  '10:00 - 13:00',
  '14:00 - 17:00',
  '15:00 - 18:00',
  '18:00 - 21:00',
];

const BookingForm: React.FC<BookingFormProps> = ({ hall, selectedDate, onSuccess }) => {
  const { user } = useAuth();
  const { createBooking, isSlotBooked } = useBooking();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    timeSlot: '',
    purpose: '',
    attendees: '',
  });

  const dateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';

  const availableSlots = timeSlots.filter(
    slot => !isSlotBooked(hall.id, dateStr, slot)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !formData.timeSlot || !formData.purpose || !formData.attendees) {
      toast.error('Please fill all fields');
      return;
    }

    const attendeesNum = parseInt(formData.attendees);
    if (attendeesNum > hall.capacity) {
      toast.error(`Maximum capacity is ${hall.capacity} attendees`);
      return;
    }

    if (attendeesNum < 1) {
      toast.error('At least 1 attendee is required');
      return;
    }

    setIsLoading(true);
    
    const result = await createBooking({
      userId: user!.id,
      userName: user!.name,
      hallId: hall.id,
      hallName: hall.name,
      date: dateStr,
      timeSlot: formData.timeSlot,
      purpose: formData.purpose,
      attendees: attendeesNum,
    });

    setIsLoading(false);

    if (result.success) {
      toast.success('Booking request submitted successfully!');
      onSuccess();
    } else {
      toast.error(result.error || 'Failed to create booking');
    }
  };

  if (!selectedDate) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <CalendarCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>Please select a date from the calendar</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
        <p className="text-sm text-muted-foreground">Selected Date</p>
        <p className="font-semibold">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="timeSlot">Time Slot</Label>
        <Select
          value={formData.timeSlot}
          onValueChange={(value) => setFormData(prev => ({ ...prev, timeSlot: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a time slot" />
          </SelectTrigger>
          <SelectContent>
            {availableSlots.length > 0 ? (
              availableSlots.map(slot => (
                <SelectItem key={slot} value={slot}>{slot}</SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled>No slots available</SelectItem>
            )}
          </SelectContent>
        </Select>
        {availableSlots.length === 0 && (
          <p className="text-xs text-destructive">All slots are booked for this date</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="purpose">Purpose of Booking</Label>
        <Textarea
          id="purpose"
          placeholder="Describe the event or meeting..."
          value={formData.purpose}
          onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="attendees">Number of Attendees</Label>
        <Input
          id="attendees"
          type="number"
          min="1"
          max={hall.capacity}
          placeholder={`Max ${hall.capacity}`}
          value={formData.attendees}
          onChange={(e) => setFormData(prev => ({ ...prev, attendees: e.target.value }))}
        />
        <p className="text-xs text-muted-foreground">Maximum capacity: {hall.capacity}</p>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || availableSlots.length === 0}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit Booking Request'
        )}
      </Button>
    </form>
  );
};

export default BookingForm;
