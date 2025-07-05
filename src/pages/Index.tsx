import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import BlogSection from "@/components/BlogSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedService, setSelectedService] = useState<{
    title: string;
    price: string;
  } | null>(null);

  const handleServiceSelect = (service: { title: string; promoPrice?: string; price?: string }) => {
    const price = service.promoPrice || service.price || "$15.000 CLP";
    setSelectedService({ title: service.title, price });
    setShowForm(true);
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen bg-background flex w-full">
        <div className="flex-1">
          <Header onAgendarClick={() => setShowForm(true)} />
          <HeroSection 
            showForm={showForm} 
            setShowForm={setShowForm}
            servicePrice={selectedService?.price}
            serviceName={selectedService?.title}
          />
          <ServicesSection onAgendarClick={handleServiceSelect} />
          <TestimonialsSection />
          <BlogSection />
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
