import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
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
    console.error('Uncaught error in React tree:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-card text-center border border-amber-100">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl">
              ⚠️
            </div>
            <h1 className="text-2xl font-black text-ink mb-2">Something went wrong</h1>
            <p className="text-slate-600 mb-6 text-sm">
              An unexpected error occurred while loading the page. You can reload to restore the standard view.
            </p>
            {this.state.error && (
              <div className="bg-slate-50 text-left p-3 rounded-xl mb-6 text-xs text-slate-700 font-mono overflow-auto max-h-32 border border-slate-200">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="w-full py-3 px-6 bg-forest text-white font-bold rounded-2xl shadow hover:bg-forest/90 transition-all cursor-pointer"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
