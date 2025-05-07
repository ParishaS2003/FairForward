import { spawn } from 'child_process';
import path from 'path';

const API_KEY = "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";

export async function handleChatRequest(message: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', [
      path.join(__dirname, '../../ChatBot-main/chatbot.py'),
      message
    ]);

    let response = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      response += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}: ${error}`));
      } else {
        resolve(response.trim());
      }
    });
  });
} 