/**
 * API communication and payload utilities.
 */

export async function transmitCommand(payload) {
  const response = await fetch('/api/commands', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: payload })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? 'Command transmission failed');
  }

  return data;
}

export async function fetchAGITelemetry() {
  try {
    const response = await fetch('/api/agi/status');
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.warn('AGI Telemetry fetch error:', error.message);
    return null;
  }
}
