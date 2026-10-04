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
# COLOR PALETTE DEFINITION (Modern Clean Light Executive Theme)
# ==============================================================================
BG_PAGE = RGBColor(248, 250, 252)          # Slate-50 #F8FAFC
BG_CARD = RGBColor(255, 255, 255)          # Pure White #FFFFFF
BG_CARD_SUBTLE = RGBColor(241, 245, 249)   # Slate-100 #F1F5F9
BORDER_CARD = RGBColor(226, 232, 240)      # Slate-200 #E2E8F0
BORDER_CARD_DARK = RGBColor(203, 213, 225) # Slate-300 #CBD5E1

COLOR_HEADING = RGBColor(15, 23, 42)       # Slate-900 #0F172A
COLOR_TEXT = RGBColor(51, 65, 85)          # Slate-700 #334155
COLOR_MUTED = RGBColor(100, 116, 139)      # Slate-500 #64748B

COLOR_VERMILION = RGBColor(253, 69, 27)    # Brand Accent Vermilion #FD451B
COLOR_BLUE = RGBColor(2, 132, 199)         # Sky/Blue #0284C7
COLOR_EMERALD = RGBColor(5, 150, 105)      # Emerald Green #059669
COLOR_AMBER = RGBColor(217, 119, 6)        # Amber #D97706
COLOR_VIOLET = RGBColor(124, 58, 237)      # Violet #7C3AED

PRESENTER_COLORS = {
    "Rohan Salkar": RGBColor(2, 132, 199),      # Sky Blue
    "Yash Sanikop": RGBColor(253, 69, 27),     # Vermilion
    "Shrujan Mitbavkar": RGBColor(5, 150, 105),# Emerald
    "Aarti Singh": RGBColor(124, 58, 237),     # Violet
    "Joint Team": RGBColor(15, 23, 42),        # Slate-900
}

