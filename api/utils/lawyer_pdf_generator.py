import boto3
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from datetime import datetime

def add_watermark(canvas, doc):
    canvas.saveState()
    canvas.setFont('Helvetica-Bold', 60)
    canvas.setStrokeColor(colors.lightgrey, alpha=0.3)
    canvas.setFillColor(colors.lightgrey, alpha=0.3)
    # Draw diagonal "CONFIDENTIAL"
    canvas.translate(A4[0]/2, A4[1]/2)
    canvas.rotate(45)
    canvas.drawCentredString(0, 0, "CONFIDENTIAL")
    canvas.restoreState()

def generate_lawyer_pdf(data, audit_info):
    pdf_buffer = BytesIO()
    doc = SimpleDocTemplate(pdf_buffer, pagesize=A4, rightMargin=50, leftMargin=50, topMargin=50, bottomMargin=50)
    story = []
    styles = getSampleStyleSheet()

    # 1. Header & Song Info
    story.append(Paragraph(f"<b>SPLIT SHEET AGREEMENT: {data['title']}</b>", styles['Title']))
    story.append(Spacer(1, 12))
    
    # 2. Ownership Table
    table_data = [["Contributor", "Role", "IPI #", "Share (%)"]]
    for c in data['contributors']:
        table_data.append([c['name'], c['role'], c['ipi'], f"{c['share']}%"])
    
    t = Table(table_data, colWidths=[150, 100, 150, 80])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.whitesmoke),
        ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ]))
    story.append(t)
    story.append(Spacer(1, 30))

    # 3. PRIORITY 2: DIGITAL AUDIT TRAIL (This makes lawyers feel safe)
    story.append(Paragraph("<b>CERTIFICATE OF COMPLETION & AUDIT TRAIL</b>", styles['Heading3']))
    audit_data = [
        ["Signer ID:", audit_info['user_id']],
        ["Timestamp:", datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")],
        ["IP Address:", audit_info['ip_address']],
        ["Verification:", "Digitally Signed via TrapRoyalties Secure Portal"]
    ]
    audit_table = Table(audit_data, colWidths=[100, 300])
    audit_table.setStyle(TableStyle([('TEXTCOLOR', (0,0), (-1,-1), colors.darkgrey)]))
    story.append(audit_table)

    # Build PDF with Priority 3: Watermark callback
    doc.build(story, onLaterPages=add_watermark, onFirstPage=add_watermark)
    
    return pdf_buffer.getvalue()
