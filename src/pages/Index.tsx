import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import BlogSection from "@/components/BlogSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { useState } from "react";

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <Header onAgendarClick={() => setShowForm(true)} />
      <HeroSection showForm={showForm} setShowForm={setShowForm} />
      <ServicesSection />
      <TestimonialsSection />
      <BlogSection />
      <Footer />
    </div>
  );
};

export default Index;
