import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Clock, 
  Plus, 
  Trash2, 
  Calendar, 
  Bell, 
  Edit2, 
  AlertCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  color: string;
  status: 'active' | 'completed' | 'missed';
}

interface Reminder {
  id: string;
  medicationId: string;
  time: string;
  date: string;
  status: 'upcoming' | 'taken' | 'missed';
}

const MedicationReminderPage = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [newMedication, setNewMedication] = useState<Omit<Medication, 'id' | 'status' | 'color'>>({
    name: '',
    dosage: '',
    frequency: 'daily',
    time: '08:00',
    startDate: new Date().toISOString().split('T')[0],
  });

  // Mock colors for medication cards
  const medicationColors = [
    'bg-blue-100 border-blue-300',
    'bg-green-100 border-green-300',
    'bg-purple-100 border-purple-300',
    'bg-yellow-100 border-yellow-300',
    'bg-pink-100 border-pink-300',
    'bg-indigo-100 border-indigo-300',
  ];

  useEffect(() => {
    // Load medication and reminder data from API or localStorage
    loadMockData();

    // Set up reminder checking interval
    const intervalId = setInterval(checkReminders, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const loadMockData = () => {
    // Mock medications
    const mockMedications: Medication[] = [
      {
        id: '1',
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'daily',
        time: '08:00',
        startDate: '2023-01-15',
        notes: 'Take with food',
        color: medicationColors[0],
        status: 'active'
      },
      {
        id: '2',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'twice-daily',
        time: '09:00',
        startDate: '2023-02-20',
        endDate: '2023-08-20',
        notes: 'Take after breakfast and dinner',
        color: medicationColors[1],
        status: 'active'
      },
      {
        id: '3',
        name: 'Vitamin D',
        dosage: '2000 IU',
        frequency: 'daily',
        time: '10:00',
        startDate: '2023-03-10',
        color: medicationColors[2],
        status: 'active'
      }
    ];
    setMedications(mockMedications);

    // Generate today's reminders
    const today = new Date().toISOString().split('T')[0];
    const mockReminders: Reminder[] = [
      {
        id: '101',
        medicationId: '1',
        time: '08:00',
        date: today,
        status: 'taken'
      },
      {
        id: '102',
        medicationId: '2',
        time: '09:00',
        date: today,
        status: 'upcoming'
      },
      {
        id: '103',
        medicationId: '2',
        time: '19:00',
        date: today,
        status: 'upcoming'
      },
      {
        id: '104',
        medicationId: '3',
        time: '10:00',
        date: today,
        status: 'upcoming'
      }
    ];
    setReminders(mockReminders);
  };

  const checkReminders = () => {
    // This would check if any reminders need to be triggered
    // For now, we'll just log a message
    console.log("Checking reminders...");
  };

  const goBack = () => navigate('/');

  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.dosage) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const id = Math.random().toString(36).substring(2, 9);
    const newMed: Medication = {
      ...newMedication,
      id,
      status: 'active',
      color: medicationColors[Math.floor(Math.random() * medicationColors.length)]
    };

    setMedications([...medications, newMed]);
    
    // Generate reminders based on frequency
    const newReminders: Reminder[] = [];
    const today = new Date().toISOString().split('T')[0];
    
    if (newMedication.frequency === 'daily') {
      newReminders.push({
        id: Math.random().toString(36).substring(2, 9),
        medicationId: id,
        time: newMedication.time,
        date: today,
        status: 'upcoming'
      });
    } else if (newMedication.frequency === 'twice-daily') {
      // Morning dose
      newReminders.push({
        id: Math.random().toString(36).substring(2, 9),
        medicationId: id,
        time: newMedication.time,
        date: today,
        status: 'upcoming'
      });
      
      // Evening dose (12 hours later)
      const [hours, minutes] = newMedication.time.split(':');
      const eveningHour = (parseInt(hours) + 12) % 24;
      const eveningTime = `${eveningHour.toString().padStart(2, '0')}:${minutes}`;
      
      newReminders.push({
        id: Math.random().toString(36).substring(2, 9),
        medicationId: id,
        time: eveningTime,
        date: today,
        status: 'upcoming'
      });
    }
    
    setReminders([...reminders, ...newReminders]);
    
    // Reset form and close dialog
    setNewMedication({
      name: '',
      dosage: '',
      frequency: 'daily',
      time: '08:00',
      startDate: new Date().toISOString().split('T')[0],
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Medication Added",
      description: `${newMed.name} has been added to your medications`,
    });
  };

  const handleDeleteMedication = (medication: Medication) => {
    setMedications(medications.filter(med => med.id !== medication.id));
    setReminders(reminders.filter(rem => rem.medicationId !== medication.id));
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Medication Deleted",
      description: `${medication.name} has been removed from your medications`,
    });
  };

  const handleReminderStatusChange = (reminderId: string, status: 'upcoming' | 'taken' | 'missed') => {
    setReminders(
      reminders.map(rem => 
        rem.id === reminderId ? { ...rem, status } : rem
      )
    );
    
    const reminder = reminders.find(r => r.id === reminderId);
    if (reminder) {
      const medication = medications.find(m => m.id === reminder.medicationId);
      if (medication) {
        toast({
          title: status === 'taken' ? "Medication Taken" : "Reminder Updated",
          description: `${medication.name} marked as ${status}`,
        });
      }
    }
  };

  // Organize reminders by time
  const todayReminders = reminders.filter(
    rem => rem.date === new Date().toISOString().split('T')[0]
  ).sort((a, b) => a.time.localeCompare(b.time));

  const upcomingReminders = todayReminders.filter(rem => rem.status === 'upcoming');
  const takenReminders = todayReminders.filter(rem => rem.status === 'taken');
  const missedReminders = todayReminders.filter(rem => rem.status === 'missed');

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon" 
            className="mr-4" 
            onClick={goBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Medication Reminders</h1>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-primary"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Medication
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upcoming">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="upcoming" className="flex-1">
                    Upcoming ({upcomingReminders.length})
                  </TabsTrigger>
                  <TabsTrigger value="taken" className="flex-1">
                    Taken ({takenReminders.length})
                  </TabsTrigger>
                  <TabsTrigger value="missed" className="flex-1">
                    Missed ({missedReminders.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming">
                  {upcomingReminders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p>No upcoming medications for today</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {upcomingReminders.map(reminder => {
                        const medication = medications.find(m => m.id === reminder.medicationId);
                        if (!medication) return null;
                        
                        return (
                          <Card key={reminder.id} className="border border-gray-200">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className={`h-12 w-12 rounded-full mr-4 flex items-center justify-center ${medication.color.split(' ')[0]}`}>
                                    <span className="material-icons">medication</span>
                                  </div>
                                  <div>
                                    <h3 className="font-medium">{medication.name}</h3>
                                    <p className="text-sm text-gray-500">{medication.dosage}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium">
                                    <Clock className="h-3 w-3 inline mr-1" />
                                    {reminder.time}
                                  </p>
                                  <div className="flex space-x-1 mt-2">
                                    <Button 
                                      size="sm" 
                                      className="bg-green-500 hover:bg-green-600 text-xs h-8"
                                      onClick={() => handleReminderStatusChange(reminder.id, 'taken')}
                                    >
                                      Take Now
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      className="text-xs h-8"
                                      onClick={() => handleReminderStatusChange(reminder.id, 'missed')}
                                    >
                                      Skip
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="taken">
                  {takenReminders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p>No medications taken yet today</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {takenReminders.map(reminder => {
                        const medication = medications.find(m => m.id === reminder.medicationId);
                        if (!medication) return null;
                        
                        return (
                          <Card key={reminder.id} className="border border-gray-200 bg-gray-50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className={`h-12 w-12 rounded-full mr-4 flex items-center justify-center ${medication.color.split(' ')[0]}`}>
                                    <span className="material-icons">medication</span>
                                  </div>
                                  <div>
                                    <h3 className="font-medium">{medication.name}</h3>
                                    <p className="text-sm text-gray-500">{medication.dosage}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-green-600">
                                    <span className="material-icons text-sm mr-1">check_circle</span>
                                    Taken at {reminder.time}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="missed">
                  {missedReminders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p>No missed medications for today</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {missedReminders.map(reminder => {
                        const medication = medications.find(m => m.id === reminder.medicationId);
                        if (!medication) return null;
                        
                        return (
                          <Card key={reminder.id} className="border border-gray-200 bg-gray-50">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className={`h-12 w-12 rounded-full mr-4 flex items-center justify-center ${medication.color.split(' ')[0]}`}>
                                    <span className="material-icons">medication</span>
                                  </div>
                                  <div>
                                    <h3 className="font-medium">{medication.name}</h3>
                                    <p className="text-sm text-gray-500">{medication.dosage}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-red-600">
                                    <AlertCircle className="h-3 w-3 inline mr-1" />
                                    Missed at {reminder.time}
                                  </p>
                                  <Button 
                                    size="sm" 
                                    className="mt-2 bg-green-500 hover:bg-green-600 text-xs h-8"
                                    onClick={() => handleReminderStatusChange(reminder.id, 'taken')}
                                  >
                                    Take Now
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>My Medications</CardTitle>
              <CardDescription>
                {medications.length} active medications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {medications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <span className="material-icons text-5xl mb-2 opacity-20">medication</span>
                  <p>No medications added yet</p>
                  <Button 
                    onClick={() => setIsAddDialogOpen(true)}
                    variant="outline"
                    className="mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Medication
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {medications.map(medication => (
                    <Card 
                      key={medication.id} 
                      className={`border ${medication.color.split(' ')[1]} hover:shadow-md transition-shadow`}
                    >
                      <CardContent className={`p-4 ${medication.color.split(' ')[0]}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{medication.name}</h3>
                            <p className="text-sm text-gray-700">{medication.dosage}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {medication.frequency === 'daily' 
                                ? `Daily at ${medication.time}` 
                                : medication.frequency === 'twice-daily'
                                  ? `Twice daily starting at ${medication.time}`
                                  : medication.frequency
                              }
                            </p>
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => {
                                setSelectedMedication(medication);
                                // In a real app, this would open an edit dialog
                                toast({
                                  title: "Edit Functionality",
                                  description: "Editing will be implemented in the next phase",
                                });
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => {
                                setSelectedMedication(medication);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {medication.notes && (
                          <p className="text-xs bg-white/50 p-2 rounded mt-2">
                            {medication.notes}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Medication Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Medication</DialogTitle>
            <DialogDescription>
              Enter the details of your medication to set up reminders.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name *
              </Label>
              <Input
                id="name"
                value={newMedication.name}
                onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dosage" className="text-right">
                Dosage *
              </Label>
              <Input
                id="dosage"
                value={newMedication.dosage}
                onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                className="col-span-3"
                placeholder="e.g., 10mg, 1 tablet"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="frequency" className="text-right">
                Frequency
              </Label>
              <Select
                value={newMedication.frequency}
                onValueChange={(value) => setNewMedication({...newMedication, frequency: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Once daily</SelectItem>
                  <SelectItem value="twice-daily">Twice daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="as-needed">As needed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={newMedication.time}
                onChange={(e) => setNewMedication({...newMedication, time: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={newMedication.startDate}
                onChange={(e) => setNewMedication({...newMedication, startDate: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={newMedication.endDate || ''}
                onChange={(e) => setNewMedication({...newMedication, endDate: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Input
                id="notes"
                value={newMedication.notes || ''}
                onChange={(e) => setNewMedication({...newMedication, notes: e.target.value})}
                className="col-span-3"
                placeholder="e.g., Take with food"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMedication}>
              Add Medication
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Medication</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this medication? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedMedication && (
            <div className="py-4">
              <p className="font-medium">{selectedMedication.name}</p>
              <p className="text-sm text-gray-500">{selectedMedication.dosage}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedMedication && handleDeleteMedication(selectedMedication)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicationReminderPage;