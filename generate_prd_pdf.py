from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer


def md_line_to_html(line: str) -> str:
    text = line.strip()
    if not text:
        return ""

    # Basic markdown transforms for paragraphs.
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    text = text.replace("**", "<b>").replace("<b></b>", "")
    # Fix paired bold tags from naive replacement.
    parts = text.split("<b>")
    if len(parts) > 1:
        rebuilt = [parts[0]]
        open_tag = True
        for chunk in parts[1:]:
            rebuilt.append(("<b>" if open_tag else "</b>") + chunk)
            open_tag = not open_tag
        text = "".join(rebuilt)

    return text


def build_pdf(md_path: Path, pdf_path: Path) -> None:
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "TitleStyle",
        parent=styles["Title"],
        fontSize=18,
        leading=22,
        textColor=colors.black,
        spaceAfter=12,
    )
    h2_style = ParagraphStyle(
        "H2Style",
        parent=styles["Heading2"],
        fontSize=13,
        leading=16,
        textColor=colors.black,
        spaceBefore=8,
        spaceAfter=4,
    )
    h3_style = ParagraphStyle(
        "H3Style",
        parent=styles["Heading3"],
        fontSize=11,
        leading=14,
        textColor=colors.black,
        spaceBefore=6,
        spaceAfter=3,
    )
    body_style = ParagraphStyle(
        "BodyStyle",
        parent=styles["BodyText"],
        fontSize=10,
        leading=14,
        spaceAfter=4,
    )
    bullet_style = ParagraphStyle(
        "BulletStyle",
        parent=body_style,
        leftIndent=12,
        bulletIndent=0,
    )

    doc = SimpleDocTemplate(
        str(pdf_path),
        pagesize=A4,
        leftMargin=1.8 * cm,
        rightMargin=1.8 * cm,
        topMargin=1.8 * cm,
        bottomMargin=1.8 * cm,
        title="PRD + TRD - App Review Intelligence Pipeline",
        author="Cursor Agent",
    )

    story = []
    for raw in md_path.read_text(encoding="utf-8").splitlines():
        line = raw.rstrip()
        if not line:
            story.append(Spacer(1, 4))
            continue

        if line.startswith("---"):
            story.append(Spacer(1, 8))
            continue

        if line.startswith("# "):
            story.append(Paragraph(md_line_to_html(line[2:]), title_style))
            continue
        if line.startswith("## "):
            story.append(Paragraph(md_line_to_html(line[3:]), h2_style))
            continue
        if line.startswith("### "):
            story.append(Paragraph(md_line_to_html(line[4:]), h3_style))
            continue
        if line.startswith("- "):
            story.append(Paragraph(md_line_to_html(line[2:]), bullet_style, bulletText="•"))
            continue
        if line.startswith("1. "):
            story.append(Paragraph(md_line_to_html(line), body_style))
            continue

        story.append(Paragraph(md_line_to_html(line), body_style))

    doc.build(story)


if __name__ == "__main__":
    root = Path(__file__).resolve().parent
    build_pdf(root / "PRD_TRD_LIP3.md", root / "PRD_TRD_LIP3.pdf")
