import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[ErrorBoundary caught an error]:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0814] font-body flex items-center justify-center px-6 py-12 text-text-main">
          <div className="card max-w-md w-full rounded-3xl p-8 bg-[#15102A] border border-[#261E4E] shadow-card-dark text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 flex items-center justify-center mx-auto mb-4 font-bold text-2xl shadow-glow-sm">
              ⚠️
            </div>
            <h1 className="font-heading font-extrabold text-2xl text-white mb-2 tracking-tight">
              Something went wrong
            </h1>
            <p className="text-sm text-text-muted mb-6 font-medium leading-relaxed">
              An unexpected error occurred. You can safely return to the home page or reload.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReload}
                className="btn-primary font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-glow-sm cursor-pointer"
              >
                Back to Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary font-bold text-xs sm:text-sm px-6 py-3 rounded-full cursor-pointer"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
