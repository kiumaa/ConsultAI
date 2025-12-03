
import React from 'react';
import { SparklesIcon } from '../components/Icons';

interface WelcomeScreenProps {
  onNavigate: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col h-full justify-between items-center text-center p-8 bg-gradient-to-b from-slate-900 to-cyan-900/40">
      <div className="flex-grow flex flex-col justify-center items-center">
        <div className="relative w-48 h-48 flex items-center justify-center mb-8">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-pulse"></div>
            <div className="relative w-36 h-36 bg-cyan-500 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/30">
                <SparklesIcon className="w-20 h-20 text-white" />
            </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to ConsultAI</h1>
        <p className="text-lg text-gray-300 max-w-sm">
          Your personal AI business consultant, ready to help you strategize and succeed.
        </p>
      </div>
      
      <div className="w-full">
         <div className="flex justify-center space-x-2 mb-6">
            <div className="w-4 h-2 bg-cyan-500 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
        </div>
        <button
          onClick={onNavigate}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 px-4 rounded-xl text-lg transition-transform transform active:scale-95 shadow-lg shadow-cyan-500/20"
        >
          Create Your Persona
        </button>
        <p className="mt-4 text-gray-400">
          Already have an account? <a href="#" className="font-semibold text-cyan-400">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
