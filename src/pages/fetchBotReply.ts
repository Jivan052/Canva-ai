export const fetchBotReply = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch('https://allan30joseph.app.n8n.cloud/webhook-test/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch response from server');
    }

    const data = await response.json();
    return data.reply || 'Received response but no reply text was found.';
  } catch (error) {
    console.error('Error sending prompt:', error);
    return 'Sorry, there was an error reaching the server.';
  }
};
