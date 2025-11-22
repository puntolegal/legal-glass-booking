import React from 'react';

export const AmbientBackground = () => (
  <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#F5F5F7] dark:bg-[#000000]">
    {/* Mesh Gradient Base */}
    <div className="absolute inset-0 opacity-30 dark:opacity-20">
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(16, 185, 129, 0.10) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(100, 116, 139, 0.06) 0%, transparent 50%)
          `
        }}
      />
    </div>
    
    {/* Noise Texture Sutil */}
    <div 
      className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
      }}
    />
    
    {/* Orbes Animados (Movimiento Muy Lento) */}
    <div className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] bg-indigo-400/8 dark:bg-indigo-500/4 blur-[120px] rounded-full animate-blob" />
    <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] bg-emerald-400/8 dark:bg-emerald-500/4 blur-[120px] rounded-full animate-blob animation-delay-2000" />
    <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-stone-400/4 dark:bg-stone-500/2 blur-[100px] rounded-full animate-blob animation-delay-4000" />
  </div>
);
