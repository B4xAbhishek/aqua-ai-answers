import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { useSubscription } from "./SubscriptionContext";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string | Date;
}

// Define the API URL - in production this would come from environment variables
const FASTAPI_URL = "https://api.yourdomain.com"; // Replace with your actual FastAPI URL

interface ChatbotContextType {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  fetchChatHistory: () => Promise<void>;
  fetchChatById: (chatId: string) => Promise<void>;
  isTrialMode: boolean;
  setTrialMode: (value: boolean) => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
}

export function ChatbotProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTrialMode, setTrialMode] = useState(false);
  const { currentUser } = useAuth();
  const { subscriptionStatus } = useSubscription();
  const { toast } = useToast();

  // Helper to get Firebase ID token
  async function getToken() {
    if (!currentUser) return null;
    return await currentUser.getIdToken();
  }

  async function fetchChatHistory() {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        toast({ title: "Authentication required", description: "Please log in to view chat history", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      const response = await fetch('http://localhost:8000/chat/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch chat history');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch chat history",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchChatById(chatId: string) {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        toast({ title: "Authentication required", description: "Please log in to view chat", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      const response = await fetch(`http://localhost:8000/chat/${chatId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch chat');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch chat",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function sendMessage(content: string) {
    if (!content.trim()) return;
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to use the chatbot",
        variant: "destructive",
      });
      return;
    }
    if (!subscriptionStatus.isSubscribed && !isTrialMode && 0) {
      toast({
        title: "Subscription required",
        description: "Please subscribe or use trial to access the AI chatbot",
        variant: "destructive",
      });
      return;
    }
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error('No auth token');
      const response = await fetch('http://localhost:8000/api/chat/davis-stirling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: content }),
      });
      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }
      const data = await response.json();
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || data.message || "No response from AI.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message to AI",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }

  function clearMessages() {
    setMessages([]);
  }

  const value = {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    fetchChatHistory,
    fetchChatById,
    isTrialMode,
    setTrialMode,
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
}
