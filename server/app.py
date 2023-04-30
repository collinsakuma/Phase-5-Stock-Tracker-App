#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session, make_response
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

# Local imports
from config import *
from models import User, Stock, WatchedStock, OwnedStock, Transaction

# Views go here!
class Signup(Resource):

    def post(self):
        request_json = request.get_json()
        username = request_json.get('username')
        password = request_json.get('password')

        user = User(
            username=username
        )

        user.password_hash = password

        try:
            db.session.add(user)
            db.session.commit()
            session['user_id'] = user.id
            return make_response(user.to_dict(), 201)
        except IntegrityError:
            return make_response({"error":"422 Unprocessable Entity"}, 422)
        
api.add_resource(Signup, '/signup')

class CheckSession(Resource):
    def get(self):
        try:
            user = User.query.filter_by(id=session['user_id']).first()
            return make_response(user.to_dict(), 200)
        except:
            return make_response({"error": "Unauthorized"}, 401)
        
api.add_resource(CheckSession, '/check_session')


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

class Logout(Resource):
    def delete(self):
        if session.get('user_id'):
            session['user_id'] = None
            return make_response({"message": "Logout Sucessful"}, 204)
        return make_response({"error": "401 Unauthorized"}, 401)

api.add_resource(Logout, '/logout')

class Stocks(Resource):
    def get(self):
        stocks = [stock.to_dict() for stock in Stock.query.all()]
        return make_response(stocks, 200)
    
    def post(self):
        request_json = request.get_json()
        if not request_json:
            return make_response({"Error":"invalid stock"}, 404)
        # check if stock already exist in Stock table
        elif request_json['ticker'] in [stock.ticker for stock in Stock.query.all()]:
            return make_response({"Error":"Stock already exist"},400)
        else:
            stock = Stock(
                ticker = request_json['ticker'],
                company_name = request_json['company_name'],
                price = request_json['price']
            )
            db.session.add(stock)
            db.session.commit()
            
            return make_response(stock.to_dict(), 201)
api.add_resource(Stocks, '/stocks')

class OwnedStocks(Resource):
    def get(self):
        owned_stocks = [stock.to_dict() for stock in OwnedStock.query.all()]
        return make_response(owned_stocks, 200)
    
    def post(self):
        request_json = request.get_json()
        if not request_json:
            return make_response({"Error": "invalid request"},404)
        else:
            new_owned_stock = OwnedStock(
                user_id = request_json['user_id'],
                stock_id = request_json['stock_id'],
                quantity = request_json['quantity'],
                total_cost = request_json['total_cost']
            )
            db.session.add(new_owned_stock)
            db.session.commit()

            return make_response(new_owned_stock.to_dict(), 201)
api.add_resource(OwnedStocks, '/owned_stocks')

# OwnedStockById returns a stock by its id and checks if the current user already has this stock in OwnedStocks
class OwnedStocksById(Resource):
    def patch(self,id):
        stock = OwnedStock.query.filter_by(id=id).filter_by(user_id=session['user_id']).first()
        if not stock:
            return make_response({"error": "user not found"}, 404)
        request_json = request.get_json()
        for attr in request_json:
            setattr(stock, attr, request_json[attr])
        db.session.add(stock)
        db.session.commit()

        return make_response(stock.to_dict(), 202)
api.add_resource(OwnedStocksById, '/owned_stocks/<int:id>')

class StocksByUserId(Resource):
    def get(self):
        stocks = [stock.to_dict(rules=('stock',)) for stock in OwnedStock.query.filter_by(user_id=session['user_id'])]
        return make_response(stocks, 200)
api.add_resource(StocksByUserId, '/stocks_by_user_id')

class Transactions(Resource):
    def get(self):
        transactions = [transaction.to_dict() for transaction in Transaction.query.all()]
        return make_response(transactions, 200)
    
    def post(self):
        request_json = request.get_json()
        if not request_json:
            return make_response({"Error": "invalid request"},404)
        else:
            new_transaction = Transaction(
                user_id = request_json['user_id'],
                stock_id = request_json['stock_id'],
                quantity = request_json['quantity'],
                bought_total = request_json['bought_total'],
                sold_total = request_json['sold_total']
            )
            db.session.add(new_transaction)
            db.session.commit()
            return make_response(new_transaction.to_dict(), 201)

api.add_resource(Transactions, '/transactions')


if __name__ == '__main__':
    app.run(port=5555, debug=True)
