from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity


def admin_required(f):
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        # In a real app, you'd want to check if the user is an admin.
        # For now, we'll just check if the token is valid.
        return f(*args, **kwargs)
    return decorated_function