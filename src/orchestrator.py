"""
Global Pipeline Orchestrator.
Coordinates Phase 1 (Scrape) -> Phase 2 (Themes) -> Phase 3 (Notes) -> Phase 4 (Delivery).
"""

import os
import json
import yaml
import structlog
from datetime import datetime, timezone
from pathlib import Path

from src.scraper.orchestrator import ScraperOrchestrator
from src.themes.extractor import ThemeExtractor
from src.notes.generator import NoteGenerator
from src.delivery.rest_client import DeliveryClient
from src.delivery.ledger import RunLedger

logger = structlog.get_logger(__name__)

class PipelineOrchestrator:
    def __init__(self, config_path: str = "config/pipeline_config.yaml"):
        with open(config_path, "r") as f:
            self.config = yaml.safe_load(f)
            
        self.week_key = datetime.now(timezone.utc).strftime("%Y-W%W")
        
        # Delivery Config
        email_config = self.config.get("email", {})
        self.to_address = email_config.get("to_address")
        self.doc_id = email_config.get("doc_id")
        self.dry_run = email_config.get("dry_run", True)
        
        # Clients
        self.delivery_client = DeliveryClient(dry_run=self.dry_run)
        self.ledger = RunLedger()

    def run_full_pipeline(self):
        logger.info("pipeline_started", week_key=self.week_key)
        
        # ==========================================
        # Phase 1: Scrape
        # ==========================================
        logger.info("phase_1_started")
        scraper = ScraperOrchestrator(self.config["scraper"])
        scrape_result = scraper.run(week_key=self.week_key)
        reviews = scrape_result["reviews"]
        
        if not reviews:
            logger.error("no_reviews_collected")
            return

        # ==========================================
        # Phase 2: Theme Extraction
        # ==========================================
        logger.info("phase_2_started")
        extractor = ThemeExtractor("config/pipeline_config.yaml")
        themes_result = extractor.extract_themes(reviews)
        
        # ==========================================
        # Phase 3: Note Generation
        # ==========================================
        logger.info("phase_3_started")
        generator = NoteGenerator()
        note_data = generator.process_themes(themes_result)
        
        # Save output
        output_dir = Path("output/notes") / self.week_key
        output_dir.mkdir(parents=True, exist_ok=True)
        
        md_path = output_dir / "weekly_note.md"
        with open(md_path, "w", encoding="utf-8") as f:
            f.write(note_data["markdown"])
            
        html_path = output_dir / "weekly_note.html"
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(note_data["html"])
            
        # ==========================================
        # Phase 4: Delivery
        # ==========================================
        logger.info("phase_4_started")
        
        # Generate the precise Subject Title
        subject_title = f"Weekly App Review Pulse - {self.week_key}"
        
        # Create Email Draft
        if self.to_address:
            draft_success = self.delivery_client.create_email_draft(
                to_email=self.to_address,
                subject=subject_title,
                html_body=note_data["formatted_html"]
            )
            if draft_success:
                logger.info("draft_created_successfully", to=self.to_address)
            else:
                logger.error("draft_creation_failed")
                
        # Append to Google Doc
        if self.doc_id:
            doc_success = self.delivery_client.append_to_doc(
                doc_id=self.doc_id,
                markdown_content=note_data["formatted_html"]
            )
            if not doc_success:
                logger.error("doc_append_failed")

        # Record LEDGER
        final_status = "dry_run" if self.dry_run else "sent"
        
        self.ledger.record_run(
            week_key=self.week_key, 
            status=final_status,
            meta={
                "reviews_analyzed": len(reviews),
                "word_count": note_data["metadata"]["word_count"],
                "pii_caught": note_data["metadata"]["pii_caught_in_note"]
            }
        )
        
        logger.info("pipeline_complete", week_key=self.week_key, status=final_status)

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    
    structlog.configure(
        processors=[
            structlog.stdlib.add_log_level,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.dev.ConsoleRenderer(),
        ],
        wrapper_class=structlog.stdlib.BoundLogger,
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
    )

    orchestrator = PipelineOrchestrator()
    orchestrator.run_full_pipeline()
