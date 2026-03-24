import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

// Shared error display component
const ErrorDisplay = ({ title, message, status, showNavigation = true, onRefresh = null, onNavigate = null, onGoBack = null }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      padding: '1rem'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow-md)',
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }}>
          <AlertCircle size={48} color='var(--danger)' />
        </div>
        
        {status && (
          <div style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: 'var(--danger)',
            marginBottom: '0.5rem'
          }}>
            {status}
          </div>
        )}
        
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          marginBottom: '0.5rem'
        }}>
          {title}
        </h1>
        
        <p style={{
          color: 'var(--text-secondary)',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          {message}
        </p>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {onRefresh && (
            <button
              onClick={onRefresh}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--accent-primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'opacity 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              Refresh Page
            </button>
          )}
          
          {showNavigation && onNavigate && (
            <button
              onClick={onNavigate}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--accent-primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'opacity 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              <Home size={20} />
              Back to Home
            </button>
          )}
          
          {showNavigation && onGoBack && (
            <button
              onClick={onGoBack}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'background-color 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--border-color)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Error Boundary - catches React component errors
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: 'var(--bg-primary)',
          padding: '1rem'
        }}>
          <div style={{
            maxWidth: '500px',
            width: '100%',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-md)',
            padding: '3rem 2rem',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <AlertCircle size={48} color='var(--danger)' />
            </div>
            <h1 style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem'
            }}>
              Something went wrong
            </h1>
            <p style={{
              color: 'var(--text-secondary)',
              marginBottom: '2rem',
              lineHeight: '1.6'
            }}>
              We are sorry for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--accent-primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'opacity 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              Refresh Page
            </button>
            {this.state.error && (
              <details style={{
                marginTop: '2rem',
                textAlign: 'left',
                padding: '1rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '0.875rem'
              }}>
                <summary style={{
                  cursor: 'pointer',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  marginBottom: '0.5rem'
                }}>
                  Error Details
                </summary>
                <pre style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  color: 'var(--text-secondary)',
                  marginTop: '0.5rem',
                  fontFamily: 'monospace',
                  overflow: 'auto',
                  maxHeight: '200px'
                }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Route Error Handler - handles React Router errors
export function RouteError() {
  const error = useRouteError();
  const navigate = useNavigate();
  console.error(error);

  const errorMessage = error?.statusText || error?.message || 'An unexpected error occurred';
  const status = error?.status || 500;

  return (
    <ErrorDisplay
      title="Oops!"
      message={errorMessage}
      status={status}
      showNavigation={true}
      onNavigate={() => navigate('/')}
      onGoBack={() => window.history.back()}
    />
  );
}

// Default export for backward compatibility
export default ErrorBoundary;
