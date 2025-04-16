from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import cohere

load_dotenv()  # This loads .env variables

app = Flask(__name__)
CORS(app, origins=["https://adityas-ai-blog.netlify.app", "http://localhost:5173", "http://localhost:3000"], supports_credentials=True)

# Load Cohere API key from .env
COHERE_API_KEY = os.getenv("COHERE_API_KEY")

if not COHERE_API_KEY:
    raise ValueError("Missing Cohere API key. Check your .env file.")

co = cohere.Client(COHERE_API_KEY)

@app.route("/generate", methods=["POST", "OPTIONS"])
def generate_blog():
    if request.method == "OPTIONS":
        return "", 204
    
    try:
        data = request.get_json()
        prompt = data.get("prompt", "")
        user_email = data.get("user_email", "anonymous@user.com")
        
        if not prompt:
            return jsonify({"error": "Prompt is missing"}), 400
        
        response = co.chat(
            message=f"Write a blog post about: {prompt}",
            model="command",
            temperature=0.8
        )
        
        blog_text = response.text.strip()
        return jsonify({"blog": blog_text}), 200
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)