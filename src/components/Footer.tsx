import React from 'react';
import { Github, Twitter, MessageCircle, Mail, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative z-10">
      {/* Footer Background with Geometric Shapes */}
      <div className="relative">
        {/* Geometric decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute bottom-0 left-0 w-1/3 h-2/3 bg-gradient-to-tr from-gray-800/15 via-gray-700/10 to-transparent"
            style={{
              clipPath: 'polygon(0 100%, 0 40%, 60% 0, 100% 60%, 80% 100%)',
              animation: 'float 15s ease-in-out infinite'
            }}
          ></div>
          <div 
            className="absolute bottom-0 right-0 w-2/5 h-3/4 bg-gradient-to-tl from-gray-700/20 via-black/15 to-transparent"
            style={{
              clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 0 100%, 20% 70%)',
              animation: 'breathe 12s ease-in-out infinite',
              animationDelay: '3s'
            }}
          ></div>
        </div>

        {/* Main Footer Content */}
        <div className="relative bg-gray-900/60 backdrop-blur-xl border-t border-gray-700/30">
          <div className="max-w-7xl mx-auto px-8 pt-8 pb-2">
            <div className="flex flex-col md:flex-row max-md:mb-4 justify-between">
              
                <div className="">
                  <h3 className="text-3xl font-bold">
                    <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                      GoldFi
                    </span>
                  </h3>
                  <p className="text-gray-400 mt-2">
                    Decentralized Gold-Backed Finance
                  </p>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Bridging traditional precious metals with DeFi innovation on Solana blockchain.
                </p>
                </div>
                
                {/* Social Links */}
                <div className="flex space-x-4">
                  <a href="#" className="group">
                    <div className="w-10 h-10 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg flex items-center justify-center transition-all border border-gray-700/30 group-hover:border-yellow-500/30">
                      <Github className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
                    </div>
                  </a>
                  <a href="#" className="group">
                    <div className="w-10 h-10 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg flex items-center justify-center transition-all border border-gray-700/30 group-hover:border-blue-500/30">
                      <Twitter className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </a>
                 
                </div>
     

            </div>


            {/* Bottom Section */}
            <div className="pt-4 border-t border-gray-700/30">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <a href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-yellow-400 transition-colors">Terms of Service</a>
                </div>
                
                <div className="text-sm text-gray-400">
                  <p>&copy; 2025 GoldFi Protocol. All rights reserved.</p>
                </div>
              </div>
            </div>

            {/* Version Badge */}
            <div className="mt-6 text-center">
              <span className="inline-block px-3 py-1 bg-gray-800/40 backdrop-blur-sm text-gray-500 text-xs rounded-full border border-gray-700/30">
                Protocol v0.2.0 | Built on Solana
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;