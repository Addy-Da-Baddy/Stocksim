from flask import Blueprint, jsonify, request
from app.models.user import User
from app.models.portfolio import Portfolio
from app.models.community_purchase import CommunityPurchase
from app.models.community_shop import CommunityShop
from app import db
from sqlalchemy import desc

leaderboard_bp = Blueprint('leaderboard_bp', __name__)

@leaderboard_bp.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    sort_by = request.args.get('sort_by', 'total')
    if sort_by not in ["money", "total", "score"]:
        return jsonify({'error': 'Invalid sort_by parameter. Use "money", "total", or "community".'}), 400
    users = User.query.all()

    if not users:
        return jsonify([]), 200

    max_balance = max(user.balance for user in users)
    max_community_score = max(user.community_score for user in users)

    leaderboard = []
    for user in users:
        username = user.username
        user_id = user.id
        balance = user.balance
        community_score = user.community_score

        normalized_balance = (balance / max_balance) * 100 if max_balance > 0 else 0
        normalized_score = (community_score / max_community_score) * 100 if max_community_score > 0 else 0
        
        total_score = round(0.6 * normalized_balance + 0.4 * normalized_score, 2)

        leaderboard_entry = {
            'user_id': user_id,
            'username': username,
            'balance': round(balance, 2),
            'community_score': community_score,
            'total_score': total_score
        }
        leaderboard.append(leaderboard_entry)

    if sort_by == "money":
        leaderboard.sort(key=lambda x: x['balance'], reverse=True)
    elif sort_by == "total":
        leaderboard.sort(key=lambda x: x['total_score'], reverse=True)
    elif sort_by == "score":
        leaderboard.sort(key=lambda x: x['community_score'], reverse=True)
    
    return jsonify(leaderboard[:10]), 200


