import React from 'react';
import { motion } from 'framer-motion';
import ApuntesHeader from '@/components/ApuntesHeader';
import Footer from '@/components/Footer';

interface GlassLayoutProps {
  children: React.ReactNode;
  // Props para el Header
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  showFilters?: boolean;
  onFiltersToggle?: () => void;
}

const GlassLayout: React.FC<GlassLayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-[#F5F7FA] dark:bg-[#050B1C] text-slate-900 dark:text-slate-100 overflow-hidden selection:bg-indigo-500/30 selection:text-slate-900">
      <div
        className="pointer-events-none absolute inset-0 bg-noise opacity-40 mix-blend-soft-light"
        aria-hidden="true"
      />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-16 right-10 w-96 h-96 bg-gradient-to-br from-indigo-300/20 to-slate-200/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-32 left-12 w-72 h-72 bg-gradient-to-br from-emerald-200/15 to-cyan-200/10 rounded-full blur-3xl animate-float" />
      </div>

      <ApuntesHeader
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        showFilters={showFilters}
        onFiltersToggle={onFiltersToggle}
      />

      <main className="relative z-10 pt-24 pb-12">
        {children}
      </main>
      <Footer variant="apuntes" />
    </div>
  );
};

export default GlassLayout;
