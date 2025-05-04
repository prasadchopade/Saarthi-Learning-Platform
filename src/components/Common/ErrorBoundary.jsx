import React from 'react';

/**
 * Without this, one component throwing during render unmounts the whole app and
 * leaves a blank white page with nothing to explain it. Showing something is
 * always better than showing nothing.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Unhandled error while rendering:', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-6 text-center">
        <div className="max-w-md">
          <h1 className="text-2xl font-semibold text-white">Something went wrong</h1>
          <p className="mt-3 text-sm text-gray-400">
            This page failed to load. Reloading usually fixes it.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-md bg-white px-5 py-2 text-sm font-medium text-black"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
