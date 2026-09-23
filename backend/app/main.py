"""Private inquiry API composition root; routes preserve the baseline URLs."""

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.api.routes.contact import router as contact_router
from app.api.routes.health import router as health_router
from app.core.logging import log

app = FastAPI(title="Portfolio inquiry service", docs_url=None, redoc_url=None, openapi_url=None)
app.include_router(contact_router)
app.include_router(health_router)


@app.exception_handler(Exception)
async def safe_error(request: Request, exception: Exception):
    request_id = request.headers.get("x-request-id", "unknown")[:80]
    log("unhandled_error", request_id, error_type=type(exception).__name__)
    return JSONResponse(
        status_code=500, content={"message": "The inquiry service could not complete the request."}
    )
