from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User
from app.models.transaction import Transaction
from app.models.portfolio import Portfolio
from app.services.stock_service import get_stock_price
from app.utils.market import is_market_open
from datetime import datetime
from app.utils.auth import user_required
from flask_jwt_extended import get_jwt_identity

transaction_bp = Blueprint('transaction_bp', __name__)

def is_market_open_safe(tz):
    try:
        result = is_market_open(tz)
        return result.get("market_open", False)
    except Exception:
        return False

@transaction_bp.route('/transaction/buy', methods=['POST'])
@user_required
def buy_stock():
    data = request.json
    user_id = get_jwt_identity()
    symbol = data.get('symbol')
    shares = float(data.get('shares', 0))
    tz = data.get('tz')

    if not all([symbol, shares, tz]) or shares <= 0:
        return jsonify({'error': 'Missing or invalid data'}), 400

    if not is_market_open_safe(tz):
        return jsonify({'error': f'Market is closed in timezone {tz}'}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    stock_data = get_stock_price(symbol)
    if 'error' in stock_data:
        return jsonify(stock_data), 500

    price = stock_data['price']
    total_cost = price * shares

    if user.balance < total_cost:
        return jsonify({'error': 'Insufficient balance'}), 400

    # Update portfolio
    portfolio = Portfolio.query.filter_by(user_id=user_id, symbol=symbol.upper()).first()
    if portfolio:
        new_total_shares = portfolio.shares + shares
        portfolio.avg_price = (
            (portfolio.avg_price * portfolio.shares) + (price * shares)
        ) / new_total_shares
        portfolio.shares = new_total_shares
    else:
        portfolio = Portfolio(
            user_id=user_id,
            symbol=symbol.upper(),
            shares=shares,
            avg_price=price
        )
        db.session.add(portfolio)

    # Update balance and add transaction
    user.balance -= total_cost
    transaction = Transaction(
        user_id=user_id,
        symbol=symbol.upper(),
        shares=shares,
        price=price,
        type='BUY',
        timestamp=datetime.utcnow()
    )

    db.session.add(user)
    db.session.add(transaction)
    db.session.commit()

    return jsonify({
        'message': 'Stock purchased successfully',
        'symbol': symbol.upper(),
        'new_balance': round(user.balance, 2),
        'portfolio': {
            'symbol': portfolio.symbol,
            'shares': round(portfolio.shares, 2),
            'avg_price': round(portfolio.avg_price, 2)
        }
    }), 200

@transaction_bp.route('/transaction/sell', methods=['POST'])
@user_required
def sell_stock():
    data = request.json
    user_id = get_jwt_identity()
    symbol = data.get('symbol')
    shares = float(data.get('shares', 0))
    tz = data.get('tz')

    if not all([symbol, shares, tz]) or shares <= 0:
        return jsonify({'error': 'Missing or invalid data'}), 400

    if not is_market_open_safe(tz):
        return jsonify({'error': f'Market is closed in timezone {tz}'}), 403

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

    transaction = Transaction(
        user_id=user_id,
        symbol=symbol.upper(),
        shares=shares,
        price=price,
        type='SELL',
        timestamp=datetime.utcnow()
    )

    db.session.add(user)
    db.session.add(transaction)
    db.session.commit()

    return jsonify({
        'message': 'Stock sold successfully',
        'new_balance': round(user.balance, 2)
    }), 200

@transaction_bp.route('/transaction/history', methods=['GET'])
@user_required
def transaction_history():
    user_id = get_jwt_identity()
    transactions = Transaction.query.filter_by(user_id=user_id).order_by(Transaction.timestamp.desc()).all()
    if not transactions:
        return jsonify({'message': 'No transactions found for this user'}), 404
    history = []
    for transaction in transactions:
        history.append({
            'symbol': transaction.symbol,
            'type': transaction.type,
            'shares': transaction.shares,
            'price': round(transaction.price, 2),
            'timestamp': transaction.timestamp.isoformat()
        })
    return jsonify(history), 200