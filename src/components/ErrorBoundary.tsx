import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDark =
        typeof document !== 'undefined' &&
        document.documentElement.classList.contains('dark');
      const panelGlass = isDark ? 'glass-ios-panel-dark' : 'glass-ios-panel-light';

      return (
        <div className="landing-canvas min-h-screen flex items-center justify-center bg-background text-foreground p-4">
          <div className={`max-w-md w-full text-center p-8 ${panelGlass}`}>
            <div className="mb-8">
              <div
                className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{
                  background:
                    'linear-gradient(135deg, hsl(var(--accent-start)), hsl(var(--accent-end)))',
                  boxShadow: '0 8px 24px hsla(var(--accent-start) / 0.35)',
                }}
              >
                <AlertTriangle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold mb-2">
                ¡Ups! Algo salió mal
              </h1>
              <p className="text-muted-foreground mb-6">
                Ha ocurrido un error inesperado. No te preocupes, nuestro equipo ya ha sido notificado.
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={this.handleRetry}
                className="w-full text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:scale-105 hover:opacity-90"
                style={{
                  background:
                    'linear-gradient(90deg, hsl(var(--accent-start)), hsl(var(--accent-end)))',
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Intentar de nuevo
              </Button>
              
              <Button
                onClick={this.handleGoHome}
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10 font-semibold py-3 rounded-lg transition-all duration-200"
              >
                <Home className="w-4 h-4 mr-2" />
                Volver al inicio
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  Detalles del error (solo desarrollo)
                </summary>
                <div className="mt-2 p-4 bg-muted rounded-lg text-xs font-mono overflow-auto">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="mt-1 text-muted-foreground">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 