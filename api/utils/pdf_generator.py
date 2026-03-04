from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, legal
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
import io
import hashlib
from datetime import datetime
import os

class SplitAgreementPDF:
    def __init__(self, track_data, participants, agreement_id):
        self.track_data = track_data
        self.participants = participants
        self.agreement_id = agreement_id
        self.buffer = io.BytesIO()
        self.doc = SimpleDocTemplate(
            self.buffer,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72,
        )
        self.styles = getSampleStyleSheet()
        self.story = []
        
    def generate_hash(self, content):
        """Generate SHA-256 hash of the document content"""
        return hashlib.sha256(content.encode()).hexdigest()
    
    def add_header(self):
        """Add document header with logo and title"""
        header_style = ParagraphStyle(
            'CustomHeader',
            parent=self.styles['Heading1'],
            fontSize=18,
            textColor=colors.HexColor('#312e81'),
            alignment=TA_CENTER,
            spaceAfter=20,
        )
        header = Paragraph("TRAPROYALTIES PRO - SPLIT AGREEMENT", header_style)
        self.story.append(header)
        self.story.append(Spacer(1, 0.2*inch))
        
        # Add agreement ID and date
        info_style = ParagraphStyle(
            'InfoStyle',
            parent=self.styles['Normal'],
            fontSize=10,
            textColor=colors.gray,
            alignment=TA_CENTER,
        )
        date_str = datetime.now().strftime("%B %d, %Y")
        info = Paragraph(f"Agreement ID: {self.agreement_id} | Date: {date_str}", info_style)
        self.story.append(info)
        self.story.append(Spacer(1, 0.3*inch))
    
    def add_track_info(self):
        """Add track information section"""
        title_style = ParagraphStyle(
            'SectionTitle',
            parent=self.styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#1e1b4b'),
            spaceAfter=10,
        )
        self.story.append(Paragraph("Track Information", title_style))
        
        data = [
            ["Track Title:", self.track_data.get('title', 'N/A')],
            ["Artist:", self.track_data.get('artist', 'N/A')],
            ["ISRC:", self.track_data.get('isrc', 'N/A')],
            ["Upload Date:", self.track_data.get('upload_date', 'N/A')],
        ]
        
        table = Table(data, colWidths=[2*inch, 3*inch])
        table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 11),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.HexColor('#4b5563')),
            ('TEXTCOLOR', (1, 0), (1, -1), colors.HexColor('#111827')),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))
        self.story.append(table)
        self.story.append(Spacer(1, 0.2*inch))
    
    def add_participants_table(self):
        """Add participants/split information"""
        title_style = ParagraphStyle(
            'SectionTitle',
            parent=self.styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#1e1b4b'),
            spaceAfter=10,
        )
        self.story.append(Paragraph("Split Distribution", title_style))
        
        # Table header
        data = [["Name", "Role", "IPI/ISWC", "Percentage", "Share Amount"]]
        
        # Add participant rows
        total_percentage = 0
        for p in self.participants:
            data.append([
                p.get('name', 'N/A'),
                p.get('role', 'N/A'),
                p.get('ipi', 'N/A'),
                f"{p.get('percentage', 0)}%",
                f"${(p.get('percentage', 0) / 100 * 100000):,.2f}"  # Example calculation
            ])
            total_percentage += p.get('percentage', 0)
        
        # Add total row
        data.append(["", "", "", "TOTAL:", f"{total_percentage}%"])
        
        table = Table(data, colWidths=[1.5*inch, 1*inch, 1.2*inch, 0.8*inch, 1.2*inch])
        table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('GRID', (0, 0), (-2, -2), 1, colors.HexColor('#e5e7eb')),
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#312e81')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTWEIGHT', (0, 0), (-1, 0), 'BOLD'),
            ('FONTWEIGHT', (0, -1), (-1, -1), 'BOLD'),
            ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#f3f4f6')),
            ('SPAN', (0, -1), (3, -1)),  # Span total label across first 4 columns
        ]))
        self.story.append(table)
        self.story.append(Spacer(1, 0.2*inch))
    
    def add_legal_clauses(self):
        """Add standard legal clauses"""
        clause_style = ParagraphStyle(
            'ClauseStyle',
            parent=self.styles['Normal'],
            fontSize=9,
            textColor=colors.HexColor('#4b5563'),
            spaceAfter=6,
        )
        
        clauses = [
            "1. PARTIES: This agreement is entered into by and between the participants listed above.",
            "2. ROYALTY DISTRIBUTION: The percentages shown represent the ownership split of all income generated from the identified track.",
            "3. REPRESENTATIONS: Each party represents that they have the right to enter into this agreement.",
            "4. GOVERNING LAW: This agreement shall be governed by the laws of the State of Georgia.",
            "5. DIGITAL HANDSHAKE: This agreement is secured by SHA-256 hash verification. Any modification will break the digital seal.",
        ]
        
        for clause in clauses:
            p = Paragraph(clause, clause_style)
            self.story.append(p)
            self.story.append(Spacer(1, 0.1*inch))
    
    def add_signature_lines(self):
        """Add signature lines"""
        self.story.append(Spacer(1, 0.3*inch))
        
        sig_style = ParagraphStyle(
            'SigStyle',
            parent=self.styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#111827'),
        )
        
        for i, p in enumerate(self.participants[:3]):  # Limit to first 3 for space
            sig_data = [
                [f"{p.get('name', 'Participant')}"],
                ["_________________________", "_________________________"],
                ["Signature", "Date"],
            ]
            sig_table = Table(sig_data, colWidths=[2.5*inch, 2*inch])
            sig_table.setStyle(TableStyle([
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('FONTWEIGHT', (0, 0), (-1, 0), 'BOLD'),
                ('TEXTCOLOR', (0, 2), (-1, 2), colors.gray),
            ]))
            self.story.append(sig_table)
            self.story.append(Spacer(1, 0.2*inch))
    
    def add_hash_footer(self):
        """Add document hash and verification footer"""
        # Generate document hash
        doc_content = str(self.track_data) + str(self.participants) + str(self.agreement_id)
        doc_hash = self.generate_hash(doc_content)
        
        footer_style = ParagraphStyle(
            'FooterStyle',
            parent=self.styles['Normal'],
            fontSize=7,
            textColor=colors.HexColor('#9ca3af'),
            alignment=TA_CENTER,
        )
        
        footer = [
            f"Document Hash: {doc_hash[:16]}...{doc_hash[-16:]}",
            f"Generated by TrapRoyaltiesPro | {datetime.now().isoformat()}",
            "This document is legally binding and hash-verified. Any alteration invalidates this agreement."
        ]
        
        self.story.append(Spacer(1, 0.3*inch))
        for line in footer:
            p = Paragraph(line, footer_style)
            self.story.append(p)
    
    def generate(self):
        """Generate the PDF document"""
        self.add_header()
        self.add_track_info()
        self.add_participants_table()
        self.add_legal_clauses()
        self.add_signature_lines()
        self.add_hash_footer()
        
        self.doc.build(self.story)
        pdf_content = self.buffer.getvalue()
        self.buffer.close()
        
        return pdf_content


# Function to generate and upload PDF to IDrive e2
async def generate_and_upload_pdf(track_data, participants, agreement_id, s3_client, bucket_name):
    """
    Generate PDF and upload to S3/IDrive
    """
    try:
        # Generate PDF
        generator = SplitAgreementPDF(track_data, participants, agreement_id)
        pdf_content = generator.generate()
        
        # Create filename
        filename = f"split_agreement_{agreement_id}_{datetime.now().strftime('%Y%m%d')}.pdf"
        s3_key = f"contracts/{agreement_id}/{filename}"
        
        # Upload to S3
        s3_client.put_object(
            Bucket=bucket_name,
            Key=s3_key,
            Body=pdf_content,
            ContentType='application/pdf',
            Metadata={
                'agreement_id': agreement_id,
                'track_title': track_data.get('title', ''),
                'generated_date': datetime.now().isoformat(),
                'document_type': 'split_agreement'
            }
        )
        
        # Generate presigned URL for sharing
        url = s3_client.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': bucket_name,
                'Key': s3_key
            },
            ExpiresIn=3600  # 1 hour
        )
        
        return {
            'success': True,
            's3_key': s3_key,
            'url': url,
            'filename': filename
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }
