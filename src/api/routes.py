"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, send_file
from api.models import db, User, News, CalendarEvent, Payroll
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
import uuid
import os

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

    access_token = create_access_token(identity=str(user.id))

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
    db.session.flush()  # Obtenemos el ID sin hacer commit aún

    # Crear nómina por defecto empleados
    if role == "employee":
        from datetime import date
        from api.models import Payroll

        month = date.today().strftime("%Y-%m")
        default_payroll = Payroll(
            user_id=new_user.id,
            month=month,
            gross_salary=1200.00,
            deductions=0.0,
            net_salary=1200.00
        )
        db.session.add(default_payroll)

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


@api.route("/users/<int:id>", methods=["DELETE"])
def delete_user(id):
    users = User.query.get_or_404(id)
    db.session.delete(users)
    db.session.commit()
    return jsonify({"message": "Noticia eliminada"}), 200

@api.route("/users/<int:id>", methods=["PATCH"])
@jwt_required()
def update_user_partial(id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user or current_user.role != "admin":
        return jsonify({"error": "No autorizado"}), 403

    user = User.query.get_or_404(id)
    data = request.get_json()

    # Solo actualizamos si el campo viene en el body
    if "profile_image" in data:
        user.profile_image = data["profile_image"]

    if "workstation" in data:
        user.workstation = data["workstation"]

    if "department" in data:
        user.department = data["department"]

    if "is_active" in data:
        user.is_active = data["is_active"]

    db.session.commit()

    return jsonify({"message": "Usuario actualizado"}), 200

@api.route("/notices", methods=["POST"])
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

@api.route("/notices/home", methods=["GET"])
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

@api.route("/profile/upload-image", methods=["POST"])
@jwt_required()
def upload_profile_image():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]
    filename = secure_filename(file.filename)
    ext = filename.rsplit('.', 1)[-1].lower()
    new_filename = f"user_{user.id}.{ext}"
    filepath = os.path.join("static/profile_images", new_filename)
    file.save(filepath)

    user.profile_image = f"/static/profile_images/{new_filename}"
    db.session.commit()

    return jsonify({ "profile_image": user.profile_image })

@api.route("/user/me", methods=["GET"])
@jwt_required()
def get_current_user():

    try:
        user_id = get_jwt_identity()

        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        return jsonify({
            "id": user.id,
            "name": user.name,
            "identification_number": user.identification_number,
            "role": user.role,
            "profile_image": user.profile_image,
            "workstation": user.workstation,
            "department": user.department
        })

    except Exception as e:
        return jsonify({"error": "Error interno"}), 500

from flask_jwt_extended import jwt_required, get_jwt_identity

