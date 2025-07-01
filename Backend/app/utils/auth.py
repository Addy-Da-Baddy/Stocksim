from functools import wraps
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt


def role_required(role):
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            claims = get_jwt()
            if claims.get('role') != role:
                return jsonify({'error': 'Forbidden'}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator

admin_required = role_required('admin')
user_required = role_required('user')