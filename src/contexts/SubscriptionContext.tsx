
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

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
    if (!currentUser) {
      setSubscriptionStatus({
        isSubscribed: false,
        plan: null,
        currentPeriodEnd: null,
        loading: false,
      });
      return;
    }

    // Here we would ideally subscribe to Firestore to get real-time subscription updates
    // This is a placeholder for demonstration
    const unsubscribe = onSnapshot(
      doc(db, "users", currentUser.uid),
      (doc) => {
        const data = doc.data();
        if (data?.subscriptionStatus) {
          setSubscriptionStatus({
            isSubscribed: data.subscriptionStatus.isSubscribed || false,
            plan: data.subscriptionStatus.plan || null,
            currentPeriodEnd: data.subscriptionStatus.currentPeriodEnd || null,
            loading: false,
          });
        } else {
          setSubscriptionStatus({
            isSubscribed: false,
            plan: null,
            currentPeriodEnd: null,
            loading: false,
          });
        }
      },
      (error) => {
        console.error("Error fetching subscription:", error);
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
    );

    return () => unsubscribe();
  }, [currentUser, toast]);

  async function createCheckoutSession(): Promise<string> {
    if (!currentUser) {
      throw new Error("User must be logged in");
    }

    // In a real implementation, we would call a Supabase Edge Function
    // For now, we'll just simulate this with a mock URL
    toast({
      title: "Redirecting to checkout",
      description: "You will be redirected to the payment page",
    });
    return "https://checkout.stripe.com/mockcheckout";
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
