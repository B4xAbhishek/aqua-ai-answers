import { useState, useRef, useEffect } from "react";
import { useChatbot } from "@/contexts/ChatbotContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Send, Bot, Menu } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import React from "react";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const { messages, isLoading, sendMessage, isTrialMode, setTrialMode, fetchChatHistory, fetchChatById } = useChatbot();
  const { subscriptionStatus } = useSubscription();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatList, setChatList] = useState<any[]>([]); // List of chat summaries
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

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

  // Fetch chat history list on mount
  useEffect(() => {
    async function loadHistoryList() {
      try {
        const res = await fetch("http://localhost:8000/chat/history");
        if (!res.ok) throw new Error("Failed to fetch chat history");
        const data = await res.json();
        setChatList(data);
      } catch (e) {
        // Optionally handle error
      }
    }
    loadHistoryList();
  }, []);

  // Fetch selected chat messages
  async function handleSelectChat(chatId: string) {
    setSelectedChatId(chatId);
    await fetchChatById(chatId);
  }

  // Restore handleSubmit for chat input form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  const hasAccess = true //subscriptionStatus.isSubscribed || isTrialMode;

  // Helper: Replace <a> tags in HTML with a React component that shows a popover with iframe preview
  function renderAssistantHtml(html: string) {
    // Parse the HTML string and replace <a> tags
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const nodes = Array.from(doc.body.childNodes);

    function processNode(node: ChildNode, i: number): React.ReactNode {
      if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === "A") {
        const el = node as HTMLAnchorElement;
        const href = el.getAttribute("href") || "";
        const text = el.textContent || href;
        // If the link contains 'leginfo.legislature.ca.gov', make it blue and underlined
        const isLeginfo = href.includes("leginfo.legislature.ca.gov");
        return (
          <a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={
              isLeginfo
                ? "text-blue-600 underline hover:text-blue-800 cursor-pointer font-semibold"
                : "underline text-blue-500 hover:text-blue-700 cursor-pointer"
            }
            onClick={e => e.stopPropagation()}
          >
            {text}
          </a>
        );
      } else if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Recursively process children
        const el = node as HTMLElement;
        const children = Array.from(el.childNodes).map(processNode);
        return React.createElement(el.tagName.toLowerCase(), {}, ...children);
      }
      return null;
    }

    return <>{nodes.map(processNode)}</>;
  }

  // Sidebar UI
  const Sidebar = (
    <div className="w-64 bg-gray-50 border-r h-full flex flex-col">
      <div className="p-4 font-bold border-b">Chat History</div>
      <div className="flex-1 overflow-y-auto">
        {chatList.length === 0 ? (
          <div className="p-4 text-gray-400">No previous chats</div>
        ) : (
          chatList.map((chat: any) => (
            <button
              key={chat.id || chat.chat_id || chat._id}
              className={`w-full text-left px-4 py-2 hover:bg-gray-200 ${selectedChatId === (chat.id || chat.chat_id || chat._id) ? "bg-gray-200" : ""}`}
              onClick={() => handleSelectChat(chat.id || chat.chat_id || chat._id)}
            >
              {chat.title || chat.summary || `Chat ${chat.id || chat.chat_id || chat._id}`}
            </button>
          ))
        )}
      </div>
      <div className="p-2 border-t">
        <Button onClick={fetchChatHistory} className="w-full">Reload History</Button>
      </div>
    </div>
  );

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
    <div className="flex h-screen">
      {/* Sidebar for desktop, drawer for mobile */}
      <div className="hidden md:block h-full">{Sidebar}</div>
      <div className="flex-1 flex flex-col max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-2">
          <button className="md:hidden mr-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu />
          </button>
        </div>
        {/* Mobile sidebar drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={() => setSidebarOpen(false)}>
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-lg z-50" onClick={e => e.stopPropagation()}>
              {Sidebar}
            </div>
          </div>
        )}
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
                      {msg.role === "assistant" ? (
                        <div className="text-sm">{renderAssistantHtml(msg.content)}</div>
                      ) : (
                        <p className="text-sm">{msg.content}</p>
                      )}
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
    </div>
  );
};

export default Chatbot;
