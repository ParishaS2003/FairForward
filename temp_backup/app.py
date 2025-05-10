from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Enable CORS for all routes
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:8081", "http://localhost:3000"]}})

def get_chatbot_response(message):
    try:
        headers = {
            "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
            "HTTP-Referer": "http://localhost:8081",  # Optional, for analytics
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "mistralai/mistral-7b-instruct",  # You can change this to any model you prefer
            "messages": [
                {"role": "system", "content": "You are a helpful legal assistant."},
                {"role": "user", "content": message}
            ]
        }
        
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=data
        )
        
        if response.status_code == 200:
            return response.json()['choices'][0]['message']['content']
        else:
            print(f"Error from OpenRouter API: {response.text}")
            return "I apologize, but I'm having trouble processing your request at the moment."
            
    except Exception as e:
        print(f"Error in API call: {str(e)}")
        return "I apologize, but I'm having trouble processing your request at the moment."

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400
            
        response = get_chatbot_response(user_message)
        return jsonify({'response': response})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001) 