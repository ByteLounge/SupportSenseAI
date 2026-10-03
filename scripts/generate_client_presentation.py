import os
import sys

# Ensure UTF-8 console output on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

import pptx
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

# ==============================================================================
# COLOR PALETTE DEFINITION (Modern Tech Executive Theme)
# ==============================================================================
BG_DARK = RGBColor(11, 15, 25)          # Deep Luxury Navy/Charcoal #0B0F19
BG_CARD = RGBColor(30, 41, 59)          # Rich Slate Card #1E293B
BG_CARD_INNER = RGBColor(24, 34, 52)    # Subtle inner container #182234
BORDER_CARD = RGBColor(51, 65, 85)      # Slate Border #334155
BORDER_CYAN = RGBColor(56, 189, 248)    # Border Cyan #38BDF8
BORDER_BLUE = RGBColor(37, 99, 235)     # Border Blue #2563EB
BORDER_AMBER = RGBColor(245, 158, 11)   # Border Amber #F59E0B
BORDER_GREEN = RGBColor(16, 185, 129)   # Border Green #10B981
BORDER_PURPLE = RGBColor(168, 85, 247)  # Border Purple #A855F7

COLOR_WHITE = RGBColor(248, 250, 252)   # #F8FAFC
COLOR_MUTED = RGBColor(148, 163, 184)   # #94A3B8
COLOR_CYAN = RGBColor(56, 189, 248)     # #38BDF8 (Sky/Cyan)
COLOR_BLUE = RGBColor(59, 130, 246)     # #3B82F6 (Electric Blue)
COLOR_GREEN = RGBColor(16, 185, 129)    # #10B981 (Emerald)
COLOR_AMBER = RGBColor(245, 158, 11)    # #F59E0B (Gold/Amber)
COLOR_PURPLE = RGBColor(168, 85, 247)   # #A855F7 (Purple)
COLOR_ROSE = RGBColor(244, 63, 94)      # #F43F5E (Coral/Rose)

# Presenter Badges Configuration
PRESENTER_COLORS = {
    "Rohan Salkar": (RGBColor(37, 99, 235), RGBColor(219, 234, 254)),       # Blue
    "Yash Sanikop": (RGBColor(245, 158, 11), RGBColor(254, 243, 199)),       # Amber
    "Shrujan Mitbavkar": (RGBColor(16, 185, 129), RGBColor(209, 250, 229)), # Green
    "Aarti Singh": (RGBColor(168, 85, 247), RGBColor(243, 232, 255)),       # Purple
    "Joint Team": (RGBColor(14, 165, 233), RGBColor(224, 242, 254)),         # Cyan
}

def create_base_slide(prs, category_text, title_text, subtitle_text=None, presenter_name="Joint Team", presenter_role="Executive Overview", slide_num_str="01 / 25"):
    """Creates a standardized 16:9 widescreen slide with top header bar, metadata, and presenter badge."""
    slide = prs.slides.add_slide(prs.slide_layouts[6]) # blank layout
    
    # Full bleed dark background
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = BG_DARK
    bg.line.fill.background()

    # Top category pill badge
    cat_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.38), Inches(4.5), Inches(0.32))
    cat_box.fill.solid()
    cat_box.fill.fore_color.rgb = BG_CARD
    cat_box.line.color.rgb = BORDER_CARD
    cat_box.line.width = Pt(1)
    tf_cat = cat_box.text_frame
    tf_cat.word_wrap = True
    tf_cat.vertical_anchor = MSO_ANCHOR.MIDDLE
    p_cat = tf_cat.paragraphs[0]
    p_cat.text = f"  {category_text.upper()}"
    p_cat.font.name = "Calibri"
    p_cat.font.size = Pt(9.5)
    p_cat.font.bold = True
    p_cat.font.color.rgb = COLOR_CYAN

    # Presenter Badge (Top Right)
    badge_color, badge_text_color = PRESENTER_COLORS.get(presenter_name, PRESENTER_COLORS["Joint Team"])
    pres_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.0), Inches(0.38), Inches(4.5), Inches(0.32))
    pres_box.fill.solid()
    pres_box.fill.fore_color.rgb = BG_CARD
    pres_box.line.color.rgb = badge_color
    pres_box.line.width = Pt(1.5)
    tf_pres = pres_box.text_frame
    tf_pres.word_wrap = True
    tf_pres.vertical_anchor = MSO_ANCHOR.MIDDLE
    p_pres = tf_pres.paragraphs[0]
    p_pres.text = f"  🗣️ {presenter_name}  |  {presenter_role}"
    p_pres.font.name = "Calibri"
    p_pres.font.size = Pt(9.0)
    p_pres.font.bold = True
    p_pres.font.color.rgb = COLOR_WHITE

    # Slide Title
    title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.76), Inches(11.7), Inches(0.55))
    tf_title = title_box.text_frame
    tf_title.word_wrap = True
    tf_title.margin_left = tf_title.margin_top = tf_title.margin_right = tf_title.margin_bottom = 0
    p_title = tf_title.paragraphs[0]
    p_title.text = title_text
    p_title.font.name = "Calibri"
    p_title.font.size = Pt(21)
    p_title.font.bold = True
    p_title.font.color.rgb = COLOR_WHITE

    # Subtitle / Tagline if present
    if subtitle_text:
        sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.32), Inches(11.7), Inches(0.35))
        tf_sub = sub_box.text_frame
        tf_sub.word_wrap = True
        tf_sub.margin_left = tf_sub.margin_top = tf_sub.margin_right = tf_sub.margin_bottom = 0
        p_sub = tf_sub.paragraphs[0]
        p_sub.text = subtitle_text
        p_sub.font.name = "Calibri"
        p_sub.font.size = Pt(11.5)
        p_sub.font.color.rgb = COLOR_MUTED

    # Header horizontal divider line
    div = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.70), Inches(11.733), Inches(0.015))
    div.fill.solid()
    div.fill.fore_color.rgb = BORDER_CARD
    div.line.fill.background()

    # Footer slide number
    ft_box = slide.shapes.add_textbox(Inches(11.2), Inches(7.12), Inches(1.3), Inches(0.3))
    tf_ft = ft_box.text_frame
    p_ft = tf_ft.paragraphs[0]
    p_ft.text = slide_num_str
    p_ft.alignment = PP_ALIGN.RIGHT
    p_ft.font.name = "Calibri"
    p_ft.font.size = Pt(10)
    p_ft.font.color.rgb = COLOR_MUTED

    # Footer watermark
    wm_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.12), Inches(9.5), Inches(0.3))
    tf_wm = wm_box.text_frame
    p_wm = tf_wm.paragraphs[0]
    p_wm.text = "SupportSense AI — Developer Team Client Pitch | Persistent Systems Internship | Yash Sanikop (23CO76)"
    p_wm.font.name = "Calibri"
    p_wm.font.size = Pt(9.5)
    p_wm.font.color.rgb = COLOR_MUTED

    return slide

def add_card(slide, left, top, width, height, title=None, subtitle=None, bg_color=BG_CARD, border_color=BORDER_CARD, border_width=1):
    """Draws a sleek modern card container."""
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
    card.fill.solid()
    card.fill.fore_color.rgb = bg_color
    if border_color:
        card.line.color.rgb = border_color
        card.line.width = Pt(border_width)
    else:
        card.line.fill.background()
    
    if title:
        tb = slide.shapes.add_textbox(Inches(left + 0.22), Inches(top + 0.18), Inches(width - 0.44), Inches(0.35))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = title
        p.font.name = "Calibri"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = COLOR_WHITE
        
        if subtitle:
            p2 = tf.add_paragraph()
            p2.text = subtitle
            p2.font.name = "Calibri"
            p2.font.size = Pt(9.2)
            p2.font.color.rgb = COLOR_MUTED

    return card

def add_stat_card(slide, left, top, width, height, stat_number, stat_label, subtext=None, accent_color=COLOR_CYAN):
    """Draws a high-impact metric KPI card."""
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
    card.fill.solid()
    card.fill.fore_color.rgb = BG_CARD
    card.line.color.rgb = accent_color
    card.line.width = Pt(1.5)

    tb = slide.shapes.add_textbox(Inches(left + 0.18), Inches(top + 0.12), Inches(width - 0.36), Inches(height - 0.24))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

    p = tf.paragraphs[0]
    p.text = stat_number
    p.font.name = "Calibri"
    p.font.size = Pt(27)
    p.font.bold = True
    p.font.color.rgb = accent_color

    p2 = tf.add_paragraph()
    p2.text = stat_label
    p2.font.name = "Calibri"
    p2.font.size = Pt(11.5)
    p2.font.bold = True
    p2.font.color.rgb = COLOR_WHITE
    p2.space_before = Pt(3)

    if subtext:
        p3 = tf.add_paragraph()
        p3.text = subtext
        p3.font.name = "Calibri"
        p3.font.size = Pt(9.0)
        p3.font.color.rgb = COLOR_MUTED
        p3.space_before = Pt(2)

def add_bullet_list(slide, left, top, width, height, items, font_size=10.5, space_before=4):
    """Adds a structured bulleted list with crisp bold-lead labels."""
    tb = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
    
    for i, item in enumerate(items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.space_before = Pt(space_before)
        
        if isinstance(item, tuple):
            r1 = p.add_run()
            r1.text = f"•  {item[0]}: "
            r1.font.name = "Calibri"
            r1.font.size = Pt(font_size)
            r1.font.bold = True
            r1.font.color.rgb = COLOR_WHITE
            
            r2 = p.add_run()
            r2.text = item[1]
            r2.font.name = "Calibri"
            r2.font.size = Pt(font_size)
            r2.font.color.rgb = COLOR_MUTED
        else:
            r = p.add_run()
            r.text = f"•  {item}"
            r.font.name = "Calibri"
            r.font.size = Pt(font_size)
            r.font.color.rgb = COLOR_MUTED

def add_image_card(slide, image_path, left, top, width, height, caption=None, border_color=BORDER_CARD):
    """Draws a picture neatly framed with border and caption."""
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left - 0.04), Inches(top - 0.04), Inches(width + 0.08), Inches(height + (0.32 if caption else 0.08)))
    card.fill.solid()
    card.fill.fore_color.rgb = BG_CARD_INNER
    card.line.color.rgb = border_color
    card.line.width = Pt(1.5)
    
    if os.path.exists(image_path):
        slide.shapes.add_picture(image_path, Inches(left), Inches(top), width=Inches(width), height=Inches(height))
    else:
        # Fallback placeholder if image not found
        tb = slide.shapes.add_textbox(Inches(left), Inches(top + height/2 - 0.3), Inches(width), Inches(0.6))
        p = tb.text_frame.paragraphs[0]
        p.text = f"[Image Asset: {os.path.basename(image_path)}]"
        p.alignment = PP_ALIGN.CENTER
        p.font.name = "Calibri"
        p.font.size = Pt(11)
        p.font.color.rgb = COLOR_MUTED
    
    if caption:
        tb = slide.shapes.add_textbox(Inches(left), Inches(top + height + 0.02), Inches(width), Inches(0.28))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = caption
        p.alignment = PP_ALIGN.CENTER
        p.font.name = "Calibri"
        p.font.size = Pt(8.8)
        p.font.color.rgb = COLOR_CYAN

def set_speaker_notes(slide, presenter_name, timing, core_goal, script_text):
    """Adds structured speaker notes for PowerPoint Presenter View."""
    notes_slide = slide.notes_slide
    tf = notes_slide.notes_text_frame
    notes_content = (
        f"🎙️ PRESENTER: {presenter_name} | ⏱️ TIME: {timing}\n"
        f"🎯 CORE GOAL: {core_goal}\n"
        f"─────────────────────────────────────────────────────────────\n"
        f"TALKING SCRIPT:\n{script_text}"
    )
    tf.text = notes_content

