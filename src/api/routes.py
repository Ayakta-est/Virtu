"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, News
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import check_password_hash
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

    return jsonify({
        "token": access_token,
        "user": {
            "id": user.id,
            "identification_number": user.identification_number,
            "role": user.role,
            "name": user.name
        }
    }), 200

@api.route('/users', methods=['POST'])
def create_user():
    body = request.get_json()
    name = body.get("name")
    password = body.get("password")
    # genera un ID corto, estilo EMP-394FA2
    identification_number = f"EMP-{uuid.uuid4().hex[:6].upper()}"

    # Hashear contraseña y guardar
    user = User(name=name, password=generate_password_hash(password), identification_number=identification_number)
    db.session.add(user)
    db.session.commit()

    return jsonify({
        "id": user.id,
        "name": user.name,
        "identification_number": user.identification_number
    }), 201

from flask_jwt_extended import jwt_required, get_jwt_identity

@api.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    current_user_id = get_jwt_identity()
    users = User.query.all()
    return jsonify([{
        "id": u.id,
        "name": u.name,
        "identification_number": u.identification_number,
        "role": u.role
    } for u in users]), 200

@api.route("/noticias", methods=["POST"])
def create_news():
    data = request.get_json()

    # Validación mínima
    required_fields = ["title", "image", "short_description", "content", "category", "link"]
    missing = [f for f in required_fields if not data.get(f)]
    if missing:
        return jsonify({"error": f"Faltan campos: {', '.join(missing)}"}), 400

    news = News(
        title=data.get("title"),
        image=data.get("image"),
        short_description=data.get("short_description"),
        content=data.get("content"),
        category=data.get("category"),
        link=data.get("link"),
        is_featured=data.get("is_featured", False)
    )

    db.session.add(news)
    db.session.commit()

    return jsonify({"message": "Noticia creada correctamente", "id": news.id}), 201

@api.route("/noticias/home", methods=["GET"])
def get_home_news():
    destacados = News.query.filter_by(is_featured=True).order_by(News.created_at.desc()).limit(5).all()
    noticias = News.query.order_by(News.created_at.desc()).limit(10).all()

    return jsonify({
        "destacados": [n.serialize() for n in destacados],
        "noticias": [n.serialize() for n in noticias]
    })