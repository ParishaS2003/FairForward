from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from chatbot import Chatbot, TOPIC_SUGGESTIONS
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
chatbot = Chatbot()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/test', methods=['GET'])
def test_api():
    return jsonify({'status': 'ok'}), 200

@app.route('/api/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message', '')
    if not user_message:
        return jsonify({'error': 'No message provided'}), 400
    
    response = chatbot.ask_bot(user_message)
    return jsonify({'response': response})

@app.route('/topics', methods=['GET'])
def get_topics():
    return jsonify({'topics': TOPIC_SUGGESTIONS})

if __name__ == '__main__':
    app.run(debug=True, port=5000) 