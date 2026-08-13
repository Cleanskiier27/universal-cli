/**
 * Copilot chat and AI relay utilities.
 */

export async function sendCopilotChat(messages) {
  const response = await fetch('/api/copilot/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: messages.map(({ role, content }) => ({ role, content }))
    })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? 'Mission Copilot could not respond.');
  }

  return data;
}
