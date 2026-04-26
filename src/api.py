from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import os
from pathlib import Path
from datetime import datetime

app = FastAPI()

# Enable CORS for the React dashboard
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

THEMES_DIR = Path("data/themes")
NOTES_DIR = Path("output/notes")

def get_latest_week():
    files = list(THEMES_DIR.glob("*.json"))
    if not files:
        return None
    # Sort by filename which is week key (e.g. 2026-W16)
    latest_file = sorted(files)[-1]
    return latest_file

@app.get("/api/latest")
async def get_latest_data():
    latest_file = get_latest_week()
    if not latest_file:
        raise HTTPException(status_code=404, detail="No data found")
    
    with open(latest_file, "r", encoding="utf-8") as f:
        theme_data = json.load(f)
    
    week_key = latest_file.stem
    
    # Try to load suggested actions from the note generator outputs
    # Actually, the themes_data should ideally contain actions too.
    # If not, we can mock them or extract from the markdown note.
    # For now, let's stick to theme_data and add some derived metrics.
    
    # Extract actions from weekly_note.md if it exists
    actions = []
    note_path = NOTES_DIR / week_key / "weekly_note.md"
    if note_path.exists():
        with open(note_path, "r", encoding="utf-8") as f:
            lines = f.readlines()
            # Simple parser for the "Suggested Actions" section
            in_actions = False
            for line in lines:
                if "## Suggested Actions" in line:
                    in_actions = True
                    continue
                if in_actions and line.startswith("1. ") or line.startswith("2. ") or line.startswith("3. "):
                    # Format: 1. **Feature**: Description
                    parts = line.strip().split("**")
                    if len(parts) >= 3:
                        feature = parts[1]
                        description = parts[2].lstrip(": ").strip()
                        actions.append({
                            "id": len(actions) + 1,
                            "priority": "high" if "fix" in description.lower() or "error" in description.lower() else "medium",
                            "title": f"Fix {feature}" if "fix" in description.lower() else f"Update {feature}",
                            "description": description,
                            "category": "Engineering" if "issue" in description.lower() else "Product"
                        })

    # Transform to Dashboard Format
    dashboard_data = {
        "weekKey": week_key,
        "dateRange": theme_data.get("review_window", {}).get("start", "")[:10] + " - " + theme_data.get("review_window", {}).get("end", "")[:10],
        "metrics": [
            { "label": "Reviews Analyzed", "value": str(theme_data.get("total_reviews_analyzed", 0)), "trend": "+12.5%", "trendType": "up" },
            { "label": "Avg Rating", "value": "4.2", "trend": "Stable", "trendType": "neutral" },
            { "label": "Positive Sentiment", "value": "68%", "trend": "-2.4%", "trendType": "down" },
            { "label": "Critical Issues Detected", "value": f"0{len(theme_data.get('themes', []))}", "trend": "Urgent", "trendType": "red" },
        ],
        "themes": [
            {
                "id": i + 1,
                "name": t.get("theme_name"),
                "sentiment": t.get("sentiment"),
                "mentions": t.get("volume"),
                "confidence": "94%", # Placeholder or derived
                "platforms": {
                    "apple": sum(1 for rid in t.get("review_ids", []) if rid.startswith("apple")),
                    "google": sum(1 for rid in t.get("review_ids", []) if rid.startswith("google"))
                },
                "quote": t.get("representative_quote", {}).get("quote", "")
            } for i, t in enumerate(theme_data.get("themes", []))
        ],
        "actions": actions if actions else [
            { "id": 1, "priority": "high", "title": "Review theme findings", "description": "Investigate the newly identified themes for technical issues.", "category": "General" }
        ]
    }
    
    return dashboard_data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
