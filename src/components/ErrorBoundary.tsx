import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in ErrorBoundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#08080a] text-red-105 flex flex-col items-center justify-center p-8 font-sans">
          <div className="max-w-xl w-full bg-[#0d0d12] border border-red-500/20 rounded-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-red-500/10 pb-3">
              <span className="text-2xl">⚠️</span>
              <h2 className="text-lg font-bold text-red-400 uppercase tracking-widest font-mono">
                System Convergence Telemetry
              </h2>
            </div>
            <p className="text-xs text-white/70 leading-relaxed font-sans">
              The spacetime ecosystem interface encountered a rendering exception. This can occur if WebGL context acceleration is restricted, or if a third-party framework mismatches peer dependencies.
            </p>
            <div className="bg-black/60 border border-white/5 p-4 rounded font-mono text-[10px] text-red-400 max-h-60 overflow-y-auto whitespace-pre-wrap select-all">
              <strong>Error Telemetry:</strong>
              {"\n"}
              {this.state.error?.toString()}
              {this.state.error?.stack ? `\n\nStack:\n${this.state.error.stack}` : ""}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="flex-1 bg-red-950/20 border border-red-500/25 hover:bg-red-950/40 text-red-300 font-mono text-xs uppercase py-2 rounded transition-all cursor-pointer"
              >
                Reset Canvas &amp; Reload System
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
