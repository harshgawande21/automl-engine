from typing import Any, Optional


def success_response(data: Any = None, message: str = "Success") -> dict:
    return {"status": "success", "message": message, "data": data}


def error_response(message: str, code: int = 400, details: Any = None) -> dict:
    return {"status": "error", "code": code, "message": message, "details": details}


def paginated_response(items: list, total: int, page: int = 1, per_page: int = 20) -> dict:
    return {
        "status": "success",
        "data": items,
        "pagination": {
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": max(1, -(-total // per_page)),
        },
    }
