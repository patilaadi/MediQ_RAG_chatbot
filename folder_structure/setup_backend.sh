#!/bin/bash

# Project name
PROJECT_NAME="medical-chatbot"

echo "Creating project structure for $PROJECT_NAME..."

# Root
mkdir -p $PROJECT_NAME
cd $PROJECT_NAME || exit

# Root files
touch .env .gitignore README.md requirements.txt setup.py

# Data folders
mkdir -p data/raw data/processed
touch data/raw/Medical_book.pdf

# Notebooks
mkdir -p notebooks
touch notebooks/trials.ipynb

# Scripts
mkdir -p scripts
touch scripts/ingest_data.py

# App structure
mkdir -p app/{core,api,services,models,utils,static,templates}

touch app/__init__.py
touch app/main.py

# Core
touch app/core/config.py
touch app/core/constants.py

# API
touch app/api/__init__.py
touch app/api/routes.py

# Services
touch app/services/llm_service.py
touch app/services/rag_pipeline.py
touch app/services/embedding_service.py

# Models
touch app/models/schema.py

# Utils
touch app/utils/helper.py
touch app/utils/prompt.py

# Static & Templates
touch app/static/style.css
touch app/templates/chat.html

# Other folders
mkdir -p vectorstore tests logs
touch tests/test_api.py

echo "✅ Project structure created successfully!"

# Show structure
echo ""
echo "📂 Project Structure:"
tree -L 3