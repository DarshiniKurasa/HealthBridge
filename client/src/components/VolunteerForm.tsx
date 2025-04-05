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
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const volunteerFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  skills: z.array(z.string()).min(1, { message: 'Please select at least one skill.' }),
  availability: z.array(z.string()).min(1, { message: 'Please select at least one availability option.' }),
  message: z.string().optional(),
});

type VolunteerFormValues = z.infer<typeof volunteerFormSchema>;

const skillOptions = [
  { id: 'medical', label: 'Medical' },
  { id: 'nursing', label: 'Nursing' },
  { id: 'mental-health', label: 'Mental Health' },
  { id: 'technology', label: 'Technology' },
  { id: 'administration', label: 'Administration' },
  { id: 'transportation', label: 'Transportation' },
  { id: 'translation', label: 'Translation' },
  { id: 'outreach', label: 'Community Outreach' },
];

const availabilityOptions = [
  { id: 'weekdays', label: 'Weekdays' },
  { id: 'weekends', label: 'Weekends' },
  { id: 'mornings', label: 'Mornings' },
  { id: 'afternoons', label: 'Afternoons' },
  { id: 'evenings', label: 'Evenings' },
  { id: 'on-call', label: 'On-call' },
];

const VolunteerForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      skills: [],
      availability: [],
      message: '',
    },
  });

  const onSubmit = async (values: VolunteerFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/volunteers/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: 'Application Submitted',
          description: 'Thank you for volunteering! We will contact you soon.',
          variant: 'default',
        });
        form.reset();
      } else {
        throw new Error(data.message || 'Failed to submit application');
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
        <CardTitle className="text-2xl font-bold">Volunteer Application</CardTitle>
        <CardDescription>
          Join our team of dedicated volunteers helping underserved communities access quality healthcare.
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
                    <Input placeholder="Your name" {...field} />
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
                    <Input type="email" placeholder="Your email" {...field} />
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
                    <Input placeholder="Your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="skills"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Skills</FormLabel>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {skillOptions.map((option) => (
                      <FormField
                        key={option.id}
                        control={form.control}
                        name="skills"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={option.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, option.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== option.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="availability"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Availability</FormLabel>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {availabilityOptions.map((option) => (
                      <FormField
                        key={option.id}
                        control={form.control}
                        name="availability"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={option.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, option.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== option.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about your experience and why you'd like to volunteer" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
              ) : 'Submit Application'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        Your information will be kept confidential and used only for volunteer coordination purposes.
      </CardFooter>
    </Card>
  );
};

export default VolunteerForm;