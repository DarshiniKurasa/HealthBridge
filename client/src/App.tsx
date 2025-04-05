import { Switch, Route, Link } from "wouter";
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
import ServicesPage from "@/pages/ServicesPage";
import EmergencyPage from "@/pages/EmergencyPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/telemedicine" component={TelemedicinePage} />
      <Route path="/symptom-checker" component={SymptomCheckerPage} />
      <Route path="/mental-health" component={MentalHealthPage} />
      <Route path="/reminders" component={MedicationReminderPage} />
      <Route path="/locator" component={HealthcareLocatorPage} />
      <Route path="/emergency" component={EmergencyPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/forum" component={() => <div className="py-8"><CommunityForum /></div>} />
      <Route path="/volunteer" component={() => <div className="py-8 container mx-auto"><VolunteerForm /></div>} />
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
        <div className="fixed bottom-6 right-6 md:hidden">
          <Link href="/emergency">
            <button 
              className="w-16 h-16 rounded-full bg-destructive shadow-lg text-white flex items-center justify-center animate-pulse"
            >
              <span className="material-icons">emergency</span>
            </button>
          </Link>
        </div>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;