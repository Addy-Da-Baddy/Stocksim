from flask import Blueprint, request, jsonify
from app.utils.market import is_market_open

market_bp = Blueprint('market_bp', __name__)

@market_bp.route('/market/status', methods=['GET'])
def market_status():
    tz = request.args.get("tz")
    if not tz:
        return jsonify({'error': 'Timezone parameter is required'}), 400
    status = is_market_open(tz)
    if isinstance(status, tuple):
        return jsonify(status[0]), status[1]
    return jsonify(status), 200

