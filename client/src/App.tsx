import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/telemedicine" component={() => <Home />} /> {/* Temporarily point to Home */}
      <Route path="/symptom-checker" component={() => <Home />} /> {/* Temporarily point to Home */}
      <Route path="/mental-health" component={() => <Home />} /> {/* Temporarily point to Home */}
      <Route path="/reminders" component={() => <Home />} /> {/* Temporarily point to Home */}
      <Route path="/locator" component={() => <Home />} /> {/* Temporarily point to Home */}
      <Route path="/emergency" component={() => <Home />} /> {/* Temporarily point to Home */}
      <Route path="/blog" component={() => <Home />} /> {/* Temporarily point to Home */}
      <Route path="/videos" component={() => <Home />} /> {/* Temporarily point to Home */}
      <Route path="/forum" component={() => <Home />} /> {/* Temporarily point to Home */}
      <Route path="/volunteer" component={() => <Home />} /> {/* Temporarily point to Home */}
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
          <button className="w-16 h-16 rounded-full bg-destructive shadow-lg text-white flex items-center justify-center">
            <span className="material-icons">emergency</span>
          </button>
        </div>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