def create_base_slide(prs, category_text, title_text, subtitle_text=None, presenter_name="Joint Team", presenter_role="Executive Overview", slide_num_str="01 / 08"):
    """Standardized 16:9 widescreen slide with clean modern light aesthetic."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    
    # Clean light background
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = BG_PAGE
    bg.line.fill.background()

    # Top category pill badge
    cat_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.4), Inches(4.2), Inches(0.32))
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
    p_cat.font.color.rgb = COLOR_VERMILION

    # Presenter Badge (Top Right)
    badge_color = PRESENTER_COLORS.get(presenter_name, PRESENTER_COLORS["Joint Team"])
    pres_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.333), Inches(0.4), Inches(4.2), Inches(0.32))
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
    p_pres.font.color.rgb = COLOR_HEADING

    # Slide Title
    title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.78), Inches(11.733), Inches(0.55))
    tf_title = title_box.text_frame
    tf_title.word_wrap = True
    tf_title.margin_left = tf_title.margin_top = tf_title.margin_right = tf_title.margin_bottom = 0
    p_title = tf_title.paragraphs[0]
    p_title.text = title_text
    p_title.font.name = "Calibri"
    p_title.font.size = Pt(22)
    p_title.font.bold = True
    p_title.font.color.rgb = COLOR_HEADING

    # Subtitle / Tagline
    if subtitle_text:
        sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.34), Inches(11.733), Inches(0.35))
        tf_sub = sub_box.text_frame
        tf_sub.word_wrap = True
        tf_sub.margin_left = tf_sub.margin_top = tf_sub.margin_right = tf_sub.margin_bottom = 0
        p_sub = tf_sub.paragraphs[0]
        p_sub.text = subtitle_text
        p_sub.font.name = "Calibri"
        p_sub.font.size = Pt(11.5)
        p_sub.font.color.rgb = COLOR_MUTED

    # Header horizontal divider line
    div = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.72), Inches(11.733), Inches(0.015))
    div.fill.solid()
    div.fill.fore_color.rgb = BORDER_CARD
    div.line.fill.background()

    # Footer slide number
    ft_box = slide.shapes.add_textbox(Inches(11.2), Inches(7.12), Inches(1.333), Inches(0.3))
    tf_ft = ft_box.text_frame
    p_ft = tf_ft.paragraphs[0]
    p_ft.text = slide_num_str
    p_ft.alignment = PP_ALIGN.RIGHT
    p_ft.font.name = "Calibri"
    p_ft.font.size = Pt(10)
    p_ft.font.bold = True
    p_ft.font.color.rgb = COLOR_MUTED

    # Footer watermark
    wm_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.12), Inches(9.5), Inches(0.3))
    tf_wm = wm_box.text_frame
    p_wm = tf_wm.paragraphs[0]
    p_wm.text = "SupportSense AI — Developer-to-Developer Client Pitch | Persistent Systems Internship | Yash Sanikop (23CO76)"
    p_wm.font.name = "Calibri"
    p_wm.font.size = Pt(9.2)
    p_wm.font.color.rgb = COLOR_MUTED

    return slide

def add_card(slide, left, top, width, height, title=None, subtitle=None, bg_color=BG_CARD, border_color=BORDER_CARD, border_width=1):
    """Draws a clean white card container."""
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
        p.font.color.rgb = COLOR_HEADING
        
        if subtitle:
            p2 = tf.add_paragraph()
            p2.text = subtitle
            p2.font.name = "Calibri"
            p2.font.size = Pt(9.5)
            p2.font.color.rgb = COLOR_MUTED

    return card

def add_stat_card(slide, left, top, width, height, stat_number, stat_label, subtext=None, accent_color=COLOR_VERMILION):
    """High-contrast light metric card."""
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
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = accent_color

    p2 = tf.add_paragraph()
    p2.text = stat_label
    p2.font.name = "Calibri"
    p2.font.size = Pt(11.5)
    p2.font.bold = True
    p2.font.color.rgb = COLOR_HEADING
    p2.space_before = Pt(2)

    if subtext:
        p3 = tf.add_paragraph()
        p3.text = subtext
        p3.font.name = "Calibri"
        p3.font.size = Pt(9.0)
        p3.font.color.rgb = COLOR_MUTED
        p3.space_before = Pt(2)

def add_bullet_list(slide, left, top, width, height, items, font_size=10.5, space_before=4):
    """Bulleted list with crisp bold-lead labels for easy reading."""
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
            r1.font.color.rgb = COLOR_HEADING
            
            r2 = p.add_run()
            r2.text = item[1]
            r2.font.name = "Calibri"
            r2.font.size = Pt(font_size)
            r2.font.color.rgb = COLOR_TEXT
        else:
            r = p.add_run()
            r.text = f"•  {item}"
            r.font.name = "Calibri"
            r.font.size = Pt(font_size)
            r.font.color.rgb = COLOR_TEXT

def add_image_card(slide, image_path, left, top, width, height, caption=None, border_color=BORDER_CARD):
    """Draws a picture neatly framed with border and caption."""
    card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left - 0.04), Inches(top - 0.04), Inches(width + 0.08), Inches(height + (0.32 if caption else 0.08)))
    card.fill.solid()
    card.fill.fore_color.rgb = BG_CARD
    card.line.color.rgb = border_color
    card.line.width = Pt(1.5)
    
    if os.path.exists(image_path):
        slide.shapes.add_picture(image_path, Inches(left), Inches(top), width=Inches(width), height=Inches(height))
    else:
        tb = slide.shapes.add_textbox(Inches(left), Inches(top + height/2 - 0.3), Inches(width), Inches(0.6))
        p = tb.text_frame.paragraphs[0]
        p.text = f"[Image: {os.path.basename(image_path)}]"
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
        p.font.bold = True
        p.font.color.rgb = COLOR_VERMILION

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


# ==============================================================================
# MAIN 8-SLIDE PRESENTATION BUILDER
# ==============================================================================
def build_short_light_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    print("Building concise 8-slide executive pitch with modern light theme and rich visuals...")

    # --------------------------------------------------------------------------
    # SLIDE 1: Title & Executive Introduction
    # --------------------------------------------------------------------------
    slide1 = prs.slides.add_slide(prs.slide_layouts[6])
    bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = BG_PAGE
    bg1.line.fill.background()

    # Brand Logo
    if os.path.exists("frontend/src/assets/logo.png"):
        slide1.shapes.add_picture("frontend/src/assets/logo.png", Inches(0.9), Inches(0.85), width=Inches(1.2))
    elif os.path.exists("logo.png"):
        slide1.shapes.add_picture("logo.png", Inches(0.9), Inches(0.85), width=Inches(1.2))

    tb1 = slide1.shapes.add_textbox(Inches(2.3), Inches(0.8), Inches(10.2), Inches(2.2))
    tf1 = tb1.text_frame
    tf1.word_wrap = True
    
    p = tf1.paragraphs[0]
    p.text = "SupportSense AI"
    p.font.name = "Calibri"
    p.font.size = Pt(38)
    p.font.bold = True
    p.font.color.rgb = COLOR_HEADING

    p2 = tf1.add_paragraph()
    p2.text = "Enterprise Decision-Support & AI-Powered Customer Support Intelligence"
    p2.font.name = "Calibri"
    p2.font.size = Pt(18)
    p2.font.bold = True
    p2.font.color.rgb = COLOR_VERMILION
    p2.space_before = Pt(4)

    p3 = tf1.add_paragraph()
    p3.text = "Core Philosophy: \"AI Assists, Humans Decide\" (Human-in-the-Loop Safeguards)"
    p3.font.name = "Calibri"
    p3.font.size = Pt(12)
    p3.font.color.rgb = COLOR_MUTED
    p3.space_before = Pt(4)

    div1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.9), Inches(3.05), Inches(11.533), Inches(0.02))
    div1.fill.solid()
    div1.fill.fore_color.rgb = BORDER_CARD
    div1.line.fill.background()

    team_info = [
        ("Rohan Salkar", "Frontend & UI/UX Lead", 
         "Headed React 18 SPA architecture, Tailwind MoonRow design system, dark/light theme switching, responsive layouts, and tone polishing modals.", 
         COLOR_BLUE),
        ("Yash Sanikop", "Frontend & AI Lead\n(Intern: Roll No. 23CO76)", 
         "Responsible for FastAPI microservice, Gemini 1.5 Flash SDK, model pooling, TTL caching, prompt engineering, and conversational AI concierge widgets.", 
         COLOR_VERMILION),
        ("Shrujan Mitbavkar", "Backend & Database Lead", 
         "Managed Express REST controllers, PostgreSQL relational schema modeling, database transactions, state machines, and Supabase connection pooling.", 
         COLOR_EMERALD),
        ("Aarti Singh", "DevOps, QA & Doc Lead", 
         "Headed Docker containerization, Render Blueprint orchestration, automated Jest/Pytest suites, security hardening, and technical specifications.", 
         COLOR_VIOLET)
    ]
    for idx, (name, role, desc, col) in enumerate(team_info):
        c_left = 0.9 + idx * 2.95
        card = add_card(slide1, c_left, 3.3, 2.75, 3.35, title=name, subtitle=role, border_color=col, border_width=1.5)
        tb_desc = slide1.shapes.add_textbox(Inches(c_left + 0.2), Inches(4.25), Inches(2.35), Inches(2.2))
        tf_desc = tb_desc.text_frame
        tf_desc.word_wrap = True
        tf_desc.margin_left = tf_desc.margin_top = tf_desc.margin_right = tf_desc.margin_bottom = 0
        p_desc = tf_desc.paragraphs[0]
        p_desc.text = desc
        p_desc.font.name = "Calibri"
        p_desc.font.size = Pt(9.2)
        p_desc.font.color.rgb = COLOR_TEXT

    tb_meta = slide1.shapes.add_textbox(Inches(0.9), Inches(6.8), Inches(11.5), Inches(0.4))
    tf_meta = tb_meta.text_frame
    p_meta = tf_meta.paragraphs[0]
    p_meta.text = "Persistent Systems Ltd. Internship Program | Student Intern: Yash Sanikop (Roll No. 23CO76) | Industry Mentor: Vishal Bidikar | Guide: Prof. Laxmikant Bordekar"
    p_meta.font.name = "Calibri"
    p_meta.font.size = Pt(9.2)
    p_meta.font.color.rgb = COLOR_MUTED

    set_speaker_notes(slide1, "Rohan Salkar", "45s", 
        "Welcome mentors acting as clients, introduce the 4-member developer team, and state our core philosophy.",
        "Good morning mentors and clients. Today, our developer team presents SupportSense AI, an enterprise-grade customer support platform built during our Persistent Systems internship. "
        "Our team consists of Rohan Salkar as Frontend & UI/UX Lead, Yash Sanikop (Roll No. 23CO76) as Frontend & AI Lead, Shrujan Mitbavkar as Backend & Database Lead, and Aarti Singh as DevOps, QA & Documentation Lead. "
        "Our platform is built around one fundamental principle: 'AI Assists, Humans Decide'. Let's look at the industry crisis that inspired our solution.")

    # --------------------------------------------------------------------------
    # SLIDE 2: The Enterprise Support Crisis & Core Solution
    # --------------------------------------------------------------------------
    slide2 = create_base_slide(prs, "Problem & Principle", "The Enterprise Support Crisis & Our Core Solution", 
                              "Overcoming high-volume ticket chaos with intelligent Human-in-the-Loop decision support.", 
                              "Rohan Salkar", "Frontend & UI/UX Lead", "02 / 08")

    # 3 Problem Cards
    problems = [
        ("Ticket Overload & Fragmentation", "Support queues are flooded with unstructured, repetitive inquiries across multiple channels.", COLOR_AMBER),
        ("Agent Burnout & Cognitive Drain", "Human agents waste 40% of their day on repetitive triage and tagging instead of solving complex issues.", COLOR_VERMILION),
        ("Sluggish First Response Time (FRT)", "8 to 14-hour delays in initial triage trigger SLA penalties and drive customer churn.", COLOR_VIOLET)
    ]
    for idx, (p_title, p_desc, col) in enumerate(problems):
        c_left = 0.8 + idx * 3.95
        add_card(slide2, c_left, 1.85, 3.8, 2.2, p_title, None, border_color=col, border_width=1.5)
        tb_p = slide2.shapes.add_textbox(Inches(c_left + 0.22), Inches(2.45), Inches(3.36), Inches(1.4))
        tf_p = tb_p.text_frame
        tf_p.word_wrap = True
        tf_p.margin_left = tf_p.margin_top = tf_p.margin_right = tf_p.margin_bottom = 0
        p_txt = tf_p.paragraphs[0]
        p_txt.text = p_desc
        p_txt.font.name = "Calibri"
        p_txt.font.size = Pt(10.5)
        p_txt.font.color.rgb = COLOR_TEXT

    # Solution Philosophy Card (Wide bottom)
    add_card(slide2, 0.8, 4.3, 11.733, 2.55, "Our Solution: Human-in-the-Loop (HITL) Intelligence", "AI Assists, Humans Decide — Zero Unvetted Autonomous Actions", border_color=COLOR_EMERALD, border_width=1.5)
    add_bullet_list(slide2, 1.05, 5.0, 11.2, 1.7, [
        ("Cognitive Amplification", "AI absorbs overhead—parsing logs, classifying priority, and drafting replies, freeing agents for high-value issues."),
        ("Empathy Preservation", "The human agent remains the empathetic decision-maker, reviewing drafts and approving actions with 1 click."),
        ("Strict Bounded Safety", "AI never issues refunds, edits databases, or contacts customers without human agent verification."),
        ("Zero Vendor Lock-In", "100% self-hostable Docker architecture with total client data sovereignty, slashing SaaS costs by over 80%.")
    ], font_size=10.5, space_before=5)

    set_speaker_notes(slide2, "Rohan Salkar", "45s",
        "Explain the enterprise support crisis and our ethical Human-in-the-Loop solution.",
        "Enterprise support centers face a crisis: ticket overload, agent burnout, and sluggish first response times stretching 8 to 14 hours. "
        "Agents spend 40% of their workday just deciphering messy threads and tagging categories. "
        "SupportSense AI solves this through Cognitive Amplification: AI handles the heavy cognitive lifting—triage, mood detection, and draft replies—while preserving human judgment. "
        "The AI never takes dangerous actions like issuing refunds or sending unvetted messages autonomously.")

    # --------------------------------------------------------------------------
    # SLIDE 3: End-to-End Workflow: How SupportSense AI Works
    # --------------------------------------------------------------------------
    slide3 = create_base_slide(prs, "System Workflow", "End-to-End Workflow: How SupportSense AI Operates", 
                              "A 4-step human-centric pipeline transforming unstructured requests into resolved tickets.", 
                              "Rohan Salkar", "Frontend & UI/UX Lead", "03 / 08")

    workflow_steps = [
        ("1. Intelligent Intake", "Customers interact via Conversational AI Concierge or Portal. Natural language chats are converted into structured formal tickets.", COLOR_BLUE),
        ("2. AI-Powered Triage", "FastAPI + Gemini microservice classifies category, sentiment, and urgency in < 420ms, routing to the correct department queue.", COLOR_VERMILION),
        ("3. Agent Cockpit Assist", "Agent opens the dual-pane workbench with a live customer patience meter, diagnostic checklists, and 1-click tone refiners.", COLOR_AMBER),
        ("4. Human Approval & Close", "Agent verifies AI recommendations, customizes replies with 1-click tone polisher, and approves resolution safely.", COLOR_EMERALD)
    ]

    for idx, (w_title, w_desc, col) in enumerate(workflow_steps):
        c_left = 0.8 + idx * 2.95
        add_card(slide3, c_left, 1.85, 2.68, 3.2, w_title, None, border_color=col, border_width=1.5)
        tb_w = slide3.shapes.add_textbox(Inches(c_left + 0.18), Inches(2.55), Inches(2.32), Inches(2.3))
        tf_w = tb_w.text_frame
        tf_w.word_wrap = True
        tf_w.margin_left = tf_w.margin_top = tf_w.margin_right = tf_w.margin_bottom = 0
        p_w = tf_w.paragraphs[0]
        p_w.text = w_desc
        p_w.font.name = "Calibri"
        p_w.font.size = Pt(10)
        p_w.font.color.rgb = COLOR_TEXT

        # Connecting arrow between cards
        if idx < 3:
            tb_arr = slide3.shapes.add_textbox(Inches(c_left + 2.68), Inches(3.2), Inches(0.27), Inches(0.5))
            tf_arr = tb_arr.text_frame
            tf_arr.margin_left = tf_arr.margin_top = tf_arr.margin_right = tf_arr.margin_bottom = 0
            p_arr = tf_arr.paragraphs[0]
            p_arr.text = "➔"
            p_arr.alignment = PP_ALIGN.CENTER
            p_arr.font.name = "Calibri"
            p_arr.font.size = Pt(14)
            p_arr.font.bold = True
            p_arr.font.color.rgb = COLOR_VERMILION

    # Horizontal Summary Banner
    add_card(slide3, 0.8, 5.25, 11.733, 1.6, "The Operational Result: 75% Faster Resolutions with 100% Control", "Bridging the gap between speed and safety", border_color=BORDER_CARD)
    add_bullet_list(slide3, 1.05, 5.75, 11.2, 0.95, [
        ("Real-Time Telemetry", "Instant sentiment degradation tracking prevents customer churn before SLA breach occurs."),
        ("Atomic State Progression", "Strict status state machine (OPEN ➔ IN_PROGRESS ➔ RESOLVED) guarantees clean operational governance.")
    ], font_size=10.0, space_before=3)

    set_speaker_notes(slide3, "Rohan Salkar", "45s",
        "Walk the client through the 4-step workflow from intake to resolution.",
        "Here is the complete four-step lifecycle in SupportSense AI. "
        "Step 1: Intelligent Intake converts everyday customer language into formal ticket specs. "
        "Step 2: Our AI microservice triages category, urgency, and customer mood in under 420 milliseconds. "
        "Step 3: When the agent opens the ticket, the Co-Pilot cockpit provides live patience scores, dynamic troubleshooting checklists, and draft replies. "
        "Step 4: The agent reviews the draft, polishes tone in 1 click, and resolves the issue. Now, I will showcase the live Agent Cockpit UI.")

    # --------------------------------------------------------------------------
    # SLIDE 4: Frontend Experience: The Agent Co-Pilot Cockpit
    # [EMBEDDED LIVE SCREENSHOT: agent_workbench_live.png]
    # --------------------------------------------------------------------------
    slide4 = create_base_slide(prs, "Frontend Experience", "The Agent Co-Pilot Cockpit: Dual-Pane Operational Interface", 
                              "Crafted with React 18, Tailwind MoonRow design, dynamic checklists, and sentiment telemetry.", 
                              "Rohan Salkar", "Frontend & UI/UX Lead", "04 / 08")

    # Left Container: Key Features
    add_card(slide4, 0.8, 1.85, 4.8, 4.9, "Dual-Pane Layout & Safety Rails", "MoonRow-inspired enterprise aesthetic", border_color=COLOR_BLUE)
    add_bullet_list(slide4, 1.0, 2.5, 4.4, 4.0, [
        ("React 18 SPA + MoonRow Design", "Vite build toolchain; WCAG 2.1 AA compliant contrast (4.5:1) with zero-layout-shift theming."),
        ("Customer Mood & Patience Meter", "Real-time gauge tracks customer frustration level across thread lifespan."),
        ("Dynamic Actionable Checklists", "Generates 3–5 tailored verification steps per category, saving state to PostgreSQL via PATCH API."),
        ("🔒 Private Internal Staff Notes", "Amber-bordered staff notes strictly isolated from customer view to prevent data leaks."),
        ("1-Click AI Tone Polisher", "Instantly refines rough notes into Empathetic, Concise, Formal, or Technical styles with 3-variation cycling.")
    ], font_size=10.0, space_before=5)

    # Right Container: High-Res Live Screenshot
    add_card(slide4, 5.8, 1.85, 6.733, 4.9, "Live Production: Dual-Pane Agent Workbench", "Live from https://supportsense-frontend.onrender.com", border_color=COLOR_VERMILION)
    workbench_img = "screenshots/agent_workbench_live.png"
    add_image_card(slide4, workbench_img, 5.95, 2.5, 6.433, 3.85, caption="Live Production: Dual-Pane Agent Workbench with AI Decision Drawer (Render Deployed)", border_color=COLOR_VERMILION)

    set_speaker_notes(slide4, "Rohan Salkar", "50s",
        "Demonstrate the live Agent Workbench, MoonRow design system, and AI Decision Drawer.",
        "As Frontend & UI/UX Lead, I designed the interface with the speed and polish of tools like Linear and Stripe. "
        "On the right is our actual live production screenshot from Render! "
        "The left pane presents chronological customer conversation with strict visual separation for private staff notes. "
        "The right pane houses the AI Decision Drawer: displaying customer mood, patience scores, resolution estimates, and interactive troubleshooting checkboxes. "
        "Now, Yash Sanikop will present our Conversational Intake and Deflection engine.")

    # --------------------------------------------------------------------------
    # SLIDE 5: Conversational AI Intake & Real-Time Deflection
    # [EMBEDDED LIVE SCREENSHOTS: ai_concierge_live.png & faq_deflection_live.png]
    # --------------------------------------------------------------------------
    slide5 = create_base_slide(prs, "Customer Experience & Deflection", "Conversational AI Intake & Real-Time FAQ Deflection", 
                              "Transforming casual chats into formal tickets while deflecting 35% of routine requests.", 
                              "Yash Sanikop", "Frontend & AI Lead (23CO76)", "05 / 08")

    # Left Container: Concierge Widget + Live Screenshot
    add_card(slide5, 0.8, 1.85, 5.75, 4.9, "1. Conversational AI Concierge Widget", "SSAI-406 Natural language ticket crafter", border_color=COLOR_VERMILION)
    concierge_img = "screenshots/ai_concierge_live.png"
    add_image_card(slide5, concierge_img, 0.95, 2.5, 5.45, 2.7, caption="Live Production: Conversational AI Concierge Chatbot Widget (Render)", border_color=COLOR_VERMILION)
    add_bullet_list(slide5, 1.0, 5.45, 5.35, 1.15, [
        ("Conversational Intake", "Users describe issues casually; AI asks empathetic clarifying questions."),
        ("1-Click Ticket Dispatch", "Synthesizes chat into formal ticket (Title, Description, Urgency, Category).")
    ], font_size=9.5, space_before=2)

    # Right Container: Real-Time Deflection + Live Screenshot
    add_card(slide5, 6.75, 1.85, 5.75, 4.9, "2. Real-Time Deflection & Duplicate Shield", "SSAI-410 & SSAI-409 Zero-queue bloat", border_color=COLOR_BLUE)
    faq_img = "screenshots/faq_deflection_live.png"
    add_image_card(slide5, faq_img, 6.9, 2.5, 5.45, 2.7, caption="Live Production: Real-Time FAQ Deflection Panel during Ticket Creation", border_color=COLOR_BLUE)
    add_bullet_list(slide5, 6.95, 5.45, 5.35, 1.15, [
        ("35% Deflection Rate", "300ms debounced scanner matches KB articles while customer types issue title."),
        ("HTTP 409 Duplicate Interception", "Intercepts repeated queries with verified past resolution notes.")
    ], font_size=9.5, space_before=2)

    set_speaker_notes(slide5, "Yash Sanikop", "50s",
        "Demonstrate the AI Concierge and real-time FAQ deflection from live screenshots.",
        "As Frontend & AI Lead (Student Intern Yash Sanikop, Roll No. 23CO76), I engineered the bridge connecting customer widgets with our Gemini AI pipeline. "
        "On the left is our live screenshot of the AI Concierge. Non-technical users explain problems naturally; the Concierge conducts dialogue and compiles a formal enterprise ticket in 1 click! "
        "On the right is our Real-Time FAQ Deflection panel. As the customer types, our debounced search scans verified documentation, deflecting 35% of repetitive tickets before submission. "
        "Next, Shrujan Mitbavkar will present our Backend and Database Architecture.")

    # --------------------------------------------------------------------------
    # SLIDE 6: Backend REST Engine & PostgreSQL Relational Architecture
    # [EMBEDDED LIVE SCREENSHOT: tickets_queue_live.png]
    # --------------------------------------------------------------------------
    slide6 = create_base_slide(prs, "Backend & Database", "Core REST Engine & PostgreSQL Relational Architecture", 
                              "High-throughput Express controllers, 3NF PostgreSQL schema, and atomic transactions.", 
                              "Shrujan Mitbavkar", "Backend & Database Lead", "06 / 08")

    # Left Container: Backend & DB Engineering
    add_card(slide6, 0.8, 1.85, 5.0, 4.9, "Node.js, Express & Supabase Pooling", "Engineered for 100% data consistency", border_color=COLOR_EMERALD)
    add_bullet_list(slide6, 1.0, 2.5, 4.6, 4.0, [
        ("Sub-200ms REST Performance", "P95 latency < 200ms across pagination, multi-criteria filtering, and assignment."),
        ("Atomic Transactions (SCRUM-112)", "BEGIN / COMMIT / ROLLBACK wraps ticket and initial message; guarantees 0 orphaned tickets on failure."),
        ("Status State Machine (SCRUM-111)", "Strict progression (OPEN ➔ IN_PROGRESS ➔ RESOLVED ➔ CLOSED) prevents illegal state jumps."),
        ("Concurrency Lock Safety (SCRUM-110)", "100 simultaneous parallel submissions tested with zero sequence collisions."),
        ("Supabase Cloud Pooling", "Managed PgBouncer pool with SSL encryption and sub-50ms compound B-tree index queries.")
    ], font_size=10.0, space_before=5)

    # Right Container: Live Ticket Queue Screenshot
    add_card(slide6, 6.0, 1.85, 6.533, 4.9, "Live Production: Express REST Ticket Feed", "Real-time queue filtering and pagination (Render)", border_color=COLOR_BLUE)
    queue_img = "screenshots/tickets_queue_live.png"
    add_image_card(slide6, queue_img, 6.15, 2.5, 6.233, 3.85, caption="Live Production: Ticket Queue Table powered by Express REST & PostgreSQL (TicketsPage.jsx)", border_color=COLOR_BLUE)

    set_speaker_notes(slide6, "Shrujan Mitbavkar", "45s",
        "Explain our Express REST engine, normalized PostgreSQL schema, and atomic transactions.",
        "As Backend & Database Lead, my objective was rock-solid data integrity and high throughput. "
        "Our P95 REST latency remains under 200 milliseconds. "
        "Under SCRUM-112, we wrapped ticket creation and initial message insertion into an atomic SQL transaction—if anything fails, the entire transaction rolls back cleanly, guaranteeing zero orphaned records. "
        "On the right is our live ticket queue from Render, powered by PostgreSQL compound B-tree indexes executing in under 50 milliseconds.")

    # --------------------------------------------------------------------------
    # SLIDE 7: AI Microservice, DevOps & Security Hardening
    # [EMBEDDED LIVE GRAPHIC: docs_system_architecture.png]
    # --------------------------------------------------------------------------
    slide7 = create_base_slide(prs, "AI Engine, DevOps & Security", "AI Microservice, Docker Containers & Security Hardening", 
                              "FastAPI + Gemini 1.5 Flash microservice, 12ms caching, multi-stage Docker, and stateless JWT.", 
                              "Aarti Singh & Yash Sanikop", "DevOps & AI Leads", "07 / 08")

    # Left Container: AI Engine & Caching (Yash)
    add_card(slide7, 0.8, 1.85, 5.0, 4.9, "FastAPI Microservice & 12ms Cache", "Gemini 1.5 Flash SDK high-throughput pipeline", border_color=COLOR_VERMILION)
    add_bullet_list(slide7, 1.0, 2.5, 4.6, 4.0, [
        ("Gemini 1.5 Flash Reasoning", "Fast, cost-effective inference (< 420ms) with Pydantic v2 structured JSON schema validation."),
        ("Model Instance Pooling", "Pre-instantiates GenerativeModel instances, eliminating memory thrashing and GC overhead."),
        ("SHA-256 In-Memory TTL Cache", "Caches identical ticket requests with 300s TTL; drops repeated query latency from 1,800ms to 12ms!"),
        ("Anti-Gaming Decoupling", "Prompt explicitly decouples shouting ('URGENT') from technical priority, preserving SLA fairness."),
        ("Deterministic Fallbacks", "Regex fallbacks guarantee 100% uptime even if external LLM API is unreachable.")
    ], font_size=10.0, space_before=5)

    # Right Container: 3-Tier Architecture Graphic & DevOps (Aarti)
    add_card(slide7, 6.0, 1.85, 6.533, 4.9, "3-Tier Micro-Architecture & DevOps", "Docker multi-stage builds & Render Blueprint", border_color=COLOR_VIOLET)
    arch_img = "docs_system_architecture.png"
    add_image_card(slide7, arch_img, 6.15, 2.5, 6.233, 3.0, caption="3-Tier Micro-Architecture: React SPA ➔ Express REST ➔ PostgreSQL & FastAPI Microservice", border_color=COLOR_VIOLET)
    add_bullet_list(slide7, 6.15, 5.75, 6.2, 0.95, [
        ("Stateless JWT & RBAC", "1-hour Bearer tokens, bcrypt 10 salt rounds, express-rate-limit brute-force protection."),
        ("Docker & Render Blueprint", "Multi-stage builds (Nginx 25MB, Node 140MB, Python 210MB); 100% automated CI/CD test pass rate.")
    ], font_size=9.5, space_before=2)

    set_speaker_notes(slide7, "Aarti Singh & Yash Sanikop", "50s",
        "Explain our FastAPI AI microservice, 12ms caching, system architecture, and Docker/Render DevOps.",
        "Yash: As AI Lead, I architected the Python FastAPI microservice with Google Gemini 1.5 Flash. GenerativeModel instance pooling and SHA-256 TTL caching drop repeated queries from 1.8 seconds down to just 12 milliseconds! "
        "Aarti: As DevOps & QA Lead, I containerized the stack with multi-stage Dockerfiles and orchestrated one-click cloud deployment via Render Blueprints. "
        "Stateless JWT tokens and express rate-limiting protect our endpoints, and our automated Jest/Pytest suites maintain a 100% pass rate.")

    # --------------------------------------------------------------------------
    # SLIDE 8: Business Impact Metrics & Client ROI
    # [EMBEDDED LIVE SCREENSHOT: analytics_live.png]
    # --------------------------------------------------------------------------
    slide8 = create_base_slide(prs, "Business Impact & ROI", "Business Impact Metrics & Client ROI Handover", 
                              "Delivering quantifiable SLA reductions, financial return on investment, and future expansion.", 
                              "Joint Team", "Executive Handover", "08 / 08")

    # 4 High-Impact KPI Stat Cards across top
    add_stat_card(slide8, 0.8, 1.85, 2.75, 1.6, "75%", "FRT Reduction", "From 8.5 hours to 2.1 mins via instant department acknowledgments", COLOR_VERMILION)
    add_stat_card(slide8, 3.75, 1.85, 2.75, 1.6, "35%", "Ticket Deflection", "Real-time Knowledge Base suggestions & duplicate prevention", COLOR_BLUE)
    add_stat_card(slide8, 6.7, 1.85, 2.75, 1.6, "96.0%", "AI Triage Accuracy", "Calibrated on 100 historical Kaggle and Hugging Face records", COLOR_EMERALD)
    add_stat_card(slide8, 9.65, 1.85, 2.75, 1.6, "> 80%", "Licensing Cost Savings", "Self-hostable Docker vs $36k/yr Zendesk contracts", COLOR_VIOLET)

    # Bottom Left: Quantifiable ROI
    add_card(slide8, 0.8, 3.7, 5.5, 3.1, "Proven Client ROI & Value", "Delivering immediate enterprise benefits", border_color=COLOR_EMERALD)
    add_bullet_list(slide8, 1.0, 4.35, 5.1, 2.3, [
        ("SLA Penalty Immunity", "Slashing initial response from hours to minutes guarantees 98.4% SLA compliance."),
        ("28% First Contact Resolution Boost", "Dynamic diagnostic checklists empower tier-1 agents to resolve issues on first contact."),
        ("Upcoming Horizons", "Multichannel sync (Slack/Teams/WhatsApp), Voice-to-ticket transcription (Whisper), and Vector RAG (pgvector)."),
        ("Production Handover Status", "Fully documented (13 engineering guides), 100% test-verified, and live on Render today.")
    ], font_size=9.8, space_before=3)

    # Bottom Right: Live Screenshot of Analytics Page
    add_card(slide8, 6.5, 3.7, 6.033, 3.1, "Live Production: Analytics & Operational Telemetry", "Render Deployment (AnalyticsPage.jsx)", border_color=COLOR_VERMILION)
    analytics_img = "screenshots/analytics_live.png"
    add_image_card(slide8, analytics_img, 6.65, 4.3, 5.733, 2.35, caption="Live Production: Analytics Dashboard with operational response metrics", border_color=COLOR_VERMILION)

    set_speaker_notes(slide8, "Joint Team (Rohan Salkar)", "50s",
        "Conclude with quantifiable client ROI, future roadmap, and invite live Q&A.",
        "In conclusion, SupportSense AI delivers measurable enterprise results: a 75% reduction in First Response Time, a 35% ticket deflection rate, 96% AI triage accuracy, and over 80% annual cost savings compared to commercial SaaS vendors. "
        "On the right is our live Analytics Dashboard on Render validating our operational metrics. "
        "With 13 technical specifications, 100% automated test pass rates, and turnkey Docker deployment, SupportSense AI is production-ready today. "
        "On behalf of Rohan, Aarti, Shrujan, and Yash, thank you! We are now excited to answer your questions and demonstrate the live platform.")

    # Save to targets safely
    saved_paths = []
    target_paths = [
        "SupportSenseAI_Short_Presentation.pptx",
        "SupportSenseAI_Client_Presentation.pptx",
        "SupportSenseAI_Presentation_Executive_8Slides.pptx"
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
        fallback = f"SupportSenseAI_Short_New_{os.getpid()}.pptx"
        prs.save(fallback)
        saved_paths.append(fallback)
        print(f"Saved to fallback file: {fallback}")

    print(f"\nShort 8-slide presentation finished! Available in: {saved_paths}")
    return saved_paths[0]

if __name__ == "__main__":
    build_short_light_presentation()
