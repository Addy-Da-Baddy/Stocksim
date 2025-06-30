from flask import Blueprint, jsonify, request
from app import db
from werkzeug.security import check_password_hash
from app.models.admin import Admin
from flask_jwt_extended import create_access_token

admin_auth = Blueprint('admin_auth', __name__)

@admin_auth.route('/auth/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    admin = Admin.query.filter_by(email=email).first()
    if not admin or not check_password_hash(admin.password_hash, password):
        return jsonify({'error': 'Invalid email or password'}), 401

    access_token = create_access_token(identity=str(admin.id))
    return jsonify(access_token=access_token), 200

