from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '1c4d8cc50bc6'
down_revision = 'c75f84fddf41'
branch_labels = None
depends_on = None

def upgrade():
    with op.batch_alter_table('overtimes', schema=None) as batch_op:
        batch_op.drop_column('date')
        batch_op.add_column(sa.Column('date', sa.Date(), nullable=False))

def downgrade():
    with op.batch_alter_table('overtimes', schema=None) as batch_op:
        batch_op.drop_column('date')
        batch_op.add_column(sa.Column('date', sa.Time(), nullable=False))
