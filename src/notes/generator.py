"""
Note Generator
Generates the Weekly App Review Pulse summary using the Groq API.
Handles parsing themes, LLM prompt retries, Markdown drafting, and HTML compilation.
"""

import os
import json
import time
import markdown
import structlog
from datetime import datetime, timezone
import yaml
from groq import Groq, RateLimitError

from .templates import (
    NOTE_SYSTEM_PROMPT,
    NOTE_REPROMPT_OVER_LENGTH,
    NOTE_REPROMPT_VAGUE_ACTIONS,
    generate_header_summary
)
from .validator import NoteValidator

logger = structlog.get_logger(__name__)


class NoteGenerator:
    """Uses Groq LLaMA to convert extracted themes into a weekly summary note."""

    def __init__(self, config_path: str = "config/pipeline_config.yaml"):
        with open(config_path, "r") as f:
            config = yaml.safe_load(f)
            
        self.llm_config = config.get("llm", {})
        self.model = self.llm_config.get("model", "llama-3.3-70b-versatile")
        self.max_retries = self.llm_config.get("max_retries", 3)
        self.platforms = ["apple", "google"] # We can read this from metadata dynamically
        
        # Initialize Groq client
        api_key = os.environ.get("GROQ_API_KEY")
        if not api_key or api_key == "your_groq_api_key_here":
            logger.error("groq_api_key_invalid")
            raise ValueError("LLM API authentication failed. Check your API key.")
            
        self.client = Groq(api_key=api_key)

    def _call_llm_text(self, system_prompt: str, user_messages: list, temperature: float = 0.3) -> str:
        """Call Groq and return a markdown string, handling backoff."""
        messages = [{"role": "system", "content": system_prompt}]
        messages.extend(user_messages)

        for attempt in range(1, self.max_retries + 1):
            try:
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    # response_format not used for text output
                    max_tokens=2000,
                    temperature=temperature
                )
                return response.choices[0].message.content
            except RateLimitError as e:
                wait_time = 2 ** attempt
                logger.warning("groq_rate_limit", attempt=attempt, wait=wait_time)
                if attempt == self.max_retries:
                    raise
                time.sleep(wait_time)
            except Exception as e:
                logger.error("groq_api_error", attempt=attempt, error=str(e))
                if attempt == self.max_retries:
                    raise
                time.sleep(2)
        return ""

    def process_themes(self, themes_data: dict) -> dict:
        """
        Takes the output dict from Phase 2 and generates the Weekly Note.
        Returns a dict with 'markdown', 'html', 'metadata'.
        """
        started_at = datetime.now(timezone.utc)
        
        raw_themes = themes_data.get("themes", [])
        if not raw_themes:
            logger.warning("no_themes_for_note")
            return {}

        # Tie breaking & Ranking (EC-3.6)
        # Volume descending, then by original index to keep determinism
        for idx, t in enumerate(raw_themes):
            t["_original_idx"] = idx
            
        # Tie break on volume -> lower sentiment if we had a numerical score, 
        # but since it's just 'negative' we just rely on stable sort
        raw_themes.sort(key=lambda x: (x.get("volume", 0), -x.get("_original_idx", 0)), reverse=True)
        
        # Take top 3 max
        top_themes = raw_themes[:3]

        # Prepare header variables
        # Format the dates
        window = themes_data.get("review_window", {})
        start_date = "N/A"
        end_date = "N/A"
        if window.get("start"):
            start_date = datetime.fromisoformat(window["start"]).strftime("%b %d")
        if window.get("end"):
            end_date = datetime.fromisoformat(window["end"]).strftime("%b %d, %Y")
            
        # We need the platforms that succeeded, check if 'google_unavailable' in metadata
        platforms = self.platforms
        if themes_data.get("metadata", {}).get("platforms_failed") == ["google"]:
            platforms = ["apple"]
            
        header_summary = generate_header_summary(raw_themes, platforms)
        
        # Filter down the quotes if needed (EC-3.7 short quotes logic)
        for t in top_themes:
            # Not strictly implementing the "shortest substantive quote search" here since 
            # phase 2 handles extracting the single quote. Phase 3 just uses it.
            pass

        themes_json = json.dumps(top_themes, indent=2)
        
        system_prompt = NOTE_SYSTEM_PROMPT.format(
            top_themes_json=themes_json,
            theme_count=len(top_themes),
            header_summary=header_summary,
            timestamp=started_at.strftime("%Y-%m-%d %H:%M UTC"),
            start_date=start_date,
            end_date=end_date
        )

        user_messages = [
            {"role": "user", "content": "Please generate the weekly note."}
        ]

        logger.info("generating_note_start")
        generated_md = self._call_llm_text(system_prompt, user_messages)

        # ====== Validation & Retry Loop ======
        max_correction_loops = 2
        
        for loop in range(max_correction_loops):
            needs_retry = False
            
            # 1. Word Count (EC-3.3)
            is_valid_len, word_count = NoteValidator.validate_word_count(generated_md)
            if not is_valid_len:
                logger.warning("word_count_exceeded", count=word_count, loop=loop)
                user_messages.extend([
                    {"role": "assistant", "content": generated_md},
                    {"role": "user", "content": NOTE_REPROMPT_OVER_LENGTH.format(word_count=word_count)}
                ])
                needs_retry = True
            
            # 2. Specificity (EC-3.4)
            if not needs_retry and not NoteValidator.check_actions_specificity(generated_md):
                logger.warning("generic_actions_detected", loop=loop)
                user_messages.extend([
                    {"role": "assistant", "content": generated_md},
                    {"role": "user", "content": NOTE_REPROMPT_VAGUE_ACTIONS}
                ])
                needs_retry = True

            if needs_retry:
                generated_md = self._call_llm_text(system_prompt, user_messages, temperature=0.1)
            else:
                break

        # Emergency fix if STILL over word count
        is_valid_len, word_count = NoteValidator.validate_word_count(generated_md)
        if not is_valid_len:
            logger.info("force_truncating_actions")
            generated_md = NoteValidator.force_truncate_actions(generated_md)

        # ====== Final Post-Processing ======
        # Strip PII (EC-3.5)
        safe_md, pii_caught = NoteValidator.check_pii(generated_md)
        
        # Verify Quotes
        safe_md, quote_corrections = NoteValidator.verify_quotes(safe_md, top_themes)

        # Convert to HTML (EC-3.8)
        # We do not use external stylesheets. Basic markdown conversion handles standard formatting.
        html_content = markdown.markdown(safe_md)
        # To strictly enforce inline CSS, we wrap the html with a simple style if needed.
        # It's sufficient to wrap in a generic div 
        html_body = f"""<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">{html_content}</div>"""

        finished_at = datetime.now(timezone.utc)
        
        return {
            "markdown": safe_md,
            "html": html_body,
            "metadata": {
                "word_count": len(safe_md.split()),
                "pii_caught_in_note": pii_caught,
                "quote_validation_replacements": quote_corrections,
                "themes_included": len(top_themes),
                "duration_seconds": round((finished_at - started_at).total_seconds(), 2)
            }
        }
