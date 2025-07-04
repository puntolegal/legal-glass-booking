import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CalculationResult {
  indemnizacionLegal: number;
  tutelaDerechos: number;
  nulidadDespido: number;
  faltaAviso: number;
  total: number;
}

const IndemnizationCalculator = () => {
  const [salary, setSalary] = useState<string>("");
  const [yearsOfService, setYearsOfService] = useState<string>("");
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);

  // Caso destacado de Joaquín Martinez
  const joaquinCase = {
    name: "Joaquín Martinez",
    salary: 1400000,
    yearsOfService: 5,
    cases: ["tutela", "nulidad"],
    total: 15400000,
    description: "Obtuvo el máximo de indemnización con tutela de derechos fundamentales"
  };

  const caseOptions = [
    { id: "tutela", label: "Tutela de Derechos Fundamentales", maxAmount: 11 },
    { id: "nulidad", label: "Nulidad del Despido", multiplier: 1 },
    { id: "aviso", label: "Falta de Aviso Previo", multiplier: 1 }
  ];

  const calculateIndemnization = () => {
    if (!salary || !yearsOfService) return;

    const monthlySalary = parseFloat(salary);
    const years = parseFloat(yearsOfService);
    
    // Indemnización legal básica (30 días por año, máximo 11 meses)
    const legalMonths = Math.min(years, 11);
    const indemnizacionLegal = monthlySalary * legalMonths;

    // Tutela de derechos (6-11 meses de sueldo)
    const tutelaDerechos = selectedCases.includes("tutela") ? monthlySalary * 11 : 0;

    // Nulidad del despido (variable según el caso)
    const nulidadDespido = selectedCases.includes("nulidad") ? monthlySalary * years : 0;

    // Falta de aviso previo (1 mes de sueldo)
    const faltaAviso = selectedCases.includes("aviso") ? monthlySalary : 0;

    const total = indemnizacionLegal + tutelaDerechos + nulidadDespido + faltaAviso;

    setResult({
      indemnizacionLegal,
      tutelaDerechos,
      nulidadDespido,
      faltaAviso,
      total
    });
    setShowResult(true);
  };

  const toggleCase = (caseId: string) => {
    setSelectedCases(prev => 
      prev.includes(caseId) 
        ? prev.filter(id => id !== caseId)
        : [...prev, caseId]
    );
  };

  // Datos para el gráfico del caso de Joaquín
  const joaquinChartData = [
    {
      concept: "Indemnización Legal",
      amount: joaquinCase.salary * 5,
      color: "#f97316"
    },
    {
      concept: "Tutela de Derechos",
      amount: joaquinCase.salary * 11,
      color: "#ea580c"
    },
    {
      concept: "Total Obtenido",
      amount: joaquinCase.total,
      color: "#10b981"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Caso destacado de Joaquín Martinez */}
      <Card className="glass-intense border-orange-500/20 bg-gradient-to-br from-orange-500/5 via-card/40 to-orange-400/5 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-red-500/10 rounded-full blur-2xl" />
        <CardContent className="relative z-10 p-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">J</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">¡Caso de Éxito!</h3>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-neon-green/20 to-green-500/20 border border-neon-green/30">
              <span className="text-neon-green font-bold text-xl">$15.400.000 CLP</span>
            </div>
          </div>
          
          <div className="text-center mb-6 space-y-2">
            <p className="text-lg font-semibold text-foreground">
              <span className="text-orange-400">Joaquín Martinez</span> - Salario: ${joaquinCase.salary.toLocaleString("es-CL")}
            </p>
            <p className="text-muted-foreground">
              {joaquinCase.description}
            </p>
          </div>
          
          <div className="h-64 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={joaquinChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="concept" 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString('es-CL')}`, 'Monto']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="amount" 
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Calculadora de indemnización */}
      <Card className="glass-intense border-glass-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            🧮 Calculadora de Indemnización
            <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
              Personalizada
            </Badge>
          </CardTitle>
          <p className="text-muted-foreground">
            Ingresa tus datos para calcular tu indemnización estimada
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="salary">Salario mensual (CLP)</Label>
              <Input
                id="salary"
                type="number"
                placeholder="1.400.000"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="glass border-glass-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="years">Años de servicio</Label>
              <Input
                id="years"
                type="number"
                placeholder="3"
                value={yearsOfService}
                onChange={(e) => setYearsOfService(e.target.value)}
                className="glass border-glass-border"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Tipo de caso (selecciona los que apliquen)</Label>
            <div className="grid grid-cols-1 gap-3">
              {caseOptions.map((option) => (
                <div
                  key={option.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedCases.includes(option.id)
                      ? "border-orange-400 bg-orange-500/10"
                      : "border-glass-border glass hover:border-orange-400/50"
                  }`}
                  onClick={() => toggleCase(option.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{option.label}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedCases.includes(option.id)
                        ? "border-orange-400 bg-orange-400"
                        : "border-muted-foreground"
                    }`}>
                      {selectedCases.includes(option.id) && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={calculateIndemnization}
            className="w-full glass-intense bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
            disabled={!salary || !yearsOfService}
          >
            Calcular mi Indemnización
          </Button>

          {showResult && result && (
            <Card className="glass-intense border-neon-green/30 bg-gradient-to-br from-neon-green/5 to-green-500/5">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-4">Resultado del Cálculo</h3>
                <div className="space-y-3">
                  {result.indemnizacionLegal > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Indemnización Legal:</span>
                      <span className="font-bold text-primary">${result.indemnizacionLegal.toLocaleString("es-CL")}</span>
                    </div>
                  )}
                  {result.tutelaDerechos > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Tutela de Derechos:</span>
                      <span className="font-bold text-primary">${result.tutelaDerechos.toLocaleString("es-CL")}</span>
                    </div>
                  )}
                  {result.nulidadDespido > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Nulidad del Despido:</span>
                      <span className="font-bold text-primary">${result.nulidadDespido.toLocaleString("es-CL")}</span>
                    </div>
                  )}
                  {result.faltaAviso > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Falta de Aviso:</span>
                      <span className="font-bold text-primary">${result.faltaAviso.toLocaleString("es-CL")}</span>
                    </div>
                  )}
                  <div className="border-t border-glass-border pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-foreground">Total Estimado:</span>
                      <span className="text-xl font-bold text-neon-green">${result.total.toLocaleString("es-CL")}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <Button
                    className="glass-intense bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 border border-orange-400/20 backdrop-blur-xl shadow-lg hover:shadow-xl"
                  >
                    Agendar ahora una reunión - $15.000
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IndemnizationCalculator;