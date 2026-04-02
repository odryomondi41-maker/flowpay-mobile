/**
 * Saves the error log to local storage or external service
 * @param error The error to log
 */
const save_log = (error: any) => {
  const logs = JSON.parse(localStorage.getItem('crash_logs') || '[]');
  const newLog = {
    timestamp: new Date().toISOString(),
    error: error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name
    } : error,
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  logs.push(newLog);
  localStorage.setItem('crash_logs', JSON.stringify(logs.slice(-50))); // Keep last 50 logs
  console.error('📝 Crash log saved:', newLog);
};

/**
 * Notifies developers about a critical crash
 * @param error The error that occurred
 */
const notify_devs = (error: any) => {
  // In a real app, this would send an email or push a message to Slack/Sentry/Bugsnag
  console.warn('📨 Notifying developers about crash:', error?.message || error);
};

/**
 * Logs a crash and notifies developers
 * @param error The error to report
 */
export function log_crash(error: any) {
  save_log(error);
  notify_devs(error);
}