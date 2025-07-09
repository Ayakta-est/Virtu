import click
from flask.cli import with_appcontext
from api.models import db, User
from werkzeug.security import generate_password_hash

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are useful to run cronjobs or tasks outside of the API but still in integration 
with your database, for example: Import the price of bitcoin every night at 12am
"""

def setup_commands(app):
    
    @app.cli.command("insert-test-users")  # name of our command
    @click.argument("count")  # argument of our command
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.email = "test_user" + str(x) + "@test.com"
            user.password = "123456"
            user.is_active = True
            db.session.add(user)
            db.session.commit()
            print("User:", user.email, "created.")

        print("All test users created")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        pass

    # crear usuario admin desde terminal
    @app.cli.command("create-admin")
    @click.option("--name", prompt="Nombre del admin", help="Nombre del nuevo admin.")
    @click.option("--id", prompt="ID del empleado", help="Identificador único (identification_number).")
    @click.option("--password", prompt=True, hide_input=True, confirmation_prompt=True)
    @with_appcontext
    def create_admin_command(name, id, password):
        exists = User.query.filter_by(identification_number=id).first()
        if exists:
            click.echo(f"⚠️  Ya existe un usuario con ID: {id}")
            return

        admin = User(
            name=name,
            identification_number=id,
            password=generate_password_hash(password),
            role="admin"
        )
        db.session.add(admin)
        db.session.commit()
        click.echo(f"✔ Usuario admin '{name}' creado con ID: {id}")
