from flask import Blueprint, jsonify
from app.services.stock_service import get_stock_price

stock_bp = Blueprint('stock_bp', __name__)

@stock_bp.route('/price/<symbol>', methods=['GET'])
def fetch_price(symbol):
    result = get_stock_price(symbol)
    return jsonify(result)
