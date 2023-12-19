import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erro capturado pelo "error boundary":', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Algo deu errado. Por favor, tente novamente mais tarde.</div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;