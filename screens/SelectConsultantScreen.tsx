
import React, { useState } from 'react';
import type { Consultant } from '../types';
import { CONSULTANTS, ADD_NEW_CONSULTANT } from '../constants';
import { BackIcon } from '../components/Icons';

interface SelectConsultantScreenProps {
  onSelectConsultant: (consultant: Consultant) => void;
  onBack: () => void;
}

const SelectConsultantScreen: React.FC<SelectConsultantScreenProps> = ({ onSelectConsultant, onBack }) => {
  const [selectedId, setSelectedId] = useState<string | null>(CONSULTANTS[0].id);

  const handleSelect = (consultant: Omit<Consultant, 'systemInstruction'>) => {
    if (consultant.id !== 'add') {
      setSelectedId(consultant.id);
    } else {
      // Handle "Add New" action, e.g., show a modal or navigate
      console.log("Request new specialty");
    }
  };
  
  const selectedConsultant = CONSULTANTS.find(c => c.id === selectedId);

  return (
    <div className="flex flex-col h-full bg-slate-900 p-6">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-300">
          <BackIcon />
        </button>
        <h1 className="text-2xl font-bold text-white mx-auto pr-8">Select Your AI Consultant</h1>
      </div>
      <p className="text-center text-gray-400 mb-8">
        Tap a specialty to tailor the AI's expertise for your needs.
      </p>

      <div className="grid grid-cols-2 gap-4 flex-grow">
        {[...CONSULTANTS, ADD_NEW_CONSULTANT].map((consultant) => (
          <button
            key={consultant.id}
            onClick={() => handleSelect(consultant)}
            className={`p-4 rounded-2xl flex flex-col justify-between text-left transition-all duration-200 transform active:scale-95 ${
              selectedId === consultant.id
                ? 'bg-cyan-500/20 border-2 border-cyan-500 shadow-lg shadow-cyan-500/20'
                : 'bg-slate-800 border-2 border-slate-700'
            } ${consultant.id === 'add' ? 'border-dashed' : ''}`}
          >
            <div>
              <consultant.icon className={`mb-4 ${selectedId === consultant.id ? 'text-cyan-400' : 'text-gray-400'}`} />
              <h2 className="font-bold text-white">{consultant.name}</h2>
            </div>
            <p className="text-sm text-gray-400 mt-1">{consultant.description}</p>
          </button>
        ))}
      </div>

      <button
        onClick={() => selectedConsultant && onSelectConsultant(selectedConsultant)}
        disabled={!selectedConsultant}
        className="w-full mt-8 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 px-4 rounded-xl text-lg transition-transform transform active:scale-95 disabled:bg-gray-600 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20"
      >
        Start Session
      </button>
    </div>
  );
};

export default SelectConsultantScreen;
