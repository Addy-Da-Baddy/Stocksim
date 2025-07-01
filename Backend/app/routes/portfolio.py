from flask import Blueprint, jsonify
from app import db
from app.models.user import User
from app.models.portfolio import Portfolio
from app.services.stock_service import get_stock_price
from app.utils.auth import user_required
from flask_jwt_extended import get_jwt_identity

portfolio_bp = Blueprint('portfolio_bp', __name__)

@portfolio_bp.route('/portfolio', methods=['GET'])
@user_required
def get_portfolio():
    user_id = get_jwt_identity()
    portfolio_entries = Portfolio.query.filter_by(user_id=user_id).all()
    if not portfolio_entries:
        return jsonify({'message': 'No portfolio entries found for this user'}), 404

    portfolio_data = []
    for entry in portfolio_entries:
        stock_data = get_stock_price(entry.symbol)
        market_price = stock_data.get('price')

        if not market_price:
            # Skip if price is not available, or use a fallback
            market_price = entry.avg_price

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
@user_required
def get_portfolio_value():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user: # Should be handled by @user_required
        return jsonify({'message': 'User not found'}), 404

    portfolio_entries = Portfolio.query.filter_by(user_id=user_id).all()
    total_value = 0.0
    total_cost = 0.0
    breakdown = []

    for entry in portfolio_entries:
        stock_data = get_stock_price(entry.symbol)
        current_price = stock_data.get('price')
        
        if not current_price:
            continue # Skip if price is not available

        market_value = current_price * entry.shares
        cost = entry.avg_price * entry.shares
        profit = market_value - cost
        total_value += market_value
        total_cost += cost
        breakdown.append({
            'symbol': entry.symbol,
            'shares': entry.shares,
            'avg_price': round(entry.avg_price, 2),
            'current_price': round(current_price, 2),
            'market_value': round(market_value, 2),
            'profit': round(profit, 2)
        })

    return jsonify({
        'user_id': user_id,
        'balance': round(user.balance, 2),
        'portfolio_value': round(total_value, 2),
        'total_cost_basis': round(total_cost, 2),
        'net_gain_loss': round(total_value - total_cost, 2),
        'total_equity': round(user.balance + total_value, 2),
        'holdings': breakdown
    }), 200

