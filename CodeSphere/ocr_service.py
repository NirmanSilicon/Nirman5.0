import pytesseract
import cv2
import re
import os
from dotenv import load_dotenv
from nlp_service import ask_ai  # use Gemini AI to refine data

load_dotenv()

def extract_text(path):
    img = cv2.imread(path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray,(5,5),0)
    return pytesseract.image_to_string(blur, lang=os.getenv("OCR_LANGUAGE","eng"))


def process_receipt(path):
    text = extract_text(path)

    amount = re.findall(r'₹?\s?(\d{2,6}(?:\.\d{1,2})?)', text)
    dates = re.findall(r'\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4}', text)

    # Ask Gemini to intelligently understand receipt
    ai_summary = ask_ai(
        f"""
        Given the receipt text below, extract:
        - Shop name (if any)
        - Total payable amount
        - Date of purchase
        - Items purchased (if detectable)
        - Return a clean JSON response.
        
        Receipt OCR Text:
        {text}
        """
    )

    return {
        "raw_text": text,
        "probable_amount": amount[-1] if amount else None,
        "probable_date": dates[-1] if dates else None,
        "amount_list": amount,
        "date_list": dates,
        "gemini_analysis": ai_summary  # EXTRA INTELLIGENCE 🧠
    }
