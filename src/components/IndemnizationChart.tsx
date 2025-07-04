import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface IndemnizationChartProps {
  chartType?: "bar" | "line";
}

const IndemnizationChart = ({ chartType = "bar" }: IndemnizationChartProps) => {
  // Enhanced data with breakdown for Sebastian's case
  const indemnizationData = [
    {
      years: "1",
      indemnization: 450000,
      tutelaDerechos: 110000,
      nulidadDespido: 110000,
      faltaAviso: 50000,
      indemnizacionLegal: 180000,
      baseSalary: 450000,
      description: "1 año de servicio",
    },
    {
      years: "2",
      indemnization: 1100000,
      tutelaDerechos: 110000,
      nulidadDespido: 110000,
      faltaAviso: 80000,
      indemnizacionLegal: 800000,
      baseSalary: 450000,
      description: "2 años de servicio",
    },
    {
      years: "3",
      indemnization: 1850000,
      tutelaDerechos: 110000,
      nulidadDespido: 110000,
      faltaAviso: 130000,
      indemnizacionLegal: 1500000,
      baseSalary: 450000,
      description: "3 años de servicio",
    },
    {
      years: "5",
      indemnization: 3350000,
      tutelaDerechos: 110000,
      nulidadDespido: 110000,
      faltaAviso: 180000,
      indemnizacionLegal: 2950000,
      baseSalary: 450000,
      description: "5 años de servicio",
    },
    {
      years: "8",
      indemnization: 6500000,
      tutelaDerechos: 110000,
      nulidadDespido: 110000,
      faltaAviso: 280000,
      indemnizacionLegal: 6000000,
      baseSalary: 450000,
      description: "8 años de servicio (Caso Sebastián)",
    },
    {
      years: "10",
      indemnization: 7500000,
      tutelaDerechos: 110000,
      nulidadDespido: 110000,
      faltaAviso: 350000,
      indemnizacionLegal: 6930000,
      baseSalary: 450000,
      description: "10 años de servicio",
    },
    {
      years: "15",
      indemnization: 10500000,
      tutelaDerechos: 110000,
      nulidadDespido: 110000,
      faltaAviso: 480000,
      indemnizacionLegal: 9800000,
      baseSalary: 450000,
      description: "15 años de servicio",
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-intense rounded-lg p-4 border border-primary/30 min-w-[280px]">
          <p className="font-semibold text-foreground mb-3">{`${label} años de servicio`}</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Tutela de Derechos:</span>
              <span className="text-sm font-medium text-primary">
                ${data.tutelaDerechos?.toLocaleString("es-CL") || "0"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Nulidad del Despido:</span>
              <span className="text-sm font-medium text-primary">
                ${data.nulidadDespido?.toLocaleString("es-CL") || "0"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Falta de Aviso Previo:</span>
              <span className="text-sm font-medium text-primary">
                ${data.faltaAviso?.toLocaleString("es-CL") || "0"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Indemnización Legal:</span>
              <span className="text-sm font-medium text-primary">
                ${data.indemnizacionLegal?.toLocaleString("es-CL") || "0"}
              </span>
            </div>
            <div className="border-t border-glass-border pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-medium text-foreground">Total:</span>
                <span className="font-bold text-neon-green">
                  ${data.indemnization.toLocaleString("es-CL")}
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">{data.description}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-intense border-glass-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">
            Calculadora de Indemnización por Despido
          </CardTitle>
          <Badge variant="secondary" className="bg-neon-green/20 text-neon-green border-neon-green/30">
            Interactivo
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Indemnización estimada según años de servicio (sueldo base: $450.000)
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
              <BarChart
                data={indemnizationData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="hsl(var(--border))" 
                  opacity={0.3}
                />
                <XAxis
                  dataKey="years"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  label={{ 
                    value: "Años de Servicio", 
                    position: "insideBottom", 
                    offset: -5,
                    style: { textAnchor: "middle", fill: "hsl(var(--muted-foreground))" }
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                  label={{ 
                    value: "Indemnización (CLP)", 
                    angle: -90, 
                    position: "insideLeft",
                    style: { textAnchor: "middle", fill: "hsl(var(--muted-foreground))" }
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="indemnization"
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                  style={{
                    filter: "drop-shadow(0 4px 8px hsl(var(--primary) / 0.3))",
                  }}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
                  </linearGradient>
                </defs>
              </BarChart>
            ) : (
              <LineChart
                data={indemnizationData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis
                  dataKey="years"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="indemnization"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{
                    fill: "hsl(var(--primary))",
                    strokeWidth: 2,
                    r: 6,
                  }}
                  activeDot={{
                    r: 8,
                    fill: "hsl(var(--neon-green))",
                    stroke: "hsl(var(--primary))",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
        
        {/* Quick Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              ${indemnizationData[2].indemnization.toLocaleString("es-CL")}
            </p>
            <p className="text-sm text-muted-foreground">3 años promedio</p>
          </div>
          <div className="glass rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-neon-green">11</p>
            <p className="text-sm text-muted-foreground">Meses máximo</p>
          </div>
          <div className="glass rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-cyan-electric">+</p>
            <p className="text-sm text-muted-foreground">Años de servicio</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IndemnizationChart;