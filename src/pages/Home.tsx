
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="flex flex-col min-h-[80vh]">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6">
              <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-gray-900 sm:mt-5 sm:text-5xl lg:mt-6 xl:text-6xl">
                <span className="block">Expert homeowner</span>
                <span className="block text-primary">guidance with AI</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg">
                Get instant answers to your homeowner association (HOA) questions and Davis-Stirling Act inquiries. Our AI assistant provides accurate, reliable information based on official documentation.
              </p>
              <div className="mt-8 sm:flex">
                {currentUser ? (
                  <Link to="/chatbot">
                    <Button className="bg-primary hover:bg-primary-600 px-8 py-6 text-lg w-full sm:w-auto">
                      Start Chatting
                    </Button>
                  </Link>
                ) : (
                  <Link to="/signup">
                    <Button className="bg-primary hover:bg-primary-600 px-8 py-6 text-lg w-full sm:w-auto">
                      Get Started
                    </Button>
                  </Link>
                )}
                <Link to="/pricing" className="mt-3 sm:mt-0 sm:ml-3">
                  <Button variant="outline" className="px-8 py-6 text-lg w-full sm:w-auto">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6">
              <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="p-8">
                  <div className="flex space-x-4 mb-6">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="bg-gray-100 rounded-lg p-4 max-w-[80%]">
                        <p className="text-gray-800">What are my rights regarding HOA assessment increases?</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-primary-100 rounded-lg p-4 max-w-[80%]">
                        <p className="text-gray-800">
                          Under the Davis-Stirling Act in California, HOAs can increase regular assessments up to 20% per year without membership approval. However, special assessments exceeding 5% of the budgeted gross expenses require member approval. Your governing documents may have additional restrictions.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary uppercase tracking-wide">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for homeowner success
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Document-Based Answers</h3>
              <p className="mt-2 text-base text-gray-500">
                Our AI is trained on real HOA documents and the Davis-Stirling Act to provide accurate, reliable answers.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">24/7 Instant Support</h3>
              <p className="mt-2 text-base text-gray-500">
                Get immediate answers to your homeowner questions any time of day or night without waiting.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Privacy-Focused</h3>
              <p className="mt-2 text-base text-gray-500">
                Your conversations are secure and private. We never share your personal information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Ready to get expert homeowner guidance?
              </h2>
              <p className="mt-4 text-lg text-white/90">
                Sign up today and get instant access to our AI-powered chatbot. Ask questions about your rights, responsibilities, and more.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:col-span-5">
              <div className="flex flex-col items-center justify-center h-full">
                <Link to="/signup">
                  <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg">
                    Start Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
