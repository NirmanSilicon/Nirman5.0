from dotenv import load_dotenv
import google.generativeai as genai
import os

# Load API KEY from .env
load_dotenv()
API_KEY = os.getenv("AI_API_KEY")

# Configure Gemini
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")  # Free tier friendly

def ask_ai(prompt):
    """ Sends a user query to Gemini and returns generated text """
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"AI Error: {str(e)}"
