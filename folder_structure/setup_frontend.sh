#!/bin/bash

echo "🚀 Creating React src structure..."

# Go to frontend folder
cd ../frontend || exit

# Remove old src
rm -rf src

# Create folders
mkdir -p src/{assets,components,pages,services,hooks,context,utils,styles,routes}

# Create empty files
touch src/App.jsx
touch src/main.jsx

touch src/pages/ChatPage.jsx

touch src/components/ChatBox.jsx
touch src/components/MessageBubble.jsx
touch src/components/Sidebar.jsx
touch src/components/Navbar.jsx

touch src/services/api.js

touch src/hooks/useChat.js

touch src/context/ChatContext.jsx

touch src/utils/formatMessage.js

touch src/styles/main.css

touch src/routes/AppRoutes.jsx

echo "✅ React src structure created successfully!"