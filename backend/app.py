from flask import Flask, request, jsonify
from flask_cors import CORS
import cohere

app = Flask(__name__)

# Allow only Netlify frontend
CORS(app, origins=["https://adityas-ai-blog.netlify.app"], supports_credentials=True)

# Initialize Cohere
co = cohere.Client("YOUR_COHERE_API_KEY")  # Replace with your key

@app.route("/generate", methods=["POST", "OPTIONS"])
def generate_blog():
    if request.method == "OPTIONS":
        return '', 204

    try:
        data = request.get_json()
        prompt = data.get("prompt", "")

        if not prompt:
            return jsonify({"error": "Prompt is missing"}), 400

        response = co.generate(
            model='command-xlarge-nightly',
            prompt=prompt,
            max_tokens=300,
            temperature=0.8
        )

        blog_text = response.generations[0].text
        return jsonify({"blog": blog_text.strip()}), 200

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)