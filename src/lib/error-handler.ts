/**
 * Centralized Error Handler for Blueprint
 * 
 * Logs all errors to PostHog without exposing them to users.
 * Provides consistent error handling across the application.
 */

import posthog from 'posthog-js';

// Error types for categorization
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ErrorCategory = 
  | 'api' 
  | 'auth' 
  | 'database' 
  | 'validation' 
  | 'network' 
  | 'unknown';

interface ErrorContext {
  userId?: string;
  sessionId?: string;
  url?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

interface ErrorReport {
  message: string;
  stack?: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  context: ErrorContext;
  timestamp: string;
  fingerprint: string;
}

/**
 * Generate a fingerprint for error deduplication
 */
function generateFingerprint(error: Error, category: ErrorCategory): string {
  const message = error.message.slice(0, 100);
  const stack = error.stack?.split('\n')[1]?.trim() || '';
  return `${category}:${message}:${stack}`.replace(/\s+/g, '_').slice(0, 200);
}

/**
 * Determine error severity based on category and error type
 */
function determineSeverity(
  error: Error,
  category: ErrorCategory,
  explicitSeverity?: ErrorSeverity
): ErrorSeverity {
  if (explicitSeverity) return explicitSeverity;

  // Critical errors
  if (category === 'auth' && error.message.includes('unauthorized')) {
    return 'high';
  }
  if (category === 'database') {
    return 'critical';
  }
  if (error.message.includes('FATAL') || error.message.includes('CRITICAL')) {
    return 'critical';
  }

  // High severity
  if (category === 'api' && error.message.includes('500')) {
    return 'high';
  }

  // Medium severity
  if (category === 'validation' || category === 'network') {
    return 'medium';
  }

  return 'low';
}

/**
 * Main error capture function
 * Logs error to PostHog and returns a safe user-friendly message
 */
export function captureError(
  error: Error | unknown,
  options: {
    category?: ErrorCategory;
    severity?: ErrorSeverity;
    context?: ErrorContext;
    silent?: boolean; // Don't log to console
  } = {}
): { userMessage: string; errorId: string } {
  const {
    category = 'unknown',
    severity: explicitSeverity,
    context = {},
    silent = false,
  } = options;

  // Normalize error
  const normalizedError = error instanceof Error 
    ? error 
    : new Error(String(error));

  const severity = determineSeverity(normalizedError, category, explicitSeverity);
  const fingerprint = generateFingerprint(normalizedError, category);
  const errorId = `err_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  const report: ErrorReport = {
    message: normalizedError.message,
    stack: normalizedError.stack,
    category,
    severity,
    context: {
      ...context,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    },
    timestamp: new Date().toISOString(),
    fingerprint,
  };

  // Log to PostHog
  if (typeof window !== 'undefined' && posthog) {
    // Use PostHog's exception capture format
    posthog.capture('$exception', {
      $exception_message: report.message,
      $exception_stack_trace_raw: report.stack,
      $exception_type: normalizedError.name || category,
      $exception_source: 'custom',
      $exception_fingerprint: fingerprint,
      $exception_personURL: typeof window !== 'undefined' ? window.location.href : undefined,
      // Custom properties
      error_id: errorId,
      error_category: category,
      error_severity: severity,
      ...report.context,
      ...report.context.metadata,
    });
    
    // Also log to console in session replay
    console.error(`[${category.toUpperCase()}] Error captured:`, {
      errorId,
      message: report.message,
      severity,
    });
  }

  // Console log in development (unless silent)
  if (!silent && process.env.NODE_ENV === 'development') {
    console.error(`[${severity.toUpperCase()}] ${category}:`, normalizedError);
  }

  // Return safe user message
  return {
    userMessage: getUserFriendlyMessage(category, severity),
    errorId,
  };
}

/**
 * Get a user-friendly error message (never expose internal details)
 */
function getUserFriendlyMessage(
  category: ErrorCategory,
  _severity: ErrorSeverity // Prefixed with _ to indicate intentionally unused (for future use)
): string {
  const messages: Record<ErrorCategory, string> = {
    api: 'Unable to complete the request. Please try again.',
    auth: 'Authentication error. Please sign in again.',
    database: 'A temporary issue occurred. Please try again shortly.',
    validation: 'Please check your input and try again.',
    network: 'Connection issue. Please check your internet and try again.',
    unknown: 'Something went wrong. Please try again.',
  };

  return messages[category];
}

/**
 * Higher-order function to wrap async functions with error handling
 */
export function withErrorHandler<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  options: {
    category?: ErrorCategory;
    context?: ErrorContext;
  } = {}
): (...args: Parameters<T>) => Promise<ReturnType<T> | { error: string; errorId: string }> {
  return async (...args: Parameters<T>) => {
    try {
      return await fn(...args) as ReturnType<T>;
    } catch (error) {
      const { userMessage, errorId } = captureError(error, options);
      return { error: userMessage, errorId };
    }
  };
}

/**
 * React Error Boundary helper - call this in componentDidCatch or error boundary
 */
export function captureReactError(
  error: Error,
  errorInfo: { componentStack?: string },
  componentName?: string
): { userMessage: string; errorId: string } {
  return captureError(error, {
    category: 'unknown',
    severity: 'high',
    context: {
      component: componentName,
      metadata: {
        componentStack: errorInfo.componentStack,
      },
    },
  });
}

/**
 * API error handler - use in API routes
 */
export function captureApiError(
  error: Error | unknown,
  endpoint: string,
  method: string,
  statusCode?: number
): { userMessage: string; errorId: string } {
  return captureError(error, {
    category: 'api',
    severity: statusCode && statusCode >= 500 ? 'high' : 'medium',
    context: {
      action: `${method} ${endpoint}`,
      metadata: { statusCode },
    },
  });
}

/**
 * Form/validation error handler
 */
export function captureValidationError(
  error: Error | unknown,
  formName: string,
  fieldName?: string
): { userMessage: string; errorId: string } {
  return captureError(error, {
    category: 'validation',
    severity: 'low',
    context: {
      action: `validate_${formName}`,
      metadata: { fieldName },
    },
  });
}

/**
 * Network/fetch error handler
 */
export function captureNetworkError(
  error: Error | unknown,
  url: string,
  method: string = 'GET'
): { userMessage: string; errorId: string } {
  return captureError(error, {
    category: 'network',
    severity: 'medium',
    context: {
      action: `${method} ${url}`,
    },
  });
}

export default {
  capture: captureError,
  captureReact: captureReactError,
  captureApi: captureApiError,
  captureValidation: captureValidationError,
  captureNetwork: captureNetworkError,
  withErrorHandler,
};
