#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session, make_response
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

# Local imports
from config import *
from models import User, Stock, WatchedStock, OwnedStock

# Views go here!
class Login(Resource):
    def post(self):
        request_json = request.get_json()
        username = request_json['username']
        password = request_json['password']
        user = User.query.filter(User.username == username).first()
        if user:
            if user.authenticate(password):
                session['user_id'] = user.id
                return make_response(user.to_dict(), 200)
        return make_response({"error": "401 Unauthorized"}, 401)
api.add_resource(Login, '/login')
if __name__ == '__main__':
    app.run(port=5555, debug=True)
