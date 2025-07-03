from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User
from app.models.community_shop import CommunityShop
from app.models.community_purchase import CommunityPurchase
from datetime import datetime

community_bp = Blueprint('community_bp', __name__)

@community_bp.route('/community/shop', methods=['GET'])
def view_shop():
    items = CommunityShop.query.filter_by(available=True).all()
    data = [{
        'id': item.id,
        'name': item.name,
        'description': item.description,
        'cost': item.cost,
        'score_value': item.score_value,
        'emoji': item.emoji
    } for item in items]
    return jsonify(data), 200

@community_bp.route('/community/purchase', methods=['POST'])
def buy_item():
    data  = request.json
    user_id = data.get('user_id')
    item_id = data.get('item_id')

    user = User.query.get(user_id)
    item = CommunityShop.query.get(item_id)

    if not user or not item:
        return jsonify({'error': 'User or item not found'}), 404
    
    if not item.available:
        return jsonify({'error': 'Item is not available'}), 400
    
    existing = CommunityPurchase.query.filter_by(user_id=user_id, item_id=item_id).first()
    if existing:
        return jsonify({'error': 'Item already purchased'}), 400
    
    if user.balance < item.cost:
        return jsonify({'error': 'Insufficient balance'}), 400
    
    user.balance -= item.cost
    user.community_score += item.score_value
    
    purchase = CommunityPurchase(user_id=user_id, item_id=item_id, timestamp=datetime.utcnow())
    db.session.add(purchase)
    db.session.commit()

    return jsonify({
        'message': 'Item purchased successfully',
        'item_id': item.id,
        'item_name': item.name,
        'user_balance': user.balance,
        'user_community_score': user.community_score
    }), 200

@community_bp.route('/community/myitems/<int:user_id>', methods=['GET'])
def get_user_items(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    purchases = db.session.query(CommunityPurchase, CommunityShop).join(CommunityShop).filter(CommunityPurchase.user_id == user_id).all()

    if not purchases:
        return jsonify([]), 200

    items_data = []
    for purchase, item in purchases:
        items_data.append({
            'id': item.id,
            'name': item.name,
            'description': item.description,
            'purchase_date': purchase.timestamp.isoformat()
        })

    return jsonify(items_data), 200


