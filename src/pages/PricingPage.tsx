
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PricingPage = () => {
  const { currentUser } = useAuth();
  const { subscriptionStatus, createCheckoutSession } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please login or sign up before subscribing",
      });
      navigate("/login");
      return;
    }

    try {
      setIsLoading(true);
      const checkoutUrl = await createCheckoutSession();
      window.location.href = checkoutUrl;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate checkout",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Pricing Plans
        </h1>
        <p className="mt-4 text-xl text-gray-500">
          Get expert homeowner guidance with our affordable subscription plan
        </p>
      </div>

      <div className="mt-16 flex justify-center">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md">
          <div className="bg-primary px-6 py-12 text-center">
            <h3 className="text-2xl font-bold text-white">Premium Plan</h3>
            <div className="mt-4 flex justify-center items-center">
              <span className="text-white text-5xl font-extrabold">$9.99</span>
              <span className="ml-2 text-white opacity-80">/month</span>
            </div>
          </div>
          <div className="px-6 py-8">
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  Unlimited access to AI chatbot
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  Answers based on Davis-Stirling Act and HOA documents
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  24/7 instant assistance
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  Export conversation history
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <p className="ml-3 text-sm text-gray-700">
                  Priority customer support
                </p>
              </li>
            </ul>
            
            <div className="mt-8">
              {subscriptionStatus.isSubscribed ? (
                <Button 
                  className="w-full bg-gray-300 cursor-not-allowed" 
                  disabled
                >
                  Already Subscribed
                </Button>
              ) : (
                <Button
                  className="w-full bg-primary hover:bg-primary-600"
                  onClick={handleSubscribe}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin mr-2"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    "Subscribe Now"
                  )}
                </Button>
              )}
            </div>
            <p className="mt-4 text-xs text-center text-gray-500">
              Cancel anytime. No contracts or hidden fees.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 bg-gray-50 rounded-lg p-8">
        <h3 className="text-xl font-bold text-center mb-4">Frequently Asked Questions</h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900">How does the AI chatbot work?</h4>
            <p className="mt-2 text-gray-500">
              Our AI chatbot is powered by advanced natural language processing technology and trained on homeowner association documents and the Davis-Stirling Act. It analyzes your questions and provides accurate, relevant answers instantly.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Can I cancel my subscription?</h4>
            <p className="mt-2 text-gray-500">
              Yes, you can cancel your subscription at any time. Once canceled, you'll continue to have access until the end of your current billing period.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">Is my information secure?</h4>
            <p className="mt-2 text-gray-500">
              We take data security seriously. All your conversations and personal information are encrypted and never shared with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
