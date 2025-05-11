
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

interface ChatbotContextType {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
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

    if (!subscriptionStatus.isSubscribed) {
      toast({
        title: "Subscription required",
        description: "Please subscribe to use the AI chatbot",
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
      // In a real implementation, we would call a Supabase Edge Function that would use OpenAI API
      // For now, we'll just simulate a response
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "This is a simulated response. In a real implementation, this would be an answer from the AI based on homeowner documents.",
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
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
}