@api.route("/calendar/request", methods=["POST"])
@jwt_required()
def request_day_off():
    data = request.get_json()

    required_fields = ["identification_number", "title", "start_date"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"'{field}' es obligatorio"}), 400

    user = User.query.filter_by(identification_number=data["identification_number"]).first()
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    # Validar que quien envía la solicitud es el usuario autenticado o un admin
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    if current_user.identification_number != user.identification_number and current_user.role != "admin":
        return jsonify({"error": "No autorizado"}), 403

    try:
        start_date = datetime.strptime(data["start_date"], "%Y-%m-%d").date()
        end_date = (
            datetime.strptime(data["end_date"], "%Y-%m-%d").date()
            if "end_date" in data and data["end_date"]
            else None
        )

        event = CalendarEvent(
            user_id=user.id,
            title=data["title"],
            type="requested",
            status="pending",
            start_date=start_date,
            end_date=end_date,
            notes=data.get("notes"),
        )
        db.session.add(event)
        db.session.commit()

        return jsonify(event.serialize()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error al crear la solicitud: {str(e)}"}), 500


@api.route("/calendar/<string:identification_number>", methods=["GET"])
@jwt_required()
def get_user_calendar(identification_number):
    user = User.query.filter_by(identification_number=identification_number).first()

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    if current_user.identification_number != identification_number and current_user.role != "admin":
        return jsonify({"error": "No autorizado"}), 403

    events = CalendarEvent.query.filter_by(user_id=user.id).all()

    return jsonify([event.serialize() for event in events]), 200

@api.route("/admin/calendar/requests", methods=["GET"])
@jwt_required()
def get_all_day_off_requests():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user or current_user.role != "admin":
        return jsonify({"error": "No autorizado"}), 403

    # Solo solicitudes tipo "requested"
    events = CalendarEvent.query.filter_by(type="requested").order_by(CalendarEvent.start_date.desc()).all()

    result = []
    for event in events:
        user = User.query.get(event.user_id)
        result.append({
            "id": event.id,
            "user_id": user.id,
            "user_name": user.name,
            "identification_number": user.identification_number,
            "title": event.title,
            "status": event.status,
            "start": event.start_date.isoformat(),
            "end": event.end_date.isoformat() if event.end_date else None,
            "notes": event.notes,
            "created_at": event.created_at.isoformat() if event.created_at else None,
        })

    return jsonify(result), 200

@api.route("/admin/calendar/requests/<int:event_id>", methods=["PUT"])
@jwt_required()
def update_request_status(event_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user or current_user.role != "admin":
        return jsonify({"error": "No autorizado"}), 403

    data = request.get_json()
    new_status = data.get("status")

    if new_status not in ["approved", "rejected"]:
        return jsonify({"error": "Estado inválido. Usa 'approved' o 'rejected'"}), 400

    event = CalendarEvent.query.get(event_id)

    if not event:
        return jsonify({"error": "Evento no encontrado"}), 404

    if event.type != "requested":
        return jsonify({"error": "Solo se pueden modificar eventos de tipo 'requested'"}), 400

    event.status = new_status
    db.session.commit()

    return jsonify({"message": f"Solicitud {new_status} correctamente"}), 200

@api.route("/calendar/admin/create", methods=["POST"])
@jwt_required()
def admin_create_event():
    data = request.get_json()

    required_fields = ["identification_number", "type", "start_date"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"'{field}' es obligatorio"}), 400

    # Validar que quien crea el evento sea un administrador
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user or current_user.role != "admin":
        return jsonify({"error": "No autorizado"}), 403

    # Buscar el usuario destino
    user = User.query.filter_by(identification_number=data["identification_number"]).first()
    if not user:
        return jsonify({"error": "Empleado no encontrado"}), 404

    try:
        start_date = datetime.strptime(data["start_date"], "%Y-%m-%d").date()
        end_date = (
            datetime.strptime(data["end_date"], "%Y-%m-%d").date()
            if "end_date" in data and data["end_date"]
            else None
        )

        event = CalendarEvent(
            user_id=user.id,
            title=data.get("title") or f"Evento {data['type']}",
            type=data["type"],
            status="approved" if data["type"] == "requested" else None,
            start_date=start_date,
            end_date=end_date,
            notes=data.get("notes"),
        )
        db.session.add(event)
        db.session.commit()

        return jsonify(event.serialize()), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error al crear evento: {str(e)}"}), 500

@api.route("/payroll", methods=["GET"])
@jwt_required()
def get_employee_payrolls():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    payrolls = Payroll.query.filter_by(user_id=user.id).order_by(Payroll.month.desc()).all()
    return jsonify([p.serialize() for p in payrolls]), 200


@api.route("/employee/payroll/<int:payroll_id>", methods=["GET"])
@jwt_required()
def get_payroll_detail(payroll_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    payroll = Payroll.query.get(payroll_id)

    if not payroll:
        return jsonify({"error": "Nómina no encontrada"}), 404

    if payroll.user_id != user.id:
        return jsonify({"error": "No autorizado para ver esta nómina"}), 403

    return jsonify(payroll.serialize()), 200

@api.route("/employee/payroll/<int:payroll_id>/download", methods=["GET"])
@jwt_required()
def download_payroll_pdf(payroll_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404

    payroll = Payroll.query.get(payroll_id)

    if not payroll:
        return jsonify({"error": "Nómina no encontrada"}), 404

    if payroll.user_id != user.id:
        return jsonify({"error": "No autorizado"}), 403

    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(100, height - 50, f"Nómina - {payroll.month}")

    pdf.setFont("Helvetica", 12)
    pdf.drawString(50, height - 100, f"Empleado ID: {user.id}")
    pdf.drawString(50, height - 120, f"Número identificación: {user.identification_number}")
    pdf.drawString(50, height - 140, f"Departamento: {user.department or 'No especificado'}")
    pdf.drawString(50, height - 180, f"Salario Bruto: {payroll.gross_salary:.2f} €")
    pdf.drawString(50, height - 200, f"Deducciones: {payroll.deductions:.2f} €")
    pdf.drawString(50, height - 220, f"Salario Neto: {payroll.net_salary:.2f} €")
    pdf.setFont("Helvetica-Oblique", 10)
    pdf.drawString(50, height - 270, f"Generado el {datetime.now().strftime('%d/%m/%Y')}")

    pdf.save()
    buffer.seek(0)

    return send_file(
        buffer,
        as_attachment=True,
        download_name=f"nomina_{payroll.month}.pdf",
        mimetype='application/pdf'
    )

@api.route("/admin/payroll-management", methods=["GET"])
@jwt_required()
def get_all_payrolls_by_month():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != "admin":
        return jsonify({"error": "No autorizado"}), 403

    month = request.args.get("month")
    if not month:
        month = datetime.now().strftime("%Y-%m")

    payrolls = Payroll.query.filter_by(month=month).all()
    return jsonify([p.serialize() for p in payrolls]), 200

@api.route("/admin/payroll-management/generate", methods=["POST"])
@jwt_required()
def generate_payrolls():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if not current_user or current_user.role != "admin":
        return jsonify({"error": "No autorizado"}), 403

    data = request.get_json()
    month = data.get("month")

    if not month:
        return jsonify({"error": "Mes no especificado"}), 400

    employees = User.query.filter_by(role="employee").all()
    created = 0
    skipped = 0

    for employee in employees:
        exists = Payroll.query.filter_by(user_id=employee.id, month=month).first()
        if exists:
            skipped += 1
            continue

        # Puedes personalizar estos valores o calcularlos
        gross = 2000.00
        deductions = 250.00
        net = gross - deductions

        payroll = Payroll(
            user_id=employee.id,
            month=month,
            gross_salary=gross,
            deductions=deductions,
            net_salary=net,
            details=None
        )
        db.session.add(payroll)
        created += 1

    db.session.commit()

    return jsonify({
        "message": f"Nóminas generadas: {created}. Ya existían: {skipped}."
    }), 200

@api.route("/admin/payroll-management/<int:payroll_id>", methods=["PUT"])
@jwt_required()
def update_payroll(payroll_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user or user.role != "admin":
        return jsonify({"error": "No autorizado"}), 403

    data = request.get_json()
    payroll = Payroll.query.get(payroll_id)

    if not payroll:
        return jsonify({"error": "Nómina no encontrada"}), 404

    payroll.gross_salary = data.get("gross_salary", payroll.gross_salary)
    payroll.deductions = data.get("deductions", payroll.deductions)
    payroll.net_salary = payroll.gross_salary - payroll.deductions
    payroll.details = data.get("details", payroll.details)

    db.session.commit()
    return jsonify(payroll.serialize()), 200
