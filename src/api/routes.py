"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, News
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity
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

@api.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([{
        "id": u.id,
        "name": u.name,
        "identification_number": u.identification_number,
        "role": u.role
    } for u in users])

@api.route("/users", methods=["POST"])
def create_user():
    data = request.json

    name = data["name"]
    password = data["password"]
    identification_number = data.get("identification_number") or f"user_{name.lower().replace(' ', '_')}"
    role = data.get("role", "employee")

    hashed_password = generate_password_hash(password)

    new_user = User(
        name=name,
        identification_number=identification_number,
        password=hashed_password,
        is_active=True,
        role=role
    )

    db.session.add(new_user)
    db.session.commit()

    # Crear token para que pueda loguearse directamente tras crear
    token = create_access_token(identity=new_user.id)

    return jsonify({
        "message": "Usuario creado correctamente",
        "id": new_user.id,
        "token": token,
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "role": new_user.role,
            "identification_number": new_user.identification_number
        }
    }), 201

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

@api.route("/notices", methods=["GET"])
def get_all_news():
    noticias = News.query.order_by(News.created_at.desc()).all()
    return jsonify([n.serialize() for n in noticias])

@api.route("/notices/<int:id>", methods=["DELETE"])
def delete_news(id):
    news = News.query.get_or_404(id)
    db.session.delete(news)
    db.session.commit()
    return jsonify({"message": "Noticia eliminada"}), 200

@api.route("/notices/<int:id>", methods=["GET"])
def get_news(id):
    news = News.query.get_or_404(id)
    return jsonify(news.serialize())

@api.route("/notices/<int:id>", methods=["PUT"])
def update_news(id):
    data = request.json
    news = News.query.get_or_404(id)

    news.title = data["title"]
    news.image = data["image"]
    news.short_description = data["short_description"]
    news.content = data["content"]
    news.category = data["category"]
    news.link = data["link"]
    news.is_featured = data.get("is_featured", False)

    db.session.commit()
    return jsonify({"message": "Noticia actualizada"})
