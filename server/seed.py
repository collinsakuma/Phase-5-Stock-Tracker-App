#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
# from faker import Faker

# Local imports
from app import app
from models import db, User, Stock, WatchedStock, OwnedStock

if __name__ == '__main__':
    # fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!
        User.query.delete()
        Stock.query.delete()
        WatchedStock.query.delete()
        OwnedStock.query.delete()

        user_1 = User(
        username="Collin",
        )
        user_1.password_hash = "collinsakuma"

        db.session.add_all([user_1])
        db.session.commit()