"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
import uuid

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/login', methods=['POST'])
def login():
    body = request.get_json()
    ident = body.get("identification_number")
    password = body.get("password")

    if not ident or not password:
        return jsonify({"msg": "Faltan datos"}), 400

    user = User.query.filter_by(identification_number=ident).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Credenciales incorrectas"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify(token=access_token, user={"id": user.id, "ident": user.identification_number}), 200

@api.route('/users', methods=['POST'])
def create_user():
    body = request.get_json()
    name = body.get("name")
    password = body.get("password")
    # genera un ID corto, estilo EMP-394FA2
    employee_id = f"EMP-{uuid.uuid4().hex[:6].upper()}"

    # Hashear contraseña y guardar
    user = User(name=name, password=generate_password_hash(password), employee_id=employee_id)
    db.session.add(user)
    db.session.commit()

    return jsonify({
        "id": user.id,
        "name": user.name,
        "employee_id": user.employee_id
    }), 201