import logging
import json

logger = logging.getLogger(__name__)

class LoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        if response.status_code >= 400:
            log_data = {
                "method": request.method,
                "path": request.get_full_path(),
                "status_code": response.status_code,
                "origin": request.headers.get("Origin", "N/A"),
                "referer": request.headers.get("Referer", "N/A"),
            }
            
            # Try to capture a snippet of the response content if it's JSON/text
            try:
                if "application/json" in response.get("Content-Type", ""):
                    log_data["response_body"] = response.content.decode("utf-8")[:500]
            except Exception:
                pass

            logger.error(f"Request Failure: {json.dumps(log_data)}")

        return response
