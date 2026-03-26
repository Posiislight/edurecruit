from django.db import connection
from django.http import JsonResponse
import logging

logger = logging.getLogger(__name__)

def health_check(request):
    """
    A simple health check endpoint that verifies database connectivity.
    """
    health = {
        "status": "healthy",
        "database": "connected",
        "errors": []
    }
    
    try:
        # Perform a simple query to verify database connectivity
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
    except Exception as e:
        logger.error(f"Health check database error: {str(e)}", exc_info=True)
        health["status"] = "unhealthy"
        health["database"] = "disconnected"
        health["errors"].append(str(e))
        
    return JsonResponse(health, status=200 if health["status"] == "healthy" else 500)
