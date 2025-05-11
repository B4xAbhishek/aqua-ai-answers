
import { useState, useRef, useEffect } from "react";
import { useChatbot } from "@/contexts/ChatbotContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Send, Bot } from "lucide-react";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const { messages, isLoading, sendMessage, isTrialMode, setTrialMode } = useChatbot();
  const { subscriptionStatus } = useSubscription();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if user came from pricing page trial button
  useEffect(() => {
    if (location.state?.fromTrial) {
      setTrialMode(true);
    }
  }, [location.state, setTrialMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  const hasAccess = subscriptionStatus.isSubscribed || isTrialMode;

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <Bot size={64} className="text-primary mb-4" />
        <h1 className="text-2xl font-bold text-center mb-2">Subscription Required</h1>
        <p className="text-center text-gray-500 mb-8">
          You need an active subscription to access the AI chatbot.
        </p>
        <Link to="/pricing">
          <Button className="bg-primary hover:bg-primary-600">View Pricing Plans</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">AI Homeowner Assistant</h1>
      {isTrialMode && (
        <div className="bg-amber-100 border-l-4 border-amber-500 p-4 mb-6">
          <p className="text-amber-700">
            You're currently using the trial version. For unlimited access, please subscribe.
            <Link to="/pricing" className="ml-2 underline">
              Subscribe now
            </Link>
          </p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md border border-gray-200 h-[60vh] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bot size={48} className="text-primary mb-4" />
              <h2 className="text-xl font-semibold mb-2">How can I help you today?</h2>
              <p className="text-gray-500 max-w-md">
                Ask me anything about homeowner associations, the Davis-Stirling Act, or any other homeowner questions.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
          <div className="flex space-x-2">
            <Input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1"
            />
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary-600"
              disabled={isLoading || !message.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
