# Eklavya_edunet

An AI-powered application for students to upload documents and generate exams.

## Setup

1. Install dependencies for backend:
   ```
   cd edunet_backend
   npm install
   ```

2. Install dependencies for frontend:
   ```
   cd edunet_ui
   npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
   ```

3. Set up OpenAI API key in `edunet_backend/.env`

4. Run the backend:
   ```
   cd edunet_backend
   npm start
   ```

5. Run the frontend:
   ```
   cd edunet_ui
   npm start
   ```

The application will be available at http://localhost:3000

## Features

- Upload PDF documents
- Extract text and create embeddings
- Generate exams based on document content
- Take exams and view results

Future features will be added.