import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Hall {
  id: string;
  name: string;
  capacity: number;
  facilities: string[];
  images: string[];
  location: string;
  description: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  hallId: string;
  hallName: string;
  date: string;
  timeSlot: string;
  purpose: string;
  attendees: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface BlockedDate {
  id: string;
  hallId: string;
  date: string;
  reason: string;
}

interface BookingContextType {
  halls: Hall[];
  bookings: Booking[];
  blockedDates: BlockedDate[];
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => Promise<{ success: boolean; error?: string }>;
  approveBooking: (id: string) => void;
  rejectBooking: (id: string) => void;
  blockDate: (hallId: string, date: string, reason: string) => void;
  isDateBlocked: (hallId: string, date: string) => boolean;
  isSlotBooked: (hallId: string, date: string, timeSlot: string) => boolean;
  getUserBookings: (userId: string) => Booking[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Mock data
const mockHalls: Hall[] = [
  {
    id: '1',
    name: 'Main Seminar Hall',
    capacity: 200,
    facilities: ['Projector', 'Sound System', 'Air Conditioning', 'WiFi', 'Podium', 'Stage'],
    images: ['/placeholder.svg'],
    location: 'Building A, Ground Floor',
    description: 'Our flagship seminar hall with state-of-the-art facilities, perfect for large conferences, workshops, and corporate events.',
  },
  {
    id: '2',
    name: 'Mini Auditorium',
    capacity: 120,
    facilities: ['Projector', 'Sound System', 'Air Conditioning', 'Recording Equipment'],
    images: ['/placeholder.svg'],
    location: 'Building B, First Floor',
    description: 'A versatile auditorium ideal for medium-sized gatherings, presentations, and cultural programs.',
  },
  {
    id: '3',
    name: 'Conference Hall',
    capacity: 50,
    facilities: ['Smart Board', 'Video Conferencing', 'Air Conditioning', 'WiFi'],
    images: ['/placeholder.svg'],
    location: 'Building A, Second Floor',
    description: 'An intimate space designed for meetings, seminars, and focused discussions with modern conferencing capabilities.',
  },
];

const initialBookings: Booking[] = [
  {
    id: '1',
    userId: '2',
    userName: 'John Doe',
    hallId: '1',
    hallName: 'Main Seminar Hall',
    date: '2025-12-10',
    timeSlot: '09:00 - 12:00',
    purpose: 'Annual Tech Conference',
    attendees: 150,
    status: 'approved',
    createdAt: '2025-12-01',
  },
  {
    id: '2',
    userId: '3',
    userName: 'Jane Smith',
    hallId: '2',
    hallName: 'Mini Auditorium',
    date: '2025-12-12',
    timeSlot: '14:00 - 17:00',
    purpose: 'Workshop on AI',
    attendees: 80,
    status: 'pending',
    createdAt: '2025-12-02',
  },
  {
    id: '3',
    userId: '2',
    userName: 'John Doe',
    hallId: '3',
    hallName: 'Conference Hall',
    date: '2025-12-08',
    timeSlot: '10:00 - 13:00',
    purpose: 'Board Meeting',
    attendees: 25,
    status: 'rejected',
    createdAt: '2025-12-01',
  },
];

const initialBlockedDates: BlockedDate[] = [
  {
    id: '1',
    hallId: '1',
    date: '2025-12-25',
    reason: 'Holiday - Christmas',
  },
  {
    id: '2',
    hallId: '2',
    date: '2025-12-15',
    reason: 'Maintenance Work',
  },
];

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>(initialBlockedDates);

  const createBooking = async (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if date is blocked
    if (isDateBlocked(booking.hallId, booking.date)) {
      return { success: false, error: 'This date is blocked for maintenance' };
    }

    // Check for double booking
    if (isSlotBooked(booking.hallId, booking.date, booking.timeSlot)) {
      return { success: false, error: 'This time slot is already booked' };
    }

    const newBooking: Booking = {
      ...booking,
      id: String(Date.now()),
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setBookings(prev => [...prev, newBooking]);
    return { success: true };
  };

  const approveBooking = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'approved' } : b));
  };

  const rejectBooking = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'rejected' } : b));
  };

  const blockDate = (hallId: string, date: string, reason: string) => {
    const newBlock: BlockedDate = {
      id: String(Date.now()),
      hallId,
      date,
      reason,
    };
    setBlockedDates(prev => [...prev, newBlock]);
  };

  const isDateBlocked = (hallId: string, date: string) => {
    return blockedDates.some(b => b.hallId === hallId && b.date === date);
  };

  const isSlotBooked = (hallId: string, date: string, timeSlot: string) => {
    return bookings.some(
      b => b.hallId === hallId && 
           b.date === date && 
           b.timeSlot === timeSlot && 
           b.status !== 'rejected'
    );
  };

  const getUserBookings = (userId: string) => {
    return bookings.filter(b => b.userId === userId);
  };

  return (
    <BookingContext.Provider value={{
      halls: mockHalls,
      bookings,
      blockedDates,
      createBooking,
      approveBooking,
      rejectBooking,
      blockDate,
      isDateBlocked,
      isSlotBooked,
      getUserBookings,
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};
