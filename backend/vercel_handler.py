# Vercel Serverless Function handler for FastAPI
# This is the entry point for Vercel Serverless Functions

import sys
from pathlib import Path

# Add backend directory to Python path
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

# Import FastAPI app
from app.main import app

# For Vercel Serverless Functions, we use mangum as the ASGI adapter
# Install with: pip install mangum
try:
    from mangum import Mangum
    handler = Mangum(app)
except ImportError:
    # Fallback for when mangum is not installed
    # This will only work for simple GET requests in Vercel
    def handler(request):
        """
        Fallback handler when mangum is not available.
        This is a minimal implementation for GET requests.
        For full functionality, install mangum.
        """
        from fastapi.testclient import TestClient
        
        # Create a test client
        client = TestClient(app)
        
        # Map Vercel request to FastAPI
        method = request.get("method", "GET")
        path = request.get("path", "/")
        query_string = request.get("query_string", b"")
        headers = request.get("headers", {})
        body = request.get("body", None)
        
        # Build URL with query string
        url = f"{path}?{query_string.decode() if query_string else ''}"
        
        # Call the appropriate method
        if method == "GET":
            response = client.get(url, headers=headers)
        elif method == "POST":
            response = client.post(url, json=body, headers=headers)
        elif method == "PUT":
            response = client.put(url, json=body, headers=headers)
        elif method == "DELETE":
            response = client.delete(url, headers=headers)
        elif method == "PATCH":
            response = client.patch(url, json=body, headers=headers)
        else:
            response = client.get(url, headers=headers)
        
        # Return response in Vercel format
        return {
            "statusCode": response.status_code,
            "headers": dict(response.headers),
            "body": response.content.decode()
        }
