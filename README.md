# MediQ_RAG_chatbot

## Project Overview

MediQ is a medical chatbot platform with:

- React frontend built with Vite
- Flask backend API
- MongoDB storage for users, chat threads, chat messages, and documents
- Admin panel for monitoring chats and uploading documents
- Retrieval-Augmented Generation (RAG) for medical QA support

## Running the App

### Backend

1. Open `medical-chatbot` folder
2. Activate your Python environment
3. Install dependencies if needed
4. Run:
   ```bash
   python app/main.py
   ```
5. The backend should start on `http://localhost:8080`

### Frontend

1. Open `frontend` folder
2. Install packages:
   ```bash
   npm install
   ```
3. Run:
   ```bash
   npm run dev
   ```
4. The frontend should start on `http://localhost:5173` or the Vite default port

## Admin Features

The admin panel now includes a chat monitoring page that shows:

- a list of users with active chat counts
- date-organized threads for each user
- full message history for a selected thread

## Testing

### Frontend

From `frontend`:

```bash
npm test
```

This will run Vitest and verify the admin chat monitoring UI behavior.
