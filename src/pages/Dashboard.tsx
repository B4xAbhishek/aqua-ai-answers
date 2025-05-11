
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { subscriptionStatus, createCustomerPortalSession } = useSubscription();
  const { toast } = useToast();

  const handleManageSubscription = async () => {
    try {
      const url = await createCustomerPortalSession();
      window.location.href = url;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to access subscription management",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Welcome back, {currentUser?.email}</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Status</CardTitle>
            <CardDescription>Manage your subscription details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Status:</span>
                <span className={`text-sm ${subscriptionStatus.isSubscribed ? "text-green-600" : "text-red-600"}`}>
                  {subscriptionStatus.isSubscribed ? "Active" : "Inactive"}
                </span>
              </div>
              {subscriptionStatus.isSubscribed && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Plan:</span>
                    <span className="text-sm">{subscriptionStatus.plan}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Expires on:</span>
                    <span className="text-sm">
                      {subscriptionStatus.currentPeriodEnd
                        ? new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter>
            {subscriptionStatus.isSubscribed ? (
              <Button 
                onClick={handleManageSubscription}
                variant="outline" 
                className="w-full"
              >
                Manage Subscription
              </Button>
            ) : (
              <Link to="/pricing" className="w-full">
                <Button className="w-full bg-primary hover:bg-primary-600">
                  Subscribe Now
                </Button>
              </Link>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Assistant</CardTitle>
            <CardDescription>Get answers to your homeowner questions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Use our AI chatbot to get instant answers about homeowner associations, the Davis-Stirling Act, and more.
            </p>
            <div className="h-24 bg-gray-50 rounded-md p-4 flex items-center justify-center">
              {subscriptionStatus.isSubscribed ? (
                <div className="text-sm text-gray-500 text-center">
                  Unlimited access to the AI chatbot
                </div>
              ) : (
                <div className="text-sm text-gray-500 text-center">
                  Subscribe to access the AI chatbot
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/chatbot" className="w-full">
              <Button 
                className={`w-full ${subscriptionStatus.isSubscribed ? "bg-primary hover:bg-primary-600" : "bg-gray-300"}`}
                disabled={!subscriptionStatus.isSubscribed}
              >
                Open Chatbot
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
