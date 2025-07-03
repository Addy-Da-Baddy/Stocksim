from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User
from flask_jwt_extended import jwt_required, get_jwt_identity

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/user/details', methods=['PUT'])
@jwt_required()
def update_user_details():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    
    # Update fields if they are in the request
    user.first_name = data.get('first_name', user.first_name)
    user.last_name = data.get('last_name', user.last_name)
    user.phone_number = data.get('phone_number', user.phone_number)
    user.date_of_birth = data.get('date_of_birth', user.date_of_birth)
    user.address = data.get('address', user.address)
    
    db.session.commit()
    
    return jsonify({'message': 'User details updated successfully'}), 200
