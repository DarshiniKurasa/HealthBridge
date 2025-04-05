import React, { useState } from 'react';
import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X } from 'lucide-react';

const SymptomCheckerPage = () => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [recentSymptoms, setRecentSymptoms] = useState<string[]>([]);
  const [isBodyMapActive, setIsBodyMapActive] = useState(false);

  const presetSymptoms = [
    "Headache", "Fever", "Cough", "Fatigue", "Sore throat", 
    "Shortness of breath", "Nausea", "Dizziness", "Chest pain",
    "Back pain", "Joint pain", "Rash", "Chills", "Congestion",
    "Loss of taste", "Loss of smell", "Muscle aches"
  ];

  const handleAddSymptom = () => {
    if (inputValue.trim() && !symptoms.includes(inputValue.trim())) {
      setSymptoms([...symptoms, inputValue.trim()]);
      setInputValue("");
      
      // Also add to recent symptoms if not already there
      if (!recentSymptoms.includes(inputValue.trim())) {
        setRecentSymptoms(prev => [inputValue.trim(), ...prev.slice(0, 9)]);
      }
    }
  };

  const handleRemoveSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter((s) => s !== symptom));
  };

  const handleCheck = async () => {
    if (symptoms.length === 0) return;

    setIsLoading(true);
    setResult(null);

    try {
      // Call our backend API that connects to Gemini
      const response = await fetch('/api/diagnosis/symptoms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze symptoms');
      }

      const data = await response.json();
      setResult(data.analysis);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      // Fallback if the API call fails
      setResult("Unable to analyze symptoms at this time. Please try again later or consult a healthcare provider directly.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBodyPartClick = (part: string) => {
    if (!symptoms.includes(part)) {
      setSymptoms([...symptoms, `Pain in ${part}`]);
      
      // Also add to recent symptoms if not already there
      if (!recentSymptoms.includes(`Pain in ${part}`)) {
        setRecentSymptoms(prev => [`Pain in ${part}`, ...prev.slice(0, 9)]);
      }
    }
  };

  const handleClearAll = () => {
    setSymptoms([]);
    setResult(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/">
          <span className="text-primary flex items-center cursor-pointer mb-4">
            <span className="material-icons mr-1">arrow_back</span>
            Back to Dashboard
          </span>
        </Link>
        <h1 className="text-3xl font-bold mb-2">AI Symptom Checker</h1>
        <p className="text-neutral-500">Get preliminary analysis of your symptoms</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2 p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">How are you feeling today?</h2>
          
          <div className="mb-6">
            <div className="flex mb-3">
              <Input
                id="symptom-input"
                type="text"
                placeholder="Enter your symptoms..."
                className="flex-1 rounded-l-lg"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSymptom()}
              />
              <Button 
                className="bg-secondary text-white rounded-r-lg hover:bg-secondary/90"
                onClick={handleAddSymptom}
              >
                <span className="material-icons text-sm mr-1">add</span>
                Add
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {symptoms.length > 0 ? (
                <>
                  {symptoms.map((symptom) => (
                    <Badge key={symptom} variant="secondary" className="gap-1 px-3 py-1 rounded-full">
                      {symptom}
                      <button onClick={() => handleRemoveSymptom(symptom)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs rounded-full"
                    onClick={handleClearAll}
                  >
                    Clear all
                  </Button>
                </>
              ) : (
                <p className="text-neutral-500 text-sm italic">No symptoms added yet. Use the input above or select from common symptoms below.</p>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Common Symptoms</h3>
              <Button 
                variant="link" 
                className="text-primary text-sm p-0"
                onClick={() => setIsBodyMapActive(!isBodyMapActive)}
              >
                <span className="material-icons text-sm mr-1">
                  {isBodyMapActive ? 'list' : 'accessibility'}
                </span>
                {isBodyMapActive ? 'Show list view' : 'Use body map'}
              </Button>
            </div>

            {isBodyMapActive ? (
              <div className="bg-neutral-100 rounded-lg p-4 relative min-h-[300px] flex justify-center">
                {/* Simple body map visualization */}
                <div className="relative">
                  <div className="w-[120px] h-[300px] bg-neutral-200 rounded-lg mx-auto relative">
                    {/* Head */}
                    <div 
                      className="absolute w-16 h-16 bg-neutral-300 rounded-full left-1/2 transform -translate-x-1/2 top-2 cursor-pointer hover:bg-primary/20"
                      onClick={() => handleBodyPartClick('head')}
                    ></div>
                    
                    {/* Chest */}
                    <div 
                      className="absolute w-20 h-16 bg-neutral-300 rounded-lg left-1/2 transform -translate-x-1/2 top-20 cursor-pointer hover:bg-primary/20"
                      onClick={() => handleBodyPartClick('chest')}
                    ></div>
                    
                    {/* Abdomen */}
                    <div 
                      className="absolute w-20 h-14 bg-neutral-300 rounded-lg left-1/2 transform -translate-x-1/2 top-36 cursor-pointer hover:bg-primary/20"
                      onClick={() => handleBodyPartClick('abdomen')}
                    ></div>
                    
                    {/* Left arm */}
                    <div 
                      className="absolute w-4 h-24 bg-neutral-300 rounded-lg left-[10px] top-20 cursor-pointer hover:bg-primary/20"
                      onClick={() => handleBodyPartClick('left arm')}
                    ></div>
                    
                    {/* Right arm */}
                    <div 
                      className="absolute w-4 h-24 bg-neutral-300 rounded-lg right-[10px] top-20 cursor-pointer hover:bg-primary/20"
                      onClick={() => handleBodyPartClick('right arm')}
                    ></div>
                    
                    {/* Left leg */}
                    <div 
                      className="absolute w-6 h-20 bg-neutral-300 rounded-lg left-1/4 top-52 cursor-pointer hover:bg-primary/20"
                      onClick={() => handleBodyPartClick('left leg')}
                    ></div>
                    
                    {/* Right leg */}
                    <div 
                      className="absolute w-6 h-20 bg-neutral-300 rounded-lg right-1/4 top-52 cursor-pointer hover:bg-primary/20"
                      onClick={() => handleBodyPartClick('right leg')}
                    ></div>
                  </div>
                  <p className="text-center text-sm text-neutral-500 mt-2">Click on any body part to add related symptoms</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {presetSymptoms.map((symptom) => (
                  <Badge 
                    key={symptom} 
                    variant="outline" 
                    className="cursor-pointer px-3 py-1 rounded-full hover:bg-secondary/10"
                    onClick={() => {
                      if (!symptoms.includes(symptom)) {
                        setSymptoms([...symptoms, symptom]);
                      }
                    }}
                  >
                    {symptom}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <Button 
              className="bg-secondary text-white w-full py-6 rounded-lg hover:bg-secondary/90 transition-colors flex items-center justify-center"
              onClick={handleCheck}
              disabled={isLoading || symptoms.length === 0}
            >
              {isLoading ? (
                <>
                  <span className="material-icons animate-spin text-sm mr-2">refresh</span>
                  Analyzing symptoms...
                </>
              ) : (
                <>
                  <span className="material-icons text-sm mr-2">search</span>
                  Check Symptoms
                </>
              )}
            </Button>
          </div>
          
          {result && (
            <div className="border border-secondary/20 rounded-lg bg-secondary/5 p-4">
              <h3 className="font-semibold text-lg mb-2 text-secondary">Possible conditions</h3>
              <div className="text-neutral-700 whitespace-pre-line">
                {result}
              </div>
              <div className="mt-4 p-3 bg-white rounded-lg border border-neutral-200">
                <div className="flex items-start">
                  <span className="material-icons text-yellow-500 mr-2">info</span>
                  <div className="text-sm text-neutral-600">
                    <strong>Important disclaimer:</strong> This is not a medical diagnosis. The information provided is for informational purposes only and does not substitute professional medical advice. Always consult with a qualified healthcare provider for proper diagnosis and treatment.
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
        
        <div className="space-y-6">
          <Card className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recently Checked</h2>
            {recentSymptoms.length > 0 ? (
              <div className="space-y-3">
                {recentSymptoms.slice(0, 5).map((symptom, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-neutral-50 cursor-pointer"
                    onClick={() => {
                      if (!symptoms.includes(symptom)) {
                        setSymptoms([...symptoms, symptom]);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <span className="material-icons text-neutral-400 mr-2">history</span>
                      <span>{symptom}</span>
                    </div>
                    <span className="material-icons text-primary text-sm">add_circle</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-sm">Your recently checked symptoms will appear here</p>
            )}
          </Card>
          
          <Card className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">What to do next?</h2>
            <div className="space-y-4">
              <div className="flex items-start cursor-pointer hover:bg-neutral-50 p-3 rounded-lg transition-colors">
                <span className="material-icons text-primary mr-3">video_call</span>
                <div>
                  <h3 className="font-medium">Telemedicine</h3>
                  <p className="text-sm text-neutral-500">Connect with a doctor virtually for a consultation</p>
                </div>
              </div>
              
              <div className="flex items-start cursor-pointer hover:bg-neutral-50 p-3 rounded-lg transition-colors">
                <span className="material-icons text-orange-500 mr-3">location_on</span>
                <div>
                  <h3 className="font-medium">Find Nearby Clinics</h3>
                  <p className="text-sm text-neutral-500">Locate healthcare facilities in your area</p>
                </div>
              </div>
              
              <div className="flex items-start cursor-pointer hover:bg-neutral-50 p-3 rounded-lg transition-colors">
                <span className="material-icons text-green-500 mr-3">psychology</span>
                <div>
                  <h3 className="font-medium">Mental Health Support</h3>
                  <p className="text-sm text-neutral-500">Talk to a professional about your mental wellbeing</p>
                </div>
              </div>
              
              <div className="flex items-start cursor-pointer hover:bg-neutral-50 p-3 rounded-lg transition-colors">
                <span className="material-icons text-red-500 mr-3">emergency</span>
                <div>
                  <h3 className="font-medium">Emergency Services</h3>
                  <p className="text-sm text-neutral-500">Call for immediate medical assistance</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SymptomCheckerPage;