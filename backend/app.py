from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import cohere
import stripe
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, origins=[
    "https://adityas-ai-blog.netlify.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
], supports_credentials=True)

# API Keys
COHERE_API_KEY = os.getenv("COHERE_API_KEY")
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
FROM_EMAIL = os.getenv("FROM_EMAIL", "noreply@example.com")
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_PRICE_ID = os.getenv("STRIPE_PRICE_ID")

# Validate environment setup
if not all([COHERE_API_KEY, SENDGRID_API_KEY, FROM_EMAIL, STRIPE_SECRET_KEY, STRIPE_PRICE_ID]):
    raise ValueError("❌ One or more environment variables are missing. Check .env")

# Initialize APIs
co = cohere.Client(COHERE_API_KEY)
stripe.api_key = STRIPE_SECRET_KEY

# 🔹 Generate Blog
@app.route("/generate", methods=["POST", "OPTIONS"])
def generate_blog():
    if request.method == "OPTIONS":
        return "", 204
    
    try:
        data = request.get_json()
        prompt = data.get("prompt", "").strip()
        tone = data.get("tone", "neutral").strip().lower()

        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400

        full_prompt = f"Write a {tone} blog post about: {prompt}"
        response = co.chat(message=full_prompt, model="command", temperature=0.8)

        blog_text = response.text.strip()
        title = f"Blog on {prompt.title()}"
        description = blog_text[:120] + "..."

        return jsonify({
            "blog": blog_text,
            "title": title,
            "description": description
        }), 200

    except Exception as e:
        print("🔥 Blog Generation Error:", str(e))
        return jsonify({"error": str(e)}), 500

# 🔹 Send Blog via Email
@app.route("/send_email", methods=["POST", "OPTIONS"])
def send_email():
    if request.method == "OPTIONS":
        return "", 204
    
    try:
        data = request.get_json()
        email = data.get("email")
        title = data.get("title")
        content = data.get("content")

        if not all([email, title, content]):
            return jsonify({"error": "Missing email, title, or content"}), 400

        message = Mail(
            from_email=FROM_EMAIL,
            to_emails=email,
            subject=title,
            html_content=f"<h2>{title}</h2><p>{content}</p>"
        )
        sg = SendGridAPIClient(SENDGRID_API_KEY)
        sg.send(message)

        return jsonify({"message": "Email sent successfully!"}), 200

    except Exception as e:
        print("🔥 SendGrid Error:", str(e))
        return jsonify({"error": str(e)}), 500

# 🔹 Create Stripe Checkout Session
@app.route("/create-checkout-session", methods=["POST", "OPTIONS"])
def create_checkout_session():
    if request.method == "OPTIONS":
        return "", 204

    try:
        data = request.get_json()
        email = data.get("email", "anonymous@guest.com")

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price": STRIPE_PRICE_ID,
                "quantity": 1,
            }],
            mode="payment",
            success_url="https://adityas-ai-blog.netlify.app/success",
            cancel_url="https://adityas-ai-blog.netlify.app/cancel",
            customer_email=email,
            metadata={"user_email": email}
        )

        return jsonify({"url": session.url}), 200

    except Exception as e:
        print("🔥 Stripe Error:", str(e))
        return jsonify({"error": str(e)}), 500

# ✅ Run App
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)