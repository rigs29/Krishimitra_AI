# fastapi entry
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="KrishiMitra AI",
    description="AI-powered agriculture assistant for farmers",
    version="1.0.0"
)

# CORS configuration (allows React frontend to connect)
# Get allowed origins from environment variable (comma-separated)
# For production: set CORS_ORIGINS=https://your-frontend.vercel.app,http://localhost:5173
# For development: default allows localhost origins
cors_origins = os.getenv("CORS_ORIGINS", "*")

# Parse comma-separated origins
if cors_origins == "*":
    allowed_origins = ["*"]
else:
    allowed_origins = [origin.strip() for origin in cors_origins.split(",") if origin.strip()]

# Always allow localhost for development
if "*" not in allowed_origins:
    allowed_origins.extend([
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ])

logger.info(f"CORS allowed origins: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root route
@app.get("/")
def home():
    return {
        "message": "Welcome to KrishiMitra AI Backend 🌾",
        "status": "Running",
        "version": "1.0.0"
    }

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Try importing routes with error handling
try:
    from app.api import disease_routes
    from app.api import weather_routes
    from app.api import market_routes
    from app.api import chat_routes
    
    # Include API routers
    app.include_router(disease_routes.router, prefix="/api/disease", tags=["Disease Detection"])
    app.include_router(weather_routes.router, prefix="/api/weather", tags=["Weather"])
    app.include_router(market_routes.router, prefix="/api/market", tags=["Crop Market"])
    app.include_router(chat_routes.router, prefix="/api/chat", tags=["AI Advisor"])
    
    logger.info("All routes loaded successfully")
    
except ImportError as e:
    logger.error(f"❌ Failed to import routes: {e}")
    # Create placeholder routes for development
    @app.get("/api/disease", tags=["Disease Detection"])
    def disease_placeholder():
        return {"message": "Disease detection routes coming soon"}
    
    @app.get("/api/weather", tags=["Weather"])
    def weather_placeholder():
        return {"message": "Weather routes coming soon"}
    
    @app.get("/api/market", tags=["Crop Market"])
    def market_placeholder():
        return {"message": "Market routes coming soon"}
    
    @app.get("/api/chat", tags=["AI Advisor"])
    def chat_placeholder():
        return {"message": "Chat routes coming soon"}

# Global exception handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred"}
    )

# Startup event
@app.on_event("startup")
async def startup_event():
    logger.info("🚀 KrishiMitra AI Backend starting up...")

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    logger.info("👋 KrishiMitra AI Backend shutting down...")