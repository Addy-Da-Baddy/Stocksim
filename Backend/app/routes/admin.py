from flask import Blueprint, jsonify, request
from app import db
from app.models.user import User
from app.models.transaction import Transaction
from app.models.portfolio import Portfolio
from app.services.stock_service import get_stock_price
from app.utils.market import is_market_open
from datetime import datetime
from app.models.community_shop import CommunityShop
from app.models.community_purchase import CommunityPurchase
from app.models.stock_cache import StockCache
from app.utils.auth import admin_required

admin_bp = Blueprint('admin_bp', __name__)

# _____________USERS_____________________

@admin_bp.route('/admin/users', methods=['GET'])
@admin_required
def get_users():
    users = User.query.all()
    user_list = [{
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'balance': user.balance,
        'community_score': user.community_score
    } for user in users]
    return jsonify(user_list), 200

@admin_bp.route('/admin/users/<int:user_id>', methods=['PUT'])
@admin_required
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    data = request.get_json()
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    user.balance = data.get('balance', user.balance)
    user.community_score = data.get('community_score', user.community_score)
    db.session.commit()
    return jsonify({'message': 'User updated'})

@admin_bp.route('/admin/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted'})

# ----------- TRANSACTIONS --------------
@admin_bp.route('/admin/transactions', methods=['GET'])
@admin_required
def list_transactions():
    txns = Transaction.query.all()
    return jsonify([{
        'id': t.id,
        'user_id': t.user_id,
        'symbol': t.symbol,
        'shares': t.shares,
        'price': t.price,
        'type': t.type,
        'timestamp': t.timestamp
    } for t in txns])

# ----------- PORTFOLIO --------------
@admin_bp.route('/admin/portfolio', methods=['GET'])
@admin_required
def list_portfolios():
    portfolios = Portfolio.query.all()
    return jsonify([{
        'id': p.id,
        'user_id': p.user_id,
        'symbol': p.symbol,
        'shares': p.shares,
        'avg_price': p.avg_price,
        'updated_at': p.updated_at
    } for p in portfolios])

# ----------- COMMUNITY SHOP --------------
@admin_bp.route('/admin/community-shop', methods=['GET'])
@admin_required
def list_community_shop():
    items = CommunityShop.query.all()
    return jsonify([{
        'id': i.id,
        'name': i.name,
        'description': i.description,
        'cost': i.cost,
        'score_value': i.score_value,
        'emoji': i.emoji,
        'available': i.available
    } for i in items])

@admin_bp.route('/admin/community-shop', methods=['POST'])
@admin_required
def create_shop_item():
    data = request.get_json()
    item = CommunityShop(
        name=data['name'],
        description=data['description'],
        cost=data['cost'],
        score_value=data['score_value'],
        emoji=data.get('emoji'),
        available=data.get('available', True)
    )
    db.session.add(item)
    db.session.commit()
    return jsonify({'message': 'Item created'}), 201

@admin_bp.route('/admin/community-shop/<int:item_id>', methods=['PUT'])
@admin_required
def update_shop_item(item_id):
    item = CommunityShop.query.get(item_id)
    if not item:
        return jsonify({'error': 'Item not found'}), 404
    data = request.get_json()
    item.name = data.get('name', item.name)
    item.description = data.get('description', item.description)
    item.cost = data.get('cost', item.cost)
    item.score_value = data.get('score_value', item.score_value)
    item.emoji = data.get('emoji', item.emoji)
    item.available = data.get('available', item.available)
    db.session.commit()
    return jsonify({'message': 'Item updated'})

@admin_bp.route('/admin/community-shop/<int:item_id>', methods=['DELETE'])
@admin_required
def delete_shop_item(item_id):
    item = CommunityShop.query.get(item_id)
    if not item:
        return jsonify({'error': 'Item not found'}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Item deleted'})

# ----------- STOCK CACHE --------------
@admin_bp.route('/admin/stock-cache', methods=['GET'])
@admin_required
def list_stock_cache():
    cache = StockCache.query.all()
    return jsonify([{
        'id': c.id,
        'symbol': c.symbol,
        'price': c.price,
        'last_updated': c.last_updated
    } for c in cache])
