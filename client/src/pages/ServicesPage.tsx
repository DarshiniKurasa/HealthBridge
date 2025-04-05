import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

const ServicesPage = () => {
  const services = [
    {
      id: 'telemedicine',
      title: 'Telemedicine',
      description: 'Connect with healthcare providers virtually through secure video consultations.',
      icon: 'video_call',
      link: '/telemedicine'
    },
    {
      id: 'symptom-checker',
      title: 'Symptom Checker',
      description: 'Use our AI-powered tool to understand your symptoms and get guidance.',
      icon: 'health_and_safety',
      link: '/symptom-checker'
    },
    {
      id: 'healthcare-locator',
      title: 'Healthcare Facility Locator',
      description: 'Find hospitals, clinics, and pharmacies near you with our location-based service.',
      icon: 'place',
      link: '/locator'
    },
    {
      id: 'mental-health',
      title: 'Mental Health Support',
      description: 'Access resources, self-help tools, and connect with mental health professionals.',
      icon: 'psychology',
      link: '/mental-health'
    },
    {
      id: 'medication-reminders',
      title: 'Medication Reminders',
      description: 'Set up personalized reminders for medications and appointments.',
      icon: 'alarm',
      link: '/reminders'
    },
    {
      id: 'community-forum',
      title: 'Community Forum',
      description: 'Connect with others, share experiences, and find support from people with similar health journeys.',
      icon: 'forum',
      link: '/forum'
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-3">Our Healthcare Services</h1>
        <p className="text-xl text-muted-foreground max-w-xl mx-auto">
          Comprehensive healthcare services designed to make quality care accessible to underserved communities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                <span className="material-icons">{service.icon}</span>
              </div>
              <CardTitle className="text-xl">{service.title}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={service.link}>
                <Button className="w-full">Access Service</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 bg-primary/5 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">Need Personal Assistance?</h2>
        <p className="mb-6 max-w-xl mx-auto">
          Our team is ready to help you navigate your healthcare options and find the right resources for your needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <SupportDialog type="call" />
          <SupportDialog type="chat" />
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;