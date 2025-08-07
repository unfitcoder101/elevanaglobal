// Production error handling utility
// Only log errors in development, use proper error reporting in production

export const logError = (error: any, context?: string) => {
  // In production, you would typically send this to an error reporting service
  // like Sentry, LogRocket, or similar service
  
  if (import.meta.env.DEV) {
    console.error(`Error${context ? ` in ${context}` : ''}:`, error);
  }
  
  // In production, you could send to an error reporting service:
  // errorReportingService.captureException(error, { context });
};

export const logWarning = (message: string, data?: any) => {
  if (import.meta.env.DEV) {
    console.warn(message, data);
  }
};

export const logInfo = (message: string, data?: any) => {
  if (import.meta.env.DEV) {
    console.log(message, data);
  }
};