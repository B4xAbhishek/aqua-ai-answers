import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface SubscriptionStatus {
  isSubscribed: boolean;
  plan: string | null;
  currentPeriodEnd: string | null;
  loading: boolean;
}

interface SubscriptionContextType {
  subscriptionStatus: SubscriptionStatus;
  createCheckoutSession: () => Promise<string>;
  createCustomerPortalSession: () => Promise<string>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
}

// Helper to get Firebase ID token
async function getFirebaseToken(currentUser: any) {
  if (!currentUser) return null;
  return await currentUser.getIdToken();
}

// Helper to verify token with backend
async function verifyToken(token: string) {
  await axios.post("http://localhost:8000/api/auth/verify", {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    isSubscribed: false,
    plan: null,
    currentPeriodEnd: null,
    loading: true,
  });

  useEffect(() => {
    async function fetchSubscriptionStatus() {
      if (!currentUser) {
        setSubscriptionStatus({
          isSubscribed: false,
          plan: null,
          currentPeriodEnd: null,
          loading: false,
        });
        return;
      }
      setSubscriptionStatus((prev) => ({ ...prev, loading: true }));
      try {
        const token = await getFirebaseToken(currentUser);
        await verifyToken(token);
        const res = await axios.get("http://localhost:8000/api/subscription/status", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubscriptionStatus({
          isSubscribed: res.data.isSubscribed,
          plan: res.data.plan,
          currentPeriodEnd: res.data.currentPeriodEnd,
          loading: false,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load subscription information",
          variant: "destructive",
        });
        setSubscriptionStatus({
          isSubscribed: false,
          plan: null,
          currentPeriodEnd: null,
          loading: false,
        });
      }
    }
    fetchSubscriptionStatus();
  }, [currentUser, toast]);

  async function createCheckoutSession(): Promise<string> {
    if (!currentUser) {
      throw new Error("User must be logged in");
    }
    const token = await getFirebaseToken(currentUser);
    try {
      await verifyToken(token);
    } catch (error) {
      toast({
        title: "Authentication Error",
        description: "Failed to verify user authentication.",
        variant: "destructive",
      });
      throw new Error("Failed to verify user authentication.");
    }
    toast({
      title: "Redirecting to checkout",
      description: "You will be redirected to the payment page",
    });
    const res = await axios.post(
      "http://localhost:8000/api/subscription/create-checkout-session",
      {
        success_url: "http://localhost:8080/chatbot",
        cancel_url: "http://localhost:8080/pricing",
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.url || res.data.checkout_url || res.data.session_url;
  }

  async function createCustomerPortalSession(): Promise<string> {
    if (!currentUser) {
      throw new Error("User must be logged in");
    }

    // Again, this would call a Supabase Edge Function in a real implementation
    toast({
      title: "Redirecting to customer portal",
      description: "You will be redirected to manage your subscription",
    });
    return "https://billing.stripe.com/mockportal";
  }

  const value = {
    subscriptionStatus,
    createCheckoutSession,
    createCustomerPortalSession,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}
