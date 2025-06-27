from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User
from app.models.transaction import Transaction
from app.models.portfolio import Portfolio
from app.services.stock_service import get_stock_price
from datetime import datetime

portfolio_bp = Blueprint('portfolio_bp', __name__)

@portfolio_bp.route('/portfolio/<int:user_id>', methods=['GET'])
def get_portfolio(user_id):
    portfolio_entries = Portfolio.query.filter_by(user_id=user_id).all()
    if not portfolio_entries:
        return jsonify({'message': 'No portfolio entries found for this user'}), 404

    portfolio_data = []
    for entry in portfolio_entries:
        stock_data = get_stock_price(entry.symbol)
        if 'error' in stock_data:
            return jsonify({'error': f"Error fetching price for {entry.symbol}: {stock_data['error']}"}), 500

        market_price = stock_data.get('price')
        if market_price is None:
            return jsonify({'error': f'Market price not available for symbol: {entry.symbol}'}), 500

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
