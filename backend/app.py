from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import cohere
import stripe
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
import traceback

# Load env variables
load_dotenv()

app = Flask(__name__)
CORS(app, origins=[
    "https://adityas-ai-blog.netlify.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
], supports_credentials=True)

# 🔐 Keys
COHERE_API_KEY = os.getenv("COHERE_API_KEY")
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
FROM_EMAIL = os.getenv("FROM_EMAIL")
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_PRICE_ID = os.getenv("STRIPE_PRICE_ID")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

# 🧠 Init services
co = cohere.Client(COHERE_API_KEY)
stripe.api_key = STRIPE_SECRET_KEY

# 🔥 Firebase init
FIREBASE_CRED_PATH = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if not firebase_admin._apps:
    cred = credentials.Certificate(FIREBASE_CRED_PATH)
    firebase_admin.initialize_app(cred)
db = firestore.client()

# ✅ Generate Blog
@app.route("/generate", methods=["POST", "OPTIONS"])
def generate_blog():
    if request.method == "OPTIONS":
        return "", 204
    try:
        data = request.get_json()
        prompt = data.get("prompt", "").strip()
        tone = data.get("tone", "neutral").strip().lower()
        user_email = data.get("user_email")

        if not prompt or not user_email:
            return jsonify({"error": "Prompt and user_email are required"}), 400

        user_ref = db.collection("users").document(user_email)
        user_doc = user_ref.get()
        user_data = user_doc.to_dict() if user_doc.exists else {}
        plan = user_data.get("plan", "free")
        last_date = user_data.get("lastGenerationDate")
        generation_count = user_data.get("generationCount", 0)
        today = datetime.utcnow().strftime('%Y-%m-%d')

        if plan == "free":
            if last_date == today and generation_count >= 1:
                return jsonify({"error": "Daily limit reached. Upgrade to premium for unlimited blogs."}), 403

        full_prompt = f"Write a {tone} blog post about: {prompt}"
        response = co.chat(message=full_prompt, model="command", temperature=0.8)
        blog_text = response.text.strip()

        updates = {
            "lastGenerationDate": today,
            "generationCount": generation_count + 1 if last_date == today else 1
        }
        user_ref.set(updates, merge=True)

        return jsonify({
            "blog": blog_text,
            "title": f"Blog on {prompt.title()}",
            "description": blog_text[:120] + "..."
        }), 200
    except Exception as e:
        print("🔥 Blog Generation Error:", str(e))
        return jsonify({"error": str(e)}), 500

# ✅ Send Email
@app.route("/send_email", methods=["POST", "OPTIONS"])
def send_email():
    if request.method == "OPTIONS":
        return "", 204
    try:
        data = request.get_json()
        email, title, content = data.get("email"), data.get("title"), data.get("content")

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

# ✅ Create Stripe Checkout Session
@app.route("/create-checkout-session", methods=["POST"])
def create_checkout_session():
    try:
        data = request.get_json()
        email = data.get("email", "anonymous@guest.com")

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price": STRIPE_PRICE_ID,
                "quantity": 1,
            }],
            mode="subscription",
            success_url="https://adityas-ai-blog.netlify.app/success",
            cancel_url="https://adityas-ai-blog.netlify.app/cancel",
            customer_email=email,
            metadata={"user_email": email}
        )

        return jsonify({"url": session.url}), 200
    except Exception as e:
        print("🔥 Stripe Checkout Error:", str(e))
        return jsonify({"error": str(e)}), 500

# ✅ Stripe Webhook
@app.route("/webhook", methods=["POST"])
def stripe_webhook():
    payload = request.data
    sig_header = request.headers.get("Stripe-Signature")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
    except stripe.error.SignatureVerificationError as e:
        print("❌ Webhook signature verification failed:", str(e))
        return jsonify(success=False), 400

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        email = session.get("customer_email")

        if email:
            db.collection("users").document(email).set({
                "plan": "premium",
                "subscribed": True,
                "stripe_session_id": session["id"]
            }, merge=True)

            print(f"✅ Upgraded {email} to premium")

    return jsonify(success=True), 200

# ✅ Stripe Billing Portal
@app.route("/create-portal-session", methods=["POST", "OPTIONS"])
def create_portal_session():
    if request.method == "OPTIONS":
        return "", 204
    try:
        data = request.get_json()
        email = data.get("email")

        if not email:
            return jsonify({"error": "Missing user email"}), 400

        # 🔍 Get customer list by email
        customers = stripe.Customer.list(email=email, limit=1).data
        if not customers:
            return jsonify({"error": "No Stripe customer found for this email"}), 404

        customer_id = customers[0].id

        # ✅ Create billing portal session
        session = stripe.billing_portal.Session.create(
            customer=customer_id,
            return_url="https://adityas-ai-blog.netlify.app/dashboard"
        )

        return jsonify({"url": session.url}), 200

    except Exception as e:
        print("❌ Stripe Billing Portal Error:", str(e))
        return jsonify({"error": str(e)}), 500

        traceback.print_exc()

# ✅ Run
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)