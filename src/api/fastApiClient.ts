
import { auth } from "@/lib/firebase";

// Define the API base URL - in production this would come from environment variables
const API_BASE_URL = "https://api.yourdomain.com"; // Replace with your actual FastAPI URL

// Interface for chatbot response
interface ChatbotResponse {
  response: string;
  sources?: string[];
  confidence?: number;
}

// Interface for document upload response
interface DocumentUploadResponse {
  success: boolean;
  documentId: string;
  message: string;
}

/**
 * Client for interacting with FastAPI backend
 */
export const fastApiClient = {
  /**
   * Send a message to the AI chatbot
   */
  async sendChatMessage(message: string): Promise<ChatbotResponse> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const token = await user.getIdToken();

    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error("Failed to send message to AI");
    }

    return response.json();
  },

  /**
   * Upload documents for AI processing
   */
  async uploadDocument(file: File): Promise<DocumentUploadResponse> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const token = await user.getIdToken();
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload document");
    }

    return response.json();
  },

  /**
   * Get user's document list
   */
  async getUserDocuments() {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const token = await user.getIdToken();

    const response = await fetch(`${API_BASE_URL}/api/documents`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch documents");
    }

    return response.json();
  },

  /**
   * Health check for the FastAPI backend
   */
  async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (!response.ok) {
      throw new Error("API health check failed");
    }
    
    return response.json();
  },
};

export default fastApiClient;
