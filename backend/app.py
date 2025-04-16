from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import cohere
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

load_dotenv()

app = Flask(__name__)
CORS(app, origins=[
    "https://adityas-ai-blog.netlify.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
], supports_credentials=True)

# Environment variables
COHERE_API_KEY = os.getenv("COHERE_API_KEY")
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
FROM_EMAIL = os.getenv("FROM_EMAIL", "adityakacha324@gmail.com")

# Validations
if not COHERE_API_KEY:
    raise ValueError("Missing COHERE_API_KEY in .env file.")
if not SENDGRID_API_KEY:
    raise ValueError("Missing SENDGRID_API_KEY in .env file.")
if not FROM_EMAIL:
    raise ValueError("Missing FROM_EMAIL in .env file.")

# Initialize Cohere client
co = cohere.Client(COHERE_API_KEY)

# ------------------------------------------------
# 🔹 Route: Generate Blog with Tone Support
# ------------------------------------------------
@app.route("/generate", methods=["POST", "OPTIONS"])
def generate_blog():
    if request.method == "OPTIONS":
        return "", 204

    try:
        data = request.get_json()
        prompt = data.get("prompt", "").strip()
        tone = data.get("tone", "neutral").strip().lower()  # NEW 🎯

        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400

        # Append tone to prompt
        full_prompt = f"Write a {tone} blog post about: {prompt}"

        response = co.chat(
            message=full_prompt,
            model="command",
            temperature=0.8
        )

        blog_text = response.text.strip()
        blog_title = f"Blog on {prompt.title()}"
        description = blog_text[:120] + "..."

        return jsonify({
            "blog": blog_text,
            "title": blog_title,
            "description": description
        }), 200

    except Exception as e:
        print(f"🔥 Blog Generation Error: {str(e)}")
        return jsonify({"error": str(e)}), 500


# ------------------------------------------------
# 🔹 Route: Send Email (user manually clicks button)
# ------------------------------------------------
@app.route("/send_email", methods=["POST", "OPTIONS"])
def send_email():
    if request.method == "OPTIONS":
        return "", 204

    try:
        data = request.get_json()
        to_email = data.get("email")
        title = data.get("title")
        content = data.get("content")

        if not all([to_email, title, content]):
            return jsonify({"error": "Missing email, title, or content"}), 400

        message = Mail(
            from_email=FROM_EMAIL,
            to_emails=to_email,
            subject=title,
            html_content=f"<h2>{title}</h2><p>{content}</p>"
        )

        sg = SendGridAPIClient(SENDGRID_API_KEY)
        sg.send(message)

        return jsonify({"message": "Email sent successfully!"}), 200

    except Exception as e:
        print(f"🔥 SendGrid Error: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)