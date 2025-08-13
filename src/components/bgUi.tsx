import React, { ReactNode } from 'react';
import { L } from 'vitest/dist/chunks/reporters.d.BFLkQcL6.js';

interface LayoutProps {
  children: ReactNode;
}

const BgUi: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen text-white overflow-hidden" style={{
      background: 'linear-gradient(135deg, #374151 0%, #1f2937 25%, #000000 50%, #1f2937 75%, #374151 100%)'
    }}>
      {/* Add keyframe animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1) translate(-50%, -50%); opacity: 0.6; }
          50% { transform: scale(1.2) translate(-50%, -50%); opacity: 0.8; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-20px) translateX(10px); }
          66% { transform: translateY(10px) translateX(-15px); }
        }
        @keyframes slideRotate {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(5deg) scale(1.1); }
          50% { transform: rotate(-3deg) scale(0.95); }
          75% { transform: rotate(8deg) scale(1.05); }
        }
        @keyframes morphShape {
          0%, 100% { transform: scale(1) rotate(0deg); }
          33% { transform: scale(1.1) rotate(2deg); }
          66% { transform: scale(0.9) rotate(-2deg); }
        }
        @keyframes scaleFloat {
          0%, 100% { transform: scale(1) translateY(0px); }
          50% { transform: scale(1.15) translateY(-10px); }
        }
        @keyframes rotateFloat {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
      
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800"></div>
        
        {/* Subtle glow effects */}
        <div className="absolute inset-0">
          {/* Central purple glow */}
          <div 
            className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"
            style={{
              animation: 'pulse 8s ease-in-out infinite'
            }}
          ></div>
          
          {/* Top left blue glow */}
          <div 
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/8 rounded-full blur-3xl"
            style={{
              animation: 'pulse 12s ease-in-out infinite',
              animationDelay: '2s'
            }}
          ></div>
          
          {/* Bottom right pink glow */}
          <div 
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/6 rounded-full blur-3xl"
            style={{
              animation: 'pulse 10s ease-in-out infinite',
              animationDelay: '4s'
            }}
          ></div>
          
          {/* Top right cyan glow */}
          <div 
            className="absolute top-1/3 right-1/3 w-48 h-48 bg-cyan-400/7 rounded-full blur-3xl"
            style={{
              animation: 'pulse 14s ease-in-out infinite',
              animationDelay: '1s'
            }}
          ></div>
        </div>
        
        <div className="absolute inset-0">
          {/* Top left shape with purple side glow */}
          <div className="absolute top-0 left-0 w-2/3 h-2/3">
            <div 
              className="absolute inset-0 bg-gradient-to-br from-gray-700/25 via-gray-800/20 to-transparent transition-all duration-[8s] ease-in-out"
              style={{
                clipPath: 'polygon(0 0, 80% 0, 40% 60%, 0 40%)',
                animation: 'float 12s ease-in-out infinite'
              }}
            ></div>
            {/* Purple side glow */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-transparent to-transparent blur-sm"
              style={{
                clipPath: 'polygon(0 0, 80% 0, 40% 60%, 0 40%)',
                animation: 'float 12s ease-in-out infinite',
                filter: 'blur(8px)'
              }}
            ></div>
          </div>
          
          {/* Top right shape with blue side glow */}
          <div className="absolute top-0 right-0 w-1/2 h-3/4">
            <div 
              className="absolute inset-0 bg-gradient-to-bl from-gray-800/30 via-black/25 to-transparent transition-all duration-[10s] ease-in-out"
              style={{
                clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 60% 100%, 0 50%)',
                animation: 'slideRotate 15s ease-in-out infinite',
                animationDelay: '2s'
              }}
            ></div>
            {/* Blue side glow */}
            <div 
              className="absolute inset-0 bg-gradient-to-l from-blue-400/15 via-transparent to-transparent blur-sm"
              style={{
                clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 60% 100%, 0 50%)',
                animation: 'slideRotate 15s ease-in-out infinite',
                animationDelay: '2s',
                filter: 'blur(6px)'
              }}
            ></div>
          </div>
          
          {/* Bottom left shape with cyan side glow */}
          <div className="absolute bottom-0 left-0 w-3/5 h-1/2">
            <div 
              className="absolute inset-0 bg-gradient-to-tr from-gray-600/20 via-gray-800/15 to-transparent transition-all duration-[6s] ease-in-out"
              style={{
                clipPath: 'polygon(0 100%, 0 20%, 30% 0, 70% 0, 100% 30%, 80% 100%)',
                animation: 'morphShape 18s ease-in-out infinite',
                animationDelay: '4s'
              }}
            ></div>
            {/* Cyan side glow */}
            <div 
              className="absolute inset-0 bg-gradient-to-t from-cyan-400/18 via-transparent to-transparent blur-sm"
              style={{
                clipPath: 'polygon(0 100%, 0 20%, 30% 0, 70% 0, 100% 30%, 80% 100%)',
                animation: 'morphShape 18s ease-in-out infinite',
                animationDelay: '4s',
                filter: 'blur(10px)'
              }}
            ></div>
          </div>
          
          {/* Bottom right shape with pink side glow */}
          <div className="absolute bottom-0 right-0 w-1/2 h-2/3">
            <div 
              className="absolute inset-0 bg-gradient-to-tl from-gray-700/28 via-gray-900/20 to-transparent transition-all duration-[7s] ease-in-out"
              style={{
                clipPath: 'polygon(30% 20%, 100% 0, 100% 100%, 0 100%, 20% 60%)',
                animation: 'scaleFloat 14s ease-in-out infinite',
                animationDelay: '1s'
              }}
            ></div>
            {/* Pink side glow */}
            <div 
              className="absolute inset-0 bg-gradient-to-bl from-pink-400/16 via-transparent to-transparent blur-sm"
              style={{
                clipPath: 'polygon(30% 20%, 100% 0, 100% 100%, 0 100%, 20% 60%)',
                animation: 'scaleFloat 14s ease-in-out infinite',
                animationDelay: '1s',
                filter: 'blur(12px)'
              }}
            ></div>
          </div>
          
          {/* Center diamond shape with multi-colored edge glow */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96">
            <div 
              className="absolute inset-0 bg-gradient-to-r from-gray-800/15 via-black/12 to-gray-700/15 transition-all duration-[9s] ease-in-out"
              style={{
                clipPath: 'polygon(50% 0%, 80% 50%, 50% 100%, 20% 50%)',
                animation: 'rotateFloat 20s linear infinite'
              }}
            ></div>
            {/* Multi-colored edge glow */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-purple-400/12 via-blue-400/10 to-pink-400/12 blur-sm"
              style={{
                clipPath: 'polygon(50% 0%, 80% 50%, 50% 100%, 20% 50%)',
                animation: 'rotateFloat 20s linear infinite',
                filter: 'blur(15px)'
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};


export default BgUi;