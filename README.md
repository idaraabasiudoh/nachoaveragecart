# MERN Stack Grocery Shopping App with AI Integration

A full-stack grocery shopping application that allows users to search for products via text or image upload, manage shopping lists, and get AI-powered meal suggestions with nutrition facts.

## Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **APIs**: SerpAPI (product search), Gemini API (image processing & meal suggestions)
- **Authentication**: JWT tokens
- **File Upload**: Multer
- **State Management**: React Context API

## Features

- User authentication (register, login, logout)
- Product search via text input
- Image upload to extract grocery items
- Shopping list management
- AI-powered meal suggestions based on grocery items
- Nutrition facts for meal suggestions

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- SerpAPI account and API key
- Google Cloud account with Gemini API access

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd grocery-shopping-app
```

### 2. Backend Setup

```bash
cd server
npm install

# Configure environment variables
# Edit the .env file with your API keys and MongoDB connection string

# Start the server
npm run dev
```

### 3. Frontend Setup

```bash
cd client
npm install
npm start
```

### 4. Access the Application

Open your browser and navigate to:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```
PORT=8080
MONGODB_URI=mongodb://localhost:27017/grocery-app
JWT_SECRET=your-secret-key-here
SERP_API_KEY=your-serpapi-key
GEMINI_API_KEY=your-gemini-api-key
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Products

- `GET /api/products/search` - Search for products
- `POST /api/products/process-image` - Process an image to extract grocery items
- `POST /api/products/meal-suggestions` - Get meal suggestions based on grocery items

### Shopping Lists

- `POST /api/shopping-lists` - Create a new shopping list
- `GET /api/shopping-lists` - Get all shopping lists for a user
- `GET /api/shopping-lists/:id` - Get a specific shopping list
- `POST /api/shopping-lists/:id/items` - Add an item to a shopping list
- `DELETE /api/shopping-lists/:id/items/:itemId` - Remove an item from a shopping list
- `PUT /api/shopping-lists/:id/meals` - Update meal suggestions for a shopping list

## Future Enhancements

- Barcode scanning for product lookup
- Price tracking and comparison
- Dietary preferences and restrictions
- Budget tracking
- Expiry date tracking
- Collaborative shopping lists
- Mobile app with React Native

## License

MIT
