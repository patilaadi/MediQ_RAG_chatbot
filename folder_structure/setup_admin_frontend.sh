#!/bin/bash

echo "Creating Admin Frontend Structure..."

# Root frontend structure
mkdir -p ../frontend/src/admin/pages
mkdir -p ../frontend/src/admin/components
mkdir -p ../frontend/src/admin/layouts

# Pages
touch ../frontend/src/admin/pages/Dashboard.jsx
touch ../frontend/src/admin/pages/Chats.jsx
touch ../frontend/src/admin/pages/Documents.jsx
touch ../frontend/src/admin/pages/Analytics.jsx
touch ../frontend/src/admin/pages/Settings.jsx
touch ../frontend/src/admin/pages/Login.jsx

# Components
touch ../frontend/src/admin/components/Sidebar.jsx
touch ../frontend/src/admin/components/Topbar.jsx
touch ../frontend/src/admin/components/StatsCard.jsx
touch ../frontend/src/admin/components/ChatTable.jsx

# Layouts
touch ../frontend/src/admin/layouts/AdminLayout.jsx

echo "Admin frontend structure created successfully!"