import streamlit as st
import json
from langchain.vectorstores import FAISS
from langchain.schema import Document
from langchain.text_splitter import CharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain.llms import OpenAI
import requests
import os
from openai import OpenAI

# Setup for OpenAI
token = os.environ.get("GITHUB_TOKEN", "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")
endpoint = "https://models.inference.ai.azure.com"
model_name = "gpt-4o"

openai_client = OpenAI(
    base_url=endpoint,
    api_key=token,
)

# Setup for Google Gemini
GEMINI_API_KEY = "AIzaSyBaVmGidt0Sb8oIr0TZJI6ly26zhK6wxNI"

def google_gemini_query(prompt, model="gemini-1.5-flash"):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={GEMINI_API_KEY}"
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        return response.json().get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
    else:
        return f"Error with Gemini API: {response.status_code}"

# Initialize JSON data
try:
    with open('COI.json', 'r', encoding='utf-8') as file:
        data = json.load(file)
except FileNotFoundError:
    data = {}
    st.warning("COI.json file not found. Proceeding without constitution data.")

# Streamlit UI
st.title("Indian Legal Chatbot")

# Sidebar for model selection
model_choice = st.sidebar.selectbox(
    'Choose your AI model:',
    ['OpenAI (gpt-4o)', 'Google Gemini (1.5-flash)', 'Google Gemini (1.5-pro)']
)

# Session state for messages
if "messages" not in st.session_state:
    st.session_state.messages = []

# Display chat messages from history on app rerun
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# Accept user input
if user_input := st.chat_input("Ask about the Indian Constitution:"):
    # Add user message to chat history
    st.session_state.messages.append({"role": "user", "content": user_input})
    with st.chat_message("user"):
        st.markdown(user_input)

    try:
        # Generate response based on model choice
        if model_choice == 'OpenAI (gpt-4o)':
            messages = [
                {"role": "system", "content": "You are a helpful assistant on the Indian Constitution."},
                {"role": "user", "content": user_input}
            ]
            response = openai_client.chat.completions.create(
                model=model_name,
                messages=messages,
                temperature=1.0,
                top_p=1.0,
                max_tokens=1000
            )
            ai_response = response.choices[0].message.content
        else:  # Google Gemini models
            model = "gemini-1.5-flash" if model_choice == 'Google Gemini (1.5-flash)' else "gemini-1.5-pro"
            ai_response = google_gemini_query(f"Indian Constitution: {user_input}", model)

        # Add AI response to chat history
        st.session_state.messages.append({"role": "assistant", "content": ai_response})
        with st.chat_message("assistant"):
            st.markdown(ai_response)

    except Exception as e:
        error_message = f"An error occurred: {str(e)}"
        st.error(error_message)
