from flask import Blueprint, jsonify, request
from app import db
from app.models.learning_article import LearningArticle
from bs4 import BeautifulSoup

help_bp = Blueprint('help_bp', __name__)

@help_bp.route('/help/articles', methods=['GET'])
def get_all_articles():
    articles = LearningArticle.query.order_by(LearningArticle.created_at.desc()).limit(10).all()
    cleaned_articles = []
    for a in articles:
        soup = BeautifulSoup(a.content, 'lxml')
        cleaned_content = soup.get_text(separator='\n')
        cleaned_articles.append({
            "id": a.id,
            "title": a.title,
            "content": cleaned_content,
            "external_url": a.source_url
        })
    return jsonify(cleaned_articles), 200

@help_bp.route('/help/article/<int:article_id>', methods=['GET'])
def get_article(article_id):
    article = LearningArticle.query.get(article_id)
    if not article:
        return jsonify({"error": "Article not found"}), 404
    
    soup = BeautifulSoup(article.content, 'lxml')
    cleaned_content = soup.get_text(separator='\n')

    return jsonify({
        "id": article.id,
        "title": article.title,
        "content": cleaned_content,
        "external_url": article.source_url
    }), 200