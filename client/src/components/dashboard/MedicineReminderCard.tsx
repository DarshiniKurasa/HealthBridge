import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

type Reminder = {
  id: string;
  name: string;
  dose: string;
  time: string;
  status: 'taken' | 'upcoming' | 'coming-up';
  color: string;
  icon: string;
};

const MedicineReminderCard = () => {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      name: 'Amoxicillin',
      dose: '500mg - 1 pill',
      time: '9:00 AM',
      status: 'taken',
      color: 'bg-green-500/20',
      icon: 'medication'
    },
    {
      id: '2',
      name: 'Ibuprofen',
      dose: '200mg - 2 pills',
      time: '2:00 PM',
      status: 'coming-up',
      color: 'bg-yellow-500/20',
      icon: 'medication'
    },
    {
      id: '3',
      name: 'Vitamin D',
      dose: '1000 IU - 1 pill',
      time: '8:00 PM',
      status: 'upcoming',
      color: 'bg-primary/20',
      icon: 'vaccines'
    }
  ]);

  const [newReminder, setNewReminder] = useState({
    name: '',
    dose: '',
    time: ''
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddReminder = () => {
    if (newReminder.name && newReminder.dose && newReminder.time) {
      const reminder: Reminder = {
        id: Date.now().toString(),
        name: newReminder.name,
        dose: newReminder.dose,
        time: newReminder.time,
        status: 'upcoming',
        color: 'bg-primary/20',
        icon: 'medication'
      };
      
      setReminders([...reminders, reminder]);
      setNewReminder({ name: '', dose: '', time: '' });
      setIsDialogOpen(false);
      
      // In a real implementation, this would use Google Calendar API to set a reminder
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'taken':
        return 'text-green-600';
      case 'coming-up':
        return 'text-primary';
      default:
        return 'text-neutral-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'taken':
        return 'Taken';
      case 'coming-up':
        return 'Coming up';
      default:
        return 'Upcoming';
    }
  };

  return (
    <Card className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Medication Reminders</h3>
            <p className="text-neutral-600 text-sm">Never miss your medicine or vaccine appointments</p>
          </div>
          <span className="material-icons text-green-600">medication</span>
        </div>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Today's Schedule</h4>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="link" className="text-primary text-sm font-medium p-0">+ Add New</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Medication Reminder</DialogTitle>
                  <DialogDescription>
                    Set up a new medication reminder. You'll receive notifications when it's time to take your medication.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="medication-name" className="text-right">
                      Medication
                    </Label>
                    <Input
                      id="medication-name"
                      value={newReminder.name}
                      onChange={(e) => setNewReminder({...newReminder, name: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="medication-dose" className="text-right">
                      Dosage
                    </Label>
                    <Input
                      id="medication-dose"
                      value={newReminder.dose}
                      onChange={(e) => setNewReminder({...newReminder, dose: e.target.value})}
                      className="col-span-3"
                      placeholder="e.g., 500mg - 1 pill"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="medication-time" className="text-right">
                      Time
                    </Label>
                    <Input
                      id="medication-time"
                      value={newReminder.time}
                      onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                      className="col-span-3"
                      placeholder="e.g., 9:00 AM"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddReminder}>Save reminder</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {reminders.map((reminder) => (
            <div key={reminder.id} className="bg-neutral-100 rounded-lg p-3 mb-2 flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full ${reminder.color} flex items-center justify-center text-${reminder.status === 'taken' ? 'green-600' : reminder.status === 'coming-up' ? 'yellow-600' : 'primary'} mr-3`}>
                  <span className="material-icons text-sm">{reminder.icon}</span>
                </div>
                <div>
                  <p className="font-medium text-neutral-800">{reminder.name}</p>
                  <p className="text-sm text-neutral-600">{reminder.dose}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-neutral-800">{reminder.time}</p>
                <p className={`text-xs ${getStatusColor(reminder.status)}`}>
                  {getStatusText(reminder.status)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Button 
          className="w-full bg-green-600 text-white hover:bg-green-600/90 transition-colors"
        >
          <span className="material-icons text-sm mr-2">calendar_month</span>
          View Full Schedule
        </Button>
      </div>
    </Card>
  );
};

export default MedicineReminderCard;
