from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import cohere

load_dotenv()  # Load from .env

cohere_client = cohere.Client(os.getenv("COHERE_API_KEY"))

app = Flask(__name__)
CORS(app)

@app.route('/generate-blog', methods=['POST'])
def generate_blog():
    data = request.json
    topic = data.get("topic", "AI tools for students and freelancers")

    prompt = f"Write a short, engaging blog post about: {topic}. Include an intro, some bullets, and a conclusion."

    try:
        response = cohere_client.chat(
            message=prompt,
            model='command-r-plus',  # or 'command' if needed
            temperature=0.7
        )

        content = response.text.strip()
        return jsonify({"post": content})
    except Exception as e:
        print("🔥 Cohere Error:", str(e))
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)