import React from 'react';
import { Video, Calendar, Clock, Users, Sparkles, ExternalLink } from 'lucide-react';

interface GoogleMeetLinkProps {
  meetingUrl: string;
  title?: string;
  description?: string;
  className?: string;
}

const GoogleMeetLink: React.FC<GoogleMeetLinkProps> = ({
  meetingUrl = "https://meet.google.com/abc-defg-hij",
  title = "Consulta Legal - Google Meet",
  description = "Reunión virtual con abogado especializado",
  className = ""
}) => {
  const handleMeetingClick = () => {
    // Abrir en nueva pestaña
    window.open(meetingUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Container principal con glassmorphism iOS 2025 */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
        
        {/* Efecto de brillo superior */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Patrón de líneas sutiles */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-4 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <div className="absolute top-8 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
        
        {/* Contenido principal */}
        <div className="relative p-8">
          {/* Header con ícono y título */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center shadow-xl">
                <Video className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
              <p className="text-sm text-white/70">{description}</p>
            </div>
          </div>
          
          {/* Información de la reunión */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <Calendar className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-xs text-white/60">Fecha</div>
                <div className="text-sm font-semibold text-white">Flexible</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <Clock className="w-5 h-5 text-green-400" />
              <div>
                <div className="text-xs text-white/60">Duración</div>
                <div className="text-sm font-semibold text-white">30 min</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <Users className="w-5 h-5 text-purple-400" />
              <div>
                <div className="text-xs text-white/60">Participantes</div>
                <div className="text-sm font-semibold text-white">1-2 personas</div>
              </div>
            </div>
          </div>
          
          {/* Botón de acción principal */}
          <button
            onClick={handleMeetingClick}
            className="w-full group/btn relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 p-4 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
          >
            {/* Efecto de brillo en hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
            
            {/* Contenido del botón */}
            <div className="relative flex items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse delay-150"></div>
                <div className="w-1 h-1 bg-white/50 rounded-full animate-pulse delay-300"></div>
              </div>
              <span>Unirse a la reunión</span>
              <ExternalLink className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
            </div>
          </button>
          
          {/* Información adicional */}
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-white/60">
              <Sparkles className="w-3 h-3" />
              <span>Reunión segura y confidencial</span>
              <Sparkles className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoogleMeetLink; 