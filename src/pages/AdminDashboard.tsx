import { useState } from 'react';
import { useBooking } from '@/context/BookingContext';
import Header from '@/components/layout/Header';
import BookingStatusBadge from '@/components/booking/BookingStatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, Building2, Clock, Users, CheckCircle, XCircle, 
  CalendarOff, Plus, AlertTriangle 
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { halls, bookings, blockedDates, approveBooking, rejectBooking, blockDate } = useBooking();
  const [blockDateOpen, setBlockDateOpen] = useState(false);
  const [blockForm, setBlockForm] = useState({
    hallId: '',
    date: '',
    reason: '',
  });

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const allBookings = [...bookings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleApprove = (id: string) => {
    approveBooking(id);
    toast.success('Booking approved');
  };

  const handleReject = (id: string) => {
    rejectBooking(id);
    toast.success('Booking rejected');
  };

  const handleBlockDate = () => {
    if (!blockForm.hallId || !blockForm.date || !blockForm.reason) {
      toast.error('Please fill all fields');
      return;
    }

    blockDate(blockForm.hallId, blockForm.date, blockForm.reason);
    toast.success('Date blocked successfully');
    setBlockDateOpen(false);
    setBlockForm({ hallId: '', date: '', reason: '' });
  };

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: Calendar, color: 'text-primary' },
    { label: 'Pending Review', value: pendingBookings.length, icon: Clock, color: 'text-warning' },
    { label: 'Approved', value: bookings.filter(b => b.status === 'approved').length, icon: CheckCircle, color: 'text-success' },
    { label: 'Blocked Dates', value: blockedDates.length, icon: CalendarOff, color: 'text-destructive' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage bookings and hall availability</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="p-4 bg-card rounded-xl border border-border/50 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <TabsList className="mb-4">
            <TabsTrigger value="pending" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Pending ({pendingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="gap-2">
              <Calendar className="h-4 w-4" />
              All Bookings
            </TabsTrigger>
            <TabsTrigger value="blocked" className="gap-2">
              <CalendarOff className="h-4 w-4" />
              Blocked Dates
            </TabsTrigger>
          </TabsList>

          {/* Pending Bookings */}
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Booking Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 mx-auto text-success/50 mb-4" />
                    <h3 className="font-medium mb-2">All caught up!</h3>
                    <p className="text-muted-foreground">No pending bookings to review</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Hall</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Purpose</TableHead>
                          <TableHead>Attendees</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.userName}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                {booking.hallName}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p>{format(new Date(booking.date), 'MMM d, yyyy')}</p>
                                <p className="text-muted-foreground">{booking.timeSlot}</p>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[200px]">
                              <span className="line-clamp-2 text-sm">{booking.purpose}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                {booking.attendees}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(booking.id)}
                                  className="bg-success hover:bg-success/90"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleReject(booking.id)}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Bookings */}
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Hall</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Attendees</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.userName}</TableCell>
                          <TableCell>{booking.hallName}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p>{format(new Date(booking.date), 'MMM d, yyyy')}</p>
                              <p className="text-muted-foreground">{booking.timeSlot}</p>
                            </div>
                          </TableCell>
                          <TableCell>{booking.attendees}</TableCell>
                          <TableCell>
                            <BookingStatusBadge status={booking.status} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Blocked Dates */}
          <TabsContent value="blocked">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Blocked Dates</CardTitle>
                <Dialog open={blockDateOpen} onOpenChange={setBlockDateOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Block Date
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Block a Date</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Select Hall</Label>
                        <Select
                          value={blockForm.hallId}
                          onValueChange={(value) => setBlockForm(prev => ({ ...prev, hallId: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a hall" />
                          </SelectTrigger>
                          <SelectContent>
                            {halls.map(hall => (
                              <SelectItem key={hall.id} value={hall.id}>{hall.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input
                          type="date"
                          value={blockForm.date}
                          onChange={(e) => setBlockForm(prev => ({ ...prev, date: e.target.value }))}
                          min={format(new Date(), 'yyyy-MM-dd')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Reason</Label>
                        <Textarea
                          placeholder="e.g., Maintenance work"
                          value={blockForm.reason}
                          onChange={(e) => setBlockForm(prev => ({ ...prev, reason: e.target.value }))}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setBlockDateOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleBlockDate}>
                        Block Date
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {blockedDates.length === 0 ? (
                  <div className="text-center py-12">
                    <CalendarOff className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="font-medium mb-2">No blocked dates</h3>
                    <p className="text-muted-foreground">All dates are available for booking</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Hall</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Reason</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {blockedDates.map((blocked) => {
                          const hall = halls.find(h => h.id === blocked.hallId);
                          return (
                            <TableRow key={blocked.id}>
                              <TableCell>{hall?.name || 'Unknown'}</TableCell>
                              <TableCell>
                                {format(new Date(blocked.date), 'MMM d, yyyy')}
                              </TableCell>
                              <TableCell>{blocked.reason}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
