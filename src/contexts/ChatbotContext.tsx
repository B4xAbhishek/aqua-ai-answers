
import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { useSubscription } from "./SubscriptionContext";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Define the API URL - in production this would come from environment variables
const FASTAPI_URL = "https://api.yourdomain.com"; // Replace with your actual FastAPI URL

interface ChatbotContextType {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
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

    if (!subscriptionStatus.isSubscribed && !isTrialMode) {
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
      // For now, we'll simulate a response while FastAPI backend is being set up
      // In a real implementation, we would call FastAPI endpoint
      /*
      const response = await fetch(`${FASTAPI_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await currentUser.getIdToken()}`
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
        content: data.response,
        timestamp: new Date(),
      };
      */
      
      // Simulate FastAPI response until backend is integrated
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "This is a simulated response. When connected to FastAPI backend, this will be an AI-generated answer based on homeowner documents.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
      }, 1000);
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
    isTrialMode,
    setTrialMode,
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
}
