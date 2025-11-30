import csv
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# --- Configuration ---
# Get the absolute path of the directory where the script is located
basedir = os.path.abspath(os.path.dirname(__file__))

# Create a Flask app instance
app = Flask(__name__)
# Configure the database to be created in the same directory as the script
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'medicines.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Create the SQLAlchemy db instance
db = SQLAlchemy(app)

# --- Database Model ---
class Medicine(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    disease_name = db.Column(db.String(100), nullable=False)
    disease_url = db.Column(db.String(255))
    med_name = db.Column(db.String(100), nullable=False)
    med_url = db.Column(db.String(255))
    final_price = db.Column(db.String(100))
    price = db.Column(db.String(100))
    prescription_required = db.Column(db.String(100))
    drug_variant = db.Column(db.String(100))
    drug_manufacturer = db.Column(db.String(100))
    drug_manufacturer_origin = db.Column(db.String(100))
    drug_content = db.Column(db.String(255))
    generic_name = db.Column(db.String(100))
    # SQLite does not support ARRAY, so we use a String to store comma-separated URLs
    img_urls = db.Column(db.String(1000))
    
    def __repr__(self):
        return f'<Medicine {self.med_name}>'

# --- Main Execution ---
def populate_database():
    """Reads data from a CSV and populates the database."""
    csv_file_path = os.path.join(basedir, 'medicines.csv')
    
    if not os.path.exists(csv_file_path):
        print(f"Error: The file '{csv_file_path}' was not found.")
        print("Please make sure 'medicines.csv' is in the same directory as this script.")
        return

    print("Opening CSV file...")
    with open(csv_file_path, 'r', encoding='utf-8') as csvfile:
        csvreader = csv.reader(csvfile)
        # Skip the header row
        next(csvreader, None)
        
        count = 0
        for row in csvreader:
            try:
                medicine = Medicine(
                    disease_name=row[0],
                    disease_url=row[1],
                    med_name=row[2],
                    med_url=row[3],
                    final_price=row[4],
                    price=row[5],
                    prescription_required=row[6],
                    drug_variant=row[7],
                    drug_manufacturer=row[8],
                    drug_manufacturer_origin=row[9],
                    drug_content=row[10],
                    generic_name=row[11],
                    # The 13th column (index 12) is the image URLs string
                    img_urls=row[12]
                )
                db.session.add(medicine)
                count += 1
                print(f"Rows processed: {count}", end="\r", flush=True)
            except IndexError:
                print(f"\nSkipping malformed or empty row: {row}")
                continue

    print(f"\nCommitting {count} records to the database...")
    db.session.commit()
    print("Commit successful.")

if __name__ == '__main__':
    # The 'with app.app_context()' is crucial to avoid the RuntimeError
    with app.app_context():
        print("Setting up application context.")
        # Create the database and tables if they don't exist
        print("Creating database tables...")
        db.create_all()
        print("Tables created successfully.")
        
        # Populate the database with data from the CSV
        populate_database()
        
    print("Script finished.")
