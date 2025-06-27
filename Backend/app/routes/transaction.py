from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User
from app.models.transaction import Transaction
from app.models.portfolio import Portfolio
from app.services.stock_service import get_stock_price
from datetime import datetime

transaction_bp = Blueprint('transaction_bp', __name__)


@transaction_bp.route('/transaction/buy', methods=['POST'])
def buy_stock():
    data = request.json
    user_id = data.get('user_id')
    symbol = data.get('symbol')
    shares = float(data.get('shares', 0))


    if not all([user_id, symbol, shares]) or shares <= 0:
        return jsonify({'error': 'Missing or invalid data'}), 400
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    stock_data = get_stock_price(symbol)
    if 'error' in stock_data:
        return jsonify(stock_data), 500
    
    price = stock_data['price']
    total_cost = price*shares

    if user.balance < total_cost:
        return jsonify({'error': 'Insufficient balance'}), 400
    
    user.balance -= total_cost

    portfolio = Portfolio.query.filter_by(user_id=user_id, symbol=symbol.upper()).first()
    if portfolio:
        new_total_shares = portfolio.shares + shares
        portfolio.shares = new_total_shares
        portfolio.avg_price = ((portfolio.avg_price * portfolio.shares) + (price * shares)) / new_total_shares
    else:
        portfolio = Portfolio(
            user_id=user_id,
            symbol=symbol.upper(),
            shares=shares,
            avg_price=price
        )
        db.session.add(portfolio)

    transaction = Transaction(
        user_id=user_id,
        symbol=symbol.upper(),
        shares=shares,
        price=price,
        type = 'BUY',
        timestamp=datetime.utcnow()
    )
    db.session.add(transaction)
    db.session.commit()

    return jsonify({
        'message': 'Stock purchased successfully',
        'symbol': symbol.upper(),
        'new_balance': user.balance,
        'portfolio': {
            'symbol': portfolio.symbol,
            'shares': portfolio.shares,
            'avg_price': portfolio.avg_price
        }
    }), 200

@transaction_bp.route('/transaction/sell', methods=['POST'])
def sell_stock():
    data = request.json
    user_id = data.get('user_id')
    symbol = data.get('symbol')
    shares = float(data.get('shares'))

    if not all([user_id, symbol, shares]) or shares <= 0:
        return jsonify({'error': 'Missing or invalid data'}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    portfolio = Portfolio.query.filter_by(user_id=user_id, symbol=symbol.upper()).first()
    if not portfolio or portfolio.shares < shares:
        return jsonify({'error': 'Not enough shares to sell'}), 400

    stock_data = get_stock_price(symbol)
    if 'error' in stock_data:
        return jsonify({'error': 'Stock price fetch failed'}), 400

    price = stock_data['price']
    total_earned = price * shares

    # Update balance
    user.balance += total_earned

    # Update portfolio
    portfolio.shares -= shares
    if portfolio.shares == 0:
        db.session.delete(portfolio)  # remove entry if no shares left

    # Log transaction
    transaction = Transaction(
        user_id=user_id,
        symbol=symbol.upper(),
        shares=shares,
        price=price,
        type='SELL',
        timestamp=datetime.utcnow()
    )
    db.session.add(transaction)
    db.session.commit()

    return jsonify({
        'message': 'Stock sold successfully',
        'new_balance': user.balance
    }), 200




