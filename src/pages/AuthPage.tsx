import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { GraduationCap, Lock, User } from "lucide-react";

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkUser();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const nombre = formData.get("nombre") as string;

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            nombre: nombre
          }
        }
      });

      if (error) throw error;

      toast.success("¡Cuenta creada exitosamente! Revisa tu email para confirmar tu cuenta.");
    } catch (error: any) {
      toast.error(error.message || "Error al crear la cuenta");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("¡Sesión iniciada exitosamente!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#000000] flex items-center justify-center p-4 relative">
      <AmbientBackground />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md z-10"
      >
        <div className="bg-white/60 dark:bg-[#1c1c1e]/60 backdrop-blur-2xl border border-white/20 dark:border-white/5 rounded-[32px] shadow-xl shadow-black/10 p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-[#1d1d1f] dark:bg-stone-700 rounded-2xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#1d1d1f] dark:text-white mb-2">
                Acceso a la Plataforma
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Inicia sesión o crea una nueva cuenta
              </p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/40 dark:bg-[#2c2c2e]/40 backdrop-blur-md border border-white/20 dark:border-white/5 rounded-full p-1">
              <TabsTrigger 
                value="signin" 
                className="rounded-full data-[state=active]:bg-[#1d1d1f] data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-[#1d1d1f]"
              >
                Iniciar Sesión
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="rounded-full data-[state=active]:bg-[#1d1d1f] data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-[#1d1d1f]"
              >
                Registrarse
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="mt-6 space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Identificación
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={1.5} />
                    <Input
                      id="signin-email"
                      name="email"
                      type="email"
                      required
                      placeholder="tu@email.com"
                      className="pl-10 bg-white/50 dark:bg-[#1c1c1e]/50 border-white/20 dark:border-white/5 rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Clave
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={1.5} />
                    <Input
                      id="signin-password"
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      className="pl-10 bg-white/50 dark:bg-[#1c1c1e]/50 border-white/20 dark:border-white/5 rounded-xl"
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-full bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] font-semibold hover:opacity-90 transition-all" 
                  disabled={isLoading}
                >
                  {isLoading ? "Iniciando sesión..." : "Activar"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="mt-6 space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-nombre" className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Nombre
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={1.5} />
                    <Input
                      id="signup-nombre"
                      name="nombre"
                      type="text"
                      required
                      placeholder="Juan Pérez"
                      className="pl-10 bg-white/50 dark:bg-[#1c1c1e]/50 border-white/20 dark:border-white/5 rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Identificación
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={1.5} />
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      required
                      placeholder="tu@email.com"
                      className="pl-10 bg-white/50 dark:bg-[#1c1c1e]/50 border-white/20 dark:border-white/5 rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-xs uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Clave
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" strokeWidth={1.5} />
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      minLength={6}
                      className="pl-10 bg-white/50 dark:bg-[#1c1c1e]/50 border-white/20 dark:border-white/5 rounded-xl"
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-full bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] font-semibold hover:opacity-90 transition-all" 
                  disabled={isLoading}
                >
                  {isLoading ? "Creando cuenta..." : "Activar"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
