
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-primary font-bold text-xl">HomeOwners AI</Link>
            <p className="mt-2 text-sm text-gray-500">
              Expert homeowner assistance powered by AI. Get answers to your HOA and Davis-Stirling questions instantly.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/pricing" className="text-sm text-gray-500 hover:text-primary">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/chatbot" className="text-sm text-gray-500 hover:text-primary">
                  AI Chatbot
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-gray-500 hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-500 hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} HomeOwners AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
