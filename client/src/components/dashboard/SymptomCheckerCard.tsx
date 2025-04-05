import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const SymptomCheckerCard = () => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleAddSymptom = () => {
    if (inputValue.trim() && !symptoms.includes(inputValue.trim())) {
      setSymptoms([...symptoms, inputValue.trim()]);
      setInputValue("");
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

  const presetSymptoms = ["Headache", "Fever", "Cough", "Fatigue"];

  return (
    <Card className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">AI Symptom Checker</h3>
            <p className="text-neutral-600 text-sm">Get preliminary diagnosis before consulting a doctor</p>
          </div>
          <span className="material-icons text-secondary">psychology</span>
        </div>
        <div className="bg-neutral-100 rounded-lg p-4 mb-4">
          <p className="text-neutral-700 mb-3">How are you feeling today?</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {symptoms.length > 0 ? (
              symptoms.map((symptom) => (
                <Badge key={symptom} variant="secondary" className="gap-1 px-3 py-1 rounded-full">
                  {symptom}
                  <button onClick={() => handleRemoveSymptom(symptom)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            ) : (
              presetSymptoms.map((symptom) => (
                <Badge 
                  key={symptom} 
                  variant="secondary" 
                  className="cursor-pointer px-3 py-1 rounded-full"
                  onClick={() => setSymptoms([...symptoms, symptom])}
                >
                  {symptom}
                </Badge>
              ))
            )}
            <Badge 
              variant="outline" 
              className="cursor-pointer px-3 py-1 rounded-full"
              onClick={() => document.getElementById('symptom-input')?.focus()}
            >
              + Add more
            </Badge>
          </div>
          <div className="flex">
            <Input
              id="symptom-input"
              type="text"
              placeholder="Describe your symptoms..."
              className="flex-1 rounded-l-lg"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSymptom()}
            />
            <Button 
              className="bg-secondary text-white rounded-r-lg hover:bg-secondary/90 transition-colors"
              onClick={handleCheck}
              disabled={isLoading || symptoms.length === 0}
            >
              {isLoading ? (
                <span className="material-icons animate-spin text-sm">refresh</span>
              ) : (
                <>
                  <span className="material-icons text-sm mr-1">search</span>
                  Check
                </>
              )}
            </Button>
          </div>
          
          {result && (
            <div className="mt-4 p-3 bg-white rounded-lg border border-secondary/30">
              <h4 className="font-medium text-sm text-secondary mb-1">Possible diagnosis:</h4>
              <p className="text-neutral-800">{result}</p>
              <p className="text-xs text-neutral-500 mt-2">
                This is an AI suggestion only. Please consult a healthcare professional for proper diagnosis.
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center text-neutral-600 text-sm">
          <span className="material-icons text-sm mr-1">privacy_tip</span>
          All symptom data is private and secure
        </div>
      </div>
    </Card>
  );
};

export default SymptomCheckerCard;
