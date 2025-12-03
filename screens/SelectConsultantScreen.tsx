
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
      console.log("Solicitar nova especialidade");
    }
  };
  
  const selectedConsultant = CONSULTANTS.find(c => c.id === selectedId);

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Header Fixo */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center mb-4">
            <button onClick={onBack} className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
            <BackIcon />
            </button>
            <h1 className="text-xl font-bold text-white ml-2">Selecione seu Consultor</h1>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Toque em uma especialidade para adaptar a experiência da IA às suas necessidades.
        </p>
      </div>

      {/* Área de Scroll dos Cards */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        <div className="grid grid-cols-2 gap-4">
            {[...CONSULTANTS, ADD_NEW_CONSULTANT].map((consultant) => {
            const isSelected = selectedId === consultant.id;
            const isAddButton = consultant.id === 'add';

            return (
                <button
                key={consultant.id}
                onClick={() => handleSelect(consultant)}
                className={`
                    relative p-5 rounded-3xl flex flex-col items-start text-left transition-all duration-300
                    ${isSelected 
                        ? 'bg-slate-900 border-2 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.25)] translate-y-[-2px]' 
                        : 'bg-slate-900/50 border border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                    }
                    ${isAddButton ? 'border-dashed border-slate-700 bg-transparent opacity-80' : ''}
                `}
                >
                <div className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300
                    ${isSelected ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-gray-500'}
                    ${isAddButton ? 'bg-slate-800/50' : ''}
                `}>
                    <consultant.icon className="w-6 h-6" />
                </div>
                
                <h2 className={`font-bold text-base mb-2 ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                    {consultant.name}
                </h2>
                
                <p className={`text-xs leading-5 line-clamp-3 ${isSelected ? 'text-cyan-100/70' : 'text-gray-500'}`}>
                    {consultant.description}
                </p>

                {isSelected && (
                    <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-cyan-400/20 pointer-events-none" />
                )}
                </button>
            );
            })}
        </div>
      </div>

      {/* Botão Fixo no Rodapé */}
      <div className="p-6 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent">
        <button
          onClick={() => selectedConsultant && onSelectConsultant(selectedConsultant)}
          disabled={!selectedConsultant}
          className="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all transform active:scale-[0.98] disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25"
        >
          Iniciar Sessão
        </button>
      </div>
    </div>
  );
};

export default SelectConsultantScreen;
