
# Davis Sitrling Act AI Assistant

A web application featuring Firebase authentication, Stripe subscription integration, and an AI chatbot that provides answers based on homeowner documents.

## Project Overview

This project is a React application built with:
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui components
- **Authentication**: Firebase Authentication (Email/Password and Google Sign-in)
- **Payment Processing**: Stripe subscription system
- **Backend**: FastAPI for document processing and AI integration
- **Color Theme**: Teal (rgb(14, 164, 170))

## Features Implemented

### Authentication
- Email/Password login and registration
- Google Sign-in integration
- Protected routes for authenticated users

### Subscription System
- Stripe subscription integration
- Trial mode for the AI chatbot
- Subscription status tracking

### AI Chatbot
- Interface to interact with AI
- Document-based answering system
- Trial access option

## Backend Requirements

### FastAPI Backend Endpoints

The frontend is designed to work with a FastAPI backend that should expose the following endpoints:

#### Authentication
- `POST /api/auth/verify` - Verify Firebase token and create/update user in the backend

#### Document Management
- `POST /api/documents/upload` - Upload homeowner documents for AI processing
- `GET /api/documents` - Get a list of user's uploaded documents
- `DELETE /api/documents/{document_id}` - Delete a specific document

#### AI Chatbot
- `POST /api/chat` - Send a message to the AI and get a response based on uploaded documents
- `GET /api/chat/history` - Get the user's chat history

#### Subscription Management
- `GET /api/subscription/status` - Check a user's subscription status
- `POST /api/subscription/webhook` - Webhook endpoint for Stripe events

### Backend Implementation Notes

1. **Document Processing**:
   - The backend should parse and extract text from uploaded documents (PDF, DOC, etc.)
   - Store document content in a vector database for efficient AI retrieval
   - Use embeddings to match user questions with relevant document sections

2. **AI Integration**:
   - Integrate with OpenAI or similar LLM APIs
   - Implement retrieval-augmented generation (RAG) pattern
   - Ensure responses are based only on the uploaded documents

3. **Authentication Flow**:
   - Frontend authenticates users with Firebase
   - Backend verifies Firebase tokens
   - Use Firebase UID as the user identifier across systems

4. **Stripe Integration**:
   - Process subscription events from Stripe webhooks
   - Update user subscription status in the database
   - Enforce access control based on subscription status

## Environment Variables

The following environment variables are required:

### Firebase Configuration
```
FIREBASE_API_KEY=AIzaSyCWGkmSFQRu_vCMAj7kh7hApmc2OM1QYxs
FIREBASE_AUTH_DOMAIN=davis-sterling-test.firebaseapp.com
FIREBASE_PROJECT_ID=davis-sterling-test
FIREBASE_STORAGE_BUCKET=davis-sterling-test.appspot.com
FIREBASE_MESSAGING_SENDER_ID=684568252316
FIREBASE_APP_ID=1:684568252316:web:7f9a31902669b393774259
FIREBASE_MEASUREMENT_ID=G-VDS8MS6850
```

### Stripe Configuration
```
STRIPE_SECRET_KEY=sk_test_51JgyYXLUULiT2GqA5TqHLAGyZn8wFm9hrrd5WmCIN7Zf5nmzWjWO9IscwfYBk03luZqVUxZ1plMIqgs0kHBQiWmK00YHDdnaWq
STRIPE_WEBHOOK_SECRET=whsec_feeImJ3ZmzRizKvdWntaP3ErFTrc65gp
STRIPE_API_KEY=sk_test_51JgyYXLUULiT2GqA5TqHLAGyZn8wFm9hrrd5WmCIN7Zf5nmzWjWO9IscwfYBk03luZqVUxZ1plMIqgs0kHBQiWmK00YHDdnaWq
STRIPE_PRICE_ID=price_1RL5YwLUULiT2GqAQ0JH9DFi
```

### FastAPI Backend Configuration
```
FASTAPI_BASE_URL=https://api.yourdomain.com
```

## Deployment Instructions

1. Set up the FastAPI backend and deploy it
2. Configure Firebase project and authentication settings
3. Set up Stripe account with subscription products and prices
4. Deploy the frontend application
5. Configure environment variables for production

## Next Steps

1. Complete the FastAPI backend implementation
2. Add document upload functionality to the frontend
3. Implement comprehensive subscription management
4. Add usage analytics and monitoring
5. Enhance the chatbot UI with features like conversation history and document reference
