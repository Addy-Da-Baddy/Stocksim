from flask import Blueprint, jsonify, request
from app.models.user import User
from app.models.portfolio import Portfolio
from app.services.stock_service import get_stock_price
from app import db

leaderboard_bp = Blueprint('leaderboard_bp', __name__)

@leaderboard_bp.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    sort_by = request.args.get('sort_by', 'total')
    if sort_by not in ["money", "total", "score"]:
        return jsonify({'error': 'Invalid sort_by parameter. Use "money", "total", or "score".'}), 400
    
    users = User.query.all()
    if not users:
        return jsonify([]), 200

    leaderboard_data = []
    for user in users:
        portfolio_entries = Portfolio.query.filter_by(user_id=user.id).all()
        portfolio_value = 0
        for entry in portfolio_entries:
            stock_data = get_stock_price(entry.symbol)
            if 'price' in stock_data:
                portfolio_value += entry.shares * stock_data['price']
        
        total_equity = user.balance + portfolio_value
        leaderboard_data.append({
            'user_id': user.id,
            'username': user.username,
            'total_equity': total_equity,
            'community_score': user.community_score
        })

    if not leaderboard_data:
        return jsonify([]), 200

    max_equity = max(u['total_equity'] for u in leaderboard_data)
    max_score = max(u['community_score'] for u in leaderboard_data)

    for user_data in leaderboard_data:
        norm_equity = (user_data['total_equity'] / max_equity) * 100 if max_equity > 0 else 0
        user_data['total_score'] = round(0.6 * norm_equity + 0.4 * user_data['community_score'], 2)
        user_data['total_equity'] = round(user_data['total_equity'], 2)

    if sort_by == "money":
        leaderboard_data.sort(key=lambda x: x['total_equity'], reverse=True)
    elif sort_by == "score":
        leaderboard_data.sort(key=lambda x: x['community_score'], reverse=True)
    else: # Default to total score
        leaderboard_data.sort(key=lambda x: x['total_score'], reverse=True)
    
    return jsonify(leaderboard_data[:10]), 200


