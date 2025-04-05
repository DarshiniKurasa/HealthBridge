import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import TelemedicinePage from "@/pages/TelemedicinePage";
import SymptomCheckerPage from "@/pages/SymptomCheckerPage";
import MentalHealthPage from "@/pages/MentalHealthPage";
import HealthcareLocatorPage from "@/pages/HealthcareLocatorPage";
import MedicationReminderPage from "@/pages/MedicationReminderPage";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CommunityForum from "@/components/CommunityForum";
import VolunteerForm from "@/components/VolunteerForm";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/telemedicine" component={TelemedicinePage} />
      <Route path="/symptom-checker" component={SymptomCheckerPage} />
      <Route path="/mental-health" component={MentalHealthPage} />
      <Route path="/reminders" component={MedicationReminderPage} />
      <Route path="/locator" component={HealthcareLocatorPage} />
      <Route path="/emergency" component={() => <Home />} /> {/* Temporarily point to Home */}
      <Route path="/blog" component={() => <Home />} /> {/* Temporarily point to Home */}
      <Route path="/videos" component={() => <Home />} /> {/* Temporarily point to Home */}
      <Route path="/forum" component={() => <div className="py-8"><CommunityForum /></div>} />
      <Route path="/volunteer" component={() => <div className="py-8 container mx-auto"><VolunteerForm /></div>} />
      <Route path="/api-docs" component={() => <Home />} /> {/* Temporarily point to Home */}
      <Route path="/research" component={() => <Home />} /> {/* Temporarily point to Home */}
      <Route path="/privacy" component={() => <Home />} /> {/* Temporarily point to Home */}
      <Route path="/terms" component={() => <Home />} /> {/* Temporarily point to Home */}
      <Route path="/accessibility" component={() => <Home />} /> {/* Temporarily point to Home */}
      <Route path="/services" component={() => <Home />} /> {/* Temporarily point to Home */}
      <Route path="/education" component={() => <Home />} /> {/* Temporarily point to Home */}
      <Route path="/about" component={() => <Home />} /> {/* Temporarily point to Home */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          <Router />
        </div>
        <Footer />
        {/* Mobile FAB for emergencies - visible only on smaller screens */}
        <div className="fixed bottom-6 right-6 md:hidden">
          <button 
            className="w-16 h-16 rounded-full bg-destructive shadow-lg text-white flex items-center justify-center animate-pulse"
            onClick={() => {
              // In a real implementation, this would trigger emergency services
              window.location.href = "tel:911";
            }}
          >
            <span className="material-icons">emergency</span>
          </button>
        </div>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
