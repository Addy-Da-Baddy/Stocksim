from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User
from app.models.transaction import Transaction
from app.models.portfolio import Portfolio
from app.services.stock_service import get_stock_price
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity

portfolio_bp = Blueprint('portfolio_bp', __name__)

@portfolio_bp.route('/portfolio', methods=['GET'])
@jwt_required()
def get_portfolio():
    user_id = get_jwt_identity()
    portfolio_entries = Portfolio.query.filter_by(user_id=user_id).all()
    portfolio_data = []
    for entry in portfolio_entries:
        stock_data = get_stock_price(entry.symbol)
        if 'error' in stock_data:
            # In a real app, you might want to handle this more gracefully
            # For now, we can skip the entry or use a placeholder
            market_price = entry.avg_price # fallback to average price
        else:
            market_price = stock_data.get('price')

        market_value = entry.shares * market_price
        profit = round(market_value - (entry.avg_price * entry.shares), 2)

        entry_data = {
            'symbol': entry.symbol,
            'shares': entry.shares,
            'avg_price': round(entry.avg_price, 2),
            'market_price': round(market_price, 2),
            'market_value': round(market_value, 2),
            'profit': profit,
            'total_invested': round(entry.avg_price * entry.shares, 2)
        }
        portfolio_data.append(entry_data)

    return jsonify({
        'user_id': user_id,
        'portfolio': portfolio_data
    }), 200


@portfolio_bp.route('/portfolio/value', methods=['GET'])
@jwt_required()
def get_portfolio_value():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    portfolio_entries = Portfolio.query.filter_by(user_id=user_id).all()
    total_value = 0.0
    total_cost = 0.0
    breakdown = []

    for entry in portfolio_entries:
        stock_data = get_stock_price(entry.symbol)
        if 'error' in stock_data:
            current_price = entry.avg_price # fallback
        else:
            current_price = stock_data.get('price')
        
        market_value = current_price * entry.shares if current_price else 0.0
        cost = entry.avg_price * entry.shares
        profit = market_value - cost
        total_value += market_value
        total_cost += cost
        breakdown.append({
            'symbol': entry.symbol,
            'shares': entry.shares,
            'avg_price': round(entry.avg_price, 2),
            'current_price': round(current_price, 2) if current_price else None,
            'market_value': round(market_value, 2),
            'profit': round(profit, 2)
        })

    return jsonify({
        'user_id': user_id,
        'balance': round(user.balance, 2),
        'portfolio_value': round(total_value, 2),
        'total_cost_basis': round(total_cost, 2) if total_cost > 0 else 0,
        'net_gain_loss': round(total_value - total_cost, 2),
        'total_equity': round(user.balance + total_value, 2),
        'holdings': breakdown,
        'user_details': {
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'phone_number': user.phone_number,
            'date_of_birth': user.date_of_birth.isoformat() if user.date_of_birth else None,
            'address': user.address,
            'created_at': user.created_at.isoformat() if user.created_at else None,
            'community_score': user.community_score
        }
    }), 200

