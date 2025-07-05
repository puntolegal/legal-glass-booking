import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Battery } from "lucide-react";

interface IndemnizationChartProps {
  selectedYears?: number;
}

const IndemnizationChart = ({ selectedYears = 15 }: IndemnizationChartProps) => {
  // Data for the 15-year case as specified
  const selectedData = {
    years: selectedYears,
    tutelaDerechos: 110000,
    nulidadDespido: 110000,
    faltaAviso: 480000,
    indemnizacionLegal: 9800000,
    total: 10500000,
    description: `${selectedYears} años de servicio`
  };

  // Calculate percentages for battery segments
  const total = selectedData.total;
  const segments = [
    { 
      name: "Tutela", 
      value: selectedData.tutelaDerechos, 
      color: "#FF6600",
      percentage: (selectedData.tutelaDerechos / total) * 100 
    },
    { 
      name: "Nulidad", 
      value: selectedData.nulidadDespido, 
      color: "#FFA040",
      percentage: (selectedData.nulidadDespido / total) * 100 
    },
    { 
      name: "Aviso", 
      value: selectedData.faltaAviso, 
      color: "#FFD142",
      percentage: (selectedData.faltaAviso / total) * 100 
    },
    { 
      name: "Legal", 
      value: selectedData.indemnizacionLegal, 
      color: "#22CC88",
      percentage: (selectedData.indemnizacionLegal / total) * 100 
    }
  ];

  return (
    <div className="glass-strong rounded-3xl p-8 border border-primary/20 shadow-2xl overflow-hidden relative">
      {/* Modern geometric background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-accent/5"></div>
        <div className="absolute top-8 right-8 w-32 h-32 border border-primary/10 rounded-full"></div>
        <div className="absolute bottom-8 left-8 w-24 h-24 border border-primary/10 rounded-full"></div>
      </div>
      {/* Warm glow effect */}
      <div 
        className="absolute inset-0 opacity-20 blur-xl"
        style={{
          background: 'radial-gradient(ellipse at top, #FF6600 0%, transparent 70%)'
        }}
      />
      
      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">
            Calculadora de Indemnización por Despido
          </h2>
          <Badge 
            variant="secondary" 
            className="bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border-orange-400/30 backdrop-blur-sm"
          >
            Interactivo
          </Badge>
        </div>
        <p className="text-gray-300 text-sm">
          Indemnización estimada según años de servicio (sueldo base: $450.000)
        </p>
      </div>

      {/* Battery Meter */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 max-w-4xl">
            {/* Battery Frame */}
            <div 
              className="relative rounded-xl p-1 h-24"
              style={{
                background: '#121212',
                border: '4px solid #121212',
                boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.5)'
              }}
            >
              {/* Battery Segments */}
              <div className="flex h-full rounded-lg overflow-hidden">
                {segments.map((segment, index) => (
                  <div
                    key={segment.name}
                    className="relative flex-1 flex items-center justify-center text-white text-xs font-medium transition-all duration-300 hover:brightness-110"
                    style={{
                      background: `linear-gradient(135deg, ${segment.color} 0%, ${segment.color}CC 100%)`,
                      boxShadow: `inset 0 0 20px ${segment.color}40, 0 0 10px ${segment.color}30`,
                      borderRight: index < segments.length - 1 ? '1px solid rgba(0,0,0,0.2)' : 'none'
                    }}
                  >
                    <div className="text-center">
                      <div className="font-semibold text-white drop-shadow-lg">
                        {segment.name}: ${(segment.value / 1000).toFixed(0)}K
                      </div>
                    </div>
                    
                    {/* Glow effect */}
                    <div 
                      className="absolute inset-0 opacity-30 blur-md"
                      style={{
                        background: `linear-gradient(to bottom, ${segment.color}80 0%, transparent 100%)`
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Total Display */}
          <div className="ml-8 flex items-center gap-4">
            <div className="text-right">
              <div 
                className="text-3xl font-bold drop-shadow-lg"
                style={{ 
                  color: '#FF6600',
                  textShadow: '0 0 20px #FF660040'
                }}
              >
                Total: ${(selectedData.total / 1000000).toFixed(1)}M
              </div>
              <div className="text-gray-400 text-sm mt-1">
                {selectedData.description}
              </div>
            </div>
            
            {/* Battery Icon with Glow */}
            <div className="relative">
              <Battery 
                size={32} 
                className="text-orange-400 drop-shadow-lg" 
                style={{
                  filter: 'drop-shadow(0 0 8px #FF660060)'
                }}
              />
              <div 
                className="absolute inset-0 opacity-60 blur-sm"
                style={{
                  background: 'radial-gradient(circle, #FF6600 0%, transparent 70%)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Details */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {segments.map((segment) => (
          <div 
            key={segment.name}
            className="backdrop-blur-sm rounded-lg p-4 border border-white/10"
            style={{
              background: `linear-gradient(135deg, ${segment.color}15 0%, ${segment.color}05 100%)`,
              boxShadow: `0 4px 12px ${segment.color}20`
            }}
          >
            <div className="text-center">
              <div 
                className="text-lg font-bold mb-1"
                style={{ color: segment.color }}
              >
                ${segment.value.toLocaleString("es-CL")}
              </div>
              <div className="text-white text-sm font-medium mb-1">
                {segment.name === "Tutela" && "Tutela de Derechos"}
                {segment.name === "Nulidad" && "Nulidad del Despido"}
                {segment.name === "Aviso" && "Falta de Aviso Previo"}
                {segment.name === "Legal" && "Indemnización Legal"}
              </div>
              <div className="text-gray-400 text-xs">
                {segment.percentage.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ambient lighting effect */}
      <div 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-32 opacity-10 blur-2xl"
        style={{
          background: 'linear-gradient(180deg, #FF6600 0%, transparent 100%)'
        }}
      />
    </div>
  );
};

export default IndemnizationChart;