def add_table_styled(slide, left, top, width, height, headers, data, col_widths=None):
    """Adds a styled modern table with high-contrast theme."""
    rows = len(data) + 1
    cols = len(headers)
    table_shape = slide.shapes.add_table(rows, cols, Inches(left), Inches(top), Inches(width), Inches(height))
    table = table_shape.table

    if col_widths and len(col_widths) == cols:
        for idx, w in enumerate(col_widths):
            table.columns[idx].width = Inches(w)

    # Style Header
    for idx, header in enumerate(headers):
        cell = table.cell(0, idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = BG_CARD
        cell.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = cell.text_frame.paragraphs[0]
        p.text = header
        p.font.name = "Calibri"
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = COLOR_CYAN
        p.alignment = PP_ALIGN.LEFT

    # Style Data Rows
    for row_idx, row_values in enumerate(data):
        row_bg = BG_CARD_INNER if row_idx % 2 == 0 else BG_CARD
        for col_idx, val in enumerate(row_values):
            cell = table.cell(row_idx + 1, col_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = row_bg
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE
            p = cell.text_frame.paragraphs[0]
            p.text = str(val)
            p.font.name = "Calibri"
            p.font.size = Pt(9.5)
            p.font.color.rgb = COLOR_WHITE if col_idx == 0 else COLOR_MUTED
            p.alignment = PP_ALIGN.LEFT

# ==============================================================================
# MAIN PRESENTATION BUILDER
# ==============================================================================
def build_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    print("Building 25-slide developer-to-developer client presentation with 13 live production screenshots...")

    # --------------------------------------------------------------------------
    # SLIDE 1: Title Slide (Executive Cover)
    # --------------------------------------------------------------------------
    slide1 = prs.slides.add_slide(prs.slide_layouts[6])
    bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = RGBColor(9, 13, 23)
    bg1.line.fill.background()

    if os.path.exists("frontend/src/assets/logo.png"):
        slide1.shapes.add_picture("frontend/src/assets/logo.png", Inches(0.9), Inches(0.9), width=Inches(1.2))
    elif os.path.exists("logo.png"):
        slide1.shapes.add_picture("logo.png", Inches(0.9), Inches(0.9), width=Inches(1.2))

    tb1 = slide1.shapes.add_textbox(Inches(2.3), Inches(0.85), Inches(10.2), Inches(2.2))
    tf1 = tb1.text_frame
    tf1.word_wrap = True
    
    p = tf1.paragraphs[0]
    p.text = "SupportSense AI"
    p.font.name = "Calibri"
    p.font.size = Pt(38)
    p.font.bold = True
    p.font.color.rgb = COLOR_WHITE

    p2 = tf1.add_paragraph()
    p2.text = "Enterprise AI-Assisted Customer Support Ecosystem"
    p2.font.name = "Calibri"
    p2.font.size = Pt(19)
    p2.font.bold = True
    p2.font.color.rgb = COLOR_CYAN
    p2.space_before = Pt(4)

    p3 = tf1.add_paragraph()
    p3.text = "Real-Time Triage • Sentiment Monitoring • Resolution Forecasting • Automated Policies"
    p3.font.name = "Calibri"
    p3.font.size = Pt(11.5)
    p3.font.color.rgb = COLOR_MUTED
    p3.space_before = Pt(4)

    div1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.9), Inches(3.1), Inches(11.533), Inches(0.02))
    div1.fill.solid()
    div1.fill.fore_color.rgb = BORDER_CARD
    div1.line.fill.background()

    team_info = [
        ("Rohan Salkar", "Frontend & UI/UX Lead", 
         "Headed React 18 SPA architecture, Tailwind CSS MoonRow design system, dark/light theme switching, responsive layouts, and tone polishing modals.", 
         COLOR_BLUE),
        ("Yash Sanikop", "Frontend & AI Lead\n(Intern: Roll No. 23CO76)", 
         "Responsible for FastAPI AI microservice, Gemini 1.5 Flash SDK integration, model instance pooling, TTL caching, prompt engineering, and conversational AI concierge widgets.", 
         COLOR_AMBER),
        ("Shrujan Mitbavkar", "Backend & Database Lead", 
         "Managed Express REST controllers, PostgreSQL relational schema modeling, database transactions, state machines, and Supabase cloud connection pooling.", 
         COLOR_GREEN),
        ("Aarti Singh", "DevOps, QA & Doc Lead", 
         "Headed Docker containerization, Render Blueprint orchestration, automated Jest and Pytest suites, security hardening, and technical governance specifications.", 
         COLOR_PURPLE)
    ]
    for idx, (name, role, desc, col) in enumerate(team_info):
        c_left = 0.9 + idx * 2.95
        card = add_card(slide1, c_left, 3.35, 2.75, 3.3, title=name, subtitle=role, border_color=col, border_width=1.5)
        tb_desc = slide1.shapes.add_textbox(Inches(c_left + 0.2), Inches(4.3), Inches(2.35), Inches(2.15))
        tf_desc = tb_desc.text_frame
        tf_desc.word_wrap = True
        tf_desc.margin_left = tf_desc.margin_top = tf_desc.margin_right = tf_desc.margin_bottom = 0
        p_desc = tf_desc.paragraphs[0]
        p_desc.text = desc
        p_desc.font.name = "Calibri"
        p_desc.font.size = Pt(9.2)
        p_desc.font.color.rgb = COLOR_MUTED

    tb_meta = slide1.shapes.add_textbox(Inches(0.9), Inches(6.8), Inches(11.5), Inches(0.4))
    tf_meta = tb_meta.text_frame
    p_meta = tf_meta.paragraphs[0]
    p_meta.text = "Persistent Systems Ltd. Internship Program | Student Intern: Yash Sanikop (Roll No. 23CO76) | Industry Mentor: Vishal Bidikar | Guide: Prof. Laxmikant Bordekar"
    p_meta.font.name = "Calibri"
    p_meta.font.size = Pt(9.2)
    p_meta.font.color.rgb = COLOR_MUTED

    set_speaker_notes(slide1, "Rohan Salkar", "45s", 
        "Welcome mentors and clients, introduce our 4-member developer team, and frame the pitch.",
        "Good morning everyone. Today our team is proud to present SupportSense AI, an enterprise-grade AI-assisted customer support platform built during our Persistent Systems internship. "
        "We are presenting directly from developer to developer. Our team consists of Rohan Salkar as Frontend & UI/UX Lead, Yash Sanikop (Roll No. 23CO76) as Frontend & AI Lead, Shrujan Mitbavkar as Backend & Database Lead, and Aarti Singh as DevOps, QA & Documentation Lead. "
        "Together, we will walk you through our product from ideation to production deployment, showing the live features we built and the exact numbers proving its value.")

    # --------------------------------------------------------------------------
    # SLIDE 2: Executive Summary & Client Value Proposition
    # --------------------------------------------------------------------------
    slide2 = create_base_slide(prs, "Executive Summary", "Executive Summary: Business Impact & Human-in-the-Loop Value", 
                              "Delivering enterprise ROI through intelligent decision-support without risky unverified automations.", 
                              "Rohan Salkar", "Frontend & UI/UX Lead", "02 / 25")
    
    add_stat_card(slide2, 0.8, 1.85, 2.75, 1.7, "75%", "First Response Reduction", "From 8.5 hours to 2.1 mins via instant department confirmations", COLOR_CYAN)
    add_stat_card(slide2, 3.75, 1.85, 2.75, 1.7, "35%", "Ticket Deflection Rate", "Real-time Knowledge Base suggestions & duplicate alerts", COLOR_GREEN)
    add_stat_card(slide2, 6.7, 1.85, 2.75, 1.7, "96.0%", "AI Triage Accuracy", "Calibrated on 100 historical Kaggle and Hugging Face records", COLOR_AMBER)
    add_stat_card(slide2, 9.65, 1.85, 2.75, 1.7, "100%", "Data Consistency", "Atomic PostgreSQL commits with 0 orphaned tickets on failure", COLOR_PURPLE)

    add_card(slide2, 0.8, 3.8, 3.7, 3.1, "1. Operational Velocity", "Slashing triage bottlenecks")
    add_bullet_list(slide2, 1.0, 4.45, 3.3, 2.3, [
        ("Instant Auto-Replies", "Non-destructive department replies sent in < 2 seconds."),
        ("Dynamic Checklists", "3–5 tailored verification steps prevent overlooked items."),
        ("Patience Guardrail", "4-tier customer patience indicators signal SLA risks early.")
    ])

    add_card(slide2, 4.8, 3.8, 3.7, 3.1, "2. Human-in-the-Loop Safety", "AI Assists, Humans Decide")
    add_bullet_list(slide2, 5.0, 4.45, 3.3, 2.3, [
        ("Bounded Automation", "AI never issues refunds, edits DB, or sends unvetted replies."),
        ("Pre-Send Audits", "Scores Professionalism, Empathy, Clarity, Actionability."),
        ("Confidence Checks", "If Gemini confidence drops < 60%, human review is required.")
    ])

    add_card(slide2, 8.8, 3.8, 3.7, 3.1, "3. Continuous Learning", "Turning closed tickets into IP")
    add_bullet_list(slide2, 9.0, 4.45, 3.3, 2.3, [
        ("Weekly AI Insights", "Aggregates recurring customer friction and emerging bugs."),
        ("Auto-Generated FAQs", "Recommends new documentation topics from deflection gaps."),
        ("Zero Vendor Lock-in", "Self-hostable Docker architecture with total data privacy.")
    ])

    set_speaker_notes(slide2, "Rohan Salkar", "45s",
        "Explain the core value proposition and our ethical Human-in-the-Loop philosophy.",
        "As developers presenting to our clients, our primary goal was solving support center burnout. "
        "SupportSense AI operates under an ethical Human-in-the-Loop philosophy: AI Assists, Humans Decide. "
        "Notice the numbers: we achieved a 75% reduction in First Response Time, a 35% ticket deflection rate, a 96% AI triage accuracy, and 100% database consistency through atomic SQL commits. "
        "The system never takes dangerous actions autonomously like issuing refunds or editing databases—it empowers agents with intelligent decision support.")

    # --------------------------------------------------------------------------
    # SLIDE 3: Problem Landscape (Ideation Phase)
    # --------------------------------------------------------------------------
    slide3 = create_base_slide(prs, "Ideation Phase", "The Enterprise Support Crisis: 4 Critical Industry Bottlenecks", 
                              "Why traditional ticketing systems fail high-volume enterprise environments.", 
                              "Rohan Salkar", "Frontend & UI/UX Lead", "03 / 25")

    problems = [
        ("1. Sluggish First Response Times (FRT)", 
         "Enterprise support queues take 8 to 14 hours for initial responses. Manual triage requires reading, classifying, assigning, and drafting from scratch, causing SLA breaches and customer churn.",
         COLOR_ROSE),
        ("2. Queue Gaming & Shouting Hijacking", 
         "Frustrated users type 'URGENT!!!' or 'EMERGENCY' for minor issues, tricking simple keyword filters and burying genuine production outages under shouting users.",
         COLOR_AMBER),
        ("3. Queue Duplication Bloat", 
         "Customers submit multiple tickets for the same issue or repeat already resolved queries. This bloats queues by over 30% and forces agents to re-diagnose solved problems.",
         COLOR_PURPLE),
        ("4. Reopened Ticket Context Blindness", 
         "When customers reopen closed tickets, newly assigned agents must read through 20+ past messages to grasp history, introducing 15+ minutes of delay per ticket.",
         COLOR_CYAN)
    ]

    for idx, (p_title, p_desc, col) in enumerate(problems):
        row = idx // 2
        col_idx = idx % 2
        left = 0.8 + col_idx * 5.95
        top = 1.85 + row * 2.5
        add_card(slide3, left, top, 5.75, 2.3, p_title, None, border_color=col, border_width=1.5)
        tb_p = slide3.shapes.add_textbox(Inches(left + 0.25), Inches(top + 0.6), Inches(5.25), Inches(1.5))
        tf_p = tb_p.text_frame
        tf_p.word_wrap = True
        tf_p.margin_left = tf_p.margin_top = tf_p.margin_right = tf_p.margin_bottom = 0
        p_txt = tf_p.paragraphs[0]
        p_txt.text = p_desc
        p_txt.font.name = "Calibri"
        p_txt.font.size = Pt(10.5)
        p_txt.font.color.rgb = COLOR_MUTED

    set_speaker_notes(slide3, "Rohan Salkar", "45s",
        "Explain the 4 industry bottlenecks that motivated the SupportSense AI project.",
        "In our ideation phase, we analyzed enterprise support workflows and identified four critical bottlenecks. "
        "First, First Response Time stretches 8 to 14 hours because human agents manually triage everything. "
        "Second, queue gaming: users shouting 'URGENT' in all caps hijack queues, burying real outages. "
        "Third, duplicate tickets bloat queues by 30% because customers submit repeated requests. "
        "And fourth, reopened tickets cause context blindness, wasting 15 minutes per ticket. SupportSense AI was specifically engineered to eradicate these four problems.")

    # --------------------------------------------------------------------------
    # SLIDE 4: Competitive Landscape (SupportSense AI vs Alternatives)
    # --------------------------------------------------------------------------
    slide4 = create_base_slide(prs, "Market Differentiation", "Competitive Matrix: Why SupportSense AI Outperforms Alternatives", 
                              "Architectural advantages over Zendesk, Freshdesk, and generic OpenAI wrappers.", 
                              "Rohan Salkar", "Frontend & UI/UX Lead", "04 / 25")

    headers = ["Feature / Capability", "Zendesk Enterprise", "Freshdesk Pro", "SupportSense AI (Ours)"]
    matrix_data = [
        ["AI Triage & Urgency Decoupling", "Basic Keyword Rules", "Rule-based tags", "Gemini 1.5 Flash Emotional Decoupling (96.0%)"],
        ["Real-Time FAQ Deflection", "Static Popups", "External Bot Add-on", "Debounced 300ms Dynamic Deflection (35% rate)"],
        ["Agent Tone Polishing (4 Tones)", "Not Available", "Add-on Bot ($$$)", "1-Click Cycling (Empathetic, Concise, Formal, Tech)"],
        ["Duplicate Ticket Interception", "Post-creation merging", "Manual agent merge", "Proactive HTTP 409 Interception with verified steps"],
        ["Reopened Timeline Summarizer", "Not Available", "Not Available", "Async Fire-and-Forget 5-bullet TL;DR banner"],
        ["Data Sovereignty & Deployment", "SaaS Cloud Only", "SaaS Cloud Only", "100% Self-Hostable Docker / Cloud (Render & Supabase)"],
        ["Licensing / Annual Cost (20 Agents)", "$36,000 / year", "$24,000 / year", "< $4,000 / year (Over 85% Cost Reduction)"]
    ]
    add_table_styled(slide4, 0.8, 1.85, 11.733, 4.9, headers, matrix_data, col_widths=[2.5, 2.2, 2.2, 4.833])

    set_speaker_notes(slide4, "Rohan Salkar", "45s",
        "Demonstrate why clients should choose SupportSense AI over expensive SaaS giants.",
        "Here you can see how SupportSense AI compares against established giants like Zendesk and Freshdesk. "
        "Traditional platforms charge exorbitant per-seat licensing fees and offer simple keyword rules. "
        "In contrast, SupportSense AI decouples customer emotion from technical priority, provides 1-click tone polishing, proactively catches duplicate tickets before submission, and summarizes reopened tickets. "
        "Best of all, our architecture is 100% self-hostable with zero vendor lock-in, saving enterprise clients over 85% in annual licensing fees.")

    # --------------------------------------------------------------------------
    # SLIDE 5: Agile Sprint Planning & Burndown Journey
    # --------------------------------------------------------------------------
    slide5 = create_base_slide(prs, "Product Development", "From Ideation to Production: 4-Sprint Agile Delivery", 
                              "Delivering 166 Story Points with 100% Jira burndown compliance across 8 weeks.", 
                              "Rohan Salkar", "Frontend & UI/UX Lead", "05 / 25")

    if os.path.exists("docs_sprint_burndown_charts.png"):
        slide5.shapes.add_picture("docs_sprint_burndown_charts.png", Inches(0.8), Inches(1.85), width=Inches(6.4))
    else:
        add_card(slide5, 0.8, 1.85, 6.4, 4.9, "Sprint Burndown Evidence", "Docs Sprint Burndown Graphic")

    sprint_details = [
        ("Sprint 1: Research & AI Datasets", "Weeks 1–2 | 18 pts burned (100%)", "Benchmarked Zendesk; evaluated Gemini latency; collected Kaggle & Hugging Face datasets; drafted PRD and 3-tier architecture."),
        ("Sprint 2: Prototype Architecture & DB", "Weeks 3–4 | 59 pts burned (100%)", "Built React 18 SPA, MoonRow theme, Express REST backend, JWT auth, PostgreSQL 15 schema, and FastAPI scaffold."),
        ("Sprint 3: Live AI Triage & Workbench", "Weeks 5–6 | 38 pts burned (100%)", "Connected Gemini AI triage, mood detection, dynamic checklists, tone checker, and status state machine."),
        ("Sprint 4: Advanced AI & Cloud Deploy", "Weeks 7–8 | 51 pts burned (100%)", "Built AI Concierge, tone polisher, Supabase cloud pooling, duplicate deflection (HTTP 409), Docker & Render deployment.")
    ]

    for idx, (s_title, s_meta, s_desc) in enumerate(sprint_details):
        s_top = 1.85 + idx * 1.22
        add_card(slide5, 7.4, s_top, 5.133, 1.15, s_title, s_meta)
        tb_s = slide5.shapes.add_textbox(Inches(7.6), Inches(s_top + 0.52), Inches(4.75), Inches(0.55))
        tf_s = tb_s.text_frame
        tf_s.word_wrap = True
        tf_s.margin_left = tf_s.margin_top = tf_s.margin_right = tf_s.margin_bottom = 0
        p_s = tf_s.paragraphs[0]
        p_s.text = s_desc
        p_s.font.name = "Calibri"
        p_s.font.size = Pt(9.5)
        p_s.font.color.rgb = COLOR_MUTED

    set_speaker_notes(slide5, "Rohan Salkar", "45s",
        "Explain our 4-sprint Agile Scrum execution and complete burn-down.",
        "Our development journey followed a disciplined Agile Scrum methodology across four 2-week sprints. "
        "As shown in our Jira burndown chart on the left, we maintained zero backlog carryover, burning all 166 story points to zero on schedule. "
        "Sprint 1 was research and PRD; Sprint 2 delivered the core 3-tier scaffold; Sprint 3 wired live Gemini triage and the agent workbench; and Sprint 4 delivered the AI Concierge, Supabase pooling, and Render cloud deployment.")

    # --------------------------------------------------------------------------
    # SLIDE 6: Team Structure & Engineering Governance
    # --------------------------------------------------------------------------
    slide6 = create_base_slide(prs, "Project Governance", "Team Structure & Cross-Functional Engineering Matrix", 
                              "Four dedicated leads collaborating across frontend, backend, AI, and security governance.", 
                              "Rohan Salkar", "Frontend & UI/UX Lead", "06 / 25")

    if os.path.exists("docs_org_chart.png"):
        slide6.shapes.add_picture("docs_org_chart.png", Inches(0.8), Inches(1.85), width=Inches(6.4))
    else:
        add_card(slide6, 0.8, 1.85, 6.4, 4.9, "Organization Chart", "Team Governance Structure")

    add_card(slide6, 7.4, 1.85, 5.133, 4.9, "Cross-Functional Role Ownership", "Balanced 166-Story-Point Workload")
    add_bullet_list(slide6, 7.65, 2.45, 4.65, 4.1, [
        ("Rohan Salkar — Frontend & UI/UX Lead", "38 Story Points. Headed React 18 SPA architecture, Tailwind CSS MoonRow design system, dark/light theme switching, and responsive layouts."),
        ("Yash Sanikop — Frontend & AI Lead (23CO76)", "45 Story Points (Student Intern). Responsible for FastAPI microservice, Gemini 1.5 Flash SDK, model pooling, TTL caching, and AI concierge widgets."),
        ("Shrujan Mitbavkar — Backend & Database Lead", "35 Story Points. Managed Express REST controllers, PostgreSQL relational schema, transactions, state machines, and Supabase pooling."),
        ("Aarti Singh — DevOps, QA & Doc Lead", "38 Story Points. Headed Docker containerization, Render Blueprint orchestration, automated Jest/Pytest suites, and security hardening."),
        ("Mentorship & Governance", "Guided by Industry Mentor Vishal Bidikar (Senior Software Engineer, Persistent Systems) and Academic Guide Prof. Laxmikant Bordekar.")
    ], font_size=10.0, space_before=5)

    set_speaker_notes(slide6, "Rohan Salkar", "45s",
        "Highlight balanced team workload and mentor governance.",
        "Our team operated as a cohesive cross-functional unit with balanced technical ownership across 166 story points. "
        "Rohan led Frontend & UI/UX; Yash Sanikop (Roll No. 23CO76) engineered the FastAPI AI microservice, Gemini integration, and AI concierge; "
        "Shrujan spearheaded Express REST controllers, PostgreSQL relational schema, and transactions; and Aarti headed Docker, Render deployment, and test automation. "
        "We are now ready to show you the actual frontend interface we built.")

    # --------------------------------------------------------------------------
    # SLIDE 7: Section Transition 1 — Frontend, UI/UX & Security Hardening
    # --------------------------------------------------------------------------
    slide7 = create_base_slide(prs, "Technical Deep Dive", "Part 1: Frontend Architecture, UI/UX & Security Hardening", 
                              "Presented by Rohan Salkar (Frontend & UI/UX Lead) & Aarti Singh (DevOps, QA & Doc Lead)", 
                              "Rohan Salkar", "Frontend & UI/UX Lead", "07 / 25")

    add_card(slide7, 0.8, 1.95, 5.75, 4.7, "Rohan Salkar — Frontend & UI/UX Lead", "React 18 SPA, MoonRow Design & Workbenches", border_color=COLOR_BLUE, border_width=2)
    add_bullet_list(slide7, 1.1, 2.7, 5.15, 3.6, [
        ("React 18 Single Page Architecture", "Vite build toolchain delivering sub-second HMR and 8.3s production build."),
        ("Tailwind CSS MoonRow Design System", "High-contrast enterprise aesthetic inspired by Linear and Stripe, with WCAG 2.1 AA."),
        ("Dark / Light Theme Switching", "Instant theme switcher with zero layout shift synced to user preferences."),
        ("Dual-Pane Agent Workbench", "Threaded customer communication paired with live AI decision-support drawer."),
        ("1-Click Tone Polishing Modals", "3-variation cycling across Empathetic, Concise, Formal, and Technical styles.")
    ], font_size=10.5, space_before=7)

    add_card(slide7, 6.75, 1.95, 5.75, 4.7, "Aarti Singh — DevOps, QA & Doc Lead", "Security Hardening, RBAC & Governance", border_color=COLOR_PURPLE, border_width=2)
    add_bullet_list(slide7, 7.05, 2.7, 5.15, 3.6, [
        ("Security Hardening & Stateless JWT", "Bearer token authentication with 1-hour expiration and bcrypt 10-round hashing."),
        ("Role-Based Access Control (RBAC)", "Strict three-tier permissions (Customer, Agent, Admin) across 4 operational departments."),
        ("1-Click Persona Testing Bar", "Pre-seeded demo accounts enabling instant client evaluation without manual typing."),
        ("Automated QA Suites", "Comprehensive Jest and Pytest suites verifying 100% test pass rate across all endpoints."),
        ("Technical Governance Specifications", "13 engineering modules establishing production governance standards.")
    ], font_size=10.5, space_before=7)

    set_speaker_notes(slide7, "Rohan Salkar", "40s",
        "Set the stage for the frontend, user experience, and security section.",
        "Thank you. In this first technical section, Aarti and I will walk you through the client tier, user experience, and security architecture. "
        "I will cover the React 18 Single Page Application, our MoonRow design system, responsive layouts, the dual-pane agent workbench, and AI tone polishing. "
        "Aarti will then demonstrate our security hardening, stateless JWT authentication, and role-based access control.")

    # --------------------------------------------------------------------------
    # SLIDE 8: Frontend Architecture & MoonRow Design System (Rohan Salkar)
    # [EMBEDDED LIVE SCREENSHOTS: dashboard_live.png & dashboard_light_live.png]
    # --------------------------------------------------------------------------
    slide8 = create_base_slide(prs, "Frontend Architecture", "React 18 Architecture & MoonRow Design System", 
                              "Sub-second responsiveness, WCAG 2.1 AA accessibility, and zero-layout-shift Dark/Light theming.", 
                              "Rohan Salkar", "Frontend & UI/UX Lead", "08 / 25")

    # Left Container: Tech Stack Details
    add_card(slide8, 0.8, 1.85, 4.5, 4.9, "React 18 + Tailwind MoonRow", "Sub-second SPA Architecture", border_color=COLOR_BLUE)
    add_bullet_list(slide8, 1.0, 2.5, 4.1, 4.0, [
        ("React 18 + Vite 5", "Bundles 1,581 modules in 8.34s; lean 263 kB total bundle (87 kB gzipped)."),
        ("Zero Layout Shift Theming", "ThemeContext dynamically swaps CSS custom properties between Dark and Light mode with 0ms delay."),
        ("Global Context Hierarchy", "AuthContext manages JWT sessions; ToastContext handles non-blocking toast alerts."),
        ("Offline Mock Fallback Layer", "Centralized Axios client in api.js includes graceful fallback data if backend is offline."),
        ("WCAG 2.1 AA Compliance", "Guarantees 4.5:1 text contrast ratios across all buttons, pills, and cards.")
    ], font_size=10.0, space_before=5)

    # Right Container: Side-by-Side Screenshots (Dark Mode vs Light Mode)
    add_card(slide8, 5.5, 1.85, 7.033, 4.9, "Live Production: Dark Theme vs Light Theme (Render)", "Instant theme switching with zero layout shift", border_color=COLOR_CYAN)
    dark_img = "screenshots/dashboard_live.png"
    light_img = "screenshots/dashboard_light_live.png"
    add_image_card(slide8, dark_img, 5.65, 2.5, 3.3, 3.8, caption="Live Dark Theme (MoonRow Slate)", border_color=BORDER_CYAN)
    add_image_card(slide8, light_img, 9.1, 2.5, 3.3, 3.8, caption="Live Light Theme (High Contrast)", border_color=BORDER_CYAN)

    set_speaker_notes(slide8, "Rohan Salkar", "50s",
        "Demonstrate the frontend performance, design system, and live Dark/Light theme switching.",
        "As Frontend & UI/UX Lead, I designed the interface with the speed and polish of modern tools like Linear and Stripe. "
        "We chose React 18 with Vite, which achieves an ultra-lean 263 kB bundle that builds in 8.3 seconds. "
        "On the right, you can see live screenshots taken directly from our Render deployment comparing our Dark Mode and Light Mode! "
        "Our Tailwind MoonRow design system uses semantic CSS tokens, allowing instant theme toggling with zero layout shift, while strictly enforcing WCAG 2.1 AA contrast compliance.")

    # --------------------------------------------------------------------------
    # SLIDE 9: Agent Workbench: Dual-Pane Operational Interface (Rohan Salkar)
    # [EMBEDDED LIVE SCREENSHOT: agent_workbench_live.png]
    # --------------------------------------------------------------------------
    slide9 = create_base_slide(prs, "Agent Workbench UI", "The Agent Workbench: Dual-Pane Operational Interface", 
                              "Empowering support specialists with live context, sentiment telemetry, and dynamic checklists.", 
                              "Rohan Salkar", "Frontend & UI/UX Lead", "09 / 25")

    # Left Container: Operational Details
    add_card(slide9, 0.8, 1.85, 4.7, 4.9, "Dual-Pane Layout & Safety Rails", "Operational clarity with visual isolation", border_color=COLOR_BLUE)
    add_bullet_list(slide9, 1.0, 2.5, 4.3, 4.0, [
        ("Chronological Message Stream", "Displays customer messages and agent replies with relative timestamps and status badges."),
        ("🔒 Isolated Internal Staff Notes", "Staff-only notes styled with distinct amber borders, strictly hidden from customers to prevent accidental leaks."),
        ("1-Click Mode Toggle", "Seamlessly toggle between Public Customer Reply and Private Staff Note with keyboard shortcuts."),
        ("AI Decision Drawer", "Renders customer sentiment, patience score, predicted resolution time, and category classification."),
        ("Interactive Diagnostic Checklists", "Dynamic 3–5 step troubleshooting checkboxes persist status directly to PostgreSQL via PATCH API.")
    ], font_size=10.0, space_before=5)

    # Right Container: High-Res Live Screenshot
    add_card(slide9, 5.7, 1.85, 6.833, 4.9, "Live Production: Agent Workbench & AI Drawer", "Live view from https://supportsense-frontend.onrender.com", border_color=COLOR_CYAN)
    workbench_img = "screenshots/agent_workbench_live.png"
    add_image_card(slide9, workbench_img, 5.85, 2.5, 6.533, 3.85, caption="Live Production: Dual-Pane Agent Workbench with AI Decision Drawer (Render Deployed)", border_color=BORDER_CYAN)

    set_speaker_notes(slide9, "Rohan Salkar", "50s",
        "Walk the client through the daily agent workspace and live decision drawer.",
        "This slide showcases where support agents spend their day: the Dual-Pane Agent Workbench. "
        "On the left, agents view customer communications with strict visual isolation between public customer messages and private internal staff notes, preventing accidental leaks. "
        "On the right is our actual live production screenshot from Render! "
        "The AI Decision Drawer delivers real-time customer mood pills, patience scores, resolution estimates, and interactive troubleshooting checkboxes that save directly to the database.")

    # --------------------------------------------------------------------------
    # SLIDE 10: Real-Time Deflection & 1-Click Tone Polisher (Rohan Salkar)
    # [EMBEDDED LIVE SCREENSHOTS: faq_deflection_live.png & tone_polisher_live.png]
    # --------------------------------------------------------------------------
    slide10 = create_base_slide(prs, "AI-Powered UI Tools", "Real-Time FAQ Deflection & 1-Click Tone Polisher", 
                               "Eliminating 35% of repetitive tickets and polishing agent drafts across 4 communication styles.", 
                               "Rohan Salkar", "Frontend & UI/UX Lead", "10 / 25")

    # Left Container: FAQ Deflection + Screenshot
    add_card(slide10, 0.8, 1.85, 5.75, 4.9, "1. Real-Time FAQ Deflection (35% Deflection)", "Debounced Knowledge Base search during ticket creation", border_color=COLOR_CYAN)
    faq_img = "screenshots/faq_deflection_live.png"
    add_image_card(slide10, faq_img, 0.95, 2.5, 5.45, 2.65, caption="Live Production: FAQ Deflection Panel during Ticket Creation", border_color=BORDER_CYAN)
    add_bullet_list(slide10, 1.0, 5.45, 5.35, 1.15, [
        ("300ms Debounced Scanner", "Matches KB articles as the customer types their issue title."),
        ("Instant Self-Service", "Customers resolve problems in 1 click without submitting tickets.")
    ], font_size=9.5, space_before=2)

    # Right Container: 1-Click Tone Polisher + Screenshot
    add_card(slide10, 6.75, 1.85, 5.75, 4.9, "2. AI 1-Click Tone Polishing Modals", "Empathetic, Concise, Formal & Technical styles", border_color=COLOR_AMBER)
    tone_img = "screenshots/tone_polisher_live.png"
    add_image_card(slide10, tone_img, 6.9, 2.5, 5.45, 2.65, caption="Live Production: 1-Click Tone Polisher bar in Ticket Detail", border_color=BORDER_AMBER)
    add_bullet_list(slide10, 6.95, 5.45, 5.35, 1.15, [
        ("4 Enterprise Tones", "Rewrites rough drafts into Empathetic, Concise, Formal, or Technical styles."),
        ("3-Variation Cycling", "Agents click repeatedly to cycle variations (v1, v2, v3) with anti-nesting rules.")
    ], font_size=9.5, space_before=2)

    set_speaker_notes(slide10, "Rohan Salkar", "50s",
        "Demonstrate how deflection saves costs and how tone polishing improves customer satisfaction.",
        "Here we show two customer and agent-facing AI tools in live production. "
        "On the left is our Real-Time FAQ Deflection panel. When a customer types 'Cannot download EU VAT invoice', our debounced search scans verified documentation and shows instant answers, deflecting 35% of tickets before submission! "
        "On the right is our 1-Click Tone Polisher. Busy agents can type rough notes, click 'Empathetic' or 'Concise TL;DR', and cycle through three polished variations with anti-nesting greeting rules. "
        "Now, Aarti Singh will present Security Hardening and Role-Based Access Control.")

    # --------------------------------------------------------------------------
    # SLIDE 11: Security Hardening & JWT Architecture (Aarti Singh)
    # [EMBEDDED LIVE SCREENSHOT: login_live.png]
    # --------------------------------------------------------------------------
    slide11 = create_base_slide(prs, "Security & Authentication", "Security Hardening: Stateless JWT & Multi-Role Auth", 
                               "Zero-trust credential verification, bcrypt password hashing, and brute-force protection.", 
                               "Aarti Singh", "DevOps, QA & Doc Lead", "11 / 25")

    # Left Container: Security Guardrails
    add_card(slide11, 0.8, 1.85, 5.5, 4.9, "Stateless JWT Lifecycle & Guardrails", "Enterprise authentication pipeline", border_color=COLOR_PURPLE)
    add_bullet_list(slide11, 1.0, 2.5, 5.1, 4.0, [
        ("1-Hour Stateless JWT Tokens", "Cryptographically signed Bearer tokens minimize hijack exposure windows."),
        ("Bcrypt Password Hashing (10 Rounds)", "Zero plaintext credentials; resistant to dictionary and rainbow table attacks."),
        ("Rate Limiting Protection", "express-rate-limit caps requests to 100 per 15 minutes per IP to defeat brute-force attacks."),
        ("Privilege Escalation Prevention", "Public self-registration strictly forces role='CUSTOMER'; Agent/Admin roles require authorization."),
        ("Axios Interceptor Pipeline", "Automatically injects Authorization headers and redirects to /login on HTTP 401 Unauthorized.")
    ], font_size=10.0, space_before=5)

    # Right Container: Live Screenshot of Login Portal
    add_card(slide11, 6.5, 1.85, 6.033, 4.9, "Live Production: Authentication Portal (Render)", "Secure role selection & JWT session initiation", border_color=COLOR_CYAN)
    login_img = "screenshots/login_live.png"
    add_image_card(slide11, login_img, 6.65, 2.5, 5.733, 3.85, caption="Live Production: SupportSense AI Multi-Role Authentication Portal (LoginPage.jsx)", border_color=BORDER_CYAN)

    set_speaker_notes(slide11, "Aarti Singh", "45s",
        "Explain our security hardening, JWT token architecture, and live login authentication portal.",
        "Thank you, Rohan. As DevOps, QA & Documentation Lead, my role was securing the ecosystem against OWASP vulnerabilities. "
        "We implemented stateless JSON Web Token authentication with 1-hour expiration, backed by bcrypt password hashing with 10 salt rounds. "
        "On the right, you can see our live production login screen on Render! "
        "Our registration endpoint strictly sanitizes payloads so external users cannot escalate privileges to Agent or Admin. "
        "Combined with express rate-limiting, CORS origin whitelisting, and Helmet headers, our authentication layer is enterprise-hardened.")

    # --------------------------------------------------------------------------
    # SLIDE 12: Role-Based Access Control (RBAC) & Test Personas (Aarti Singh)
    # --------------------------------------------------------------------------
    slide12 = create_base_slide(prs, "Access Control & Governance", "Role-Based Access Control (RBAC) & 9 Test Personas", 
                               "Multi-department access matrix with 1-click persona testing for client evaluations.", 
                               "Aarti Singh", "DevOps, QA & Doc Lead", "12 / 25")

    rbac_headers = ["User Role", "Department Assignment", "Queue Access Level", "Internal Notes", "Administrative Rights"]
    rbac_data = [
        ["CUSTOMER", "Customer Portal", "Own submitted tickets only", "Hidden (Blocked)", "Self-service submission only"],
        ["AGENT (Tech)", "Technical Support", "Tech Support queue + Unassigned", "Read & Write", "Checklist toggle, Tone Polish, Forwarding"],
        ["AGENT (Billing)", "Finance & Billing", "Billing & Invoices queue", "Read & Write", "Checklist toggle, Tone Polish, Forwarding"],
        ["AGENT (Identity)", "Identity & Access", "SSO, MFA & Account Security", "Read & Write", "Checklist toggle, Tone Polish, Forwarding"],
        ["AGENT (API)", "API Platform Team", "Webhooks, SDKs & Gateway errors", "Read & Write", "Checklist toggle, Tone Polish, Forwarding"],
        ["ADMIN", "IT Operations & Admin", "Global access (All 4 Departments)", "Read & Write", "User role updates, Weekly insights, System logs"]
    ]
    add_table_styled(slide12, 0.8, 1.85, 11.733, 2.65, rbac_headers, rbac_data, col_widths=[1.8, 2.2, 3.2, 1.8, 2.733])

    add_card(slide12, 0.8, 4.75, 11.733, 2.0, "1-Click Persona Testing Bar: Instant Client Demonstrations", "SSAI-203 Zero-friction evaluation framework")
    add_bullet_list(slide12, 1.0, 5.35, 11.3, 1.25, [
        ("Pre-Seeded Multi-Department Accounts", "Includes Sarah (Customer), Alex (Tech Lead), Elena (Billing), Marcus (Security), Liam (API), and Administrator."),
        ("Universal Demo Credential", "All demo accounts share the password 'Password123!', pre-populated in database seeds (001_seed_data.sql)."),
        ("Instant Role Switcher", "Clicking any persona button automatically logs in as that user and re-renders the UI with that role's exact permissions.")
    ], font_size=10.0, space_before=4)

    set_speaker_notes(slide12, "Aarti Singh", "45s",
        "Demonstrate strict department data segregation and how clients can test personas in 1 click.",
        "In enterprise support, strict data segregation is critical. We established a granular Role-Based Access Control matrix across three roles and four departments. "
        "Customers can only access their own tickets and can never view internal staff notes. "
        "Agents are organized into Technical Support, Finance & Billing, Identity & Access, and API Platform. "
        "To make evaluating our system effortless for clients, we built the 1-Click Persona Testing Bar. "
        "Stakeholders can click a single button to switch between Sarah the Customer, Alex the Tech Agent, or Admin without retyping passwords!")

    # --------------------------------------------------------------------------
    # SLIDE 13: Conversational AI Concierge Widgets (Yash Sanikop)
    # [EMBEDDED LIVE SCREENSHOTS: ai_concierge_live.png & billing_ticket_live.png]
    # --------------------------------------------------------------------------
    slide13 = create_base_slide(prs, "Customer Experience & AI", "Conversational AI Concierge & Duplicate Interception", 
                               "Transforming natural conversational input into formal enterprise ticket specifications.", 
                               "Yash Sanikop", "Frontend & AI Lead (23CO76)", "13 / 25")

    # Left Container: Concierge Widget + Live Screenshot
    add_card(slide13, 0.8, 1.85, 5.75, 4.9, "1. Conversational AI Concierge Widget", "SSAI-406 Natural language ticket crafter", border_color=COLOR_AMBER)
    concierge_img = "screenshots/ai_concierge_live.png"
    add_image_card(slide13, concierge_img, 0.95, 2.5, 5.45, 2.7, caption="Live Production: Conversational AI Concierge Chatbot actively answering inquiry", border_color=BORDER_CYAN)
    add_bullet_list(slide13, 1.0, 5.45, 5.35, 1.15, [
        ("Conversational Intake", "Users describe issues casually; AI conducts empathetic clarification dialogue."),
        ("1-Click Ticket Dispatch", "Compiles formal specs (Summary, Symptoms, Impact) into atomic DB queue.")
    ], font_size=9.5, space_before=2)

    # Right Container: Duplicate Ticket Interception + Live Screenshot
    add_card(slide13, 6.75, 1.85, 5.75, 4.9, "2. Duplicate Ticket Interception (HTTP 409)", "SSAI-409 Intercepting duplicates with past verified notes", border_color=COLOR_ROSE)
    billing_img = "screenshots/billing_ticket_live.png"
    add_image_card(slide13, billing_img, 6.9, 2.5, 5.45, 2.7, caption="Live Production: Verified Resolution Notes presented upon duplicate ticket match", border_color=BORDER_CYAN)
    add_bullet_list(slide13, 6.95, 5.45, 5.35, 1.15, [
        ("Proactive Past Resolution Match", "Returns HTTP 409 with verified past resolution steps before creating duplicates."),
        ("Same-User Thread Linking", "Follow-ups automatically attach to existing active threads (linked_ticket_id).")
    ], font_size=9.5, space_before=2)

    set_speaker_notes(slide13, "Yash Sanikop", "50s",
        "Demonstrate the AI Concierge chatbot widget and duplicate ticket interception in production.",
        "As Frontend & AI Lead (Student Intern Yash Sanikop, Roll No. 23CO76), I engineered the bridge connecting user-facing widgets with our Gemini AI pipeline. "
        "Non-technical customers often struggle to describe technical bugs. On the left is our live screenshot of the AI Concierge widget! "
        "A user describes their issue in everyday language; the Concierge asks clarifying questions and compiles a formal ticket ready for 1-click dispatch. "
        "On the right, we show Duplicate Ticket Interception. If a customer tries to submit a ticket for an issue that was already solved for them, our backend intercepts it with an HTTP 409 response, displays the previous verified resolution steps, and prevents queue bloat!")

    # --------------------------------------------------------------------------
    # SLIDE 14: Executive Operations & Ticket Queue (Shrujan Mitbavkar)
    # [EMBEDDED LIVE SCREENSHOTS: dashboard_live.png & tickets_queue_live.png]
    # --------------------------------------------------------------------------
    slide14 = create_base_slide(prs, "Operations & Analytics", "Executive Operations Dashboard & Live Ticket Queue", 
                               "Admin command center powered by real-time KPI metrics and PostgreSQL-backed queue management.", 
                               "Shrujan Mitbavkar", "Backend & Database Lead", "14 / 25")

    # Left: Live Dashboard Screenshot
    add_card(slide14, 0.8, 1.85, 5.75, 4.9, "Executive KPI Operations Dashboard", "Live status breakdown donuts & priority distribution", border_color=COLOR_CYAN)
    dash_img = "screenshots/dashboard_live.png"
    add_image_card(slide14, dash_img, 0.95, 2.5, 5.45, 2.7, caption="Live Production: Executive Operations Dashboard on Render (DashboardPage.jsx)", border_color=BORDER_CYAN)
    add_bullet_list(slide14, 1.0, 5.45, 5.35, 1.15, [
        ("Real-Time KPI Cards", "Tracks Total Tickets, High Priority, Open, and Pending tickets instantly."),
        ("SLA Health Monitoring", "98.4% SLA compliance rate across all 4 department queues.")
    ], font_size=9.5, space_before=2)

    # Right: Live Ticket Queue Screenshot
    add_card(slide14, 6.75, 1.85, 5.75, 4.9, "Live Ticket Queue Table & Multi-Filtering", "Real-time query execution with compound B-tree indexes", border_color=COLOR_GREEN)
    queue_img = "screenshots/tickets_queue_live.png"
    add_image_card(slide14, queue_img, 6.9, 2.5, 5.45, 2.7, caption="Live Production: Ticket Queue with status pills & priority filters (TicketsPage.jsx)", border_color=BORDER_GREEN)
    add_bullet_list(slide14, 6.95, 5.45, 5.35, 1.15, [
        ("Multi-Criteria Filtering", "Instant filtering across status, priority, department, and assigned agent."),
        ("Sub-50ms Query Performance", "Compound indexes (status, priority) guarantee instant table pagination.")
    ], font_size=9.5, space_before=2)

    set_speaker_notes(slide14, "Shrujan Mitbavkar", "45s",
        "Present the live operations dashboard and ticket queue table to the client.",
        "As Backend & Database Lead, I ensured our API and database seamlessly feed the executive dashboards. "
        "On the left is our live production screenshot from Render showing real-time queue health, priority distribution, and status breakdown donuts. "
        "On the right is our live Ticket Queue Table. Support managers can filter by department, priority, and status with sub-50 millisecond query execution, powered by compound B-tree indexes on PostgreSQL.")

    # --------------------------------------------------------------------------
    # SLIDE 15: Section Transition 2 — Backend Core, Database & AI Microservice
    # --------------------------------------------------------------------------
    slide15 = create_base_slide(prs, "Technical Deep Dive", "Part 2: Backend Core, PostgreSQL, AI Microservice & Cloud Ops", 
                              "Presented by Shrujan Mitbavkar (Backend & DB Lead) & Yash Sanikop (Frontend & AI Lead)", 
                              "Shrujan Mitbavkar & Yash Sanikop", "Technical Transition", "15 / 25")

    add_card(slide15, 0.8, 1.95, 5.75, 4.7, "Shrujan Mitbavkar — Backend & DB Lead", "Express REST Controllers, PostgreSQL & Transactions", border_color=COLOR_GREEN, border_width=2)
    add_bullet_list(slide15, 1.1, 2.7, 5.15, 3.6, [
        ("Express REST Controllers", "High-throughput API controllers managing ticket lifecycle, pagination, and filters."),
        ("PostgreSQL Relational Schema", "Third Normal Form (3NF) design across 6 normalized entities with B-tree indexing."),
        ("Atomic Transactions (SCRUM-112)", "Guaranteed all-or-nothing rollback on ticket and initial message creation."),
        ("Status State Machine (SCRUM-111)", "Strict lifecycle progression enforcing valid progression and rejecting illegal skips."),
        ("Supabase Cloud Connection Pooling", "Managed PgBouncer pool (max 20 clients) with SSL encryption and < 50ms queries.")
    ], font_size=10.5, space_before=7)

    add_card(slide15, 6.75, 1.95, 5.75, 4.7, "Yash Sanikop — Frontend & AI Lead", "FastAPI Microservice, Gemini 1.5 Flash SDK & Caching", border_color=COLOR_AMBER, border_width=2)
    add_bullet_list(slide15, 7.05, 2.7, 5.15, 3.6, [
        ("FastAPI AI Microservice", "Google Gemini 1.5 Flash SDK integration with Pydantic v2 structured JSON validation."),
        ("Model Instance Pooling", "Pre-instantiates GenerativeModel instances eliminating garbage collection overhead."),
        ("SHA-256 In-Memory TTL Caching", "Caches identical ticket analyses, dropping repeated latency from 1,800ms to 12ms."),
        ("Prompt Engineering Pipeline", "Authored specialized ~40-line persona system prompts and anti-gaming urgency filters."),
        ("Dataset Grounding & Benchmarks", "Calibrated against historical Kaggle and Hugging Face customer support corpora.")
    ], font_size=10.5, space_before=7)

    set_speaker_notes(slide15, "Shrujan Mitbavkar", "40s",
        "Set the stage for backend architecture, database integrity, and the AI microservice.",
        "Thank you, Aarti. In this second half of our presentation, Yash and I will take you deep into the engine room: our backend, database, and AI microservice. "
        "I will explain our Node.js and Express REST architecture, our normalized PostgreSQL schema, atomic SQL transactions, and Supabase cloud pooling. "
        "Yash will then detail our Python FastAPI AI microservice, Gemini 1.5 Flash SDK integration, model instance pooling, SHA-256 TTL caching, and prompt engineering pipeline.")

    # --------------------------------------------------------------------------
    # SLIDE 16: Core Backend Engine: Node.js & Express (Shrujan Mitbavkar)
    # --------------------------------------------------------------------------
    slide16 = create_base_slide(prs, "Backend Architecture", "Core REST Engine: Express REST Controllers & Architecture", 
                               "High-throughput API layer orchestrating business logic, security guards, and AI proxy routing.", 
                               "Shrujan Mitbavkar", "Backend & Database Lead", "16 / 25")

    add_stat_card(slide16, 0.8, 1.85, 2.75, 1.6, "< 200ms", "P95 REST Latency", "Standard CRUD endpoint response time under normal load", COLOR_GREEN)
    add_stat_card(slide16, 3.75, 1.85, 2.75, 1.6, "5 Seconds", "Circuit Breaker Timeout", "AbortSignal.timeout(5000) prevents hung upstream AI requests", COLOR_AMBER)
    add_stat_card(slide16, 6.7, 1.85, 2.75, 1.6, "100%", "Async Error Handling", "Centralized errorHandler middleware guarantees 0 unhandled crashes", COLOR_BLUE)
    add_stat_card(slide16, 9.65, 1.85, 2.75, 1.6, "10/10", "Jest Integration Specs", "100% pass rate across authentication and ticket routing suites", COLOR_CYAN)

    add_card(slide16, 0.8, 3.7, 5.5, 3.1, "Express Controllers & Decoupled AI Proxy", "High-throughput ticket processing", border_color=COLOR_GREEN)
    add_bullet_list(slide16, 1.0, 4.35, 5.1, 2.3, [
        ("Internal AI Delegation", "Backend proxies triage and tone requests to FastAPI over internal HTTP with 5s timeout."),
        ("Fast-Fail Fallback Mode", "Returns deterministic fallback metadata if AI times out, preventing ticket workflow freezes."),
        ("Multi-Criteria Controller", "ticketController.js handles status/priority filtering, pagination, and assignment in < 50ms."),
        ("Department Forwarding", "Enables inter-department ticket handoffs with auto-logged internal notes documenting reasons.")
    ], font_size=9.8, space_before=3)

    add_card(slide16, 6.5, 3.7, 6.033, 3.1, "Live Production: Express REST Ticket Feed", "Real-time query execution from PostgreSQL (Render)", border_color=COLOR_CYAN)
    queue_img = "screenshots/tickets_queue_live.png"
    add_image_card(slide16, queue_img, 6.65, 4.3, 5.733, 2.35, caption="Live Production: Ticket Queue Table powered by Express REST & PostgreSQL (TicketsPage.jsx)", border_color=BORDER_CYAN)

    set_speaker_notes(slide16, "Shrujan Mitbavkar", "45s",
        "Explain the Express backend architecture, latency, and circuit breaker patterns.",
        "As Backend Lead, my mission was constructing a high-throughput Node.js and Express REST engine. "
        "Our P95 latency is under 200 milliseconds. All AI interactions are decoupled through our aiService proxy with a strict 5-second AbortSignal timeout. "
        "If the upstream LLM ever delays, our fast-fail circuit breaker returns safe fallback data so tickets are created without interruption. "
        "Our controllers strictly enforce business rules, audit logging, and inter-department forwarding.")

    # --------------------------------------------------------------------------
    # SLIDE 17: Database Design & PostgreSQL Schema (Shrujan Mitbavkar)
    # --------------------------------------------------------------------------
    slide17 = create_base_slide(prs, "Database Architecture", "PostgreSQL 15 Relational Schema & Supabase Connection Pooling", 
                               "Third Normal Form (3NF) relational design with Supabase connection pooling and B-tree indexing.", 
                               "Shrujan Mitbavkar", "Backend & Database Lead", "17 / 25")

    schema_headers = ["Table Name", "Primary Key", "Foreign Keys", "Key Attributes & Types", "Index Strategy"]
    schema_data = [
        ["users", "uuid (PK)", "None", "name, email (UK), password_hash, role, department", "Unique B-tree on email"],
        ["tickets", "uuid (PK)", "customer_id, assigned_agent_id, linked_ticket_id", "ticket_number (UK), title, status, priority, category", "Compound (status, priority), customer_id"],
        ["ticket_messages", "uuid (PK)", "ticket_id (FK), sender_id (FK)", "message_body (text), is_internal_note (boolean)", "B-tree on (ticket_id, created_at)"],
        ["ai_metadata", "uuid (PK)", "ticket_id (FK, UNIQUE)", "customer_mood, patience_score, predicted_resolution_time, confidence", "Unique B-tree on ticket_id"],
        ["agent_checklists", "uuid (PK)", "ticket_id (FK)", "item_text (text), is_completed (boolean)", "B-tree on ticket_id"],
        ["weekly_insights", "uuid (PK)", "None", "week_identifier, top_issues (JSONB), common_mistakes (JSONB)", "B-tree on week_identifier"]
    ]
    add_table_styled(slide17, 0.8, 1.85, 11.733, 2.7, schema_headers, schema_data, col_widths=[1.8, 1.2, 2.6, 3.8, 2.333])

    add_card(slide17, 0.8, 4.8, 5.75, 2.0, "Supabase Cloud Connection Pooling", "High-burst query stability")
    add_bullet_list(slide17, 1.0, 5.4, 5.35, 1.3, [
        ("Managed PgBouncer Pool", "Configured with max 20 client connections, preventing pool exhaustion under sudden traffic spikes."),
        ("SSL Encryption Enforced", "All traffic encrypted over SSL (rejectUnauthorized: false for Supabase certificates)."),
        ("Sub-50ms Query Execution", "Compound B-tree indexes guarantee fast queue rendering across thousands of tickets.")
    ], font_size=10, space_before=3)

    add_card(slide17, 6.75, 4.8, 5.75, 2.0, "Auto-Migration & Seed Integrity", "dbInit.js zero-configuration setup")
    add_bullet_list(slide17, 6.95, 5.4, 5.35, 1.3, [
        ("Automated Schema Migration", "dbInit.js executes on server startup, idempotently applying migrations and creating tables."),
        ("Production-Ready Seed Data", "001_seed_data.sql seeds realistic multi-turn conversations across all 4 departments."),
        ("JSONB Extensibility", "Uses PostgreSQL JSONB for flexible weekly AI learning insights and recurring issue patterns.")
    ], font_size=10, space_before=3)

    set_speaker_notes(slide17, "Shrujan Mitbavkar", "45s",
        "Explain the 3NF schema, Supabase cloud pooling, and compound indexes.",
        "Turning to our database tier: we implemented a normalized PostgreSQL 15 schema adhering strictly to Third Normal Form. "
        "Our schema features six core entities, including tickets, threaded messages, AI metadata, checklists, and weekly insights. "
        "We migrated our database to Supabase Cloud with PgBouncer connection pooling, enforcing SSL encryption and sub-50ms query execution through compound B-tree indexes. "
        "Our automated dbInit.js script ensures zero-configuration schema creation upon boot.")

    # --------------------------------------------------------------------------
    # SLIDE 18: Mission-Critical Data Integrity & Concurrency (Shrujan Mitbavkar)
    # --------------------------------------------------------------------------
    slide18 = create_base_slide(prs, "Data Integrity & Concurrency", "Mission-Critical Integrity: Atomic Transactions & State Machines", 
                               "Empirical proof of zero database divergence, concurrency lock-safety, and status validation.", 
                               "Shrujan Mitbavkar", "Backend & Database Lead", "18 / 25")

    add_card(slide18, 0.8, 1.85, 3.7, 4.9, "1. Atomic Transactions (SCRUM-112)", "createTicketWithInitialMessage", border_color=COLOR_GREEN)
    add_bullet_list(slide18, 1.0, 2.55, 3.3, 3.9, [
        ("Atomic Multi-Statement Commit", "Ticket insertion and initial message execute within a single PostgreSQL transaction (BEGIN / COMMIT / ROLLBACK)."),
        ("Zero Orphaned Tickets", "If initial message insertion fails, the transaction rolls back 100%, leaving no corrupt ticket rows in the database."),
        ("Verified Test Proof", "ticket-transaction.test.js simulates sender foreign key failures and verifies 100% clean rollback (8/8 specs passing).")
    ], font_size=10.5, space_before=6)

    add_card(slide18, 4.8, 1.85, 3.7, 4.9, "2. Status State Machine (SCRUM-111)", "Enforced Lifecycle Progression", border_color=COLOR_BLUE)
    add_bullet_list(slide18, 5.0, 2.55, 3.3, 3.9, [
        ("Strict Transition Rules", "ALLOWED_STATUS_TRANSITIONS: OPEN ➔ IN_PROGRESS ➔ RESOLVED ➔ CLOSED. Reopening is permitted only from RESOLVED to OPEN."),
        ("Illegal Skip Rejection", "Any attempt to jump illegally (e.g. OPEN directly to CLOSED) is rejected with HTTP 400 Bad Request."),
        ("Reopened Trigger Worker", "Transitioning from RESOLVED to OPEN asynchronously invokes the AI timeline summarizer worker.")
    ], font_size=10.5, space_before=6)

    add_card(slide18, 8.8, 1.85, 3.7, 4.9, "3. Concurrency Stress (SCRUM-110)", "100 Parallel Submissions", border_color=COLOR_PURPLE)
    add_bullet_list(slide18, 9.0, 2.55, 3.3, 3.9, [
        ("Sequence-Safe Ticket Numbers", "Utilizes PostgreSQL sequence ticket_number_seq to guarantee unique numbers (T-1001, T-1002)."),
        ("Zero Race Conditions", "ticket-concurrency.test.js dispatches 100 simultaneous parallel ticket submissions via Promise.allSettled."),
        ("Zero Sequence Collisions", "Maintains 100% connection pool stability with 0 deadlock errors and 100% unique ticket numbers.")
    ], font_size=10.5, space_before=6)

    set_speaker_notes(slide18, "Shrujan Mitbavkar", "50s",
        "Highlight our atomic transactions, status state machine, and concurrency stress test.",
        "Slide 18 represents our greatest backend engineering achievement: bulletproof data integrity. "
        "Under SCRUM-112, we wrapped ticket creation and initial message insertion into an atomic SQL transaction. If a network blip interrupts message insertion, the entire ticket rolls back—guaranteeing zero orphaned records. "
        "Under SCRUM-111, our status transition state machine strictly enforces valid ticket lifecycle progression. "
        "And under SCRUM-110, we subjected our database to 100 concurrent parallel submissions; our sequence generator produced 100% unique ticket numbers with zero race conditions. "
        "I will now pass the floor to Yash Sanikop to present our AI Microservice.")

    # --------------------------------------------------------------------------
    # SLIDE 19: AI Microservice: FastAPI & Gemini 1.5 Flash SDK (Yash Sanikop)
    # --------------------------------------------------------------------------
    slide19 = create_base_slide(prs, "AI Microservice & Caching", "FastAPI Microservice, Gemini 1.5 Flash SDK & Model Pooling", 
                               "High-throughput LLM pipeline with Pydantic validation and SHA-256 TTL caching.", 
                               "Yash Sanikop", "Frontend & AI Lead (23CO76)", "19 / 25")

    add_stat_card(slide19, 0.8, 1.85, 2.75, 1.6, "12 ms", "Cached AI Latency", "SHA-256 TTL cache intercepts repeated queries in 12ms vs 1,800ms", COLOR_AMBER)
    add_stat_card(slide19, 3.75, 1.85, 2.75, 1.6, "420 ms", "Live Inference Latency", "Google Gemini 1.5 Flash delivers complete structured triage", COLOR_GREEN)
    add_stat_card(slide19, 6.7, 1.85, 2.75, 1.6, "100%", "Schema Adherence", "Pydantic v2 JSON schemas enforced via response_mime_type", COLOR_BLUE)
    add_stat_card(slide19, 9.65, 1.85, 2.75, 1.6, "0 Downtime", "Graceful Fallback Mode", "Deterministic regex fallbacks guarantee 100% operational uptime", COLOR_CYAN)

    add_card(slide19, 0.8, 3.7, 5.75, 3.1, "Model Instance Pooling & SHA-256 TTL Caching", "gemini_client.py high-performance architecture")
    add_bullet_list(slide19, 1.0, 4.35, 5.3, 2.3, [
        ("Model Instance Pooling (_MODEL_CACHE)", "Pre-instantiates and reuses GenerativeModel instances across concurrent async coroutines, eliminating Garbage Collection overhead."),
        ("SHA-256 Hashed Response Cache", "Caches identical ticket bodies with a 300-second TTL. Drops repeated concierge or triage queries from 1.8 seconds down to 12 milliseconds."),
        ("Strict JSON Enforcement", "Uses Gemini's native 'application/json' output mode to prevent markdown backtick wrapping and guarantee parseable payloads.")
    ])

    add_card(slide19, 6.75, 3.7, 5.75, 3.1, "Resilient Fallback Engine & Pytest Validation", "Deterministic reliability when offline")
    add_bullet_list(slide19, 6.95, 4.35, 5.3, 2.3, [
        ("Zero-Downtime Guarantee", "If the GEMINI_API_KEY is unset, rate-limited, or network unreachable, regex-based deterministic fallbacks kick in instantly."),
        ("Bounded Confidence Scoring", "Every AI response returns an overall_confidence score (0.00 to 1.00). If confidence < 0.60, the UI warns agents to verify advice."),
        ("Pytest Test Coverage", "test_ai_features.py and test_triage.py validate 100% of triage, auto-reply, tone-polish, and fallback functions (28/28 passing).")
    ])

    set_speaker_notes(slide19, "Yash Sanikop", "50s",
        "Explain our FastAPI microservice, Gemini 1.5 Flash SDK, model pooling, and 12ms caching.",
        "Thank you, Shrujan. As Frontend & AI Lead (Student Intern Yash Sanikop, Roll No. 23CO76), I architected our Python FastAPI microservice and integrated the Google Gemini 1.5 Flash SDK. "
        "We chose Google Gemini 1.5 Flash for its sub-second speed and low token cost. "
        "Directly instantiating LLM clients on every request causes memory thrashing, so I implemented GenerativeModel instance pooling and an SHA-256 in-memory TTL response cache. "
        "This drops repeated queries from 1,800 milliseconds down to just 12 milliseconds! "
        "All outputs are validated against strict Pydantic v2 schemas, and our deterministic regex fallback handler guarantees that even if the external LLM is offline, our support platform never crashes.")

    # --------------------------------------------------------------------------
    # SLIDE 20: Prompt Engineering & Ground-Truth Knowledge Base (Yash Sanikop)
    # [EMBEDDED LIVE SCREENSHOT: knowledge_base_live.png]
    # --------------------------------------------------------------------------
    slide20 = create_base_slide(prs, "Prompt Engineering & Datasets", "Prompt Engineering & Ground-Truth Knowledge Base", 
                               "Grounding LLM reasoning in verified Knowledge Base articles and Kaggle benchmarks.", 
                               "Yash Sanikop", "Frontend & AI Lead (23CO76)", "20 / 25")

    # Left Container: Datasets & Anti-Gaming Prompting
    add_card(slide20, 0.8, 1.85, 5.5, 4.9, "Ground-Truth Datasets & Prompt Personas", "templates.py prompt architecture", border_color=COLOR_AMBER)
    add_bullet_list(slide20, 1.0, 2.5, 5.1, 4.0, [
        ("Kaggle Customer Support Dataset", "Grounds SLA resolution durations (Billing: 1-2 days, Tech: 2-3 days) and category distributions."),
        ("Kaggle Twitter Support (TWCS)", "Calibrates corporate de-escalation patterns and empathetic customer phrasing."),
        ("8 Domain-Specific Personas", "Senior Triage Officer, Communications Stylist, Empathy Lead, and Knowledge Base Architect."),
        ("Anti-Gaming Urgency Filter", "Prompt explicitly decouples shouting ('URGENT', exclamation marks) from technical priority. Emotional distress is captured in customer_mood, while priority is determined strictly by business impact."),
        ("Structured Checklists", "Directs Gemini to generate 3–5 specific diagnostic checkboxes based on typical category workflows.")
    ], font_size=10.0, space_before=5)

    # Right Container: Live Screenshot of Knowledge Base
    add_card(slide20, 6.5, 1.85, 6.033, 4.9, "Live Production: Knowledge Base Management (Render)", "Grounded FAQ repository deflecting repetitive tickets", border_color=COLOR_CYAN)
    kb_img = "screenshots/knowledge_base_live.png"
    add_image_card(slide20, kb_img, 6.65, 2.5, 5.733, 3.85, caption="Live Production: Knowledge Base Management & Articles (KnowledgeBasePage.jsx)", border_color=BORDER_CYAN)

    set_speaker_notes(slide20, "Yash Sanikop", "50s",
        "Demonstrate how prompt engineering and knowledge base grounding eliminate hallucinations.",
        "A key innovation of SupportSense AI is that our model does not hallucinate arbitrary predictions. We ground its reasoning in verified Knowledge Base articles and open-source datasets from Kaggle and Hugging Face. "
        "On the right is our live production screenshot from Render of the Knowledge Base management portal! "
        "Furthermore, in templates.py, I authored eight specialized 40-line persona system prompts. "
        "Our Anti-Gaming Prompting explicitly separates emotion from priority: if a customer shouts 'URGENT!!!' over a minor UI color preference, the system records Frustrated in customer_mood, but keeps technical priority at LOW, preserving SLA fairness.")

    # --------------------------------------------------------------------------
    # SLIDE 21: Department Auto-Replies & Reopened Summaries (Yash Sanikop)
    # [EMBEDDED LIVE SCREENSHOTS: departments_live.png & insights_live.png]
    # --------------------------------------------------------------------------
    slide21 = create_base_slide(prs, "Automation & Summaries", "Department Automated Responses & Learning Insights", 
                               "Accelerating First Response Time while capturing weekly friction points across departments.", 
                               "Yash Sanikop", "Frontend & AI Lead (23CO76)", "21 / 25")

    # Left Container: Department Auto-Replies + LIVE SCREENSHOT
    add_card(slide21, 0.8, 1.85, 5.75, 4.9, "1. Autonomous Department Auto-Replies", "Instant confirmation & automated action triggers", border_color=COLOR_GREEN)
    depts_img = "screenshots/departments_live.png"
    add_image_card(slide21, depts_img, 0.95, 2.5, 5.45, 2.7, caption="Live Production: 4 Core Departmental Routing Policies on Render (DepartmentsPage.jsx)", border_color=BORDER_CYAN)
    add_bullet_list(slide21, 1.0, 5.45, 5.35, 1.15, [
        ("4 Department Policies", "Tech Support (80%), Billing (85%), Identity (90%), API (85%)."),
        ("Automated Diagnostics", "Dispatches instant confirmations and traces gateway logs in < 2s.")
    ], font_size=9.5, space_before=2)

    # Right Container: AI Learning Insights + LIVE SCREENSHOT
    add_card(slide21, 6.75, 1.85, 5.75, 4.9, "2. AI Learning Insights & Reopened Summaries", "Turning support tickets into organizational intelligence", border_color=COLOR_CYAN)
    insights_img = "screenshots/insights_live.png"
    add_image_card(slide21, insights_img, 6.9, 2.5, 5.45, 2.7, caption="Live Production: AI Learning Insights & weekly support trends (InsightsPage.jsx)", border_color=BORDER_CYAN)
    add_bullet_list(slide21, 6.95, 5.45, 5.35, 1.15, [
        ("Weekly Insights Aggregation", "Summarizes top recurring issues, agent mistakes, and product bugs."),
        ("Reopened Ticket Summarizer", "Async worker condenses 20 past messages into a 5-bullet TL;DR banner.")
    ], font_size=9.5, space_before=2)

    set_speaker_notes(slide21, "Yash Sanikop", "50s",
        "Demonstrate department automated policies and learning insights in live production.",
        "Slide 21 showcases two operational automations. "
        "On the left is our live production screenshot of Department Policies. Each department has defined routing policies and confidence thresholds; if qualified, it dispatches an instant confirmation message, slashing First Response Time to two minutes! "
        "On the right is our live Learning Insights page. The AI aggregates weekly support friction points and product bugs into actionable intelligence. "
        "Additionally, under SCRUM-113, our async worker condenses reopened tickets into a 5-bullet summary, saving newly assigned agents 15 minutes of re-reading time. "
        "Now, Aarti Singh will present Docker containerization and Render cloud deployment.")

    # --------------------------------------------------------------------------
    # SLIDE 22: DevOps, Docker & Render Cloud Deployment (Aarti Singh)
    # --------------------------------------------------------------------------
    slide22 = create_base_slide(prs, "DevOps & Cloud Deployment", "Docker Multi-Stage Containers, Render Blueprint & CI/CD", 
                               "Production cloud deployment on Render and Supabase with automated GitHub Actions CI/CD.", 
                               "Aarti Singh", "DevOps, QA & Doc Lead", "22 / 25")

    add_stat_card(slide22, 0.8, 1.85, 2.75, 1.6, "1 Command", "Local Docker Boot", "docker compose up -d launches all 4 tiers in under 45 seconds", COLOR_BLUE)
    add_stat_card(slide22, 3.75, 1.85, 2.75, 1.6, "1-Click", "Render Blueprint", "render.yaml provisions PostgreSQL, Express, FastAPI, and Vite SPA", COLOR_CYAN)
    add_stat_card(slide22, 6.7, 1.85, 2.75, 1.6, "100%", "CI/CD Pass Rate", "GitHub Actions validates Jest, Pytest, and Vite build on every PR", COLOR_GREEN)
    add_stat_card(slide22, 9.65, 1.85, 2.75, 1.6, "SSL Ready", "Cloud Infrastructure", "Full HTTPS encryption across all endpoints and Supabase database", COLOR_AMBER)

    add_card(slide22, 0.8, 3.7, 5.75, 3.1, "Docker Multi-Stage Containerization", "Optimized production container images")
    add_bullet_list(slide22, 1.0, 4.35, 5.3, 2.3, [
        ("Frontend Container (frontend/Dockerfile)", "Multi-stage build: compiles Vite bundle and serves static assets via Nginx Alpine (final image < 25 MB)."),
        ("Backend Container (backend/Dockerfile)", "Node.js 18 Alpine runtime with npm prune --production for minimal image footprint (140 MB)."),
        ("AI Microservice (ai-service/Dockerfile)", "Python 3.10 slim base with cached wheels and non-root execution (210 MB)."),
        ("Docker Compose (deployment/docker-compose.yml)", "Orchestrates database, backend, AI microservice, and frontend on unified bridge network.")
    ])

    add_card(slide22, 6.75, 3.7, 5.75, 3.1, "Render Blueprint Orchestration & CI/CD", "render.yaml Blueprint specification")
    add_bullet_list(slide22, 6.95, 4.35, 5.3, 2.3, [
        ("Render Blueprint (render.yaml)", "Defines production web services for Express backend, FastAPI microservice, React frontend, and managed PostgreSQL."),
        ("GitHub Actions Pipeline (.github/workflows/ci.yml)", "Spins up live postgres:15-alpine container, seeds database, and executes Jest and Pytest suites in parallel."),
        ("Zero Downtime Delivery", "Automated health checks (/health) ensure services only receive traffic after complete database initialization.")
    ])

    set_speaker_notes(slide22, "Aarti Singh", "45s",
        "Demonstrate our containerization, Render cloud deployment, and automated CI/CD pipeline.",
        "To ensure seamless client adoption and production stability, I headed our Docker containerization and Render Blueprint cloud orchestration. "
        "We built multi-stage Dockerfiles for all tiers, resulting in ultra-compact images: Nginx frontend at 25 MB, Express backend at 140 MB, and FastAPI at 210 MB. "
        "A single 'docker compose up' command boots the entire stack locally. "
        "For cloud deployment, our render.yaml Blueprint provisions all services on Render with one click, connected to Supabase PostgreSQL over SSL. "
        "Furthermore, our GitHub Actions CI/CD pipeline validates every commit by booting a test PostgreSQL container and running all unit and integration tests. "
        "Now, our entire team will rejoin for the System Architecture and Empirical Benchmarks.")

    # --------------------------------------------------------------------------
    # SLIDE 23: System Architecture Overview: Full 3-Tier Flow
    # --------------------------------------------------------------------------
    slide23 = create_base_slide(prs, "System Architecture", "End-to-End System Architecture & Component Interaction", 
                               "The complete 3-tier micro-architecture connecting clients, REST APIs, databases, and AI microservices.", 
                               "Joint Team", "System Architecture", "23 / 25")

    if os.path.exists("docs_system_architecture.png"):
        slide23.shapes.add_picture("docs_system_architecture.png", Inches(0.8), Inches(1.85), width=Inches(7.2))
    else:
        add_card(slide23, 0.8, 1.85, 7.2, 4.9, "System Architecture Diagram", "Docs System Architecture Graphic")

    add_card(slide23, 8.2, 1.85, 4.333, 4.9, "Architectural Flow Breakdown", "4 Interconnected Tiers")
    add_bullet_list(slide23, 8.45, 2.45, 3.85, 4.1, [
        ("Tier 1: Client SPA", "React 18 + Vite Single Page Application rendering dual-pane workbench, customer portal, and AI drawer."),
        ("Tier 2: Application Core", "Node.js & Express REST server managing JWT authentication, state transitions, transactions, and AI proxy routing."),
        ("Tier 3: Database Engine", "PostgreSQL 15 / Supabase Cloud storing relational tables with connection pooling and B-tree indexes."),
        ("Tier 4: AI Microservice", "Python FastAPI microservice executing role-based prompts with Google Gemini 1.5 Flash."),
        ("Data Grounding", "Kaggle historical CSVs and Hugging Face streaming datasets calibrating triage accuracy and SLAs.")
    ], font_size=10.5, space_before=6)

    set_speaker_notes(slide23, "Joint Team (Shrujan & Yash)", "45s",
        "Walk the client through the complete end-to-end request flow across all 4 tiers.",
        "This slide presents the complete system architecture diagram of SupportSense AI. "
        "The Client Tier communicates with the Express Application Tier over HTTPS REST using JWT Bearer authentication. "
        "The Express backend handles business logic, state machines, and atomic database persistence to PostgreSQL. "
        "When AI triage or decision support is needed, the backend delegates asynchronously to our Python FastAPI AI microservice, which executes specialized role-based prompts grounded in Kaggle datasets. "
        "This decoupled micro-architecture guarantees high availability, modular scaling, and zero single points of failure.")

    # --------------------------------------------------------------------------
    # SLIDE 24: Empirical Verification: Benchmarks & Analytics (Joint Team)
    # [EMBEDDED LIVE SCREENSHOT: analytics_live.png]
    # --------------------------------------------------------------------------
    slide24 = create_base_slide(prs, "Empirical Evaluation", "Empirical Proof: Benchmarks & Performance Metrics", 
                               "Rigorous data proving accuracy, latency, and test pass rates across 100 benchmark scenarios.", 
                               "Joint Team", "Empirical Evaluation", "24 / 25")

    # Left Container: Benchmark Table
    bench_headers = ["AI Feature / Capability", "Benchmark Dataset", "Metric", "Avg Latency"]
    bench_data = [
        ["Ticket Classification", "Kaggle Customer Support", "96.0% match", "420 ms"],
        ["Customer Mood Detection", "Hugging Face GoEmotions", "94.0% alignment", "380 ms"],
        ["Patience Guardrail", "Kaggle Twitter Support", "91.2% score", "390 ms"],
        ["Resolution Forecasting", "Kaggle SLA Records", "89.5% accuracy", "410 ms"],
        ["TTL Response Cache", "SHA-256 In-Memory Cache", "100% precision", "12 ms"],
        ["Concierge Ticket Crafting", "Natural Language Chats", "98.0% schema", "650 ms"],
        ["Automated Test Suites", "Jest & Pytest Suites", "100% Pass (89/89)", "2.07s"]
    ]
    add_table_styled(slide24, 0.8, 1.85, 6.2, 4.9, bench_headers, bench_data, col_widths=[1.9, 1.7, 1.5, 1.1])

    # Right Container: Live Screenshot of Analytics Page
    add_card(slide24, 7.2, 1.85, 5.333, 4.9, "Live Production: Analytics & Metrics (Render)", "Operational performance charts and SLA metrics", border_color=COLOR_CYAN)
    analytics_img = "screenshots/analytics_live.png"
    add_image_card(slide24, analytics_img, 7.35, 2.5, 5.033, 3.85, caption="Live Production: Analytics Dashboard with operational response metrics (AnalyticsPage.jsx)", border_color=BORDER_CYAN)

    set_speaker_notes(slide24, "Joint Team (Aarti & Yash)", "45s",
        "Present the empirical benchmark table and live analytics dashboard.",
        "Every claim we make today is backed by empirical proof. "
        "As seen on the left and verified in our test reports: our ticket classification achieved 96.0% accuracy; customer mood detection reached 94.0% alignment; and resolution forecasting reached 89.5% accuracy. "
        "Inference latency averages 420 milliseconds, dropping to 12 milliseconds on cache hits. "
        "On the right is our live production screenshot of the Analytics Dashboard on Render. "
        "Furthermore, our automated test suite achieved a 100% pass rate across 89 unit, integration, concurrency, and transaction rollback specifications.")

    # --------------------------------------------------------------------------
    # SLIDE 25: Client Business ROI, Future Roadmap & Conclusion
    # --------------------------------------------------------------------------
    slide25 = create_base_slide(prs, "Business ROI & Conclusion", "Client Business Impact, Strategic Roadmap & Handover", 
                               "Delivering tangible financial ROI and enterprise readiness for modern customer support.", 
                               "Joint Team", "Executive Handover", "25 / 25")

    add_card(slide25, 0.8, 1.85, 5.75, 4.9, "Quantifiable Client ROI & Value", "Proven business outcomes", border_color=COLOR_GREEN)
    add_bullet_list(slide25, 1.0, 2.55, 5.35, 3.9, [
        ("75% First Response Acceleration", "Slashes initial response wait from 8.5 hours to 2.1 minutes, guaranteeing SLA compliance and eliminating penalty risks."),
        ("35% Operational Ticket Deflection", "Real-time Knowledge Base suggestions and HTTP 409 duplicate alerts remove more than a third of repetitive ticket volume."),
        ("28% First Contact Resolution Boost", "Dynamic troubleshooting checklists and dataset-grounded timelines empower tier-1 agents to resolve issues on first contact."),
        ("> 80% Reduction in LLM API Costs", "Gemini 1.5 Flash efficiency combined with SHA-256 TTL caching cuts operational AI overhead compared to commercial SaaS add-ons."),
        ("Zero Vendor Lock-In", "100% self-hostable Docker architecture with complete client data privacy.")
    ], font_size=10.5, space_before=5)

    add_card(slide25, 6.75, 1.85, 5.75, 4.9, "Strategic Future Roadmap & Handover", "Next-generation expansion vectors", border_color=COLOR_CYAN)
    add_bullet_list(slide25, 6.95, 2.55, 5.35, 3.9, [
        ("Enterprise Vector RAG (pgvector)", "Index internal PDF product manuals, API wikis, and historical resolution logs for semantic question answering."),
        ("Real-Time Telephony Support (Whisper)", "Integrate speech-to-text models to transcribe incoming voice support calls and automatically draft structured tickets."),
        ("Predictive SLA Breach Alerting", "Machine learning forecasting of queue bottlenecks to dynamically rebalance agent workloads."),
        ("Cross-Platform Mobile App (React Native)", "Dedicated on-call mobile workbench for tier-3 engineers and support directors."),
        ("Production Handover Status", "Fully documented (13 engineering guides), Dockerized, test-verified, and ready for immediate enterprise deployment.")
    ], font_size=10.5, space_before=5)

    set_speaker_notes(slide25, "Joint Team (Rohan Salkar)", "50s",
        "Conclude with financial ROI, future roadmap, and invite questions.",
        "In conclusion, SupportSense AI delivers transformational business outcomes for enterprise support centers: "
        "a 75% reduction in First Response Time, a 35% ticket deflection rate, a 28% increase in First Contact Resolution, and over 80% savings in AI API costs. "
        "Our strategic roadmap includes Vector RAG with pgvector, real-time telephony transcription, and predictive SLA alerting. "
        "With 13 comprehensive engineering modules, 100% test pass rates, and turnkey Docker orchestration, SupportSense AI is enterprise-ready today. "
        "On behalf of Rohan, Aarti, Shrujan, and Yash, thank you for your time. We would now be delighted to answer any questions and demonstrate a live walkthrough of the platform.")

    saved_paths = []
    target_paths = [
        "SupportSenseAI_Client_Presentation.pptx",
        "SupportSenseAI_Client_Presentation_Developer_Pitch.pptx",
        "SupportSenseAI_Client_Presentation_v2.pptx"
    ]
    
    for path in target_paths:
        try:
            prs.save(path)
            saved_paths.append(path)
            print(f"Successfully saved presentation to: {path}")
        except PermissionError:
            print(f"Notice: {path} is currently open in PowerPoint (write locked). Skipping.")
        except Exception as e:
            print(f"Notice: Could not write {path}: {e}")

    if not saved_paths:
        fallback = f"SupportSenseAI_Presentation_New_{os.getpid()}.pptx"
        prs.save(fallback)
        saved_paths.append(fallback)
        print(f"Saved to fallback file: {fallback}")

    print(f"\nPresentation compilation finished! Available in: {saved_paths}")
    return saved_paths[0]

if __name__ == "__main__":
    build_presentation()
