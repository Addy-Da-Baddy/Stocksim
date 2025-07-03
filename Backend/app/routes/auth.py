from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from datetime import datetime

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    phone_number = data.get('phone_number')
    date_of_birth_str = data.get('date_of_birth')
    address = data.get('address')

    if not all([username, password, email, first_name, last_name, phone_number, date_of_birth_str, address]):
        return jsonify({'error': 'Missing required fields'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400

    try:
        date_of_birth = datetime.strptime(date_of_birth_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Invalid date format for date_of_birth. Please use YYYY-MM-DD.'}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(
        username=username, 
        password_hash=hashed_password, 
        email=email, 
        balance=100000, 
        first_name=first_name, 
        last_name=last_name, 
        phone_number=phone_number, 
        date_of_birth=date_of_birth, 
        address=address
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/login/username', methods=['POST'])
def login_username():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not all([username, password]):
        return jsonify({'error': 'Missing required fields'}), 400

    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user_id': user.id,
        'email': user.email,
        'balance': user.balance
    }), 200

@auth_bp.route('/login/email', methods=['POST'])
def login_email():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'error': 'Missing required fields'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user_id': user.id,
        'username': user.username,
        'balance': user.balance
    }), 200
