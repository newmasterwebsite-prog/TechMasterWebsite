import React from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      showDetails: false 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("TechMaster Admin Panel ErrorBoundary caught runtime exception:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    // If there is any quota issue or corrupted state in localStorage, clean bloated cache
    try {
      const db = localStorage.getItem('zenvora_db');
      if (db && (db.includes('resume_file_') || db.length > 2500000)) {
        localStorage.removeItem('zenvora_db');
      }
    } catch (e) {}
    window.location.reload();
  };

  handleResetState = () => {
    try {
      localStorage.removeItem('zenvora_db');
      localStorage.removeItem('techmaster-cms-last-updated');
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#030303] text-zinc-100 flex flex-col items-center justify-center p-6 text-center select-none font-sans">
          {/* Subtle luxury glow background */}
          <div className="absolute w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-lg w-full bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-8 backdrop-blur-xl shadow-2xl shadow-black/80 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-red-500/10 border border-amber-500/30 flex items-center justify-center mb-6 shadow-inner">
              <ShieldAlert className="w-8 h-8 text-amber-400" />
            </div>

            <h1 className="text-xl font-serif font-semibold text-white tracking-wide mb-2">
              Panel Recovery System
            </h1>

            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              The panel intercepted an unexpected UI exception. Your system data is safe and protected on the server.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center mb-6">
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-mono text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer shadow-lg shadow-amber-500/5 hover:scale-[1.02]"
              >
                <RefreshCw className="w-4 h-4 animate-spin-reverse" />
                Reload Panel
              </button>

              <button
                onClick={this.handleResetState}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-300 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer hover:scale-[1.02]"
              >
                Reset Local Cache
              </button>
            </div>

            {/* Collapsible Error Technical Information */}
            <div className="w-full text-left">
              <button
                onClick={() => this.setState({ showDetails: !this.state.showDetails })}
                className="text-[11px] text-zinc-500 hover:text-zinc-400 font-mono underline cursor-pointer"
              >
                {this.state.showDetails ? "Hide Technical Details" : "View Technical Diagnostics"}
              </button>

              {this.state.showDetails && (
                <div className="mt-3 p-3 rounded-lg bg-black/60 border border-zinc-900 max-h-48 overflow-y-auto text-[10px] font-mono text-rose-300/80 leading-normal select-text break-words">
                  <div><strong>Error:</strong> {String(this.state.error?.message || this.state.error)}</div>
                  {this.state.error?.stack && (
                    <div className="mt-2 text-zinc-500 text-[9px] whitespace-pre-wrap">
                      {this.state.error.stack}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
