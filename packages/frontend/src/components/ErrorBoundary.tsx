import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * ErrorBoundary — catches crashes so one broken component
 * doesn't white-screen the entire app.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    console.error('[ErrorBoundary]', error);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="card" style={{ textAlign: 'center', padding: '2rem', margin: '1rem' }}>
            <div style={{ fontSize: '2.5rem' }}>😅</div>
            <h3>Something went wrong</h3>
            <p className="form-note">Don't worry, your stuff is safe.</p>
            <button className="btn" onClick={() => this.setState({ hasError: false })}>
              Try Again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
