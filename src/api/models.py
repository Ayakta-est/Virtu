from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, date

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    identification_number: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False, default="employee")
    profile_image: Mapped[str] = mapped_column(String(255), nullable=True)
    workstation: Mapped[str] = mapped_column(String(100), nullable=True)  # Puesto
    department: Mapped[str] = mapped_column(String(100), nullable=True)

    # Relación con eventos de calendario
    calendar_events: Mapped[list["CalendarEvent"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan"
    )

    def serialize(self):
        return {
            "id": self.id,
            "identification_number": self.identification_number,
            # No incluir password por seguridad
        }


class News(db.Model):
    __tablename__ = "news"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    image: Mapped[str] = mapped_column(String(300), nullable=False)
    short_description: Mapped[str] = mapped_column(String(300), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    link: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
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


class CalendarEvent(db.Model):
    __tablename__ = "calendar_events"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)

    title: Mapped[str] = mapped_column(String(100), nullable=False)
    type: Mapped[str] = mapped_column(String(20), nullable=False)  # worked, vacation, absence, requested...
    status: Mapped[str] = mapped_column(String(20), nullable=True)  # solo para "requested"
    start_date: Mapped[date] = mapped_column(nullable=False)
    end_date: Mapped[date] = mapped_column(nullable=True)
    notes: Mapped[str] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, onupdate=datetime.utcnow, nullable=True)

    user: Mapped["User"] = relationship(back_populates="calendar_events")

    def serialize(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "title": self.title,
            "type": self.type,
            "status": self.status,
            "start": self.start_date.isoformat(),
            "end": self.end_date.isoformat() if self.end_date else None,
            "notes": self.notes,
            "createdAt": self.created_at.isoformat(),
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }
