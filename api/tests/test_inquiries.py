import os

os.environ["CONTACT_INTERNAL_TOKEN"] = "test-internal-token-32-chars-minimum-safe"
os.environ["DATABASE_URL"] = "sqlite://"

from fastapi.testclient import TestClient  # noqa: E402
from sqlalchemy import create_engine, select  # noqa: E402
from sqlalchemy.orm import sessionmaker  # noqa: E402
from sqlalchemy.pool import StaticPool  # noqa: E402

from app.database import Base  # noqa: E402
from app.main import app, session  # noqa: E402
from app.models import Inquiry  # noqa: E402


def client_with_db():
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    Base.metadata.create_all(engine)
    maker = sessionmaker(bind=engine)

    def override():
        with maker() as db:
            yield db

    app.dependency_overrides[session] = override
    return TestClient(app, raise_server_exceptions=False), maker


def payload(**changes):
    return {
        "name": "Ada Lovelace",
        "email": "ada@example.com",
        "topic": "project",
        "message": "A meaningful project inquiry.",
        "website": "",
        **changes,
    }


def headers(ip="203.0.113.1"):
    return {
        "X-Internal-Token": os.environ["CONTACT_INTERNAL_TOKEN"],
        "X-Client-IP": ip,
        "X-Request-ID": "test-request",
    }


def test_private_boundary_and_persistence():
    client, maker = client_with_db()
    assert client.post("/inquiries", json=payload()).status_code == 403
    response = client.post("/inquiries", json=payload(), headers=headers())
    assert response.status_code == 200
    with maker() as db:
        rows = db.scalars(select(Inquiry)).all()
        assert len(rows) == 1
        assert rows[0].message == "A meaningful project inquiry."
        assert rows[0].notification_status == "pending"
    app.dependency_overrides.clear()


def test_validation_spam_and_throttle():
    client, maker = client_with_db()
    assert (
        client.post("/inquiries", json=payload(message="short"), headers=headers()).status_code
        == 422
    )
    assert (
        client.post(
            "/inquiries", json=payload(website="bot.example"), headers=headers()
        ).status_code
        == 200
    )
    for _ in range(5):
        assert client.post("/inquiries", json=payload(), headers=headers()).status_code == 200
    assert client.post("/inquiries", json=payload(), headers=headers()).status_code == 429
    with maker() as db:
        assert len(db.scalars(select(Inquiry)).all()) == 5
    app.dependency_overrides.clear()


def test_health_and_readiness():
    client, _ = client_with_db()
    assert client.get("/health/live").status_code == 200
    assert client.get("/health/ready").json()["status"] == "ready"
    app.dependency_overrides.clear()
