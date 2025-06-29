from flask import Blueprint, jsonify, request
import requests
import os

news_bp = Blueprint('news_bp', __name__)

NEWS_API_KEY = os.getenv('NEWS_API_KEY')

@news_bp.route('/news', methods=['GET'])
def get_business_news():
    url = "https://newsapi.org/v2/top-headlines"
    params = {
        'category': 'business',
        'country': 'us',
        'apiKey': NEWS_API_KEY,
        'language': 'en',
    }
    response = requests.get(url, params=params)
    if response.status_code != 200:
        return jsonify({'error': 'Failed to fetch news'}), response.status_code
    articles = response.json().get('articles', [])
    top_news = [
        {
            'title': article['title'],
            'description': article['description'],
            'url': article['url'],
            'publishedAt': article['publishedAt'],
            'source': article['source']['name']
        } for article in articles
    ]

    return jsonify(top_news), 200