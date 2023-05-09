"""bought / sold total added to Transaction table

Revision ID: f4422cc3c48d
Revises: 780387e47c0d
Create Date: 2023-04-29 12:32:05.750821

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f4422cc3c48d'
down_revision = '780387e47c0d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('transactions', schema=None) as batch_op:
        batch_op.add_column(sa.Column('bought_total', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('sold_total', sa.Integer(), nullable=True))
        batch_op.drop_column('share_price')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('transactions', schema=None) as batch_op:
        batch_op.add_column(sa.Column('share_price', sa.INTEGER(), nullable=True))
        batch_op.drop_column('sold_total')
        batch_op.drop_column('bought_total')

    # ### end Alembic commands ###
