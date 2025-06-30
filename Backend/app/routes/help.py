from flask import Blueprint, jsonify, request
from app import db
from app.models.learning_article import LearningArticle
help_bp = Blueprint('help_bp', __name__)

@help_bp.route('/help/resources', methods=['GET'])
def get_all_articles():
    articles = LearningArticle.query.order_by(LearningArticle.created_at.desc()).limit(10).all()
    return jsonify([
        {
            "id": a.id,
            "title": a.title,
            "summary": a.summary,
            "source_url": a.source_url
        } for a in articles
    ]), 200

@help_bp.route('/help/article/<int:article_id>', methods=['GET'])
def get_article(article_id):
    article = LearningArticle.query.get(article_id)
    if not article:
        return jsonify({"error": "Article not found"}), 404
    return jsonify({
        "id": article.id,
        "title": article.title,
        "content": article.content,
        "source_url": article.source_url
    }), 200