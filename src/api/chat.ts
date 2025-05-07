import { Chatbot } from '@/lib/chatbot';

const chatbot = new Chatbot();

export async function chat(message: string) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function getTopics() {
  try {
    const response = await fetch('/api/topics');
    if (!response.ok) {
      throw new Error('Failed to get topics');
    }
    const data = await response.json();
    return data.topics;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
} 