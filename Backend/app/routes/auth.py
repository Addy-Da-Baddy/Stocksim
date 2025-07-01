from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if not all([username, password, email]):
        return jsonify({'error': 'Missing required fields'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400

    new_user = User(username=username, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    identifier = data.get('identifier') # Can be username or email
    password = data.get('password')

    if not all([identifier, password]):
        return jsonify({'error': 'Missing required fields'}), 400

    user = User.query.filter((User.username == identifier) | (User.email == identifier)).first()

    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401

    access_token = create_access_token(identity=user.id, additional_claims={'role': user.role})

    return jsonify({
        'message': 'Login successful',
        'access_token': access_token
    }), 200
