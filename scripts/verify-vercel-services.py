"""Check the repository's Vercel Services topology and private binding contract."""

import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
config = json.loads((root / "vercel.json").read_text())
assert set(config) == {"$schema", "services", "rewrites"}
services = config["services"]
assert set(services) == {"frontend", "backend"}
frontend = services["frontend"]
backend = services["backend"]
assert frontend["root"] == "frontend"
assert frontend["framework"] == "nextjs"
assert frontend["bindings"] == [
    {
        "type": "service",
        "service": "backend",
        "format": "url",
        "env": "CONTACT_API_URL",
    }
]
assert backend["root"] == "backend"
assert backend["framework"] == "fastapi"
assert backend["entrypoint"] == "app.main:app"
assert backend["functions"] == {"app/main.py": {"maxDuration": 20}}

# Public traffic has one catch-all to the frontend. No rewrite exposes FastAPI.
rewrites = config["rewrites"]
assert rewrites == [{"source": "/(.*)", "destination": {"service": "frontend"}}]
assert not (root / "backend" / "vercel.json").exists()

print("Vercel Services configuration matches the private backend topology.")
