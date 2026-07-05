import { Link } from 'react-router-dom';
import { HiOutlineTrendingUp } from 'react-icons/hi';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-900/50 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
                <HiOutlineTrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">
                StockAnalyzer
              </span>
            </Link>
            <p className="text-sm text-dark-400 mb-4">
              Your premium financial analysis platform. Real-time data,
              advanced charts, and portfolio tracking.
            </p>
            <div className="flex gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 text-dark-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <FaGithub className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 text-dark-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 text-dark-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              {['Dashboard', 'Stock Search', 'Portfolio', 'Watchlist', 'Market News'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-dark-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              {['About', 'Careers', 'Blog', 'Press', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-dark-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Disclaimer'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-dark-400 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-dark-500">
            © {currentYear} StockAnalyzer. All rights reserved.
          </p>
          <p className="text-xs text-dark-600">
            Data provided by Alpha Vantage. Not financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
