from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    identification_number: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False, default="employee")
    profile_image: Mapped[str] = mapped_column(String(255), nullable=True)
    workstation: Mapped[str] = mapped_column(String(100), nullable=True) #Puesto
    department: Mapped[str] = mapped_column(String(100), nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "identification_number": self.identification_number,
            # do not serialize the password, its a security breach
        }
    
class News(db.Model):
    __tablename__ = "news"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    image: Mapped[str] = mapped_column(String(300), nullable=False)  # URL relativa o completa
    short_description: Mapped[str] = mapped_column(String(300), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    link: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)  # Para rutas
    is_featured: Mapped[bool] = mapped_column(Boolean(), default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "image": self.image,
            "shortDescription": self.short_description,
            "content": self.content,
            "category": self.category,
            "link": self.link,
            "isFeatured": self.is_featured,
            "createdAt": self.created_at.isoformat(),
        }