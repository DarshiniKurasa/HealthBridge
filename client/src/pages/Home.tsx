import Hero from "@/components/Hero";
import QuickAccess from "@/components/dashboard/QuickAccess";
import TelemedicineCard from "@/components/dashboard/TelemedicineCard";
import SymptomCheckerCard from "@/components/dashboard/SymptomCheckerCard";
import HealthcareLocatorCard from "@/components/dashboard/HealthcareLocatorCard";
import SOSCard from "@/components/dashboard/SOSCard";
import MedicineReminderCard from "@/components/dashboard/MedicineReminderCard";
import MentalHealthChatCard from "@/components/dashboard/MentalHealthChatCard";
import CommunitySection from "@/components/community/CommunitySection";
import EducationSection from "@/components/education/EducationSection";
import VolunteerSection from "@/components/volunteer/VolunteerSection";
import { useEffect } from "react";
import { handleRedirectResult } from "@/lib/firebase";

const Home = () => {
  // Handle Firebase auth redirect result on component mount
  useEffect(() => {
    const processRedirect = async () => {
      try {
        await handleRedirectResult();
      } catch (error) {
        console.error("Authentication error:", error);
      }
    };
    processRedirect();
  }, []);

  return (
    <div>
      <Hero />
      <QuickAccess />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TelemedicineCard />
          <SymptomCheckerCard />
          <HealthcareLocatorCard />
          <SOSCard />
          <MedicineReminderCard />
          <MentalHealthChatCard />
        </div>
      </main>
      <CommunitySection />
      <EducationSection />
      <VolunteerSection />
    </div>
  );
};

export default Home;
