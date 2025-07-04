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
  // Sample data for indemnization based on years of service
  const indemnizationData = [
    {
      years: "1",
      indemnization: 450000,
      baseSalary: 450000,
      description: "1 mes de sueldo",
    },
    {
      years: "2",
      indemnization: 900000,
      baseSalary: 450000,
      description: "2 meses de sueldo",
    },
    {
      years: "3",
      indemnization: 1350000,
      baseSalary: 450000,
      description: "3 meses de sueldo",
    },
    {
      years: "5",
      indemnization: 2250000,
      baseSalary: 450000,
      description: "5 meses de sueldo",
    },
    {
      years: "10",
      indemnization: 4500000,
      baseSalary: 450000,
      description: "10 meses de sueldo",
    },
    {
      years: "15",
      indemnization: 6750000,
      baseSalary: 450000,
      description: "11 meses de sueldo + años de servicio",
    },
    {
      years: "20",
      indemnization: 9000000,
      baseSalary: 450000,
      description: "11 meses + años de servicio",
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-intense rounded-lg p-4 border border-primary/30">
          <p className="font-semibold text-foreground">{`${label} años de servicio`}</p>
          <p className="text-primary font-medium">
            {`Indemnización: $${data.indemnization.toLocaleString("es-CL")}`}
          </p>
          <p className="text-sm text-muted-foreground">{data.description}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Sueldo base: ${data.baseSalary.toLocaleString("es-CL")}
          </p>
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