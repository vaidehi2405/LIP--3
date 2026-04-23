"""
REST Client for Email and Document Delivery.
Communicates with the centralized Render MCP server.
"""

import requests
import structlog
from typing import Optional

logger = structlog.get_logger(__name__)

class DeliveryClient:
    BASE_URL = "https://saksham-mcp-server-a7gq.onrender.com"

    def __init__(self, dry_run: bool = False):
        self.dry_run = dry_run

    def create_email_draft(self, to_email: str, subject: str, html_body: str) -> bool:
        """
        Sends a POST request to create an email draft via remote MCP server.
        """
        if not to_email or "@" not in to_email:
            logger.error("invalid_email", email=to_email)
            return False

        if self.dry_run:
            logger.info("dry_run_create_email_draft", to=to_email, subject=subject, body_length=len(html_body))
            return True

        endpoint = f"{self.BASE_URL}/create_email_draft"
        payload = {
            "to": to_email,
            "subject": subject,
            "body": html_body
        }

        try:
            logger.info("request_create_email", to=to_email)
            response = requests.post(endpoint, json=payload, timeout=30)
            response.raise_for_status()
            logger.info("email_draft_created")
            return True
        except requests.RequestException as e:
            logger.error("email_delivery_failed", error=str(e), response=getattr(e.response, "text", None))
            return False

    def append_to_doc(self, doc_id: str, markdown_content: str) -> bool:
        """
        Sends a POST request to append markdown content to a Google Doc.
        """
        if not doc_id:
            logger.error("missing_doc_id")
            return False

        if self.dry_run:
            logger.info("dry_run_append_doc", doc_id=doc_id, content_length=len(markdown_content))
            return True

        endpoint = f"{self.BASE_URL}/append_to_doc"
        payload = {
            "doc_id": doc_id,
            "content": markdown_content
        }

        try:
            logger.info("request_append_doc", doc_id=doc_id)
            response = requests.post(endpoint, json=payload, timeout=30)
            response.raise_for_status()
            logger.info("doc_appended")
            return True
        except requests.RequestException as e:
            logger.error("doc_append_failed", error=str(e), response=getattr(e.response, "text", None))
            return False
