from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Image, Spacer
from reportlab.lib.units import inch
from reportlab.lib import colors
import os

def generate_pdf(filename, data):
    # Create PDF document
    pdf = SimpleDocTemplate(filename, pagesize=letter)
    elements = []
    data.insert(0, ["Roll No.", "Name", "Total Classes", "No. of Present", "No. of Absent", "Percentage"])

    # Create table
    table = Table(data, colWidths=[80, 150, 80, 80, 80, 80])

    # Add style to table
    style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),     # Header background
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke), # Header text color
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),             # Center align all cells
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),   # Header font
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),            # Header padding
        ('GRID', (0, 0), (-1, -1), 1, colors.black),       # Table border
    ])
    table.setStyle(style)
    elements.append(table)
    if os.path.exists("graph.png"):
        img = Image("graph.png", width=8*inch, height=4*inch)
        elements.append(Spacer(1,20))
        elements.append(img)


    pdf.build(elements)
    print(f"PDF generated: {filename}")
