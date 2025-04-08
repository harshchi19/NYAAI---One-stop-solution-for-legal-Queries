# NyaAI - AI-Powered Legal Services Platform

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Technical Architecture](#technical-architecture)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Security](#security)
7. [Ethical Considerations](#ethical-considerations)
8. [Contributing](#contributing)
9. [Future Enhancements](#future-enhancements)
10. [License](#license)
11. [Contact](#contact)
12. [References](#references)

---

## Overview
NyaAI is a cutting-edge, AI-driven legal services platform developed by the Department of Artificial Intelligence and Data Science at Dwarkadas J. Sanghvi College of Engineering, Mumbai, India. It leverages advanced AI models such as LLaMA 3, OpenAI GPT-4o, and Google Gemini to enhance legal processes with tools like a legal chatbot, attorney matchmaking, case analysis, document drafting, and calendar scheduling. The platform integrates Retrieval-Augmented Generation (RAG) for context-aware responses and employs AES/CAST5 PGP symmetric encryption for data security. Designed for efficiency, accessibility, and accuracy, NyaAI aims to revolutionize legal support for professionals and clients alike.

---

## Features

### 1. AI-Powered Legal Chatbot
- *Description*: A 24/7 accessible chatbot providing instant legal advice with 95% accuracy.
- *Capabilities*: Interprets legal terminology, cites case law, and offers step-by-step guidance using NLP and RAG.
- *Use Case*: Ideal for individuals seeking quick answers and professionals needing real-time support.

### 2. Attorney Matchmaking System
- *Description*: Matches clients with lawyers based on case type, expertise, and geographic proximity.
- *Technology*: Uses AI algorithms to rank and recommend attorneys with high relevance.
- *Use Case*: Streamlines client-lawyer connections for optimal legal representation.

### 3. Case Analysis Module - Verdict Vista
- *Description*: Provides real-case analysis and a practice mode for dummy cases with 92% accuracy.
- *Features*:
  - *Real-Case Analysis*: Analyzes past case law and predicts outcomes using ML.
  - *Practice Mode*: Simulates case scenarios for training law students and professionals.
- *Use Case*: Enhances decision-making and legal education.

### 4. Legal Document Drafting - DraftBot
- *Description*: Automates the creation of contracts, agreements, and other legal documents.
- *Features*: Customizable clauses, compliance with legal norms, and reduced drafting time (from days to minutes).
- *Use Case*: Saves time while ensuring accuracy and consistency in legal documentation.

### 5. Calendar Scheduling with Twilio Integration
- *Description*: Manages appointments and sends reminders for court hearings and deadlines.
- *Integration*: Uses Twilio for SMS and call notifications.
- *Use Case*: Improves time management and prevents missed deadlines for legal professionals.

---

## Technical Architecture
NyaAI is built on a modular, scalable architecture:
- *AI Models*:
  - *LLaMA 3 (8B-8192)*: General legal queries and precedent lookup.
  - *Google Gemini (1.5 Flask & Pro)*: Multimodal data processing and advanced case analysis.
  - *OpenAI GPT-4o*: Legal drafting and human-like interactions.
- *RAG Workflow*: Combines data ingestion, embedding/indexing, hybrid retrieval, and response generation.
- *Backend*: FastAPI for high-performance APIs, PostgreSQL for structured data, and Node.js for real-time processing.
- *Frontend*: React & Vite for an interactive, responsive dashboard.
- *Data Storage*: Vector databases (FAISS/Milvus) for embeddings and Elasticsearch for keyword indexing.

---

## Installation

### Prerequisites
- *System Requirements*: Python 3.8+, Node.js 16+, PostgreSQL 13+
- *Dependencies*: FastAPI, React, Vite, Twilio SDK, Apache Tika, PyPDF2, Tabula
- *API Keys*: OpenAI, Google Gemini, Twilio

### Steps
1. *Clone the Repository*:
   bash
   git clone https://github.com/<your-repo>/nyaai.git
   cd nyaai
   
2. *Install Python Dependencies*:
   bash
   pip install -r requirements.txt
   
3. *Install Frontend Dependencies*:
   bash
   npm install
   
4. *Configure Environment Variables*:
   - Create a .env file in the root directory:
     plaintext
     OPENAI_API_KEY=<your-openai-key>
     GEMINI_API_KEY=<your-gemini-key>
     TWILIO_SID=<your-twilio-sid>
     TWILIO_AUTH_TOKEN=<your-twilio-token>
     DATABASE_URL=postgresql://user:password@localhost:5432/nyaai
     
5. *Set Up Database*:
   - Initialize PostgreSQL and create a database named nyaai.
   - Run migrations (if applicable):
     bash
     python manage.py migrate
     
6. *Run the Application*:
   - Start the backend:
     bash
     uvicorn main:app --host 0.0.0.0 --port 8000 --reload
     
   - Start the frontend:
     bash
     npm run dev
     

---

## Usage

### Accessing the Platform
- *Web Interface*: Open http://localhost:5173 (default Vite port) in your browser.
- *API Endpoints*: Use tools like Postman to interact with FastAPI endpoints (e.g., http://localhost:8000/query).

### Examples
1. *Chatbot*:
   - Input: "What are the steps to file a patent?"
   - Output: Detailed steps with legal references.
2. *Attorney Match*:
   - Input: Case type (e.g., "criminal"), location (e.g., "Mumbai").
   - Output: List of top 3 recommended lawyers.
3. *Case Analysis*:
   - Upload a case file or select a dummy case for practice.
   - Output: Analysis report with predicted outcomes.
4. *Document Drafting*:
   - Input: Case details and document type (e.g., "contract").
   - Output: Editable draft in minutes.
5. *Scheduling*:
   - Set a court date; receive SMS reminders via Twilio.

---

## Security
- *Encryption*: AES and CAST5 PGP symmetric encryption for data storage and transmission.
- *Access Control*: Strict permissions for sensitive case files.
- *Data Privacy*: Compliance with ethical standards and user consent.

---

## Ethical Considerations
- *Bias Mitigation*: Regular audits to ensure unbiased AI responses.
- *Transparency*: Users are informed about data usage.
- *Confidentiality*: All interactions are encrypted and secure.

---

## Contributing

### Guidelines
1. Fork the repository.
2. Create a feature branch:
   bash
   git checkout -b feature/<feature-name>
   
3. Commit changes:
   bash
   git commit -m "Add <feature-name>"
   
4. Push to the branch:
   bash
   git push origin feature/<feature-name>
   
5. Open a pull request with a detailed description.

### Code Style
- Follow PEP 8 for Python and ESLint for JavaScript.
- Include unit tests for new features.

---

## Future Enhancements
- *Scalability*: Use Docker and Kubernetes for deployment.
- *Big Data*: Integrate Apache Spark/PySpark for large-scale data processing.
- *Blockchain*: Implement immutable record-keeping.
- *Multilingual Support*: Expand to more languages for global accessibility.
- *Predictive Analytics*: Forecast legal outcomes with advanced ML/DL.

---

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact
For questions or collaboration, contact the team:
- *Email*: {anushri.v, arya.vaidya, deep.jain, harsh.chitaliya, satyavrat.tiwari}@djsce.edu.in, dashrath.kale@djsce.ac.in
- *Institution*: Dwarkadas J. Sanghvi College of Engineering, Mumbai, India

---

## References
- Research Paper: "Enhancing Legal Services with AI: Integrating Attorney Match, Case Analysis and Document Drafting" by Anushri Venkitaramanan et al.
- Models: LLaMA 3, OpenAI GPT-4o, Google Gemini
- Tools: FastAPI, React, Vite, Twilio, FAISS, Elasticsearch
