/**
 * Command execution and export utilities for VEX CLI App.
 */

export async function sendPayloadCommand(message) {
  const response = await fetch('/api/commands', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? 'Command transmission failed');
  }

  return data;
}

export function exportPayloadText(kind, content) {
  const timestamp = new Date().toISOString().replaceAll(':', '-');
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = downloadUrl;
  link.download = `vex-${kind}-${timestamp}.txt`;
  link.click();
  URL.revokeObjectURL(downloadUrl);
}
