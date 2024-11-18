/* eslint-disable react/prop-types */

import React, { Component } from 'react';
import ErrorPage from './pages/ErrorPage';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
