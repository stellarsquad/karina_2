export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { methodName, ...body } = request.body;
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    return response.status(500).json({ error: 'Telegram bot token is not configured.' });
  }

  if (!methodName) {
    return response.status(400).json({ error: 'Method name is required.' });
  }

  const url = `https://api.telegram.org/bot${token}/${methodName}`;

  try {
    const telegramResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await telegramResponse.json();

    if (!telegramResponse.ok) {
      return response.status(telegramResponse.status).json(data);
    }

    return response.status(200).json(data);
  } catch (error) {
    console.error('Error proxying Telegram request:', error);
    return response.status(500).json({ error: 'An internal error occurred.' });
  }
}
