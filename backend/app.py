from flask import Flask, request, jsonify
from flask_cors import CORS
import cohere

app = Flask(__name__)

# Allow Netlify frontend
CORS(app, origins=["https://adityas-ai-blog.netlify.app", 
                   "http://adityas-ai-blog.netlify.app"], 
     supports_credentials=True)

# Initialize Cohere
co = cohere.Client("BFtqMu2YLAOd5AapuccYiU7kBy1K6PlxfwIeOyIO")  # Replace with your key

@app.route("/generate", methods=["POST", "OPTIONS"])
def generate_blog():
    if request.method == "OPTIONS":
        return "", 204
    
    try:
        data = request.get_json()
        # Check for either 'prompt' or 'topic' to make it more flexible
        prompt = data.get("prompt", data.get("topic", ""))
        
        if not prompt:
            return jsonify({"error": "Prompt is missing"}), 400
        
        # Use chat API instead of generate API
        response = co.chat(
            message=f"Write a blog post about: {prompt}",
            model="command",  # Using a supported model for chat
            temperature=0.8
        )
        
        # Extract text from chat response
        blog_text = response.text
        return jsonify({"blog": blog_text.strip()}), 200
        
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)