from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User
from app.models.transaction import Transaction
from app.models.portfolio import Portfolio
from app.services.stock_service import get_stock_price
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity

transaction_bp = Blueprint('transaction_bp', __name__)


@transaction_bp.route('/transaction/buy', methods=['POST'])
@jwt_required()
def buy_stock():
    data = request.json
    user_id = get_jwt_identity()
    symbol = data.get('symbol')
    shares = float(data.get('shares', 0))
    tz = data.get('tz')

    if not all([user_id, symbol, shares]) or shares <= 0:
        return jsonify({'error': 'Missing or invalid data'}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    stock_data = get_stock_price(symbol)
    if 'error' in stock_data:
        return jsonify(stock_data), 500

    price = stock_data['price']
    total_cost = price * shares

    if user.balance < total_cost:
        return jsonify({'error': 'Insufficient funds'}), 400

    # Update portfolio
    portfolio = Portfolio.query.filter_by(user_id=user_id, symbol=symbol.upper()).first()
    if portfolio:
        new_total_shares = portfolio.shares + shares
        portfolio.avg_price = ((portfolio.avg_price * portfolio.shares) + (price * shares)) / new_total_shares
        portfolio.shares = new_total_shares
    else:
        portfolio = Portfolio(user_id=user_id, symbol=symbol.upper(), shares=shares, avg_price=price)
        db.session.add(portfolio)

    # Update balance and add transaction
    user.balance -= total_cost
    transaction = Transaction(user_id=user_id, symbol=symbol.upper(), shares=shares, price=price, type='BUY', timestamp=datetime.utcnow())
    
    db.session.add(transaction)
    db.session.commit()

    return jsonify({
        'message': 'Stock purchased successfully',
        'new_balance': user.balance
    }), 200


@transaction_bp.route('/transaction/sell', methods=['POST'])
@jwt_required()
def sell_stock():
    data = request.json
    user_id = get_jwt_identity()
    symbol = data.get('symbol')
    shares = float(data.get('shares', 0))

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
    user.balance += total_earned

    portfolio.shares -= shares
    if portfolio.shares == 0:
        db.session.delete(portfolio)

    transaction = Transaction(user_id=user_id, symbol=symbol.upper(), shares=shares, price=price, type='SELL', timestamp=datetime.utcnow())
    
    db.session.add(transaction)
    db.session.commit()

    return jsonify({
        'message': 'Stock sold successfully',
        'new_balance': user.balance
    }), 200


@transaction_bp.route('/transaction/history', methods=['GET'])
@jwt_required()
def transaction_history():
    user_id = get_jwt_identity()
    transactions = Transaction.query.filter_by(user_id=user_id).order_by(Transaction.timestamp.desc()).all()
    if not transactions:
        return jsonify({'message': 'No transactions found for this user'}), 404
    history = []
    for transaction in transactions:
        symbol = transaction.symbol
        type  = transaction.type
        shares = transaction.shares
        price = round(transaction.price, 2)
        timestamp = transaction.timestamp.isoformat()
        history.append({
            'symbol': symbol,
            'type': type,
            'shares': shares,
            'price': price,
            'timestamp': timestamp
        })
    return jsonify(history), 200