/**
 * System diagnostic and status utilities.
 */

export async function fetchSystemHealth() {
  try {
    const response = await fetch('/api/health');
    if (!response.ok) {
      throw new Error(`Health check failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return { status: 'error', error: error.message, timestamp: new Date().toISOString() };
  }
}

export async function fetchSystemStatus() {
  try {
    const response = await fetch('/api/status');
    if (!response.ok) {
      throw new Error(`Status check failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    return { status: 'offline', error: error.message, timestamp: new Date().toISOString() };
  }
}

export function formatUptime(seconds) {
  if (!seconds || seconds <= 0) return '0s';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}
