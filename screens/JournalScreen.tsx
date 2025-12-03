
import React from 'react';
import { BackIcon, MarketingIcon, FinanceIcon, ChevronRightIcon, MicIcon } from '../components/Icons';

interface JournalScreenProps {
  onBack: () => void;
}

const journalEntries = [
  {
    icon: MarketingIcon,
    title: 'Estratégia de Marketing T3',
    date: 'Ontem',
    snippet: 'Principais conclusões incluíram a implementação de um programa de fidelidade...',
  },
  {
    icon: () => <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
    title: 'Melhorando a Retenção de Clientes',
    date: '2 dias atrás',
    snippet: 'Discutimos a importância do acompanhamento pós-compra e...',
  },
  {
    icon: FinanceIcon,
    title: 'Opções de Financiamento para Startup',
    date: '5 dias atrás',
    snippet: 'Explorei os prós e contras de capital de risco versus investidor anjo...',
  },
];

const JournalScreen: React.FC<JournalScreenProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col h-full bg-slate-900">
      <header className="flex items-center p-4 bg-slate-800/50 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-300">
          <BackIcon />
        </button>
        <h1 className="text-xl font-bold text-white mx-auto">Diário de Negócios</h1>
        <button className="p-2 -mr-2 text-gray-300 font-semibold">Editar</button>
      </header>

      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por tópico, palavra-chave ou data"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-500"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      <main className="flex-grow overflow-y-auto">
        <ul className="divide-y divide-slate-800">
          {journalEntries.map((entry, index) => {
            const Icon = entry.icon;
            return (
              <li key={index} className="px-4 py-4 flex items-center hover:bg-slate-800/50 cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center mr-4">
                  <Icon className="w-6 h-6 text-gray-400"/>
                </div>
                <div className="flex-grow">
                  <p className="font-semibold text-white">{entry.title}</p>
                  <p className="text-sm text-gray-500">{entry.date}</p>
                  <p className="text-sm text-gray-400 truncate">{entry.snippet}</p>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-600" />
              </li>
            );
          })}
        </ul>
      </main>
       <div className="absolute bottom-8 right-6">
          <button className="w-16 h-16 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30 transform transition-transform active:scale-90">
              <MicIcon className="w-8 h-8" />
          </button>
       </div>
    </div>
  );
};

export default JournalScreen;
