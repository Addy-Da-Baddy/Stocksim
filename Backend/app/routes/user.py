from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/user/details', methods=['PUT'])
@jwt_required()
def update_user_details():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    
    user.first_name = data.get('first_name', user.first_name)
    user.last_name = data.get('last_name', user.last_name)
    user.phone_number = data.get('phone_number', user.phone_number)
    
    dob_str = data.get('date_of_birth')
    if dob_str:
        try:
            # Assuming YYYY-MM-DD format from the frontend
            user.date_of_birth = datetime.strptime(dob_str.split('T')[0], '%Y-%m-%d').date()
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid date format for date_of_birth. Please use YYYY-MM-DD.'}), 400

    user.address = data.get('address', user.address)
    
    db.session.commit()
    
    return jsonify({'message': 'User details updated successfully'}), 200

@user_bp.route('/user/details', methods=['GET'])
@jwt_required()
def get_user_details():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'phone_number': user.phone_number,
        'date_of_birth': user.date_of_birth,
        'address': user.address
    }
    
    return jsonify(data), 200