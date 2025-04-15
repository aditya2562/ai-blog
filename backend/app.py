from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app, origins="https://adityas-ai-blog.netlify.app", supports_credentials=True)

blog_history = []

@app.route('/generate_blog', methods=['POST'])
def generate_blog():
    data = request.get_json()
    topic = data.get('topic')
    user_id = data.get('user_email')

    if not topic or not user_id:
        return jsonify({"error": "Topic and user_id are required"}), 400

    content = f"This is a blog post about {topic}, generated by our amazing AI engine."

    new_blog = {
        "id": len(blog_history) + 1,
        "title": f"Blog on {topic.title()}",
        "desc": content[:100] + "...",
        "content": content,
        "date": datetime.now().strftime("%Y-%m-%d"),
        "user_id": user_id,
    }

    blog_history.insert(0, new_blog)

    return jsonify({
        "id": new_blog["id"],
        "title": new_blog["title"],
        "description": new_blog["desc"],
        "blog": new_blog["content"]
    })


@app.route('/blog_history/<user_id>', methods=['GET'])
def get_user_blog_history(user_id):
    user_blogs = [blog for blog in blog_history if blog["user_id"] == user_id]
    return jsonify(user_blogs)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)  