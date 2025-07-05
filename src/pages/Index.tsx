import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import BlogSection from "@/components/BlogSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { MobileLayout } from "@/components/MobileLayout";
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

  const content = (
    <>
      <Header onAgendarClick={() => setShowForm(true)} />
      <div className="hidden lg:block lg:pt-20">
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
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        {content}
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <MobileLayout onAgendarClick={() => setShowForm(true)}>
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
        </MobileLayout>
      </div>
    </div>
  );
};

export default Index;
