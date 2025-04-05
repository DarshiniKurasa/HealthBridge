import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { insertHealthcareProviderSchema } from '@shared/schema';

// Create a custom form schema for provider signup
const providerFormSchema = z.object({
  userId: z.number().default(1), // We'll use 1 for now, in a real app this would be the logged-in user's ID
  specialty: z.string().min(2, { message: 'Please select a specialty.' }),
  address: z.string().min(2, { message: 'Please enter your practice location.' }).optional(),
  availableHours: z.string().min(2, { message: 'Please enter your available hours.' }),
  
  // Additional fields not in our database schema but needed for the form
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  credentials: z.string().min(2, { message: 'Please enter your credentials.' }),
  bio: z.string().min(10, { message: 'Bio must be at least 10 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  acceptingNewPatients: z.boolean(),
  virtualCareOffered: z.boolean(),
});

type ProviderFormValues = z.infer<typeof providerFormSchema>;

const specialtyOptions = [
  { value: 'family-medicine', label: 'Family Medicine' },
  { value: 'internal-medicine', label: 'Internal Medicine' },
  { value: 'pediatrics', label: 'Pediatrics' },
  { value: 'obstetrics-gynecology', label: 'Obstetrics & Gynecology' },
  { value: 'cardiology', label: 'Cardiology' },
  { value: 'dermatology', label: 'Dermatology' },
  { value: 'psychiatry', label: 'Psychiatry' },
  { value: 'neurology', label: 'Neurology' },
  { value: 'orthopedics', label: 'Orthopedics' },
  { value: 'emergency-medicine', label: 'Emergency Medicine' },
  { value: 'other', label: 'Other Specialty' },
];

const ProviderSignupForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(providerFormSchema),
    defaultValues: {
      userId: 1, // Default user ID
      name: '',
      specialty: '',
      address: '',
      credentials: '',
      bio: '',
      email: '',
      phone: '',
      availableHours: '',
      acceptingNewPatients: true,
      virtualCareOffered: true,
    },
  });

  const onSubmit = async (values: ProviderFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/providers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: 'Provider Profile Created',
          description: 'Your profile has been successfully created. Our team will review your information.',
          variant: 'default',
        });
        form.reset();
      } else {
        throw new Error(data.message || 'Failed to create provider profile');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Submission Failed',
        description: error instanceof Error ? error.message : 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Join as Healthcare Provider</CardTitle>
        <CardDescription>
          Join our network and connect with patients who need your expertise in underserved communities.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Dr. Jane Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialty</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your specialty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {specialtyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="credentials"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credentials</FormLabel>
                  <FormControl>
                    <Input placeholder="MD, NP, PA, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Your professional email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Your office phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Practice Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Address or virtual practice" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="availableHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Hours</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mon-Fri 9am-5pm" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell patients about your background, approach to care, and experience" 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="acceptingNewPatients"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4"
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Accepting New Patients
                    </FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="virtualCareOffered"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4"
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Offer Virtual Care
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : 'Submit Provider Application'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        Medical credentials will be verified before your profile is activated on our platform.
      </CardFooter>
    </Card>
  );
};

export default ProviderSignupForm;